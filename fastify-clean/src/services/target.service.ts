import { Inject, Service } from 'fastify-decorators';
import { DeepPartial, Like } from 'typeorm';
import { TargetDAO } from '../dao/target.dao';
import { TargetDaysDDAO } from '../dao/targetDaysD.dao';
import { Target } from '../datasources/entity/pgsql/Target.entity';
import { TargetDaysD } from '../datasources/entity/pgsql/TargetDaysD.entity';
import { CreateTargetBody, GetTargetQuery, UpdateTargetBody } from '../dto/target.dto';
import { ERR_TARGET_CODE_EXIST, ERR_TARGET_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';

@Service()
export class TargetService {
  @Inject(TargetDAO)
  private targetDAO: TargetDAO;

  @Inject(TargetDaysDDAO)
  private targetDaysDDAO: TargetDaysDDAO;

  async get(filter: GetTargetQuery): Promise<[Target[], number]> {
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;

    return this.targetDAO.getMany({
      where: {
        targetCode: filter.targetCode,
        targetName: filter.targetName ? Like(`%${filter.targetName}%`) : undefined,
        coopTypeId: filter.coopTypeId,
        chickTypeId: filter.chickTypeId,
        variableId: filter.variableId,
        status: filter.status,
      },
      select: {
        coopType: {
          id: true,
          coopTypeCode: true,
          coopTypeName: true,
        },
        chickType: {
          id: true,
          chickTypeCode: true,
          chickTypeName: true,
        },
        variable: {
          id: true,
          variableCode: true,
          variableName: true,
          variableUOM: true,
          variableType: true,
          variableFormula: true,
        },
      },
      relations: {
        coopType: true,
        chickType: true,
        variable: true,
        userModifier: true,
      },
      take: limit,
      skip,
      order: {
        createdDate: 'DESC',
      },
    });
  }

  async getById(id: string): Promise<Target> {
    const target = await this.targetDAO.getOne({
      where: {
        id,
      },
      select: {
        coopType: {
          id: true,
          coopTypeCode: true,
          coopTypeName: true,
        },
        chickType: {
          id: true,
          chickTypeCode: true,
          chickTypeName: true,
        },
        variable: {
          id: true,
          variableCode: true,
          variableName: true,
          variableUOM: true,
          variableType: true,
          variableFormula: true,
        },
        targetDays: true,
      },
      relations: {
        coopType: true,
        chickType: true,
        variable: true,
        targetDays: {
          target: true,
        },
      },
      order: {
        targetDays: {
          day: 'ASC',
        },
      },
    });

    if (!target) throw ERR_TARGET_NOT_FOUND();

    return target;
  }

  async create(input: CreateTargetBody, user: RequestUser): Promise<Target> {
    const queryRunner = await this.targetDAO.startTransaction();

    try {
      const existingTaskPreset = await this.targetDAO.getOne({
        where: {
          targetCode: input.targetCode,
        },
      });
      if (existingTaskPreset) {
        throw ERR_TARGET_CODE_EXIST();
      }

      const transactionHooks: Function[] = [];
      if (input.targets) {
        input.targets.forEach((target) => {
          transactionHooks.push(
            this.targetDaysDDAO.wrapUpsertHook(
              target.day,
              user.id,
              target.minValue,
              target.maxValue,
            ),
          );
        });
      }

      const taskPreset = await this.targetDAO.createOneWithTx(
        input,
        user,
        queryRunner,
        transactionHooks,
      );

      await this.targetDAO.commitTransaction(queryRunner);

      return this.getById(taskPreset.id);
    } catch (error) {
      await this.targetDAO.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async update(id: string, input: UpdateTargetBody, user: RequestUser): Promise<Target> {
    const queryRunner = await this.targetDAO.startTransaction();

    try {
      await this.targetDaysDDAO.deleteWithTx(
        {
          targetId: id,
        },
        queryRunner,
      );

      await this.targetDaysDDAO.createManyWithTx(
        input.targets.map<DeepPartial<TargetDaysD>>((target) => ({
          id: target.id,
          targetId: id,
          day: target.day,
          minValue: target.minValue,
          maxValue: target.maxValue,
        })),
        user,
        queryRunner,
      );

      await this.targetDAO.updateOneWithTx(
        { id },
        {
          targetCode: input.targetCode,
          targetName: input.targetName,
          targetDaysCount: input.targetDaysCount,
          status: input.status,
          remarks: input.remarks,
          coopTypeId: input.coopTypeId,
          chickTypeId: input.chickTypeId,
          variableId: input.variableId,
        },
        user,
        queryRunner,
      );

      await this.targetDAO.commitTransaction(queryRunner);

      const alertPreset = await this.targetDAO.getOneStrict({
        where: {
          id,
        },
      });

      return alertPreset;
    } catch (error) {
      await this.targetDAO.rollbackTransaction(queryRunner);

      throw error;
    }
  }
}
