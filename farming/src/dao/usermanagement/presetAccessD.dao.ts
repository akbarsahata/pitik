import { randomUUID } from 'crypto';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOneOptions, QueryRunner, Repository } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { PresetAccessD } from '../../datasources/entity/pgsql/usermanagement/PresetAccessD.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_RECORD_NOT_FOUND } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class PresetAccessDDAO extends BaseSQLDAO<PresetAccessD> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  protected repository: Repository<PresetAccessD>;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(PresetAccessD);
  }

  async getOneStrict(params: FindOneOptions<PresetAccessD>): Promise<PresetAccessD> {
    try {
      const presetAccess = await this.repository.findOneOrFail(params);

      return presetAccess;
    } catch (error) {
      throw ERR_RECORD_NOT_FOUND();
    }
  }

  async upsertOne(
    user: RequestUser,
    item: DeepPartial<PresetAccessD>,
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<PresetAccessD> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItem: DeepPartial<PresetAccessD> = {
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
      .into(PresetAccessD)
      .values(upsertItem)
      .orUpdate(['preset_name', 'preset_type', 'modified_by', 'modified_date'], ['id'])
      .execute();

    return this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('id = :id', { id: upsertItem.id })
      .getOneOrFail();
  }
}
