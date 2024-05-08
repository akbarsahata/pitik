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
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { B2BFarm } from '../../datasources/entity/pgsql/b2b/B2BFarm.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_FARM_NOT_FOUND } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class B2BFarmDAO extends BaseSQLDAO<B2BFarm> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(B2BFarm);
  }

  async getOneStrict(params: FindOneOptions<B2BFarm>): Promise<B2BFarm> {
    try {
      return this.repository.findOneOrFail(params);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_FARM_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async upsertOneWithTx(
    params: FindOptionsWhere<B2BFarm>,
    data: DeepPartial<B2BFarm>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<B2BFarm> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const b2bFarm = await this.repository.findOne({
      where: {
        ...params,
      },
    });

    if (!b2bFarm) {
      const newRecord = queryRunner.manager.create(B2BFarm, {
        ...data,
        id: randomUUID(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      });

      const newB2BFarm = await queryRunner.manager.save(B2BFarm, newRecord);

      return newB2BFarm;
    }

    await queryRunner.manager.update(B2BFarm, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const updatedB2BFarm = await queryRunner.manager.findOneOrFail(B2BFarm, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updatedB2BFarm;
  }
}
