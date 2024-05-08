import { Inject, Service } from 'fastify-decorators';
import { ILike } from 'typeorm';
import { TargetDAO } from '../dao/target.dao';
import { VariableDAO } from '../dao/variable.dao';
import { Variable } from '../datasources/entity/pgsql/Variable.entity';
import { CreateVariableBody, GetVariableQuery, UpdateVariableBody } from '../dto/variable.dto';
import { ERR_VARIABLE_CODE_EXIST, ERR_VARIABLE_IN_USE } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';

@Service()
export class VariableService {
  @Inject(VariableDAO)
  private variableDAO: VariableDAO;

  @Inject(TargetDAO)
  private targetDAO: TargetDAO;

  async getMany(filter: GetVariableQuery): Promise<[Variable[], number]> {
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;

    return this.variableDAO.getMany({
      where: {
        variableCode: filter.variableCode,
        variableName: filter.variableName ? ILike(`%${filter.variableName}%`) : undefined,
        variableUOM: filter.variableUOM,
        variableType: filter.variableType,
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

  async getById(id: string): Promise<Variable> {
    const target = await this.variableDAO.getOneStrict({
      where: {
        id,
      },
      order: {
        createdDate: 'DESC',
      },
    });

    return target;
  }

  async create(input: CreateVariableBody, user: RequestUser): Promise<Variable> {
    const existingVariable = await this.variableDAO.getOne({
      where: {
        variableCode: input.variableCode,
      },
    });
    if (existingVariable) {
      throw ERR_VARIABLE_CODE_EXIST();
    }

    return this.variableDAO.createOne(input, user);
  }

  async update(id: string, input: UpdateVariableBody, user: RequestUser): Promise<Variable> {
    const [currentVariable, activeTarget] = await Promise.all([
      this.variableDAO.getOne({
        where: {
          id,
          variableCode: input.variableCode,
        },
      }),
      this.targetDAO.getOne({
        where: {
          status: true,
          variableId: id,
        },
        order: {
          modifiedDate: 'DESC',
        },
      }),
    ]);

    if (!currentVariable) {
      const existingTasklibrary = await this.variableDAO.getOne({
        where: {
          variableCode: input.variableCode,
        },
      });

      if (existingTasklibrary) {
        throw ERR_VARIABLE_CODE_EXIST();
      }
    }

    if (currentVariable?.status && input.status === false && activeTarget) {
      throw ERR_VARIABLE_IN_USE(`TARGET CODE: ${activeTarget.targetCode}`);
    }

    return this.variableDAO.updateOne(
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
