import { Service } from 'fastify-decorators';
import { TaskTicketJob } from '../../dto/farmingCycle.dto';
import { QUEUE_GENERATE_TASK_TICKET } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class GenerateTaskTicketQueue extends BaseQueue<TaskTicketJob> {
  protected queueName = QUEUE_GENERATE_TASK_TICKET;
}
