import { Service } from 'fastify-decorators';
import { GamificationTaskVerified } from '../../dto/gamification.dto';
import { QUEUE_GAMIFICATION_TASK_VERIFIED } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class GamificationTaskVerifiedQueue extends BaseQueue<GamificationTaskVerified> {
  protected queueName = QUEUE_GAMIFICATION_TASK_VERIFIED;
}
