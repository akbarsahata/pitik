import { Service } from 'fastify-decorators';
import { AlertJob } from '../../dto/farmingCycle.dto';
import { QUEUE_GENERATE_ALERT } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class GenerateAlertQueue extends BaseQueue<AlertJob> {
  protected queueName = QUEUE_GENERATE_ALERT;
}
