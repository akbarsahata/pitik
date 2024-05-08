import { Service } from 'fastify-decorators';
import { QUEUE_DAILY_REPORT_REVISION_REQUESTED } from '../../libs/constants/queue';
import { DailyReportRevisionRequestedQueueJobData } from '../../libs/interfaces/job-data';
import { BaseQueue } from './base.queue';

@Service()
export class DailyReportRevisionRequestedQueue extends BaseQueue<DailyReportRevisionRequestedQueueJobData> {
  protected queueName = QUEUE_DAILY_REPORT_REVISION_REQUESTED;
}
