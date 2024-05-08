import { Service } from 'fastify-decorators';
import { UpdateDOCinJob } from '../../dto/farmingCycle.dto';
import { QUEUE_FARMING_CYCLE_DOC_IN } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class FarmingCycleDOCinQueue extends BaseQueue<UpdateDOCinJob> {
  protected queueName = QUEUE_FARMING_CYCLE_DOC_IN;
}
