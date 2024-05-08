/* eslint-disable no-unused-vars */
import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import { FarmingCycleChickStockDDAO } from '../../dao/farmingCycleChickStockD.dao';
import { FarmingCycleFeedStockDDAO } from '../../dao/farmingCycleFeedStockD.dao';
import { VariableLinkedDataDAO } from '../../dao/variableLinkedData.dao';
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

  @Inject(FarmingCycleChickStockDDAO)
  private farmingCycleChickStockDDAO: FarmingCycleChickStockDDAO;

  @Inject(FarmingCycleFeedStockDDAO)
  private farmingCycleFeedStockDDAO: FarmingCycleFeedStockDDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_TASK_TICKET_DETAIL_UPDATED;

  protected async handle({
    taskTicket,
    taskTicketD,
    user,
  }: TaskTicketDetailUpdatedJobData): Promise<void> {
    try {
      const variableLinkedData = await this.variableLinkedDataDAO.getOne({
        where: {
          variableId: taskTicketD.variableId,
        },
      });

      if (!variableLinkedData) return;

      if (variableLinkedData.dataType === 'mortality' && taskTicket.ticketSource === 'task') {
        await this.farmingCycleChickStockDDAO.upsert(
          {
            farmingCycleId: taskTicket.farmingCycleId,
            taskTicketDId: taskTicketD.id,
            taskTicketId: taskTicket.id,
            transactionDate: taskTicket.reportedDate,
            qty: Number(taskTicketD.dataValue),
            operator: FieldOperatorEnum.MINUS,
            notes: variableLinkedData.dataType,
          },
          user,
        );

        return;
      }

      if (
        variableLinkedData.dataType === 'chick_stock_plus' &&
        taskTicket.ticketSource === 'task'
      ) {
        await this.farmingCycleChickStockDDAO.upsert(
          {
            farmingCycleId: taskTicket.farmingCycleId,
            taskTicketDId: taskTicketD.id,
            taskTicketId: taskTicket.id,
            transactionDate: taskTicket.reportedDate,
            qty: Number(taskTicketD.dataValue),
            operator: FieldOperatorEnum.PLUS,
            notes: variableLinkedData.dataType,
          },
          user,
        );

        return;
      }

      if (
        variableLinkedData.dataType === 'chick_stock_minus' &&
        taskTicket.ticketSource === 'task'
      ) {
        await this.farmingCycleChickStockDDAO.upsert(
          {
            farmingCycleId: taskTicket.farmingCycleId,
            taskTicketDId: taskTicketD.id,
            taskTicketId: taskTicket.id,
            transactionDate: taskTicket.reportedDate,
            qty: Number(taskTicketD.dataValue),
            operator: FieldOperatorEnum.MINUS,
            notes: variableLinkedData.dataType,
          },
          user,
        );

        return;
      }

      if (
        variableLinkedData.dataType === 'feed_stock_minus' &&
        taskTicket.ticketSource === 'task'
      ) {
        this.farmingCycleFeedStockDDAO.upsert(
          {
            farmingCycleId: taskTicket.farmingCycleId,
            taskTicketDId: taskTicketD.id,
            taskTicketId: taskTicket.id,
            qty: Number(taskTicketD.dataValue),
            operator: FieldOperatorEnum.MINUS,
            notes: variableLinkedData.dataType,
          },
          user,
        );
      }

      if (variableLinkedData.dataType === 'harvested' && taskTicket.ticketSource === 'harvest') {
        await this.farmingCycleChickStockDDAO.upsert(
          {
            farmingCycleId: taskTicket.farmingCycleId,
            taskTicketDId: taskTicketD.id,
            taskTicketId: taskTicket.id,
            transactionDate: taskTicket.reportedDate,
            qty: Number(taskTicketD.dataValue),
            operator: FieldOperatorEnum.MINUS,
            notes: variableLinkedData.dataType,
          },
          user,
        );
      }
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }
}
