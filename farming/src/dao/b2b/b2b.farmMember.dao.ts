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
import { B2BFarmMember } from '../../datasources/entity/pgsql/b2b/B2BFarmMember.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_B2B_FARM_MEMBER_NOT_FOUND } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class B2BFarmMemberDAO extends BaseSQLDAO<B2BFarmMember> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(B2BFarmMember);
  }

  async getOneStrict(params: FindOneOptions<B2BFarmMember>): Promise<B2BFarmMember> {
    try {
      const farmMember = await this.repository.findOneOrFail(params);

      return farmMember;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_B2B_FARM_MEMBER_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async upsertOneWithTx(
    params: FindOptionsWhere<B2BFarmMember>,
    data: DeepPartial<B2BFarmMember>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<B2BFarmMember> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const b2bFarm = await this.repository.findOne({
      where: {
        ...params,
      },
    });

    if (!b2bFarm) {
      const newRecord = queryRunner.manager.create(B2BFarmMember, {
        ...data,
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      });

      const newB2BFarm = await queryRunner.manager.save(B2BFarmMember, newRecord);

      return newB2BFarm;
    }

    await queryRunner.manager.update(B2BFarmMember, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const updatedB2BFarm = await queryRunner.manager.findOneOrFail(B2BFarmMember, {
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
