import { Inject, Service } from 'fastify-decorators';
import { FindOptionsWhere, ILike, Not } from 'typeorm';
import { ChickTypeDAO } from '../../dao/chickType.dao';
import { TargetDAO } from '../../dao/target.dao';
import { ChickType } from '../../datasources/entity/pgsql/ChickType.entity';
import {
  CreateChickTypeBody,
  GetChickTypesQuery,
  UpdateChickTypeByIdBody,
} from '../../dto/chickType.dto';
import { ERR_CHICK_TYPE_CODE_EXIST, ERR_CHICK_TYPE_IN_USE } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';

@Service()
export class ChickTypeService {
  @Inject(ChickTypeDAO)
  private chickTypeDAO: ChickTypeDAO;

  @Inject(TargetDAO)
  private targetDAO: TargetDAO;

  async create(input: CreateChickTypeBody, user: RequestUser): Promise<ChickType> {
    const [existingCode] = await Promise.all([
      this.chickTypeDAO.getOne({
        where: {
          chickTypeCode: input.chickTypeCode,
        },
      }),
    ]);

    if (existingCode) {
      throw ERR_CHICK_TYPE_CODE_EXIST();
    }

    return this.chickTypeDAO.createOne(input, user);
  }

  async get(filter: GetChickTypesQuery): Promise<[ChickType[], number]> {
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;
    return this.chickTypeDAO.getManyAndCount({
      where: {
        chickTypeCode: filter.chickTypeCode || undefined,
        chickTypeName: filter.chickTypeName ? ILike(`%${filter.chickTypeName}%`) : undefined,
        status: filter.status,
        category: filter.category,
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

  async getById(id: string): Promise<ChickType> {
    return this.chickTypeDAO.getOneById(id);
  }

  async update(id: string, input: UpdateChickTypeByIdBody, user: RequestUser): Promise<ChickType> {
    const conflictConditions: FindOptionsWhere<ChickType>[] = [];
    if (input.chickTypeCode) {
      conflictConditions.push({
        id: Not(id),
        chickTypeCode: input.chickTypeCode,
      });
    }

    const [conflictIdentifier, chickType, activeTarget] = await Promise.all([
      this.chickTypeDAO.getOne({
        where: conflictConditions,
      }),
      this.chickTypeDAO.getOneById(id),
      this.targetDAO.getOne({
        where: {
          status: true,
          chickTypeId: id,
        },
        order: {
          modifiedDate: 'DESC',
        },
      }),
    ]);

    if (conflictIdentifier) {
      throw ERR_CHICK_TYPE_CODE_EXIST();
    }

    if (chickType.status && input.status === false && activeTarget) {
      throw ERR_CHICK_TYPE_IN_USE(`TARGET CODE: ${activeTarget.targetCode}`);
    }

    return this.chickTypeDAO.updateOne(
      {
        id,
      },
      {
        ...input,
        createdDate: undefined,
        modifiedDate: undefined,
      },
      user,
    );
  }
}
