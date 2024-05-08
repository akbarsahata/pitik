import { randomUUID } from 'crypto';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOneOptions, FindOptionsWhere, QueryRunner, Repository } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { App } from '../../datasources/entity/pgsql/usermanagement/App.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_RECORD_NOT_FOUND } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class AppDAO extends BaseSQLDAO<App> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  protected repository: Repository<App>;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(App);
  }

  async getOneStrict(params: FindOneOptions<App>): Promise<App> {
    try {
      const app = await this.repository.findOneOrFail(params);

      return app;
    } catch (error) {
      throw ERR_RECORD_NOT_FOUND();
    }
  }

  async upsertOne(
    user: RequestUser,
    item: DeepPartial<App>,
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<App> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItem: DeepPartial<App> = {
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
      .into(App)
      .values(upsertItem)
      .orUpdate(['name', 'url', 'logo', 'key', 'about', 'modified_by', 'modified_date'], ['id'])
      .execute();

    return this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('id = :id', { id: upsertItem.id })
      .getOneOrFail();
  }

  async deleteOne(params: FindOptionsWhere<App>): Promise<App> {
    const toBeDeleted = await this.repository.findOneOrFail({ where: params });

    await this.repository.delete({
      id: toBeDeleted.id,
    });

    return toBeDeleted;
  }
}
