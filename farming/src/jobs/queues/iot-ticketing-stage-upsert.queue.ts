import { Service } from 'fastify-decorators';
import { QUEUE_IOT_TICKETING_STAGE_UPSERT } from '../../libs/constants/queue';
import { IotTicketingStageUpsertJobData } from '../../libs/interfaces/job-data';
import { BaseQueue } from './base.queue';

@Service()
export class IotTicketingStageUpsertQueue extends BaseQueue<IotTicketingStageUpsertJobData> {
  protected queueName = QUEUE_IOT_TICKETING_STAGE_UPSERT;
}
