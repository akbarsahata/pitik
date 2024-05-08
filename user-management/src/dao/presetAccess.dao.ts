import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOneOptions, QueryRunner, Repository } from 'typeorm';
import { utcToZonedTime } from 'date-fns-tz';
import { randomUUID } from 'crypto';
import { ERR_RECORD_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { PresetAccess } from '../datasources/entity/pgsql/PresetAccess.entity';
import { BaseSQLDAO } from './base.dao';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';

@Service()
export class PresetAccessDAO extends BaseSQLDAO<PresetAccess> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  protected repository: Repository<PresetAccess>;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(PresetAccess);
  }

  async getOneStrict(params: FindOneOptions<PresetAccess>): Promise<PresetAccess> {
    try {
      const presetAccess = await this.repository.findOneOrFail(params);

      return presetAccess;
    } catch (error) {
      throw ERR_RECORD_NOT_FOUND();
    }
  }

  async upsertOne(
    user: RequestUser,
    item: DeepPartial<PresetAccess>,
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<PresetAccess> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItem: DeepPartial<PresetAccess> = {
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
      .into(PresetAccess)
      .values(upsertItem)
      .orUpdate(['preset_name', 'preset_type', 'modified_by', 'modified_date'], ['id'])
      .execute();

    return this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('id = :id', { id: upsertItem.id })
      .getOneOrFail();
  }
}
