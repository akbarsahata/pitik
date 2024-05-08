import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, QueryRunner } from 'typeorm';
import { utcToZonedTime } from 'date-fns-tz';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { BaseSQLDAO } from './base.dao';
import { Fan } from '../datasources/entity/pgsql/Fan.entity';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_FAN_INSERT_FAILED } from '../libs/constants/errors';

@Service()
export class FanDAO extends BaseSQLDAO<Fan> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(Fan);
  }

  async deleteByRoomId(
    roomId: string,
    opts?: {
      qr?: QueryRunner;
    },
  ) {
    await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('room_id = :roomId', { roomId })
      .delete()
      .execute();
  }

  async upsertMany(
    user: RequestUser,
    items: DeepPartial<Fan>[],
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<Fan[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItems = items.map<DeepPartial<Fan>>((item) => ({
      ...item,
      id: item.id || randomHexString(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    }));

    await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .insert()
      .into(Fan)
      .values(upsertItems)
      .orUpdate(['size', 'capacity', 'modified_by', 'modified_date'], ['id'])
      .execute();

    const [results, count] = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('id IN (:...ids)', { ids: upsertItems.map((item) => item.id) })
      .getManyAndCount();

    if (count !== upsertItems.length) {
      throw ERR_FAN_INSERT_FAILED('result count not match');
    }

    return results;
  }
}
