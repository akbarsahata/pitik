import { Inject, Service } from 'fastify-decorators';
import { SlackDAO } from '../../dao/external/slack.dao';
import { StockOpnameDAO } from '../../dao/sales/stockOpname.dao';
import { USER_TYPE } from '../../libs/constants';
import { QUEUE_SALES_STOCK_OPNAME_CREATED } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
import { SalesStockOpnameCreatedJobData } from '../../libs/interfaces/job-data';
import { Logger } from '../../libs/utils/logger';
import { UserService as UserCoreService } from '../../services/usermanagement/userCore.service';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

@Service()
export class SalesStockOpnameCreatedWorker extends BaseWorker<SalesStockOpnameCreatedJobData> {
  @Inject(StockOpnameDAO)
  private stockOpnameDAO: StockOpnameDAO;

  @Inject(UserCoreService)
  private userCoreService: UserCoreService;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  @Inject(Logger)
  private logger!: Logger;

  protected workerName = QUEUE_SALES_STOCK_OPNAME_CREATED;

  protected async handle(
    data: SalesStockOpnameCreatedJobData,
    attemptsMade: number,
    opts: any,
    jobId?: string,
  ) {
    try {
      const { stockOpnameId } = data;

      const stockOpname = await this.stockOpnameDAO.getOneStrict({
        where: {
          id: stockOpnameId,
        },
        relations: {
          salesOperationUnit: {
            salesUsersInOperationUnit: true,
          },
          userCreator: true,
        },
      });

      const salesUserIds = stockOpname.salesOperationUnit.salesUsersInOperationUnit.map(
        (user) => user.userId,
      );

      const [salesUsersDetails] = await this.userCoreService.search({ cmsIds: salesUserIds });

      const operationalLeads = salesUsersDetails.filter((user) =>
        user.roles?.some((role) => role.name === USER_TYPE.OPERATIONAL_LEAD),
      );

      const userReceivers = operationalLeads.reduce((ids, user) => {
        if (user.cmsId) return [...ids, user.cmsId];
        return ids;
      }, [] as string[]);

      await this.pushNotificationQueue.sendNotificationToApp('internal', {
        appTarget: 'internal',
        userReceivers,
        content: {
          type: 'stock-opname',
          headline: `Ada stok opname baru di ${stockOpname.salesOperationUnit.operationUnitName}`,
          subHeadline: `${`${
            stockOpname.userCreator?.fullName || 'Shop keeper'
          } telah membuat stok opname baru,`} silahkan cek stok opname yang telah dibuat`,
          body: `Ada stok opname baru di ${stockOpname.salesOperationUnit.operationUnitName}`,
          target: targetPage.android.internal.detailOpname,
          additionalParameters: {
            opname: {
              id: stockOpname.id,
            },
          },
        },
        notification: {
          subjectId: 'stock-opname-created',
          notificationType: 'stock-opname',
          headline: `Ada stok opname baru di ${stockOpname.salesOperationUnit.operationUnitName}`,
          subHeadline: `${`${
            stockOpname.userCreator?.fullName || 'Shop keeper'
          } telah membuat stok opname baru,`} silahkan cek stok opname yang telah dibuat`,
          referenceId: `stock-opname-id: ${stockOpname.id}`,
          target: targetPage.android.internal.detailOpname,
          additionalParameters: {
            opname: {
              id: stockOpname.id,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(error);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, data, jobId);
      }

      throw error;
    }
  }
}
