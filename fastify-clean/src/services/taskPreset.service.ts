import { Inject, Service } from 'fastify-decorators';
import { DeepPartial, Like } from 'typeorm';
import { TaskPresetD } from '../datasources/entity/pgsql/TaskPresetD.entity';
import { TaskPresetDAO } from '../dao/taskPreset.dao';
import { TaskPresetDDAO } from '../dao/taskPresetD.dao';
import { TaskPreset } from '../datasources/entity/pgsql/TaskPreset.entity';
import {
  CreateTaskPresetBody,
  GetTaskPresetQuery,
  UpdateTaskPresetBody,
} from '../dto/taskPreset.dto';
import { ERR_TASK_PRESET_CODE_EXIST, ERR_TASK_PRESET_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';

@Service()
export class TaskPresetService {
  @Inject(TaskPresetDAO)
  private taskPresetDAO: TaskPresetDAO;

  @Inject(TaskPresetDDAO)
  private taskPresetDDAO: TaskPresetDDAO;

  async getMany(filter: GetTaskPresetQuery): Promise<[TaskPreset[], number]> {
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;

    return this.taskPresetDAO.getMany({
      where: {
        taskPresetCode: filter.taskPresetCode,
        taskPresetName: filter.taskPresetName ? Like(`%${filter.taskPresetName}%`) : undefined,
        coopTypeId: filter.coopTypeId,
        status: filter.status,
      },
      select: {
        coopType: {
          id: true,
          coopTypeCode: true,
          coopTypeName: true,
        },
      },
      relations: {
        coopType: true,
        userModifier: true,
      },
      take: limit,
      skip,
      order: {
        createdDate: 'DESC',
      },
    });
  }

  async getById(id: string): Promise<TaskPreset> {
    const taskPreset = await this.taskPresetDAO.getOne({
      where: {
        id,
      },
      select: {
        tasks: {
          id: true,
          task: {
            id: true,
            taskCode: true,
            taskName: true,
            harvestOnly: true,
            manualTrigger: true,
            manualDeadline: true,
            instruction: true,
            status: true,
            remarks: true,
          },
        },
        coopType: {
          id: true,
          coopTypeCode: true,
          coopTypeName: true,
        },
      },
      relations: {
        tasks: {
          task: true,
        },
        coopType: true,
      },
    });

    if (!taskPreset) throw ERR_TASK_PRESET_NOT_FOUND();

    return taskPreset;
  }

  async create(input: CreateTaskPresetBody, user: RequestUser): Promise<TaskPreset> {
    const queryRunner = await this.taskPresetDAO.startTransaction();

    try {
      const existingTaskPreset = await this.taskPresetDAO.getOne({
        where: {
          taskPresetCode: input.taskPresetCode,
        },
      });
      if (existingTaskPreset) {
        throw ERR_TASK_PRESET_CODE_EXIST();
      }

      const transactionHooks: Function[] = [];
      if (input.taskIds) {
        input.taskIds.forEach((taskId) => {
          transactionHooks.push(this.taskPresetDDAO.wrapUpsertHook(taskId, user.id));
        });
      }

      const taskPreset = await this.taskPresetDAO.createOneWithTx(
        input,
        user,
        queryRunner,
        transactionHooks,
      );

      await this.taskPresetDAO.commitTransaction(queryRunner);

      return this.getById(taskPreset.id);
    } catch (error) {
      await this.taskPresetDAO.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async update(id: string, input: UpdateTaskPresetBody, user: RequestUser): Promise<TaskPreset> {
    const queryRunner = await this.taskPresetDAO.startTransaction();

    try {
      await this.taskPresetDDAO.deleteWithTx(
        {
          taskPresetId: id,
        },
        queryRunner,
      );

      await this.taskPresetDDAO.createManyWithTx(
        input.taskIds.map<DeepPartial<TaskPresetD>>((taskId) => ({
          taskPresetId: id,
          taskId,
        })),
        user,
        queryRunner,
      );

      await this.taskPresetDAO.updateOneWithTx(
        { id },
        {
          taskPresetCode: input.taskPresetCode,
          taskPresetName: input.taskPresetName,
          coopTypeId: input.coopTypeId,
          status: input.status,
          remarks: input.remarks,
        },
        user,
        queryRunner,
      );

      await this.taskPresetDAO.commitTransaction(queryRunner);

      const taskPreset = await this.taskPresetDAO.getOneStrict({
        where: {
          id,
        },
      });

      return taskPreset;
    } catch (error) {
      await this.taskPresetDAO.rollbackTransaction(queryRunner);

      throw error;
    }
  }
}
