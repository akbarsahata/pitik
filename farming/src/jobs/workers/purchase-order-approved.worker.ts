import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { DeepPartial, In } from 'typeorm';
import { AlertDAO } from '../../dao/alert.dao';
import { AlertInstructionDAO } from '../../dao/alertInstruction.dao';
import { AlertPresetDAO } from '../../dao/alertPreset.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { FarmingCycleAlertDDAO } from '../../dao/farmingCycleAlertD.dao';
import { FarmingCycleAlertFormDDAO } from '../../dao/farmingCycleAlertFromD.dao';
import { FarmingCycleAlertInstructionCoopTypeDDAO } from '../../dao/farmingCycleAlertInstructionCoopTypeD.dao';
import { FarmingCycleAlertInstructionDDAO } from '../../dao/farmingCycleAlertInstructionD.dao';
import { FarmingCycleAlertTriggerDDAO } from '../../dao/farmingCycleAlertTriggerD.dao';
import { FarmingCycleTaskDDAO } from '../../dao/farmingCycleTaskD.dao';
import { FarmingCycleTaskFormDDAO } from '../../dao/farmingCycleTaskFormD.dao';
import { FarmingCycleTaskTriggerDDAO } from '../../dao/farmingCycleTaskTriggerD.dao';
import { TaskDAO } from '../../dao/task.dao';
import { TaskPresetDAO } from '../../dao/taskPreset.dao';
import { FarmingCycle } from '../../datasources/entity/pgsql/FarmingCycle.entity';
import { FarmingCycleAlertD } from '../../datasources/entity/pgsql/FarmingCycleAlertD.entity';
import { FarmingCycleAlertFormD } from '../../datasources/entity/pgsql/FarmingCycleAlertFormD.entity';
import { FarmingCycleAlertInstructionCoopTypeD } from '../../datasources/entity/pgsql/FarmingCycleAlertInstructionCoopTypeD.entity';
import { FarmingCycleAlertInstructionD } from '../../datasources/entity/pgsql/FarmingCycleAlertInstructionD.entity';
import { FarmingCycleAlertTriggerD } from '../../datasources/entity/pgsql/FarmingCycleAlertTriggerD.entity';
import { FarmingCycleTaskD } from '../../datasources/entity/pgsql/FarmingCycleTaskD.entity';
import { FarmingCycleTaskFormD } from '../../datasources/entity/pgsql/FarmingCycleTaskFormD.entity';
import { FarmingCycleTaskTriggerD } from '../../datasources/entity/pgsql/FarmingCycleTaskTriggerD.entity';
import { PurchaseOrder } from '../../datasources/entity/pgsql/PurchaseOrder.entity';
import { QUEUE_PURCHASE_ORDER_APPROVED } from '../../libs/constants/queue';
import { PurchaseOrderApprovedJobData } from '../../libs/interfaces/job-data';
import { randomHexString } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { BaseWorker } from './base.worker';

@Service()
export class PurchaseOrderApprovedWorker extends BaseWorker<PurchaseOrderApprovedJobData> {
  @Inject(FarmingCycleDAO)
  private fcDAO!: FarmingCycleDAO;

  @Inject(TaskPresetDAO)
  private taskPresetDAO!: TaskPresetDAO;

  @Inject(AlertPresetDAO)
  private alertPresetDAO!: AlertPresetDAO;

  @Inject(TaskDAO)
  private taskDAO!: TaskDAO;

  @Inject(AlertDAO)
  private alertDAO!: AlertDAO;

  @Inject(AlertInstructionDAO)
  private alertInstructionDAO!: AlertInstructionDAO;

  @Inject(FarmingCycleTaskDDAO)
  private farmingCycleTaskDDAO!: FarmingCycleTaskDDAO;

  // @Inject(FarmingCycleGamificationPointDAO)
  // private farmingCycleGamificationPoint!: FarmingCycleGamificationPointDAO;

  // @Inject(FarmingCycleTaskGamificationPointDAO)
  // private farmingCycleTaskGamificationPoint!: FarmingCycleTaskGamificationPointDAO;

  @Inject(FarmingCycleAlertDDAO)
  private farmingCycleAlertDDAO!: FarmingCycleAlertDDAO;

  @Inject(FarmingCycleAlertInstructionDDAO)
  private farmingCycleAlertInstructionDDAO!: FarmingCycleAlertInstructionDDAO;

  @Inject(FarmingCycleAlertInstructionCoopTypeDDAO)
  private farmingCycleAlertInstructionCoopTypeDDAO!: FarmingCycleAlertInstructionCoopTypeDDAO;

  @Inject(FarmingCycleTaskTriggerDDAO)
  private taskTriggerDDAO!: FarmingCycleTaskTriggerDDAO;

  @Inject(FarmingCycleAlertTriggerDDAO)
  private farmingCycleAlertTriggerDDAO!: FarmingCycleAlertTriggerDDAO;

  @Inject(FarmingCycleTaskFormDDAO)
  private taskFormDDAO!: FarmingCycleTaskFormDDAO;

  @Inject(FarmingCycleAlertFormDDAO)
  private farmingCycleAlertFormDDAO!: FarmingCycleAlertFormDDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_PURCHASE_ORDER_APPROVED;

  protected async handle(
    data: PurchaseOrder,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ): Promise<void> {
    if (!data.isDoc) return;

    if (!data.isApproved) return;

    // Check whether current farming cycle has defined tasks:
    const { autoGenerateAlerts, autoGenerateTasks } = await this.taskAlertDispatcher(
      data.farmingCycleId,
    );
    if (!autoGenerateAlerts && !autoGenerateTasks) return;

    const queryRunner = await this.farmingCycleTaskDDAO.startTransaction();

    try {
      const farmingCycle = await this.fcDAO.getOneStrict({
        where: {
          id: data.farmingCycleId,
        },
        select: {
          id: true,
          chickTypeId: true,
          coop: {
            coopTypeId: true,
          },
        },
        relations: {
          coop: true,
        },
      });

      const userCreator = { id: data.approvedBy };

      if (autoGenerateTasks) {
        const {
          farmingCycleTaskDPayloads,
          farmingCycleTaskTriggerDPayloads,
          farmingCycleTaskFormDPayloads,
        } = await this.constructFarmingCycleTaskPayloads(farmingCycle);

        await this.farmingCycleTaskDDAO.createManyWithTx(
          farmingCycleTaskDPayloads,
          userCreator,
          queryRunner,
        );

        await this.taskTriggerDDAO.createManyWithTx(
          farmingCycleTaskTriggerDPayloads,
          userCreator,
          queryRunner,
        );

        await this.taskFormDDAO.createManyWithTx(
          farmingCycleTaskFormDPayloads,
          userCreator,
          queryRunner,
        );
      }

      if (autoGenerateAlerts) {
        const {
          fcAlertDPayloads,
          fcAlertInstructionDPayloads,
          fcAlertTriggerDPayloads,
          fcaFormDPayloads,
          fcaInstructionCoopType,
        } = await this.constructFarmingCycleAlertPayloads(farmingCycle);

        await this.farmingCycleAlertDDAO.createManyWithTx(
          fcAlertDPayloads,
          userCreator,
          queryRunner,
        );

        await this.farmingCycleAlertInstructionDDAO.createManyWithTx(
          fcAlertInstructionDPayloads,
          userCreator,
          queryRunner,
        );

        await this.farmingCycleAlertInstructionCoopTypeDDAO.createManyWithTx(
          fcaInstructionCoopType,
          userCreator,
          queryRunner,
        );

        await this.farmingCycleAlertTriggerDDAO.createManyWithTx(
          fcAlertTriggerDPayloads,
          userCreator,
          queryRunner,
        );

        await this.farmingCycleAlertFormDDAO.createManyWithTx(
          fcaFormDPayloads,
          userCreator,
          queryRunner,
        );
      }
      await this.farmingCycleTaskDDAO.commitTransaction(queryRunner);
    } catch (error) {
      this.logger.error(error);

      await this.farmingCycleTaskDDAO.rollbackTransaction(queryRunner);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, data, jobId);
      }

      throw error;
    }
  }

  private async taskAlertDispatcher(farmingCycleId: string) {
    const [[, countFcAlerts], [, countFcTasks]] = await Promise.all([
      await this.farmingCycleAlertDDAO.getMany({ where: { farmingCycleId } }),
      await this.farmingCycleTaskDDAO.getMany({ where: { farmingCycleId } }),
    ]);

    const dispatchResultDecisions = {
      autoGenerateAlerts: !(countFcAlerts > 0),
      autoGenerateTasks: !(countFcTasks > 0),
    };
    return dispatchResultDecisions;
  }

  private async constructFarmingCycleTaskPayloads(farmingCycle: FarmingCycle) {
    try {
      const taskPreset = await this.taskPresetDAO.getOneStrict({
        where: {
          coopTypeId: farmingCycle.coop?.coopTypeId,
          status: true,
        },
        select: {
          id: true,
          tasks: true,
        },
        relations: {
          tasks: true,
        },
        relationLoadStrategy: 'join',
      });

      const presetTasks = taskPreset.tasks.map((el) => el.taskId);

      const [tasks] = await this.taskDAO.getMany({
        where: {
          id: In(presetTasks),
        },
        relations: {
          triggers: true,
          instructions: true,
        },
      });

      const farmingCycleTaskDPayloads: DeepPartial<FarmingCycleTaskD>[] = [];
      const farmingCycleTaskTriggerDPayloads: DeepPartial<FarmingCycleTaskTriggerD>[] = [];
      const farmingCycleTaskFormDPayloads: DeepPartial<FarmingCycleTaskFormD>[] = [];

      tasks.forEach((task) => {
        const taskFarmingCycleId = randomHexString();

        const itemTaskD = {
          id: taskFarmingCycleId,
          farmingCycleId: farmingCycle.id,
          taskId: task.id,
          taskCode: task.taskCode,
          taskName: task.taskName,
          manualTrigger: task.manualTrigger ? 1 : 0,
          manualDeadline: task.manualDeadline,
          instruction: task.instruction,
          onlyThisCycle: task.harvestOnly,
          executeCount: 0,
          remarks: task.remarks,
          status: task.status,
        };
        farmingCycleTaskDPayloads.push(itemTaskD);

        const itemTriggers =
          task.triggers?.map((trigger) => ({
            id: randomHexString(),
            farmingCycleTaskId: taskFarmingCycleId,
            day: trigger.day,
            triggerTime: trigger.triggerTime,
            deadline: trigger.deadline,
          })) || [];
        farmingCycleTaskTriggerDPayloads.push(...itemTriggers);

        const itemInstructions =
          task.instructions?.map((instruction) => ({
            id: randomHexString(),
            farmingCycleTaskId: taskFarmingCycleId,
            variableId: instruction.variableId,
            feedbrandId: instruction.feedbrandId,
            instructionTitle: instruction.instructionTitle,
            dataRequired: instruction.dataRequired,
            dataInstruction: instruction.dataInstruction,
            dataType: instruction.dataType,
            dataOption: instruction.dataOption,
            dataOperator: instruction.dataOperator,
            photoRequired: instruction.photoRequired,
            photoInstruction: instruction.photoInstruction,
            videoRequired: instruction.videoRequired,
            videoInstruction: instruction.videoInstruction,
            needAdditionalDetail: instruction.needAdditionalDetail,
            additionalDetail: instruction.additionalDetail,
            checkDataCorrectness: instruction.checkDataCorrectness,
          })) || [];
        farmingCycleTaskFormDPayloads.push(...itemInstructions);
      });

      const farmingCycleTasksPayload = {
        farmingCycleTaskDPayloads,
        farmingCycleTaskFormDPayloads,
        farmingCycleTaskTriggerDPayloads,
      };

      return farmingCycleTasksPayload;
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  private async constructFarmingCycleAlertPayloads(farmingCycle: Partial<FarmingCycle>) {
    try {
      const alertPreset = await this.alertPresetDAO.getOneStrict({
        where: {
          coopTypeId: farmingCycle.coop?.coopTypeId,
          status: true,
        },
        select: {
          id: true,
          alerts: true,
        },
        relations: {
          alerts: true,
        },
        relationLoadStrategy: 'join',
      });

      const presetAlerts = alertPreset.alerts.map((el) => el.alertId);

      const [alerts] = await this.alertDAO.getMany({
        where: {
          id: In(presetAlerts),
        },
        relations: {
          instructions: true,
          triggers: true,
        },
      });

      const alertInstructionIds: { [key: string]: string } = {};
      const fcAlertDPayloads: DeepPartial<FarmingCycleAlertD>[] = [];
      const fcAlertInstructionDPayloads: DeepPartial<FarmingCycleAlertInstructionD>[] = [];
      const fcAlertTriggerDPayloads: DeepPartial<FarmingCycleAlertTriggerD>[] = [];

      // Construct Payload to insert (farmingCycleAlertD & farmingCycleAlertInstructionD)
      alerts.forEach((alert) => {
        const farmingCycleAlertDId = randomHexString();

        const itemAlertD: Partial<FarmingCycleAlertD> = {
          id: farmingCycleAlertDId,
          farmingCycleId: farmingCycle.id,
          alertId: alert.id,
          alertName: alert.alertName,
          alertDescription: alert.alertDescription,
          manualTrigger: alert.eligibleManual,
          alertCode: alert.alertCode,
          onlyThisCycle: true,
          executeCount: 0,
          remarks: alert.remarks,
        };
        fcAlertDPayloads.push(itemAlertD);

        // Construct Payload for FarmingCycleItemAlertInstructionD
        const farmingCycleItemAlertInstruction: Partial<FarmingCycleAlertInstructionD>[] = [];
        alert.instructions?.forEach((instruction) => {
          const farmingCycleItemAlertInstructionId = randomHexString();

          farmingCycleItemAlertInstruction.push({
            id: farmingCycleItemAlertInstructionId,
            farmingCycleAlertId: farmingCycleAlertDId,
            instruction: instruction.instruction,
            deadline: instruction.deadline,
            status: instruction.status,
          });

          Object.assign(alertInstructionIds, {
            [`${instruction.id}`]: farmingCycleItemAlertInstructionId,
          });
        });
        fcAlertInstructionDPayloads.push(...farmingCycleItemAlertInstruction);

        // Construct Payload for FarmingCycleAlertTriggerD
        const farmingCycleItemAlertTriggerD: Partial<FarmingCycleAlertTriggerD>[] = [];
        alert.triggers?.forEach((trigger) => {
          const farmingCycleItemAlertTriggerId = randomHexString();

          farmingCycleItemAlertTriggerD.push({
            id: farmingCycleItemAlertTriggerId,
            farmingCycleAlertId: farmingCycleAlertDId,
            variableId: trigger.variableId,
            measurementUnit: trigger.measurementUnit,
            measurementCondition: trigger.measurementCondition,
            measurementValue: trigger.measurementValue,
          });
        });
        fcAlertTriggerDPayloads.push(...farmingCycleItemAlertTriggerD);
      });

      // Fetch for farmingCycleAlertInstructionCoopTypeD & farmingCycleAlertFormD
      const referenceAlertInstructionIds = Object.keys(alertInstructionIds);
      const [alertInstructions] = await this.alertInstructionDAO.getMany({
        where: {
          id: In(referenceAlertInstructionIds),
        },
        relations: {
          instructionCoopType: true,
          forms: true,
        },
      });

      // Construct Payload to insert record
      const fcaFormDPayloads: DeepPartial<FarmingCycleAlertFormD>[] = [];
      const fcaInstructionCoopTypePayloads: DeepPartial<FarmingCycleAlertInstructionCoopTypeD>[] =
        [];
      alertInstructions.forEach((alertInst) => {
        const fcaFormDItem =
          alertInst.forms?.map<DeepPartial<FarmingCycleAlertFormD>>((form) => ({
            id: randomHexString(),
            farmingCycleAlertInstructionId: alertInstructionIds[form.alertInstructionId],
            instructionTitle: form.instructionTitle,
            dataRequired: form.dataRequired,
            dataInstruction: form.dataInstruction,
            dataType: form.dataType,
            dataOption: form.dataOption,
            variableId: form.variableId,
            feedBrandId: form.feedBrandId,
            dataOperator: form.dataOperator,
            photoRequired: form.photoRequired,
            photoInstruction: form.photoInstruction,
            videoInstruction: form.videoInstruction,
            videoRequired: form.videoRequired,
            needAdditionalDetail: form.needAdditionalDetail,
            additionalDetail: form.additionalDetail,
          })) || [];
        fcaFormDPayloads.push(...fcaFormDItem);

        const fcaInstructionCoopTypeDItem: DeepPartial<FarmingCycleAlertInstructionCoopTypeD>[] =
          [];

        alertInst.instructionCoopType?.forEach((form) => {
          fcaInstructionCoopTypeDItem.push({
            id: randomHexString(),
            farmingCycleAlertInstructionId: alertInstructionIds[form.alertInstructionId],
            coopTypeId: form.coopTypeId,
          });
        });
        fcaInstructionCoopTypePayloads.push(...fcaInstructionCoopTypeDItem);
      });

      const farmingCycleAlertPayloads = {
        fcAlertDPayloads,
        fcAlertInstructionDPayloads,
        fcAlertTriggerDPayloads,
        fcaFormDPayloads,
        fcaInstructionCoopType: fcaInstructionCoopTypePayloads,
      };

      return farmingCycleAlertPayloads;
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }
}
