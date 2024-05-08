import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import { DeepPartial, IsNull } from 'typeorm';
import { ErpDAO } from '../../dao/erp.dao';
import { PurchaseRequestDAO } from '../../dao/purchaseRequest.dao';
import { PurchaseRequest } from '../../datasources/entity/pgsql/PurchaseRequest.entity';
import { QUEUE_PURCHASE_REQUEST_APPROVED } from '../../libs/constants/queue';
import { BaseWorker } from './base.worker';

// FIXME: please remove import env once flow with ODOO is ready
import env from '../../config/env';
import { CoopDAO } from '../../dao/coop.dao';
import { CoopMemberDDAO } from '../../dao/coopMemberD.dao';
import { AutoNumbering } from '../../datasources/entity/pgsql/AutoNumbering.entity';
import { PurchaseOrder } from '../../datasources/entity/pgsql/PurchaseOrder.entity';
import { PurchaseOrderProduct } from '../../datasources/entity/pgsql/PurchaseOrderProduct.entity';
import { AUTO_NUMBERING_TRX_TYPE } from '../../libs/constants';
import { CoopCacheUtil } from '../../libs/utils/coopCache';
import { generateErpCode, randomHexString } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { PurchaseOrderApprovedQueue } from '../queues/purchase-order-approved.queue';
import { PushNotificationQueue } from '../queues/push-notification.queue';

@Service()
export class PurchaseRequestApprovedWorker extends BaseWorker<PurchaseRequest> {
  @Inject(PurchaseRequestDAO)
  private prDAO!: PurchaseRequestDAO;

  @Inject(ErpDAO)
  private erpDAO!: ErpDAO;

  @Inject(CoopDAO)
  private coopDAO!: CoopDAO;

  @Inject(Logger)
  private logger: Logger;

  @Inject(CoopMemberDDAO)
  private coopMemberDDAO!: CoopMemberDDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue!: PushNotificationQueue;

  @Inject(PurchaseOrderApprovedQueue)
  private poApprovedQueue!: PurchaseOrderApprovedQueue;

  @Inject(CoopCacheUtil)
  private coopCacheUtil!: CoopCacheUtil;

  protected workerName = QUEUE_PURCHASE_REQUEST_APPROVED;

  protected async handle(data: PurchaseRequest) {
    try {
      const purchaseReq = await this.prDAO.getOne({
        where: {
          id: data.id,
          erpCode: IsNull(),
        },
        select: {
          id: true,
          requestSchedule: true,
          farmingCycleId: true,
          notes: true,
          farmingCycle: {
            farmingCycleCode: true,
            coopId: true,
          },
          chickInRequest: {
            approvedDate: true,
          },
          userApprover: {
            fullName: true,
            phoneNumber: true,
            userType: true,
            id: true,
          },
          userCreator: {
            fullName: true,
            phoneNumber: true,
          },
          products: true,
          modifiedBy: true,
        },
        relations: {
          farmingCycle: true,
          userApprover: true,
          userCreator: true,
          products: true,
        },
      });

      if (!purchaseReq) return;

      const [coopMembers, count] = await this.coopMemberDDAO.getMany({
        where: {
          coopId: purchaseReq.farmingCycle.coopId,
          isInternal: true,
        },
      });

      const coop = await this.coopDAO.getOneStrict({
        where: {
          id: purchaseReq.farmingCycle.coopId,
        },
      });

      if (!coopMembers && count === 0) return;

      const notificationReceiverMap: { [key: string]: boolean } = {};

      coopMembers.forEach((coopMember) => {
        notificationReceiverMap[coopMember.userId] = true;
      });

      const userReceivers = Object.keys(notificationReceiverMap);

      await this.pushNotificationQueue.addJob({
        userReceivers,
        content: {
          headline: `Permintaan ${purchaseReq.products[0]?.categoryCode || 'baru'} di kandang ${
            coop.coopName
          } telah disetujui`,
          subHeadline: 'Terus pantau status permintaannya ya',
          body: `Permintaan ${
            purchaseReq.products[0]?.categoryCode || 'baru'
          } dari rekanmu telah disetujui, coba cek ya`,
          type: 'purchase-request',
        },
        notification: {
          subjectId: 'purchase-request',
          notificationType: 'purchase-request',
          headline: `Permintaan ${purchaseReq.products[0]?.categoryCode || 'baru'} di kandang ${
            coop.coopName
          } telah disetujui`,
          subHeadline: 'Terus pantau status Permintaannya ya',
          referenceId: `purchase-request-id: ${data.id}`,
          icon: '',
          iconPath: '',
        },
      });

      // FIXME:  please remove conditional USE_ERP feature flag once flow with ODOO is ready
      if (env.USE_ERP) {
        const erpCode = await this.erpDAO.createPurchaseRequest(purchaseReq);

        await this.prDAO.updateOne(
          {
            id: purchaseReq.id,
          },
          {
            erpCode,
          },
          {
            id: purchaseReq.userApprover.id,
            role: purchaseReq.userApprover.userType,
          },
        );
      } else {
        const queryRunner = await this.prDAO.startTransaction();

        try {
          const numberingPR = await queryRunner.manager.findOneOrFail(AutoNumbering, {
            where: {
              transactionType: AUTO_NUMBERING_TRX_TYPE.PURCHASE_REQUEST,
            },
          });

          const numberingPO = await queryRunner.manager.findOneOrFail(AutoNumbering, {
            where: {
              transactionType: AUTO_NUMBERING_TRX_TYPE.PURCHASE_ORDER,
            },
          });

          const erpCodePR = generateErpCode(
            numberingPR.lastNumber,
            numberingPR.digitCount,
            numberingPR.prefix,
          );

          await this.prDAO.updateOneWithTx(
            {
              id: purchaseReq.id,
            },
            {
              erpCode: erpCodePR,
            },
            {
              id: purchaseReq.userApprover.id,
              role: purchaseReq.userApprover.userType,
            },
            queryRunner,
          );

          const poProductsDOC = purchaseReq.products.filter((prp) => prp.categoryCode === 'DOC');

          const poProductsPakan = purchaseReq.products.filter(
            (prp) => prp.categoryCode === 'PAKAN',
          );

          const poProductsOVK = purchaseReq.products.filter((prp) => prp.categoryCode === 'OVK');

          const now = new Date();

          let numberingPOinc = 0;

          if (poProductsDOC.length) {
            const erpCodePO = generateErpCode(
              numberingPO.lastNumber + numberingPOinc,
              numberingPO.digitCount,
              numberingPO.prefix,
            );

            numberingPOinc += 1;

            const purchaseOrderId = randomHexString();

            const poDOC = await queryRunner.manager.save(PurchaseOrder, {
              id: purchaseOrderId,
              erpCode: erpCodePO,
              type: 'doc',
              datePlanned: purchaseReq.requestSchedule,
              farmingCycleId: purchaseReq.farmingCycleId,
              purchaseRequestId: purchaseReq.id,
              isDoc: true,
              isFulfilled: false,
              isApproved: true,
              approvedBy: purchaseReq.userApprover.id,
              createdBy: purchaseReq.userCreator.id,
              createdDate: now,
            });

            await this.poApprovedQueue.addJob(poDOC);

            await queryRunner.manager.save(
              PurchaseOrderProduct,
              poProductsDOC.map<DeepPartial<PurchaseOrderProduct>>((pop) => ({
                ...pop,
                purchaseOrderId,
                id: randomHexString(),
              })),
            );

            await this.coopDAO.updateOneWithTx(
              {
                id: purchaseReq.farmingCycle.coopId,
              },
              {
                activeFarmingCycleId: purchaseReq.farmingCycleId,
              },
              {
                id: purchaseReq.userApprover.id,
                role: purchaseReq.userApprover.userType,
              },
              queryRunner,
            );
          }

          await this.coopCacheUtil.invalidateCoopCache(purchaseReq.farmingCycle.coopId, 'both');

          if (poProductsPakan.length) {
            const erpCodePO = generateErpCode(
              numberingPO.lastNumber + numberingPOinc,
              numberingPO.digitCount,
              numberingPO.prefix,
            );

            numberingPOinc += 1;

            const purchaseOrderId = randomHexString();

            await queryRunner.manager.save(PurchaseOrder, {
              id: purchaseOrderId,
              erpCode: erpCodePO,
              type: 'pakan',
              datePlanned: purchaseReq.requestSchedule,
              farmingCycleId: purchaseReq.farmingCycleId,
              purchaseRequestId: purchaseReq.id,
              isDoc: false,
              isFulfilled: false,
              isApproved: true,
              notes: purchaseReq.notes,
              approvedBy: purchaseReq.userApprover.id,
              createdBy: purchaseReq.userCreator.id,
              createdDate: now,
            });

            await queryRunner.manager.save(
              PurchaseOrderProduct,
              poProductsPakan.map<DeepPartial<PurchaseOrderProduct>>((pop) => ({
                ...pop,
                purchaseOrderId,
                id: randomHexString(),
              })),
            );
          }

          if (poProductsOVK.length) {
            const erpCodePO = generateErpCode(
              numberingPO.lastNumber + numberingPOinc,
              numberingPO.digitCount,
              numberingPO.prefix,
            );

            numberingPOinc += 1;

            const purchaseOrderId = randomHexString();

            await queryRunner.manager.save(PurchaseOrder, {
              id: purchaseOrderId,
              erpCode: erpCodePO,
              type: 'ovk',
              datePlanned: purchaseReq.requestSchedule,
              farmingCycleId: purchaseReq.farmingCycleId,
              purchaseRequestId: purchaseReq.id,
              isDoc: false,
              isFulfilled: false,
              isApproved: true,
              approvedBy: purchaseReq.userApprover.id,
              createdBy: purchaseReq.userCreator.id,
              createdDate: now,
            });

            await queryRunner.manager.save(
              PurchaseOrderProduct,
              poProductsOVK.map<DeepPartial<PurchaseOrderProduct>>((pop) => ({
                ...pop,
                purchaseOrderId,
                id: randomHexString(),
              })),
            );
          }

          await queryRunner.manager.update(AutoNumbering, numberingPO.id, {
            lastNumber: () => `last_number + ${numberingPOinc}`,
          });

          await queryRunner.manager.update(AutoNumbering, numberingPR.id, {
            lastNumber: () => 'last_number + 1',
          });

          await this.prDAO.commitTransaction(queryRunner);
        } catch (error) {
          await this.prDAO.rollbackTransaction(queryRunner);

          throw error;
        }
      }
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }
}
