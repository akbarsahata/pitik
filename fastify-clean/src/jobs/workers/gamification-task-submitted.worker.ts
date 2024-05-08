import { captureException } from '@sentry/node';
import { addHours, isBefore } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { Not } from 'typeorm';
import env from '../../config/env';
import { DataVerificationGamificationDAO } from '../../dao/dataVerificationGamification.dao';
import { TaskTicketDAO } from '../../dao/taskTicket.dao';
import { TaskTicketDDAO } from '../../dao/taskTicketD.dao';
import { UserDAO } from '../../dao/user.dao';
import { GamificationTaskSubmitted } from '../../dto/gamification.dto';
import { DEFAULT_TIME_ZONE, USER_TYPE } from '../../libs/constants';
import { QUEUE_GAMIFICATION_TASK_SUBMITTED } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { GamificationTaskPointQueue } from '../queues/gamification-task-point.queue';
import { BaseWorker } from './base.worker';

@Service()
export class GamificationTaskSubmittedWorker extends BaseWorker<GamificationTaskSubmitted> {
  @Inject(TaskTicketDDAO)
  private taskTicketDDAO: TaskTicketDDAO;

  @Inject(TaskTicketDAO)
  private taskTicketDAO: TaskTicketDAO;

  @Inject(DataVerificationGamificationDAO)
  private dataVerificationDAO: DataVerificationGamificationDAO;

  @Inject(UserDAO)
  private userDAO: UserDAO;

  @Inject(GamificationTaskPointQueue)
  private taskPointQueue: GamificationTaskPointQueue;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_GAMIFICATION_TASK_SUBMITTED;

  protected async handle(data: GamificationTaskSubmitted) {
    try {
      const [taskTicket, userSubmitter] = await Promise.all([
        this.taskTicketDAO.getOneStrict({
          where: {
            id: data.taskTicketId,
          },
          relations: {
            farmingCycle: true,
          },
        }),
        this.userDAO.getOneById(data.userSubmitterId),
      ]);

      /** skip process */
      if (userSubmitter.userType === USER_TYPE.PPL) return;

      const chickInDate = zonedTimeToUtc(
        taskTicket.farmingCycle.farmingCycleStartDate,
        DEFAULT_TIME_ZONE,
      );

      if (isBefore(chickInDate, env.GAMIFICATION_START_DATE)) return;

      if (taskTicket.alertTriggeredId) return;

      if (taskTicket.harvestTaskId) return;

      if (taskTicket.createdBy !== 'System') return;
      /** end of skip process */

      const [forms, count] = await this.taskTicketDDAO.getCheckCorrectnessOnly(data.taskTicketId);

      if (count > 0) {
        await this.dataVerificationDAO.createWithDetails(
          {
            farmingCycleId: data.farmingCycleId,
            taskTicketId: data.taskTicketId,
          },
          forms.map((f) => ({
            taskTicketDId: f.id,
          })),
          data.userSubmitterId,
        );
      } else {
        const deadline = addHours(taskTicket.reportedDate, taskTicket.deadline);

        const isOnTime = taskTicket.executedDate <= deadline;

        const earnedPoints = await this.calculatePoint(data.taskTicketId, isOnTime);

        await this.taskPointQueue.addJob({
          earnedPoints,
          farmingCycleId: data.farmingCycleId,
          taskTicketId: data.taskTicketId,
          userSubmitterId: data.userSubmitterId,
        });
      }
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }

  private async calculatePoint(taskTicketId: string, isOnTime = false): Promise<number> {
    const [, count] = await this.taskTicketDDAO.getByTaskTicket(taskTicketId, {
      where: { dataRequired: Not(0) },
    });

    if (isOnTime) return (1 + count * 2) * 3;

    return 1 + count * 2;
  }
}
