import { Inject, Service } from 'fastify-decorators';
import { DeepPartial, ILike } from 'typeorm';
import { TaskFormDDAO } from '../dao/taskFormD.dao';
import { TaskLibraryDAO } from '../dao/taskLibrary.dao';
import { TaskTriggerDDAO } from '../dao/taskTriggerD.dao';
import { Task } from '../datasources/entity/pgsql/Task.entity';
import { TaskFormD } from '../datasources/entity/pgsql/TaskFormD.entity';
import { TaskTriggerD } from '../datasources/entity/pgsql/TaskTriggerD.entity';
import {
  CreateTaskLibraryBody,
  GetTaskLibraryQuery,
  UpdateTaskLibraryBody,
} from '../dto/taskLibrary.dto';
import { ERR_TASK_LIBRARY_CODE_EXIST } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';

@Service()
export class TaskLibraryService {
  @Inject(TaskLibraryDAO)
  private taskLibraryDAO: TaskLibraryDAO;

  @Inject(TaskTriggerDDAO)
  private taskTriggerDDAO: TaskTriggerDDAO;

  @Inject(TaskFormDDAO)
  private taskFormDDAO: TaskFormDDAO;

  async getMany(filter: GetTaskLibraryQuery): Promise<[Task[], number]> {
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;

    const results = await this.taskLibraryDAO.getMany({
      where: {
        taskCode: filter.taskCode,
        taskName: filter.taskName ? ILike(`%${filter.taskName}%`) : undefined,
        harvestOnly: filter.harvestOnly,
        manualTrigger: filter.manualTrigger,
        manualDeadline: filter.manualDeadline,
        status: filter.status,
      },
      relations: {
        triggers: true,
        instructions: {
          feedbrand: true,
          variable: true,
        },
        userModifier: true,
      },
      take: limit,
      skip,
      order: {
        createdDate: 'DESC',
      },
    });
    return results;
  }

  async getById(id: string): Promise<Task> {
    const taskPreset = await this.taskLibraryDAO.getOneStrict({
      where: {
        id,
      },
      relations: {
        triggers: true,
        instructions: {
          feedbrand: true,
          variable: true,
        },
      },
      order: {
        createdDate: 'DESC',
        triggers: {
          day: 'ASC',
        },
      },
    });

    return taskPreset;
  }

  async create(input: CreateTaskLibraryBody, user: RequestUser): Promise<Task> {
    const queryRunner = await this.taskLibraryDAO.startTransaction();

    try {
      const existingTasklibrary = await this.taskLibraryDAO.getOne({
        where: {
          taskCode: input.taskCode,
        },
      });
      if (existingTasklibrary) {
        throw ERR_TASK_LIBRARY_CODE_EXIST();
      }

      const transactionHooks: Function[] = [];
      if (input.triggers) {
        input.triggers.forEach((trigger) => {
          transactionHooks.push(
            this.taskTriggerDDAO.wrapUpsertHook(trigger as TaskTriggerD, user.id),
          );
        });
      }

      if (input.instructions) {
        input.instructions.forEach((instruction) => {
          transactionHooks.push(
            this.taskFormDDAO.wrapUpsertHook(instruction as TaskFormD, user.id),
          );
        });
      }

      const taskLibrary = await this.taskLibraryDAO.createOneWithTx(
        {
          taskCode: input.taskCode,
          taskName: input.taskName,
          harvestOnly: input.harvestOnly,
          manualTrigger: input.manualTrigger,
          manualDeadline: input.manualDeadline,
          instruction: input.instruction,
          status: input.status,
          remarks: input.remarks,
        },
        user,
        queryRunner,
        transactionHooks,
      );

      await this.taskLibraryDAO.commitTransaction(queryRunner);

      return this.getById(taskLibrary.id);
    } catch (error) {
      await this.taskLibraryDAO.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async update(id: string, input: UpdateTaskLibraryBody, user: RequestUser): Promise<Task> {
    const queryRunner = await this.taskLibraryDAO.startTransaction();

    try {
      const currentTasklibrary = await this.taskLibraryDAO.getOne({
        where: {
          id,
          taskCode: input.taskCode,
        },
      });

      if (!currentTasklibrary) {
        const existingTasklibrary = await this.taskLibraryDAO.getOne({
          where: {
            taskCode: input.taskCode,
          },
        });

        if (existingTasklibrary) {
          throw ERR_TASK_LIBRARY_CODE_EXIST();
        }
      }

      await this.taskTriggerDDAO.deleteWithTx(
        {
          taskId: id,
        },
        queryRunner,
      );

      await this.taskFormDDAO.deleteWithTx(
        {
          taskId: id,
        },
        queryRunner,
      );

      await this.taskTriggerDDAO.createManyWithTx(
        input.triggers.map<DeepPartial<TaskTriggerD>>((trigger) => ({
          taskId: id,
          ...trigger,
        })),
        user,
        queryRunner,
      );

      await this.taskFormDDAO.createManyWithTx(
        input.instructions.map<DeepPartial<TaskFormD>>((instruction) => ({
          taskId: id,
          ...instruction,
          variableId: instruction.variableId ? instruction.variableId : undefined,
          feedbrandId: instruction.feedbrandId ? instruction.feedbrandId : undefined,
        })),
        user,
        queryRunner,
      );

      await this.taskLibraryDAO.updateOneWithTx(
        { id },
        {
          taskCode: input.taskCode,
          taskName: input.taskName,
          harvestOnly: input.harvestOnly,
          manualTrigger: input.manualTrigger,
          manualDeadline: input.manualDeadline,
          instruction: input.instruction,
          status: input.status,
          remarks: input.remarks,
        },
        user,
        queryRunner,
      );

      await this.taskLibraryDAO.commitTransaction(queryRunner);

      const taskLibrary = await this.taskLibraryDAO.getOneStrict({
        where: {
          id,
        },
      });

      return taskLibrary;
    } catch (error) {
      await this.taskLibraryDAO.rollbackTransaction(queryRunner);

      throw error;
    }
  }
}
