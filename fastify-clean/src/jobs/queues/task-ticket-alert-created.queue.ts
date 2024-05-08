import { Service } from 'fastify-decorators';
import { FarmingCycleAlertInstructionD } from '../../datasources/entity/pgsql/FarmingCycleAlertInstructionD.entity';
import { TaskTicket } from '../../datasources/entity/pgsql/TaskTicket.entity';
import { QUEUE_TASK_TICKET_ALERT_CREATED } from '../../libs/constants/queue';
import { RequestUser } from '../../libs/types/index.d';
import { BaseQueue } from './base.queue';

export type TaskTicketAlertCreatedJobData = {
  taskTicket: TaskTicket;
  farmingCycleAlertInstruction: FarmingCycleAlertInstructionD;
  user: RequestUser;
};

@Service()
export class TaskTicketAlertCreatedQueue extends BaseQueue<TaskTicketAlertCreatedJobData> {
  protected queueName = QUEUE_TASK_TICKET_ALERT_CREATED;
}
