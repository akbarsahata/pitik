import { Service } from 'fastify-decorators';
import { LateTaskTicketTicketJob } from '../../dto/farmingCycle.dto';
import { QUEUE_GENERATE_LATE_TASK_REMINDER } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class GenerateLateTaskReminderQueue extends BaseQueue<LateTaskTicketTicketJob> {
  protected queueName = QUEUE_GENERATE_LATE_TASK_REMINDER;
}
