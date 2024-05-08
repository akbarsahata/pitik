import { randomUUID } from 'crypto';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  In,
  QueryRunner,
  Repository,
} from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { RoleAcl } from '../../datasources/entity/pgsql/usermanagement/RoleAcl.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_RECORD_NOT_FOUND } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class RoleAclDAO extends BaseSQLDAO<RoleAcl> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  protected repository: Repository<RoleAcl>;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(RoleAcl);
  }

  async getOneStrict(params: FindOneOptions<RoleAcl>): Promise<RoleAcl> {
    try {
      const roleAcl = await this.repository.findOneOrFail(params);

      return roleAcl;
    } catch (error) {
      throw ERR_RECORD_NOT_FOUND();
    }
  }

  async upsertOne(
    user: RequestUser,
    item: DeepPartial<RoleAcl>,
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<RoleAcl> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItem: DeepPartial<RoleAcl> = {
      ...item,
      id: item.id ? item.id : randomUUID(),
      createdBy: user?.id ? user.id : 'system',
      createdDate: now,
      modifiedBy: user?.id ? user.id : 'system',
      modifiedDate: now,
    };

    await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .insert()
      .into(RoleAcl)
      .values(upsertItem)
      .orUpdate(['modified_by', 'modified_date'], ['ref_role_id', 'ref_api_id'], {
        skipUpdateIfNoValuesChanged: true,
      })
      .execute();

    return this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('id = :id', { id: upsertItem.id })
      .getOneOrFail();
  }

  async upsertMany(user: RequestUser, items: DeepPartial<RoleAcl>[]): Promise<RoleAcl[]> {
    const upsertItems = items.map((item) => ({
      ...item,
      id: item.id || randomUUID(),
      createdBy: user.id || 'system',
      createdDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
      modifiedBy: user.id || 'system',
      modifiedDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
    }));

    await this.repository
      .createQueryBuilder()
      .insert()
      .into(RoleAcl)
      .values(upsertItems)
      .orUpdate(['modified_by', 'modified_date'], ['ref_role_id', 'ref_api_id'], {
        skipUpdateIfNoValuesChanged: true,
      })
      .execute();

    const [records] = await this.getMany({
      where: {
        id: In(upsertItems.map((item) => item.id)),
      },
    });

    return records;
  }

  async deleteOne(params: FindOptionsWhere<RoleAcl>): Promise<RoleAcl> {
    const toBeDeleted = await this.repository.findOneOrFail({ where: params });

    await this.repository.delete({
      id: toBeDeleted.id,
    });

    return toBeDeleted;
  }
}
