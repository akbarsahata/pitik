/* eslint-disable no-unused-vars */
import { JobsOptions } from 'bullmq';
import { format } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { IsNull } from 'typeorm';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { FarmingCycleChickStockDDAO } from '../../dao/farmingCycleChickStockD.dao';
import { FarmingCycleFeedStockDDAO } from '../../dao/farmingCycleFeedStockD.dao';
import { FarmingCycleFeedStockSummaryDAO } from '../../dao/farmingCycleFeedStockSummary.dao';
import { FarmingCycleOvkStockLogDAO } from '../../dao/farmingCycleOvkStockLog.dao';
import { FarmingCycleOvkStockSummaryDAO } from '../../dao/farmingCycleOvkStockSummary.dao';
import { VariableLinkedDataDAO } from '../../dao/variableLinkedData.dao';
import { FarmChickCategory } from '../../datasources/entity/pgsql/Farm.entity';
import { FarmingCycle } from '../../datasources/entity/pgsql/FarmingCycle.entity';
import { DATE_SQL_FORMAT } from '../../libs/constants';
import { QUEUE_TASK_TICKET_DETAIL_UPDATED } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { TaskTicketDetailUpdatedJobData } from '../queues/task-ticket-detail-updated.queue';
import { BaseWorker } from './base.worker';

enum FieldOperatorEnum {
  PLUS = '+',
  MINUS = '-',
}

@Service()
export class TaskTicketDetailUpdatedWorker extends BaseWorker<TaskTicketDetailUpdatedJobData> {
  @Inject(VariableLinkedDataDAO)
  private variableLinkedDataDAO!: VariableLinkedDataDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO!: FarmingCycleDAO;

  @Inject(FarmingCycleChickStockDDAO)
  private farmingCycleChickStockDDAO: FarmingCycleChickStockDDAO;

  @Inject(FarmingCycleFeedStockDDAO)
  private farmingCycleFeedStockDDAO: FarmingCycleFeedStockDDAO;

  @Inject(FarmingCycleFeedStockSummaryDAO)
  private farmingCycleFeedStockSummaryDAO: FarmingCycleFeedStockSummaryDAO;

  @Inject(FarmingCycleOvkStockSummaryDAO)
  private farmingCycleOvkStockSummaryDAO: FarmingCycleOvkStockSummaryDAO;

  @Inject(FarmingCycleOvkStockLogDAO)
  private farmingCycleOvkStockLogDAO: FarmingCycleOvkStockLogDAO;

  @Inject(SlackDAO)
  private slackDAO: SlackDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_TASK_TICKET_DETAIL_UPDATED;

  protected async handle(
    {
      taskTicket,
      taskTicketD,
      user,
      feedConsumptions,
      ovkConsumptions,
      farmingCycleId,
    }: TaskTicketDetailUpdatedJobData,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ): Promise<void> {
    const queryRunner = await this.farmingCycleFeedStockSummaryDAO.startTransaction();

    try {
      const farmingCycle =
        (farmingCycleId &&
          (await this.farmingCycleDAO.getOne({
            where: {
              id: farmingCycleId,
            },
            relations: {
              farm: true,
            },
          }))) ||
        null;

      const isFarmLayer = farmingCycle?.farm.category === FarmChickCategory.LAYER;
      const uom = this.getUomFromFarmingCycle(farmingCycle);

      const variableLinkedData = await this.variableLinkedDataDAO.getOne({
        where: {
          variableId: taskTicketD.variableId,
        },
      });

      if (!variableLinkedData) {
        await this.farmingCycleFeedStockSummaryDAO.commitTransaction(queryRunner);

        return;
      }

      if (variableLinkedData.dataType === 'mortality' && taskTicket.ticketSource === 'task') {
        await this.farmingCycleChickStockDDAO.upsertStockWithTx(
          {
            farmingCycleId: taskTicket.farmingCycleId,
            taskTicketDId: taskTicketD.id,
            taskTicketId: taskTicket.id,
            transactionDate: taskTicket.reportedDate,
            qty: Number(taskTicketD.dataValue),
            operator: FieldOperatorEnum.MINUS,
            notes: `${variableLinkedData.dataType}`,
          },
          user,
          queryRunner,
        );

        await this.farmingCycleFeedStockSummaryDAO.commitTransaction(queryRunner);

        return;
      }

      if (
        variableLinkedData.dataType === 'chick_stock_plus' &&
        taskTicket.ticketSource === 'task'
      ) {
        await this.farmingCycleChickStockDDAO.upsertStockWithTx(
          {
            farmingCycleId: taskTicket.farmingCycleId,
            taskTicketDId: taskTicketD.id,
            taskTicketId: taskTicket.id,
            transactionDate: taskTicket.reportedDate,
            qty: Number(taskTicketD.dataValue),
            operator: FieldOperatorEnum.PLUS,
            notes: `${variableLinkedData.dataType}`,
          },
          user,
          queryRunner,
        );

        await this.farmingCycleFeedStockSummaryDAO.commitTransaction(queryRunner);

        return;
      }

      if (
        variableLinkedData.dataType === 'chick_stock_minus' &&
        taskTicket.ticketSource === 'task'
      ) {
        await this.farmingCycleChickStockDDAO.upsertStockWithTx(
          {
            farmingCycleId: taskTicket.farmingCycleId,
            taskTicketDId: taskTicketD.id,
            taskTicketId: taskTicket.id,
            transactionDate: taskTicket.reportedDate,
            qty: Number(taskTicketD.dataValue),
            operator: FieldOperatorEnum.MINUS,
            notes: `${variableLinkedData.dataType}`,
          },
          user,
          queryRunner,
        );

        await this.farmingCycleFeedStockSummaryDAO.commitTransaction(queryRunner);

        return;
      }

      if (
        variableLinkedData.dataType === 'feed_stock_minus' &&
        taskTicket.ticketSource === 'task'
      ) {
        if (feedConsumptions?.length) {
          await Promise.allSettled(
            feedConsumptions.map(async (fc) => {
              let fcStockSummary = await this.farmingCycleFeedStockSummaryDAO.getOneWithTx(
                {
                  where: isFarmLayer
                    ? {
                        // TODO: remove this if procurement feature for layer is implemented
                        farmingCycleId: taskTicket.farmingCycleId,
                        subcategoryCode: fc.subcategoryCode,
                        productCode: fc.productCode,
                      }
                    : {
                        id: fc.feedStockSummaryId,
                      },
                },
                queryRunner,
              );

              // TODO: remove this if procurement feature for layer is implemented
              if (!fcStockSummary && isFarmLayer) {
                // create summary
                fcStockSummary = await this.farmingCycleFeedStockSummaryDAO.createOneWithTx(
                  {
                    farmingCycleId,
                    subcategoryCode: fc.subcategoryCode,
                    subcategoryName: fc.subcategoryCode,
                    productCode: fc.productCode,
                    productName: fc.productName,
                    remainingQuantity: 0,
                    bookedQuantity: 0,
                    uom,
                  },
                  user,
                  queryRunner,
                );
              }

              if (fcStockSummary === null) {
                // throw error
                throw new Error('Feed stock summary not found');
              }

              const productDetail = fcStockSummary
                ? `${fcStockSummary.subcategoryCode}:${fcStockSummary.subcategoryName}:${fcStockSummary.productCode}:${fcStockSummary.productName}`
                : undefined;

              const logNotes = `${variableLinkedData.dataType} - fc_feedstock_summary_id:${fcStockSummary.id}`;
              const consumedDate = format(new Date(taskTicket.reportedDate), DATE_SQL_FORMAT);

              const fcFeedStock = await this.farmingCycleFeedStockDDAO.getOneWithTx(
                {
                  where: {
                    taskTicketDId: taskTicketD.id || IsNull(),
                    operator: FieldOperatorEnum.MINUS,
                    notes: logNotes,
                    productDetail,
                    consumedDate: taskTicketD.id ? undefined : consumedDate,
                  },
                },
                queryRunner,
              );

              if (fcFeedStock) {
                await this.farmingCycleFeedStockSummaryDAO.incrementRemainingQuantityWithTx(
                  {
                    id: fcStockSummary.id,
                  },
                  Math.abs(Number(fcFeedStock.qty)),
                  user,
                  queryRunner,
                );
              }

              // for layer it is assumed the qty received is already in kilogram
              await this.farmingCycleFeedStockDDAO.upsertOneWithTx(
                {
                  taskTicketDId: taskTicketD.id || IsNull(),
                  operator: FieldOperatorEnum.MINUS,
                  notes: logNotes,
                  productDetail,
                  consumedDate: taskTicketD.id ? undefined : consumedDate,
                },
                {
                  farmingCycleId: taskTicket.farmingCycleId,
                  taskTicketDId: taskTicketD.id || undefined,
                  taskTicketId: taskTicket.id || undefined,
                  userId: user.id,
                  operator: FieldOperatorEnum.MINUS,
                  notes: logNotes,
                  productDetail,
                  qty: Number(fc.quantity),
                  consumedDate,
                  uom,
                },
                user,
                queryRunner,
              );

              await this.farmingCycleFeedStockSummaryDAO.incrementRemainingQuantityWithTx(
                {
                  id: fcStockSummary.id,
                },
                -1 * Number(fc.quantity),
                user,
                queryRunner,
              );
            }),
          );
        } else {
          // updating from FMS
          // TODO: remove if FEED and OVK can be inputted from FMS too
          const existingStock = await this.farmingCycleFeedStockDDAO.getOneWithTx(
            {
              where: {
                farmingCycleId: taskTicket.farmingCycleId,
                taskTicketDId: taskTicketD.id,
                taskTicketId: taskTicket.id,
                operator: FieldOperatorEnum.MINUS,
              },
            },
            queryRunner,
          );

          // for layer it is assumed the qty received is already in kilogram
          await this.farmingCycleFeedStockDDAO.upsertStockWithTx(
            {
              farmingCycleId: taskTicket.farmingCycleId,
              taskTicketDId: taskTicketD.id,
              taskTicketId: taskTicket.id,
              userId: user.id,
              qty: Number(taskTicketD.dataValue),
              operator: FieldOperatorEnum.MINUS,
              notes: existingStock ? existingStock.notes : variableLinkedData.dataType,
              uom,
            },
            user,
            queryRunner,
          );
        }

        await this.farmingCycleFeedStockSummaryDAO.commitTransaction(queryRunner);

        return;
      }

      if (variableLinkedData.dataType === 'ovk_stock_minus' && taskTicket.ticketSource === 'task') {
        if (ovkConsumptions?.length) {
          await Promise.allSettled(
            ovkConsumptions.map(async (oc) => {
              let ovkStockSummary = await this.farmingCycleOvkStockSummaryDAO.getOneWithTx(
                {
                  where: isFarmLayer
                    ? {
                        // TODO: remove this if procurement feature for layer is implemented
                        farmingCycleId: taskTicket.farmingCycleId,
                        subcategoryCode: oc.subcategoryCode,
                        productCode: oc.productCode,
                      }
                    : {
                        id: oc.ovkStockSummaryId,
                      },
                },
                queryRunner,
              );

              // TODO: remove this if procurement feature for layer is implemented
              if (!ovkStockSummary && isFarmLayer) {
                // create summary
                ovkStockSummary = await this.farmingCycleOvkStockSummaryDAO.createOneWithTx(
                  {
                    farmingCycleId,
                    subcategoryCode: oc.subcategoryCode,
                    subcategoryName: oc.subcategoryCode,
                    productCode: oc.productCode,
                    productName: oc.productName,
                    remainingQuantity: 0,
                    bookedQuantity: 0,
                  },
                  user,
                  queryRunner,
                );
              }

              if (ovkStockSummary === null) {
                // throw error
                throw new Error('OVK stock summary not found');
              }

              const logNotes = `${variableLinkedData.dataType} - fc_ovkstock_summary_id:${ovkStockSummary.id}`;
              const consumedDate = format(new Date(taskTicket.reportedDate), DATE_SQL_FORMAT);

              const ovkStockLog = await this.farmingCycleOvkStockLogDAO.getOneWithTx(
                {
                  where: {
                    taskTicketDId: taskTicketD.id || IsNull(),
                    operator: FieldOperatorEnum.MINUS,
                    notes: logNotes,
                    subcategoryCode: ovkStockSummary?.subcategoryCode || '',
                    subcategoryName: ovkStockSummary?.subcategoryName || '',
                    productCode: ovkStockSummary?.productCode || '',
                    productName: ovkStockSummary?.productName || '',
                    consumedDate: taskTicketD.id ? undefined : consumedDate,
                  },
                },
                queryRunner,
              );

              if (ovkStockLog) {
                await this.farmingCycleOvkStockSummaryDAO.incrementRemainingQuantityWithTx(
                  {
                    id: ovkStockSummary.id,
                  },
                  Math.abs(Number(ovkStockLog.quantity)),
                  user,
                  queryRunner,
                );
              }

              await this.farmingCycleOvkStockLogDAO.upsertOneWithTx(
                {
                  taskTicketDId: taskTicketD.id || IsNull(),
                  operator: FieldOperatorEnum.MINUS,
                  notes: logNotes,
                  subcategoryCode: ovkStockSummary?.subcategoryCode || '',
                  subcategoryName: ovkStockSummary?.subcategoryName || '',
                  productCode: ovkStockSummary?.productCode || '',
                  productName: ovkStockSummary?.productName || '',
                  consumedDate: taskTicketD.id ? undefined : consumedDate,
                },
                {
                  farmingCycleId: taskTicket.farmingCycleId,
                  taskTicketDId: taskTicketD.id || undefined,
                  taskTicketId: taskTicket.id || undefined,
                  operator: FieldOperatorEnum.MINUS,
                  notes: logNotes,
                  subcategoryCode: ovkStockSummary?.subcategoryCode || '',
                  subcategoryName: ovkStockSummary?.subcategoryName || '',
                  productCode: ovkStockSummary?.productCode || '',
                  productName: ovkStockSummary?.productName || '',
                  quantity: Number(oc.quantity),
                  remarks: oc.remarks,
                  consumedDate,
                },
                user,
                queryRunner,
              );

              await this.farmingCycleOvkStockSummaryDAO.incrementRemainingQuantityWithTx(
                {
                  id: ovkStockSummary.id,
                },
                -1 * Number(oc.quantity),
                user,
                queryRunner,
              );
            }),
          );
        }
      }

      if (variableLinkedData.dataType === 'harvested' && taskTicket.ticketSource === 'harvest') {
        await this.farmingCycleChickStockDDAO.upsertStockWithTx(
          {
            farmingCycleId: taskTicket.farmingCycleId,
            taskTicketDId: taskTicketD.id,
            taskTicketId: taskTicket.id,
            transactionDate: taskTicket.reportedDate,
            qty: Number(taskTicketD.dataValue),
            operator: FieldOperatorEnum.MINUS,
            notes: `${variableLinkedData.dataType} - harvest`,
          },
          user,
          queryRunner,
        );

        await this.farmingCycleFeedStockSummaryDAO.commitTransaction(queryRunner);

        return;
      }

      await this.farmingCycleFeedStockSummaryDAO.commitTransaction(queryRunner);
    } catch (error) {
      await this.farmingCycleFeedStockSummaryDAO.rollbackTransaction(queryRunner);

      this.logger.error(error);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(
          this.workerName,
          error,
          {
            taskTicket,
            taskTicketD,
            user,
            feedConsumptions,
          },
          jobId,
        );
      }

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private getUomFromFarmingCycle(farmingCycle: FarmingCycle | null): string {
    return farmingCycle?.farm.category === FarmChickCategory.LAYER ? 'kilogram' : 'karung';
  }
}
