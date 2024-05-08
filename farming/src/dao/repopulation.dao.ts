import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, EntityNotFoundError, FindOneOptions, QueryRunner } from 'typeorm';
import { ERR_REPOPULATION_NOT_FOUND } from '../libs/constants/errors';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { Repopulation } from '../datasources/entity/pgsql/Repopulation.entity';
import { BaseSQLDAO } from './base.dao';

@Service()
export class RepopulationDAO extends BaseSQLDAO<Repopulation> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(Repopulation);
  }

  async getOneStrict(params: FindOneOptions<Repopulation>): Promise<Repopulation> {
    try {
      const repopulation = await this.repository.findOneOrFail(params);

      return repopulation;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_REPOPULATION_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async createOne(data: DeepPartial<Repopulation>, user: RequestUser): Promise<Repopulation> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const repopulation = this.repository.create({
      ...data,
      id: randomHexString(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    await this.repository.save(repopulation);

    return repopulation;
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: DeepPartial<Repopulation>,
    userRequest: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<Repopulation> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const repopulationData = queryRunner.manager.create(Repopulation, {
      ...data,
      id: randomHexString(),
      createdBy: userRequest.id,
      createdDate: now,
      modifiedBy: userRequest.id,
      modifiedDate: now,
    });

    const result = await queryRunner.manager.save(Repopulation, repopulationData);

    return result;
  }
}
