import { Inject, Service } from 'fastify-decorators';
import { FindOptionsWhere, ILike, Not } from 'typeorm';
import { AlertPresetDAO } from '../dao/alertPreset.dao';
import { CoopDAO } from '../dao/coop.dao';
import { CoopTypeDAO } from '../dao/coopType.dao';
import { TargetDAO } from '../dao/target.dao';
import { TaskPresetDAO } from '../dao/taskPreset.dao';
import { CoopType } from '../datasources/entity/pgsql/CoopType.entity';
import { CreateCoopTypeBody, GetCoopTypesQuery, UpdateCoopTypeBody } from '../dto/coopType.dto';
import { ERR_COOP_TYPE_CODE_EXIST, ERR_COOP_TYPE_IN_USE } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';

@Service()
export class CoopTypeService {
  @Inject(CoopTypeDAO)
  private coopTypeDAO: CoopTypeDAO;

  @Inject(CoopDAO)
  private coopDAO: CoopDAO;

  @Inject(TargetDAO)
  private targetDAO: TargetDAO;

  @Inject(TaskPresetDAO)
  private taskPresetDAO: TaskPresetDAO;

  @Inject(AlertPresetDAO)
  private alertPresetDAO: AlertPresetDAO;

  async get(filter: GetCoopTypesQuery): Promise<[CoopType[], number]> {
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;
    return this.coopTypeDAO.getAll({
      where: {
        coopTypeName: filter.coopTypeName ? ILike(`%${filter.coopTypeName}%`) : undefined,
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

  async getById(id: string): Promise<CoopType> {
    return this.coopTypeDAO.getOneById(id);
  }

  async create(input: CreateCoopTypeBody, user: RequestUser): Promise<CoopType> {
    const existingCoopType = await this.coopTypeDAO.getOne({
      where: {
        coopTypeCode: input.coopTypeCode,
      },
    });
    if (existingCoopType) {
      throw ERR_COOP_TYPE_CODE_EXIST();
    }

    return this.coopTypeDAO.createOne(
      {
        ...input,
        createdBy: undefined,
        createdDate: undefined,
        modifiedBy: undefined,
        modifiedDate: undefined,
      },
      user,
    );
  }

  async update(id: string, input: UpdateCoopTypeBody, user: RequestUser): Promise<CoopType> {
    const conflictConditions: FindOptionsWhere<CoopType>[] = [];
    if (input.coopTypeCode) {
      conflictConditions.push({
        id: Not(id),
        coopTypeCode: input.coopTypeCode,
      });
    }

    const [
      conflictIdentifier,
      coopType,
      coopActive,
      targetActive,
      taskPresetActive,
      alertPresetActive,
    ] = await Promise.all([
      (conflictConditions.length &&
        this.coopTypeDAO.getOne({
          where: conflictConditions,
        })) ||
        null,
      this.coopTypeDAO.getOneById(id),
      this.coopDAO.getOne({
        where: {
          status: true,
          coopTypeId: id,
        },
        order: {
          modifiedDate: 'DESC',
        },
      }),
      this.targetDAO.getOne({
        where: {
          status: true,
          coopTypeId: id,
        },
        order: {
          modifiedDate: 'DESC',
        },
      }),
      this.taskPresetDAO.getOne({
        where: {
          status: true,
          coopTypeId: id,
        },
        order: {
          modifiedDate: 'DESC',
        },
      }),
      this.alertPresetDAO.getOne({
        where: {
          status: true,
          coopTypeId: id,
        },
        order: {
          modifiedDate: 'DESC',
        },
      }),
    ]);

    if (conflictIdentifier) {
      throw ERR_COOP_TYPE_CODE_EXIST();
    }

    if (coopType.status && input.status === false) {
      if (coopActive) {
        throw ERR_COOP_TYPE_IN_USE(`ACTIVE COOP: ${coopActive.coopCode}`);
      } else if (targetActive) {
        throw ERR_COOP_TYPE_IN_USE(`ACTIVE TARGET: ${targetActive.targetCode}`);
      } else if (taskPresetActive) {
        throw ERR_COOP_TYPE_IN_USE(`ACTIVE TASK PRESET: ${taskPresetActive.taskPresetCode}`);
      } else if (alertPresetActive) {
        throw ERR_COOP_TYPE_IN_USE(`ACTIVE ALERT PRESET: ${alertPresetActive.alertPresetCode}`);
      }
    }

    return this.coopTypeDAO.updateOne(
      { id },
      {
        ...input,
        createdBy: undefined,
        createdDate: undefined,
        modifiedBy: undefined,
        modifiedDate: undefined,
      },
      user,
    );
  }
}
