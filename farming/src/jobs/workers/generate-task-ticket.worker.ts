import { JobsOptions } from 'bullmq';
import { addHours, format } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { DeepPartial } from 'typeorm';
import env from '../../config/env';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { FarmingCycleMemberDDAO } from '../../dao/farmingCycleMemberD.dao';
import { FarmingCycleTaskFormDDAO } from '../../dao/farmingCycleTaskFormD.dao';
import { TaskTicketDAO } from '../../dao/taskTicket.dao';
import { TaskTicketDDAO } from '../../dao/taskTicketD.dao';
import { TaskTicketD } from '../../datasources/entity/pgsql/TaskTicketD.entity';
import { TaskTicketJob } from '../../dto/farmingCycle.dto';
import { TIME_HH_MM } from '../../libs/constants';
import { QUEUE_GENERATE_TASK_TICKET } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
import { RequestUser } from '../../libs/types/index.d';
import { constructAdditionalNotificationCoop } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

@Service()
export class GenerateTaskTicketWorker extends BaseWorker<TaskTicketJob> {
  @Inject(Logger)
  private logger: Logger;

  @Inject(TaskTicketDAO)
  private taskTicketDAO: TaskTicketDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(FarmingCycleTaskFormDDAO)
  private fcTaskFormDDAO: FarmingCycleTaskFormDDAO;

  @Inject(TaskTicketDDAO)
  private taskTicketDDAO: TaskTicketDDAO;

  @Inject(FarmingCycleMemberDDAO)
  private fcMemberDDAO: FarmingCycleMemberDDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  protected workerName = QUEUE_GENERATE_TASK_TICKET;

  protected async handle(
    data: TaskTicketJob,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ) {
    // prevent worker to execute in local machine
    if (env.isDev) return;

    const user: RequestUser = {
      id: `system${env.isDev ? '-local' : ''}`,
      role: 'system',
    };

    const reportedDate = new Date(data.reportedDate);

    const deadlineDate = addHours(reportedDate, data.triggerDeadline);

    const deadlineTimeStr = format(deadlineDate, TIME_HH_MM);

    const existingTaskTicket = await this.taskTicketDAO.getOne({
      where: {
        farmingCycleTaskId: data.farmingCycleTaskId,
        reportedDate: new Date(data.reportedDate),
      },
    });

    if (existingTaskTicket) return;

    const queryRunner = await this.taskTicketDAO.startTransaction();

    try {
      const taskTicket = await this.taskTicketDAO.createFromJobWithTx(data, user, queryRunner);

      await this.taskTicketDAO.commitTransaction(queryRunner, false);

      const [fcTaskForms, fcTaskFormCount] = await this.fcTaskFormDDAO.getMany({
        where: {
          farmingCycleTaskId: data.farmingCycleTaskId,
        },
      });

      if (fcTaskFormCount > 0) {
        await this.taskTicketDDAO.createManyWithTx(
          fcTaskForms.map<DeepPartial<TaskTicketD>>((form) => ({
            taskTicketId: taskTicket.id,
            instructionTitle: form.instructionTitle,
            dataRequired: form.dataRequired,
            dataInstruction: form.dataInstruction,
            dataType: form.dataType,
            dataOption: form.dataOption,
            variableId: form.variableId,
            dataOperator: form.dataOperator,
            photoRequired: form.photoRequired,
            photoInstruction: form.photoInstruction,
            videoRequired: form.videoRequired,
            videoInstruction: form.videoInstruction,
            needAdditionalDetail: form.needAdditionalDetail,
            additionalDetail: form.additionalDetail,
            checkDataCorrectness: form.checkDataCorrectness, // TODO: gamification removal
          })),
          user,
          queryRunner,
        );
      }

      await this.taskTicketDAO.commitTransaction(queryRunner);

      const [farmingCycle, [fcWorkers]] = await Promise.all([
        this.farmingCycleDAO.getOneStrict({
          where: {
            id: data.farmingCycleId,
          },
          relations: {
            coop: true,
            farm: {
              city: true,
              district: true,
            },
          },
        }),
        await this.fcMemberDDAO.getMany({
          where: {
            farmingCycleId: data.farmingCycleId,
            isInternal: false,
          },
          select: {
            userId: true,
          },
        }),
      ]);

      await this.pushNotificationQueue.sendNotificationToApp('ppl', {
        appTarget: 'ppl',
        userReceivers: [data.farmOwnerId, ...fcWorkers.map((fcm) => fcm.userId)],
        content: {
          id: taskTicket.id,
          headline: data.coopName,
          subHeadline: data.taskName,
          body: `${data.taskName} sebelum jam ${deadlineTimeStr}`,
          type: 'task-ticket',
          target: targetPage.android.ppl.taskDetailPage,
          additionalParameters: {
            type: 'detailTask',
            taskId: taskTicket.id,
            taskDate: format(taskTicket.reportedDate, 'yyyy-MM-dd'),
            coopId: data.coopId,
            farmingCycleId: data.farmingCycleId,
            coop: constructAdditionalNotificationCoop(farmingCycle),
          },
        },
        notification: {
          subjectId: 'System',
          notificationType: 'task-ticket',
          headline: data.coopName,
          subHeadline: `${data.taskName} sebelum jam ${deadlineTimeStr}`,
          referenceId: `task-ticket-id: ${taskTicket.id}`,
          icon: '',
          iconPath: '',
          target: targetPage.android.ppl.taskDetailPage,
          additionalParameters: {
            type: 'detailTask',
            taskId: taskTicket.id,
            taskDate: format(taskTicket.reportedDate, 'yyyy-MM-dd'),
            coopId: data.coopId,
            farmingCycleId: data.farmingCycleId,
            coop: constructAdditionalNotificationCoop(farmingCycle),
          },
        },
      });
    } catch (error) {
      await this.taskTicketDAO.rollbackTransaction(queryRunner);

      this.logger.error(error);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, data, jobId);
      }

      throw error;
    }
  }
}
