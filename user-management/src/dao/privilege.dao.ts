import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOneOptions, In, QueryRunner, Repository } from 'typeorm';
import { utcToZonedTime } from 'date-fns-tz';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { ERR_RECORD_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { Privilege } from '../datasources/entity/pgsql/Privilege.entity';
import { BaseSQLDAO } from './base.dao';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';

@Service()
export class PrivilegeDAO extends BaseSQLDAO<Privilege> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  protected repository: Repository<Privilege>;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(Privilege);
  }

  async getOneStrict(params: FindOneOptions<Privilege>): Promise<Privilege> {
    try {
      const privilege = await this.repository.findOneOrFail(params);

      return privilege;
    } catch (error) {
      throw ERR_RECORD_NOT_FOUND();
    }
  }

  async upsertOne(
    user: RequestUser,
    item: DeepPartial<Privilege>,
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<Privilege> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItem: DeepPartial<Privilege> = {
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
      .into(Privilege)
      .values(upsertItem)
      .orUpdate(
        ['expiration_date', 'modified_by', 'modified_date'],
        ['ref_user_id', 'ref_api_id'],
        { skipUpdateIfNoValuesChanged: true },
      )
      .execute();

    return this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('id = :id', { id: upsertItem.id })
      .getOneOrFail();
  }

  async upsertMany(user: RequestUser, items: DeepPartial<Privilege>[]): Promise<Privilege[]> {
    const upsertItems = items.map((item) => ({
      ...item,
      id: item.id || randomUUID(),
      expirationDate: item.expirationDate || add(new Date(), { days: 30 }).toISOString(),
      createdBy: user.id || 'system',
      createdDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
      modifiedBy: user.id || 'system',
      modifiedDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
    }));

    await this.repository
      .createQueryBuilder()
      .insert()
      .into(Privilege)
      .values(upsertItems)
      .orUpdate(
        ['expiration_date', 'modified_by', 'modified_date'],
        ['ref_user_id', 'ref_api_id'],
        { skipUpdateIfNoValuesChanged: true },
      )
      .execute();

    const [records] = await this.getMany({
      where: {
        id: In(upsertItems.map((item) => item.id)),
      },
    });

    return records;
  }
}
