import { Service } from 'fastify-decorators';
import { TaskTicket } from '../../datasources/entity/pgsql/TaskTicket.entity';
import { TaskTicketD } from '../../datasources/entity/pgsql/TaskTicketD.entity';
import { QUEUE_TASK_TICKET_DETAIL_UPDATED } from '../../libs/constants/queue';
import { RequestUser } from '../../libs/types/index.d';
import { BaseQueue } from './base.queue';

export type TaskTicketDetailUpdatedJobData = {
  taskTicketD: TaskTicketD;
  taskTicket: TaskTicket;
  user: RequestUser;
};

@Service()
export class TaskTicketDetailUpdatedQueue extends BaseQueue<TaskTicketDetailUpdatedJobData> {
  protected queueName = QUEUE_TASK_TICKET_DETAIL_UPDATED;
}
