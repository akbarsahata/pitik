/* eslint-disable class-methods-use-this */
import { randomUUID } from 'crypto';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  DeepPartial,
  EntityNotFoundError,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
} from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { HarvestRealization } from '../datasources/entity/pgsql/HarvestRealization.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_HARVEST_REALIZATION_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class HarvestRealizationDAO extends BaseSQLDAO<HarvestRealization> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(HarvestRealization);
  }

  async createOneWithTx(
    data: DeepPartial<HarvestRealization>,
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<HarvestRealization> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const items = queryRunner.manager.create(HarvestRealization, {
      ...data,
      id: randomUUID(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const result = await queryRunner.manager.save(HarvestRealization, items);

    return result;
  }

  async updateOneWithTx(
    params: FindOptionsWhere<HarvestRealization>,
    data: Partial<HarvestRealization>,
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(HarvestRealization, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const updatedHarvestRealization = await queryRunner.manager.findOneOrFail(HarvestRealization, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updatedHarvestRealization;
  }

  async getOneStrict(params: FindOneOptions<HarvestRealization>): Promise<HarvestRealization> {
    try {
      const harvestRealization = await this.repository.findOneOrFail(params);

      return harvestRealization;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_HARVEST_REALIZATION_NOT_FOUND(error.message);
      }

      throw error;
    }
  }
}
