import { randomUUID } from 'crypto';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { EntityNotFoundError, FindOneOptions, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { B2BFarmInfrastructure } from '../../datasources/entity/pgsql/b2b/B2BFarmInfrastructure.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_FARM_NOT_FOUND } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class B2BFarmInfrastructureDAO extends BaseSQLDAO<B2BFarmInfrastructure> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(B2BFarmInfrastructure);
  }

  async getOneStrict(
    params: FindOneOptions<B2BFarmInfrastructure>,
  ): Promise<B2BFarmInfrastructure> {
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
  async createOneWithTx(
    data: Partial<B2BFarmInfrastructure>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<B2BFarmInfrastructure> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const item = queryRunner.manager.create(B2BFarmInfrastructure, {
      ...data,
      id: randomUUID(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const newBuilding = await queryRunner.manager.save(B2BFarmInfrastructure, item);

    return newBuilding;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteOneWithTx(
    params: FindOptionsWhere<B2BFarmInfrastructure>,
    queryRunner: QueryRunner,
  ): Promise<B2BFarmInfrastructure> {
    const toBeDeleted = await queryRunner.manager.findOneOrFail(B2BFarmInfrastructure, {
      where: params,
    });

    await queryRunner.manager.delete(B2BFarmInfrastructure, {
      id: toBeDeleted.id,
    });

    return toBeDeleted;
  }
}
