import { Service } from 'fastify-decorators';
import { QUEUE_GENERATE_DAILY_REPORT_REMINDER } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

export type GenerateDailyReportReminderJob = {
  taskTicketId: string;
};

@Service()
export class GenerateDailyReportReminderQueue extends BaseQueue<GenerateDailyReportReminderJob> {
  protected queueName = QUEUE_GENERATE_DAILY_REPORT_REMINDER;
}
