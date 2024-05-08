import { JobsOptions } from 'bullmq';
import { addHours, format } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { FarmingCycleAlertFormDDAO } from '../../dao/farmingCycleAlertFromD.dao';
import { FarmingCycleMemberDDAO } from '../../dao/farmingCycleMemberD.dao';
import { TaskTicketDDAO } from '../../dao/taskTicketD.dao';
import { DATE_SQL_FORMAT, TIME_HH_MM } from '../../libs/constants';
import { QUEUE_TASK_TICKET_ALERT_CREATED } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
import { constructAdditionalNotificationCoop } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { TaskTicketAlertCreatedJobData } from '../queues/task-ticket-alert-created.queue';
import { BaseWorker } from './base.worker';

@Service()
export class TaskTicketAlertCreatedWorker extends BaseWorker {
  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  @Inject(TaskTicketDDAO)
  private taskTicketDDAO: TaskTicketDDAO;

  @Inject(FarmingCycleMemberDDAO)
  private farmingCycleMemberDDAO: FarmingCycleMemberDDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(FarmingCycleAlertFormDDAO)
  private farmingCycleAlertFormDDAO: FarmingCycleAlertFormDDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_TASK_TICKET_ALERT_CREATED;

  protected async handle(
    { taskTicket, farmingCycleAlertInstruction, user }: TaskTicketAlertCreatedJobData,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ): Promise<void> {
    try {
      const alertForms = await this.farmingCycleAlertFormDDAO.getMany({
        where: {
          farmingCycleAlertInstructionId: farmingCycleAlertInstruction.id,
        },
        order: {
          seqNo: 'ASC',
        },
      });

      await this.taskTicketDDAO.createMany(
        alertForms.map((af) => ({
          taskTicketId: taskTicket.id,
          instructionTitle: af.instructionTitle,
          variabelId: af.variableId,
          feedBrandId: af.feedBrandId,
          dataRequired: af.dataRequired,
          dataInstruction: af.dataInstruction,
          dataOption: af.dataOption,
          dataOperator: af.dataOperator,
          photoRequired: af.photoRequired,
          photoInstruction: af.photoInstruction,
          videoRequired: af.videoRequired,
          videoInstruction: af.videoInstruction,
          needAdditionalDetail: af.needAdditionalDetail,
          additionalDetail: af.additionalDetail,
        })),
        user,
      );

      const [farmingCycle, [farmingCycleMembers]] = await Promise.all([
        this.farmingCycleDAO.getOneStrict({
          where: {
            id: taskTicket.farmingCycleId,
          },
          relations: {
            farm: {
              city: true,
              district: true,
            },
            coop: true,
          },
        }),
        this.farmingCycleMemberDDAO.getMany({
          where: {
            farmingCycleId: taskTicket.farmingCycleId,
          },
        }),
      ]);

      const notificationReceiverMap: { [key: string]: boolean } = {};

      notificationReceiverMap[farmingCycle.farm.userOwnerId] = true;

      farmingCycleMembers.forEach((fcm) => {
        notificationReceiverMap[fcm.userId] = true;
      });

      const deadlineTime = addHours(
        new Date(taskTicket.reportedDate),
        farmingCycleAlertInstruction.deadline,
      );

      const deadlineStr = format(deadlineTime, TIME_HH_MM);

      const subHeadline = `${farmingCycleAlertInstruction.instruction} sebelum jam ${deadlineStr}.`;

      await this.pushNotificationQueue.sendNotificationToApp('ppl', {
        appTarget: 'ppl',
        userReceivers: Object.keys(notificationReceiverMap),
        content: {
          id: taskTicket.id,
          headline: farmingCycle.coop.coopName,
          body: subHeadline,
          subHeadline,
          type: 'task',
          target: targetPage.android.ppl.taskDetailPage,
          additionalParameters: {
            type: 'detailTask',
            taskId: taskTicket.id,
            taskDate: format(new Date(taskTicket.reportedDate), DATE_SQL_FORMAT),
            coopId: farmingCycle.coopId,
            farmingCycleId: farmingCycle.id,
            coop: constructAdditionalNotificationCoop(farmingCycle),
          },
        },
        notification: {
          subjectId: 'System',
          notificationType: 'task',
          headline: farmingCycle.coop.coopName,
          subHeadline,
          referenceId: `task-ticket-id: ${taskTicket.id}`,
          icon: '',
          iconPath: '',
          target: targetPage.android.ppl.taskDetailPage,
          additionalParameters: {
            type: 'detailTask',
            taskId: taskTicket.id,
            taskDate: format(new Date(taskTicket.reportedDate), DATE_SQL_FORMAT),
            coopId: farmingCycle.coopId,
            farmingCycleId: farmingCycle.id,
            coop: constructAdditionalNotificationCoop(farmingCycle),
          },
        },
      });
    } catch (error) {
      this.logger.error(error);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, {
          taskTicket,
          farmingCycleAlertInstruction,
          user,
          jobId,
        });
      }

      throw error;
    }
  }
}
