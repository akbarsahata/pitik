import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOneOptions, QueryRunner } from 'typeorm';
import { utcToZonedTime } from 'date-fns-tz';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { BaseSQLDAO } from './base.dao';
import { Room } from '../datasources/entity/pgsql/Room.entity';
import { ERR_ROOM_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { DEFAULT_TIME_ZONE } from '../libs/constants';

@Service()
export class RoomDAO extends BaseSQLDAO<Room> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(Room);
  }

  async getOneStrict(params: FindOneOptions<Room>): Promise<Room> {
    try {
      const chickInReq = await this.repository.findOneOrFail(params);

      return chickInReq;
    } catch (error) {
      throw ERR_ROOM_NOT_FOUND();
    }
  }

  async upsertOne(
    user: RequestUser,
    item: DeepPartial<Room>,
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<Room> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItem: DeepPartial<Room> = {
      ...item,
      id: item.id || randomHexString(),
      roomCode: item.roomCode || randomHexString(4).toUpperCase(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    };

    await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .insert()
      .into(Room)
      .values(upsertItem)
      .orUpdate(
        [
          'population',
          'inlet_width',
          'inlet_length',
          'inlet_position',
          'is_cooling_pad_exist',
          'is_active',
          'building_id',
          'room_type_id',
          'floor_type_id',
          'controller_type_id',
          'coop_id',
          'modified_by',
          'modified_date',
        ],
        ['id'],
      )
      .execute();

    return this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('id = :roomId', {
        roomId: upsertItem.id,
      })
      .getOneOrFail();
  }
}
