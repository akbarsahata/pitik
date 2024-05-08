import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { stripHtml } from 'string-strip-html';
import { ILike } from 'typeorm';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { TaskDAO } from '../dao/task.dao';
import { TaskTicketDAO } from '../dao/taskTicket.dao';
import { TaskTicketDDAO } from '../dao/taskTicketD.dao';
import { TaskTicketPhotoDDAO } from '../dao/taskTicketPhotoD.dao';
import { TaskTicketVideoDDAO } from '../dao/taskTicketVideoD.dao';
import { Task } from '../datasources/entity/pgsql/Task.entity';
import { TaskTicketD } from '../datasources/entity/pgsql/TaskTicketD.entity';
import { TaskTicketPhotoD } from '../datasources/entity/pgsql/TaskTicketPhotoD.entity';
import { TaskTicketVideoD } from '../datasources/entity/pgsql/TaskTicketVideoD.entity';
import {
  GetStatisticsResponse,
  GetTaskQuery,
  TaskDetail,
  TaskFormItem,
  TaskMedia,
  TaskSummaryItem,
  VerificationStatusEnum,
} from '../dto/task.dto';
import { CalculateDailyMonitoringQueue } from '../jobs/queues/calculate-daily-monitoring.queue';
import { GenerateLateTaskReminderQueue } from '../jobs/queues/generate-late-task-reminder.queue';
import { GenerateTaskTicketQueue } from '../jobs/queues/generate-task-ticket.queue';
import { TaskTicketDetailUpdatedQueue } from '../jobs/queues/task-ticket-detail-updated.queue';
import {
  DATE_SQL_FORMAT,
  DEFAULT_TIME_ZONE,
  FC_CYCLE_STATUS,
  FC_FARMING_STATUS,
} from '../libs/constants';
import { ERR_TASK_ALREADY_DONE } from '../libs/constants/errors';
import { TASK_LAPORAN_AKHIR_HARI } from '../libs/constants/taskCodes';
import { RequestUser } from '../libs/types/index.d';

@Service()
export class TaskService {
  @Inject(TaskDAO)
  private taskDAO!: TaskDAO;

  @Inject(TaskTicketDAO)
  private dao!: TaskTicketDAO;

  @Inject(TaskTicketDDAO)
  private taskTicketDDAO!: TaskTicketDDAO;

  @Inject(TaskTicketPhotoDDAO)
  private taskTicketPhotoDDAO!: TaskTicketPhotoDDAO;

  @Inject(TaskTicketVideoDDAO)
  private taskTicketVideoDDAO!: TaskTicketVideoDDAO;

  @Inject(TaskTicketDetailUpdatedQueue)
  private taskTicketDetailUpdatedQueue!: TaskTicketDetailUpdatedQueue;

  @Inject(FarmingCycleDAO)
  private fcDAO!: FarmingCycleDAO;

  @Inject(CalculateDailyMonitoringQueue)
  private calculateDailyMonitoringQueue: CalculateDailyMonitoringQueue;

  @Inject(GenerateTaskTicketQueue)
  private generateTaskTicketQueue: GenerateTaskTicketQueue;

  @Inject(GenerateLateTaskReminderQueue)
  private generateLateTaskReminderQueue: GenerateLateTaskReminderQueue;

  async getTask(filter: GetTaskQuery): Promise<[Task[], number]> {
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;

    return this.taskDAO.getMany({
      where: {
        taskCode: filter.taskCode,
        taskName: filter.taskName ? ILike(`%${filter.taskName}%`) : undefined,
        harvestOnly: filter.harvestOnly,
        manualTrigger: filter.manualTrigger,
        manualDeadline: filter.manualDeadline,
        status: filter.status,
      },
      take: (filter.$limit !== 0 && limit) || undefined,
      skip,
      order: {
        createdDate: 'DESC',
      },
      relations: {
        userModifier: true,
      },
    });
  }

  async getTaskSummaryCurrent(
    farmingCycleId: string,
    page: number,
    limit: number,
  ): Promise<[TaskSummaryItem[], number]> {
    const skip = (page - 1) * limit;

    const [result, count] = await this.dao.getSummaryCurrent(farmingCycleId, skip, limit);

    return [
      result.map<TaskSummaryItem>((r) => ({
        ...r,
        verificationStatus: VerificationStatusEnum.NO_STATUS,
        potentialPoints: r.potentialPoints || 0,
        earnedPoints: 0,
        ...(r.instruction && {
          instruction: stripHtml(r.instruction).result,
        }),
      })),
      count,
    ];
  }

  async getTaskSummaryLate(
    farmingCycleId: string,
    page: number,
    limit: number,
  ): Promise<[TaskSummaryItem[], number]> {
    const skip = (page - 1) * limit;

    const [result, count] = await this.dao.getSummaryLate(farmingCycleId, skip, limit);

    return [
      result.map<TaskSummaryItem>((r) => ({
        ...r,
        verificationStatus: VerificationStatusEnum.NO_STATUS,
        potentialPoints: r.potentialPoints || 0,
        earnedPoints: 0,
        ...(r.instruction && {
          instruction: stripHtml(r.instruction).result,
        }),
      })),
      count,
    ];
  }

  async getTaskSummaryDone(
    farmingCycleId: string,
    page: number,
    limit: number,
  ): Promise<[TaskSummaryItem[], number]> {
    const skip = (page - 1) * limit;

    const [result, count] = await this.dao.getSummaryDone(farmingCycleId, skip, limit);

    return [
      result.map<TaskSummaryItem>((r) => ({
        ...r,
        verificationStatus: r.verificationStatus,
        potentialPoints: r.potentialPoints || 0,
        earnedPoints: r.earnedPoints || 0,
        ...(r.instruction && {
          instruction: stripHtml(r.instruction).result,
        }),
      })),
      count,
    ];
  }

  async getTaskDetail(taskId: string): Promise<TaskDetail> {
    const taskDetail = await this.dao.getOneDetailById(taskId);

    return taskDetail;
  }

  async updateTaskDetail(
    taskId: string,
    data: Partial<TaskDetail>,
    user: RequestUser,
  ): Promise<TaskDetail> {
    const task = await this.dao.getOneStrict({
      where: {
        id: taskId,
      },
      relations: {
        farmingCycleTask: true,
        farmingCycle: true,
      },
    });

    if (task.ticketStatus === 3) {
      throw ERR_TASK_ALREADY_DONE();
    }

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const updatedTask = await this.dao.updateOne(
      {
        id: taskId,
      },
      {
        ticketStatus: 3,
        executedBy: user.id,
        executedDate: now,
        alreadyExecute: true,
      },
      user,
    );

    await Promise.all<any>(
      data.detail?.map<Promise<TaskTicketPhotoD[]>>((dd) =>
        this.taskTicketPhotoDDAO.createMany(dd.photoValue, dd.id, user),
      ),
    );

    await Promise.all<any>(
      data.detail?.map<Promise<TaskTicketVideoD[]>>((dd) =>
        this.taskTicketVideoDDAO.createMany(dd.videoValue, dd.id, user),
      ),
    );

    const updatedDetails = (await Promise.all<any>(
      data.detail?.map<Promise<TaskTicketD>>((d) =>
        this.taskTicketDDAO.updateOne(
          {
            id: d.id,
          },
          {
            dataValue: d.dataValue,
          },
          user,
        ),
      ),
    )) as TaskTicketD[];

    updatedDetails.forEach(async (updatedTaskDetail) => {
      this.taskTicketDetailUpdatedQueue.addJob({
        taskTicketD: updatedTaskDetail,
        taskTicket: updatedTask,
        user,
      });
    });

    if (task.farmingCycleTask && task.farmingCycleTask.taskCode === TASK_LAPORAN_AKHIR_HARI) {
      await this.calculateDailyMonitoringQueue.addJob({
        taskTicketId: updatedTask.id,
        farmingCycleId: updatedTask.farmingCycleId,
        farmingCycleCode: task.farmingCycle.farmingCycleCode,
        user,
        updateStatusStrategy: 'single',
        date: format(task.reportedDate, DATE_SQL_FORMAT),
      });
    }

    return {
      id: updatedTask.id,
      name: updatedTask.taskName,
      ticketCode: updatedTask.ticketCode,
      isExecuted: !!updatedTask.alreadyExecute,
      instruction: updatedTask.instruction,
      needVerification: false,
      potentialPoints: 0,
      earnedPoints: 0,
      isDailyReport: false,
      farmingCycleId: updatedTask.farmingCycleId,
      detail: updatedDetails.map<TaskFormItem>((ttd) => ({
        id: ttd.id,
        title: ttd.instructionTitle,
        dataRequired: ttd.dataRequired,
        dataValue: ttd.dataValue || '',
        dataType: ttd.dataType || '',
        dataInstruction: ttd.dataInstruction || '',
        dataUOM: ttd.variable?.variableUOM || '',
        additionalDetail: ttd.additionalDetail || '',
        photoRequired: ttd.photoRequired,
        photoInstruction: ttd.photoInstruction || '',
        photoValue: ttd.photos.map<TaskMedia>((p) => ({
          id: p.id,
          url: p.imageUrl,
        })),
        videoRequired: ttd.videoRequired,
        videoInstruction: ttd.videoInstruction || '',
        videoValue: ttd.videos.map<TaskMedia>((v) => ({
          id: v.id,
          url: v.videoUrl,
        })),
        dataOption: [],
        threshold: {},
      })),
    };
  }

  async getStatistics(farmingCycleId: string): Promise<GetStatisticsResponse> {
    const [countLate, countDone] = await Promise.all([
      this.dao.countSummaryLate(farmingCycleId),
      this.dao.countSummaryDone(farmingCycleId),
    ]);

    return {
      code: 200,
      data: {
        late: countLate,
        done: countDone,
      },
    };
  }

  async generateTaskTicketJobs() {
    const taskTicketJobs = await this.fcDAO.getTaskTicketJobs();

    taskTicketJobs.reduce<any>(async (prev, ttj) => {
      await prev;

      await this.generateTaskTicketQueue.addJob(ttj);
    }, Promise.resolve());
  }

  async generateLateTaskReminderJobs() {
    const [activeFarmingCycles] = await this.fcDAO.getMany({
      where: {
        cycleStatus: FC_CYCLE_STATUS.ACTIVE,
        farmingStatus: FC_FARMING_STATUS.IN_PROGRESS,
      },
      relations: {
        coop: true,
        farm: true,
      },
      select: {
        id: true,
      },
    });

    await activeFarmingCycles.reduce(async (prev, fc) => {
      await prev;

      await this.generateLateTaskReminderQueue.addJob({
        farmingCycleId: fc.id,
        farmOwnerId: fc.farm.userOwnerId,
        coopId: fc.coop.id,
        coopName: fc.coop.coopName,
      });
    }, Promise.resolve());
  }
}
