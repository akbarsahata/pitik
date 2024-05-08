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
import { B2BOrganizationMember } from '../../datasources/entity/pgsql/b2b/B2BOrganizationMember.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_USER_NOT_FOUND } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class B2BOrganizationMemberDAO extends BaseSQLDAO<B2BOrganizationMember> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(B2BOrganizationMember);
  }

  async getOneStrict(
    params: FindOneOptions<B2BOrganizationMember>,
  ): Promise<B2BOrganizationMember> {
    try {
      return this.repository.findOneOrFail(params);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_USER_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async upsertOneWithTx(
    params: FindOptionsWhere<B2BOrganizationMember>,
    data: DeepPartial<B2BOrganizationMember>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<B2BOrganizationMember> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const orgMember = await this.repository.findOne({
      where: {
        ...params,
      },
    });

    if (!orgMember) {
      const newRecord = queryRunner.manager.create(B2BOrganizationMember, {
        ...data,
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      });

      const newOrgMember = await queryRunner.manager.save(B2BOrganizationMember, newRecord);

      return newOrgMember;
    }

    await queryRunner.manager.update(B2BOrganizationMember, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const updatedOrgMember = await queryRunner.manager.findOneOrFail(B2BOrganizationMember, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updatedOrgMember;
  }
}
