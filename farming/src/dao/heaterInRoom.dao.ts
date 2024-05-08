import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, QueryRunner } from 'typeorm';
import { utcToZonedTime } from 'date-fns-tz';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { BaseSQLDAO } from './base.dao';
import { HeaterInRoom } from '../datasources/entity/pgsql/HeaterInRoom.entity';
import { RequestUser } from '../libs/types/index.d';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_HEATER_IN_ROOM_INSERT_FAILED } from '../libs/constants/errors';

@Service()
export class HeaterInRoomDAO extends BaseSQLDAO<HeaterInRoom> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(HeaterInRoom);
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
    items: DeepPartial<HeaterInRoom>[],
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<HeaterInRoom[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItems = items.map<DeepPartial<HeaterInRoom>>((item) => ({
      ...item,
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    }));

    await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .insert()
      .into(HeaterInRoom)
      .values(upsertItems)
      .orUpdate(['quantity', 'modified_by', 'modified_date'], ['room_id', 'heater_type_id'])
      .execute();

    const [results, count] = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('room_id IN (:...roomIds)', { roomIds: upsertItems.map((item) => item.roomId) })
      .getManyAndCount();

    if (count !== upsertItems.length) {
      throw ERR_HEATER_IN_ROOM_INSERT_FAILED('result count not match');
    }

    return results;
  }
}
