import { Service } from 'fastify-decorators';
import { GamificationTaskSubmitted } from '../../dto/gamification.dto';
import { QUEUE_GAMIFICATION_TASK_SUBMITTED } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class GamificationTaskSubmittedQueue extends BaseQueue<GamificationTaskSubmitted> {
  protected queueName = QUEUE_GAMIFICATION_TASK_SUBMITTED;
}
