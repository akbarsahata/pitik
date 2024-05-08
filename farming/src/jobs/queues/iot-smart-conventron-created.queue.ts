import { Service } from 'fastify-decorators';
import { ConventronCreatedJob } from '../../dto/smartConventron.dto';
import { QUEUE_IOT_SMART_CONVENTRON_CREATED } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class IotSmartConventronCreatedQueue extends BaseQueue<ConventronCreatedJob> {
  protected queueName = QUEUE_IOT_SMART_CONVENTRON_CREATED;
}
