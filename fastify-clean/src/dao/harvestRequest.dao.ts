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
import { HarvestRequest } from '../datasources/entity/pgsql/HarvestRequest.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_HARVEST_REQUEST_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class HarvestRequestDAO extends BaseSQLDAO<HarvestRequest> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(HarvestRequest);
  }

  async createOneWithTx(
    data: DeepPartial<HarvestRequest>,
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<HarvestRequest> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const items = queryRunner.manager.create(HarvestRequest, {
      ...data,
      id: randomUUID(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const result = await queryRunner.manager.save(HarvestRequest, items);

    return result;
  }

  async createManyWithTx(
    data: DeepPartial<HarvestRequest>[],
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<HarvestRequest[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const items = queryRunner.manager.create(
      HarvestRequest,
      data.map<DeepPartial<HarvestRequest>>((input) => ({
        ...input,
        id: randomUUID(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const result = await queryRunner.manager.save(HarvestRequest, items);

    return result;
  }

  async updateOneWithTx(
    params: FindOptionsWhere<HarvestRequest>,
    data: Partial<HarvestRequest>,
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(HarvestRequest, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const updatedHarvestRequest = await queryRunner.manager.findOneOrFail(HarvestRequest, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updatedHarvestRequest;
  }

  async getOneStrict(
    params: FindOneOptions<HarvestRequest>,
    qr?: QueryRunner,
  ): Promise<HarvestRequest> {
    try {
      let query: Promise<HarvestRequest>;

      if (qr) {
        query = qr.manager.findOneOrFail(HarvestRequest, params);
      } else {
        query = this.repository.findOneOrFail(params);
      }
      const harvestDeal = await query;

      return harvestDeal;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_HARVEST_REQUEST_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async deleteMany(where: FindOptionsWhere<HarvestRequest>): Promise<HarvestRequest[]> {
    const toBeDeleted = await this.repository.find({ where });

    await this.repository.delete(where);

    return toBeDeleted;
  }

  async getById(id: string, qr?: QueryRunner) {
    try {
      const request = await this.repository
        .createQueryBuilder(undefined, qr)
        .where('id = :id', { id })
        .getOneOrFail();

      return request;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_HARVEST_REQUEST_NOT_FOUND(error.message);
      }

      throw error;
    }
  }
}
