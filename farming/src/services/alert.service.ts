import { Inject, Service } from 'fastify-decorators';
import { ILike } from 'typeorm';
import { AlertDAO } from '../dao/alert.dao';
import { AlertTriggeredDAO } from '../dao/alertTriggered.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { FarmingCycleAlertInstructionDDAO } from '../dao/farmingCycleAlertInstructionD.dao';
import { TaskTicketDAO } from '../dao/taskTicket.dao';
import { UserDAO } from '../dao/user.dao';
import { Alert } from '../datasources/entity/pgsql/Alert.entity';
import { TaskTicket } from '../datasources/entity/pgsql/TaskTicket.entity';
import {
  AlertDetail,
  AlertSummaryItem,
  AlertTaskItem,
  AlertToTask,
  AlertToTaskBody,
  GetAlertQuery,
} from '../dto/alert.dto';
import { TaskSourceEnum } from '../dto/task.dto';
import { GenerateAlertQueue } from '../jobs/queues/generate-alert.queue';
import { TaskTicketAlertCreatedQueue } from '../jobs/queues/task-ticket-alert-created.queue';
import { ERR_ALERT_ALREADY_DISMISSED } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';

@Service()
export class AlertService {
  @Inject(AlertDAO)
  private alertDAO!: AlertDAO;

  @Inject(AlertTriggeredDAO)
  private alertTriggeredDAO!: AlertTriggeredDAO;

  @Inject(FarmingCycleAlertInstructionDDAO)
  private farmingCycleAlertInstructionDDAO!: FarmingCycleAlertInstructionDDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO!: FarmingCycleDAO;

  @Inject(TaskTicketDAO)
  private taskTicketDAO!: TaskTicketDAO;

  @Inject(UserDAO)
  private userDAO!: UserDAO;

  @Inject(TaskTicketAlertCreatedQueue)
  private taskTicketAlertCreatedQueue: TaskTicketAlertCreatedQueue;

  @Inject(GenerateAlertQueue)
  private generateAlertQueue!: GenerateAlertQueue;

  async getAlert(filter: GetAlertQuery): Promise<[Alert[], number]> {
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;

    return this.alertDAO.getMany({
      where: {
        alertCode: filter.alertCode,
        alertName: filter.alertName ? ILike(`%${filter.alertName}%`) : undefined,
        eligibleManual: filter.eligibleManual,
        status: filter.status,
      },
      relations: {
        userModifier: true,
      },
      take: (filter.$limit !== 0 && limit) || undefined,
      skip,
      order: {
        createdDate: 'DESC',
      },
    });
  }

  async getSummary(
    farmingCycleId: string,
    page: number,
    limit: number,
  ): Promise<[AlertSummaryItem[], number]> {
    const [alerts, count] = await this.alertTriggeredDAO.getSummary(
      farmingCycleId,
      (page - 1) * limit,
      limit,
    );

    return [
      alerts.map<AlertSummaryItem>((a) => ({
        id: a.id,
        title: a.farmingCycleAlert.alertName,
        timestamp: a.createdDate.toISOString(),
      })),
      count,
    ];
  }

  async getDetail(id: string): Promise<AlertDetail> {
    const alertTriggered = await this.alertTriggeredDAO.getDetail(id);
    const alertInstructions = await this.farmingCycleAlertInstructionDDAO.getMany({
      where: {
        farmingCycleAlertId: alertTriggered.farmingCycleAlert.id,
        status: true,
      },
      order: {
        seqNo: 'ASC',
      },
    });

    return {
      id: alertTriggered.id,
      title: alertTriggered.farmingCycleAlert.alertName,
      description: alertTriggered.farmingCycleAlert.alertDescription,
      timestamp: alertTriggered.createdDate.toISOString(),
      addToTask: alertTriggered.addToTask,
      tasks: alertInstructions.map<AlertTaskItem>((ai) => ({
        id: ai.id,
        instruction: ai.instruction,
      })),
    };
  }

  async createTaskFromAlert(
    farmingCycleId: string,
    alert: AlertToTaskBody,
    user: RequestUser,
  ): Promise<AlertToTask> {
    if (await this.alertTriggeredDAO.isAlertDismissed(alert.id)) {
      throw ERR_ALERT_ALREADY_DISMISSED();
    }

    const farmingCycle = await this.farmingCycleDAO.getOneStrict({
      where: {
        id: farmingCycleId,
      },
      relations: {
        farm: true,
      },
    });

    const userOwner = await this.userDAO.getOneById(farmingCycle.farm.userOwnerId);

    const createTaskTicket = async (
      alertTriggeredId: string,
      farmingCycleAlertInstructionId: string,
    ) => {
      const farmingCycleAlertInstruction = await this.farmingCycleAlertInstructionDDAO.getOne({
        where: {
          id: farmingCycleAlertInstructionId,
        },
      });

      const taskTicket = await this.taskTicketDAO.createTaskTicket(
        {
          farmingCycleId,
          farmingCycleAlertInstructionId,
          alertTriggeredId,
          taskName: farmingCycleAlertInstruction.instruction,
          instruction: farmingCycleAlertInstruction.instruction,
          ticketSource: TaskSourceEnum.ALERT,
          deadline: farmingCycleAlertInstruction.deadline,
        },
        user,
        userOwner,
      );

      await this.taskTicketAlertCreatedQueue.addJob({
        taskTicket,
        farmingCycleAlertInstruction,
        user,
      });

      return taskTicket;
    };

    const taskTickets = await Promise.all<TaskTicket>(
      alert.tasks.map<Promise<TaskTicket>>(async (t) => createTaskTicket(alert.id, t.id)),
    );

    await this.alertTriggeredDAO.updateOne(
      {
        id: alert.id,
      },
      {
        dismissed: true,
        addToTask: true,
      },
      user,
    );

    return { tasks: taskTickets.map((tt) => ({ id: tt.id })) };
  }

  async generateAlertJobs() {
    const alertJobs = await this.farmingCycleDAO.getAlertJobs();

    alertJobs.reduce<any>(async (prev, aj) => {
      await prev;

      await this.generateAlertQueue.addJob(aj);
    }, Promise.resolve());
  }
}
