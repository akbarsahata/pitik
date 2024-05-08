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
import { HarvestDeal } from '../datasources/entity/pgsql/HarvestDeal.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_HARVEST_DEAL_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class HarvestDealDAO extends BaseSQLDAO<HarvestDeal> {
  @Inject(PostgreSQLConnection)
  protected psql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.psql.connection.getRepository(HarvestDeal);
  }

  async getOneStrict(params: FindOneOptions<HarvestDeal>, qr?: QueryRunner): Promise<HarvestDeal> {
    try {
      let query: Promise<HarvestDeal>;

      if (qr) {
        query = qr.manager.findOneOrFail(HarvestDeal, params);
      } else {
        query = this.repository.findOneOrFail(params);
      }

      const harvestDeal = await query;

      return harvestDeal;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_HARVEST_DEAL_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async createOne(data: DeepPartial<HarvestDeal>, user: RequestUser): Promise<HarvestDeal> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const toBeEntity = {
      ...data,
      id: randomUUID(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    };

    const entity = this.repository.create(toBeEntity);

    const createdEntity = await this.repository.save(entity);

    return createdEntity;
  }

  async createOneWithTx(
    data: DeepPartial<HarvestDeal>,
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<HarvestDeal> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const items = queryRunner.manager.create(HarvestDeal, {
      ...data,
      id: randomUUID(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const result = await queryRunner.manager.save(HarvestDeal, items);

    return result;
  }

  async updateOne(
    params: FindOptionsWhere<HarvestDeal>,
    data: DeepPartial<HarvestDeal>,
    user: RequestUser,
  ): Promise<HarvestDeal> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const result = await this.repository.update(params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    if (!result.affected) {
      throw ERR_HARVEST_DEAL_NOT_FOUND();
    }

    const updated = await this.repository.findOneOrFail({
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updated;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<HarvestDeal>,
    data: Partial<HarvestDeal>,
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(HarvestDeal, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const updated = await queryRunner.manager.findOneOrFail(HarvestDeal, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updated;
  }

  async updateMany(
    params: FindOptionsWhere<HarvestDeal>,
    data: DeepPartial<HarvestDeal>,
    user: RequestUser,
  ): Promise<HarvestDeal[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const result = await this.repository.update(params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    if (!result.affected) {
      return [];
    }

    const updated = await this.repository.find({
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updated;
  }
}
