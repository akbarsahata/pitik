import { Service } from 'fastify-decorators';
import { TaskTicket } from '../../datasources/entity/pgsql/TaskTicket.entity';
import { TaskTicketD } from '../../datasources/entity/pgsql/TaskTicketD.entity';
import { QUEUE_TASK_TICKET_DETAIL_UPDATED } from '../../libs/constants/queue';
import { RequestUser } from '../../libs/types/index.d';
import { BaseQueue } from './base.queue';

export type TaskTicketDetailUpdatedJobData = {
  taskTicketD: Pick<TaskTicketD, 'id' | 'variableId' | 'dataValue'>;
  taskTicket: Pick<TaskTicket, 'id' | 'farmingCycleId' | 'ticketSource' | 'reportedDate'>;
  user: RequestUser;
  feedConsumptions?: {
    feedStockSummaryId: string;
    quantity: number;
    subcategoryCode?: string;
    subcategoryName?: string;
    productCode?: string;
    productName?: string;
  }[];
  ovkConsumptions?: {
    ovkStockSummaryId: string;
    quantity: number;
    remarks?: string;
    subcategoryCode?: string;
    subcategoryName?: string;
    productCode?: string;
    productName?: string;
  }[];
  farmingCycleId?: string;
};

@Service()
export class TaskTicketDetailUpdatedQueue extends BaseQueue<TaskTicketDetailUpdatedJobData> {
  protected queueName = QUEUE_TASK_TICKET_DETAIL_UPDATED;
}
