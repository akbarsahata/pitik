import { Service } from 'fastify-decorators';
import { GamificationTaskPoint } from '../../dto/gamification.dto';
import { QUEUE_GAMIFICATION_TASK_POINT } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class GamificationTaskPointQueue extends BaseQueue<GamificationTaskPoint> {
  protected queueName = QUEUE_GAMIFICATION_TASK_POINT;
}
