import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import { Not } from 'typeorm';
import { DataVerificationGamificationDAO } from '../../dao/dataVerificationGamification.dao';
import { TaskTicketDDAO } from '../../dao/taskTicketD.dao';
import { GamificationTaskVerified } from '../../dto/gamification.dto';
import { QUEUE_GAMIFICATION_TASK_VERIFIED } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { GamificationTaskPointQueue } from '../queues/gamification-task-point.queue';
import { BaseWorker } from './base.worker';

@Service()
export class GamificationTaskVerifiedWorker extends BaseWorker<GamificationTaskVerified> {
  @Inject(DataVerificationGamificationDAO)
  dataVerificationDAO: DataVerificationGamificationDAO;

  @Inject(TaskTicketDDAO)
  taskTicketDDAO: TaskTicketDDAO;

  @Inject(GamificationTaskPointQueue)
  taskPointQueue: GamificationTaskPointQueue;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_GAMIFICATION_TASK_VERIFIED;

  protected async handle(data: GamificationTaskVerified) {
    try {
      const dataVerification = await this.dataVerificationDAO.getOne({
        where: {
          id: data.dataVerificationId,
        },
        relations: {
          details: true,
        },
      });

      let correctData = 0;

      dataVerification.details.forEach((vd) => {
        if (vd.hasCorrectData) correctData += 1;
      });

      const earnedPoints = await this.calculatePoint(
        data.taskTicketId,
        correctData,
        data.onTimeStatus,
      );

      await this.taskPointQueue.addJob({
        earnedPoints,
        farmingCycleId: data.farmingCycleId,
        dataVerificationId: data.dataVerificationId,
        taskTicketId: data.taskTicketId,
        userSubmitterId: dataVerification.createdBy,
        userVerifierId: dataVerification.userVerifierId,
      });
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }

  private async calculatePoint(
    taskTicketId: string,
    correctData: number,
    isOnTime = false,
  ): Promise<number> {
    const [, count] = await this.taskTicketDDAO.getByTaskTicket(taskTicketId, {
      where: { dataRequired: Not(0) },
    });

    if (isOnTime) return (1 + count * 2 + correctData * 4) * 3;

    return 1 + count * 2 + correctData * 4;
  }
}
