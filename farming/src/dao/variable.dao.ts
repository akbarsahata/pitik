import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  EntityNotFoundError,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
} from 'typeorm';
import { utcToZonedTime } from 'date-fns-tz';
import { BaseSQLDAO } from './base.dao';

import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Variable } from '../datasources/entity/pgsql/Variable.entity';
import { ERR_VARIABLE_NOT_FOUND } from '../libs/constants/errors';
import { DEFAULT_TIME_ZONE } from '../libs/constants';

@Service()
export class VariableDAO extends BaseSQLDAO<Variable> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(Variable);
  }

  async getAll(params?: FindManyOptions<Variable>): Promise<Variable[]> {
    return this.repository.find(params);
  }

  async getOneStrict(params: FindOneOptions<Variable>): Promise<Variable> {
    try {
      const variable = await this.repository.findOneOrFail(params);

      return variable;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_VARIABLE_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getOne(params: FindOneOptions<Variable>): Promise<Variable | null> {
    const target = await this.repository.findOne(params);

    return target;
  }

  // map variable code for optimze access in the next process
  async getMappedByCode(variableCodes: string[]): Promise<Map<string, Variable>> {
    try {
      const [variables] = await this.getMany({
        where: {
          variableCode: In(variableCodes),
        },
        select: {
          id: true,
          variableCode: true,
        },
      });

      const mapCodeToData = new Map<string, Variable>();
      variables.forEach((variable) => {
        mapCodeToData.set(variable.variableCode, variable);
      });

      // if variable codes length & map size not match
      // probably some variable is missing in our database
      // then throw new error to catch block
      if (variableCodes.length !== mapCodeToData.size) {
        throw new Error('variable codes length and map size not match');
      }

      return mapCodeToData;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_VARIABLE_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async updateOne(
    params: FindOptionsWhere<Variable>,
    data: Partial<Variable>,
    user: Partial<Variable>,
  ): Promise<Variable> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const result = await this.repository.update(params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    if (!result.affected) {
      throw ERR_VARIABLE_NOT_FOUND();
    }

    return this.repository.findOneOrFail({
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });
  }
}
