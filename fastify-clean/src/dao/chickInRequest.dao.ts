import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { FindOneOptions, DeepPartial, QueryRunner, FindOptionsWhere } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { ChickInRequest } from '../datasources/entity/pgsql/ChickInRequest.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_CHICK_IN_REQ_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class ChickInRequestDAO extends BaseSQLDAO<ChickInRequest> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ChickInRequest);
  }

  async getOneStrict(params: FindOneOptions<ChickInRequest>): Promise<ChickInRequest> {
    try {
      const chickInReq = await this.repository.findOneOrFail(params);

      return chickInReq;
    } catch (error) {
      throw ERR_CHICK_IN_REQ_NOT_FOUND();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: Partial<ChickInRequest>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<ChickInRequest> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const chickInReq = queryRunner.manager.create(ChickInRequest, {
      ...data,
      id: randomHexString(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const newChickInReq = await queryRunner.manager.save(ChickInRequest, chickInReq);

    return newChickInReq;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<ChickInRequest>,
    data: DeepPartial<ChickInRequest>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<ChickInRequest> {
    await queryRunner.manager.update(ChickInRequest, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
    });

    const updated = await queryRunner.manager.findOneOrFail(ChickInRequest, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updated;
  }

  async updateOne(
    params: FindOptionsWhere<ChickInRequest>,
    data: DeepPartial<ChickInRequest>,
    user: RequestUser,
  ): Promise<ChickInRequest> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const result = await this.repository.update(params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    if (!result.affected) {
      throw ERR_CHICK_IN_REQ_NOT_FOUND();
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
}
