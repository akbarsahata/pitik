import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOneOptions, QueryRunner, Repository } from 'typeorm';
import { utcToZonedTime } from 'date-fns-tz';
import { randomUUID } from 'crypto';
import { ERR_RECORD_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RoleRank } from '../datasources/entity/pgsql/RoleRank.entity';
import { BaseSQLDAO } from './base.dao';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';

@Service()
export class RoleRankDAO extends BaseSQLDAO<RoleRank> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  protected repository: Repository<RoleRank>;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(RoleRank);
  }

  async getOneStrict(params: FindOneOptions<RoleRank>): Promise<RoleRank> {
    try {
      const roleAcl = await this.repository.findOneOrFail(params);

      return roleAcl;
    } catch (error) {
      throw ERR_RECORD_NOT_FOUND();
    }
  }

  async upsertOne(
    user: RequestUser,
    item: DeepPartial<RoleRank>,
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<RoleRank> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItem: DeepPartial<RoleRank> = {
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
      .into(RoleRank)
      .values(upsertItem)
      .orUpdate(['rank', 'context', 'role_id', 'modified_by', 'modified_date'], ['id'])
      .execute();

    return this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('id = :id', { id: upsertItem.id })
      .getOneOrFail();
  }
}
