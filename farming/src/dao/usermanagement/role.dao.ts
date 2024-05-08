import { randomUUID } from 'crypto';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOneOptions, FindOptionsWhere, QueryRunner, Repository } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { Role } from '../../datasources/entity/pgsql/usermanagement/Role.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_RECORD_NOT_FOUND } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class RoleDAO extends BaseSQLDAO<Role> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  protected repository: Repository<Role>;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(Role);
  }

  async getOneStrict(params: FindOneOptions<Role>): Promise<Role> {
    try {
      const role = await this.repository.findOneOrFail(params);

      return role;
    } catch (error) {
      throw ERR_RECORD_NOT_FOUND();
    }
  }

  async upsertOne(
    user: RequestUser,
    item: DeepPartial<Role>,
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<Role> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItem: DeepPartial<Role> = {
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
      .into(Role)
      .values(upsertItem)
      .orUpdate(['name', 'modified_by', 'modified_date'], ['id'])
      .execute();

    return this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('id = :id', { id: upsertItem.id })
      .getOneOrFail();
  }

  async deleteOne(params: FindOptionsWhere<Role>): Promise<Role> {
    const toBeDeleted = await this.repository.findOneOrFail({ where: params });

    await this.repository.delete({
      id: toBeDeleted.id,
    });

    return toBeDeleted;
  }
}
