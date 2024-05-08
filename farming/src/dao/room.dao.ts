import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOneOptions, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Room } from '../datasources/entity/pgsql/Room.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_ROOM_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

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

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<Room>,
    data: Partial<Room>,
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<Room> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const updatedCoop = await queryRunner.manager.findOneOrFail(Room, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    await queryRunner.manager.update(Room, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const promises = transactionHooks?.map((trxHook) => trxHook(updatedCoop, queryRunner));
    await Promise.all(promises || []);

    return {
      ...updatedCoop,
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  async createManyWithTx(
    data: DeepPartial<Room>[],
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<Room[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const items = queryRunner.manager.create(
      Room,
      data.map<DeepPartial<Room>>((input) => ({
        ...input,
        id: randomHexString(),
        roomCode: input.roomCode || randomHexString(4).toUpperCase(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const result = await queryRunner.manager.save(Room, items);

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async upsertManyWithTx(
    params: FindOptionsWhere<Room>,
    data: DeepPartial<Room>[],
    _user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<Room[]> {
    await Promise.all(
      data.map((d) => {
        if (d.id || d.id === '') {
          return queryRunner.manager.update(Room, d.id, d);
        }

        const item = queryRunner.manager.create(Room, {
          ...d,
          id: randomHexString(),
        });

        return queryRunner.manager.save(Room, item);
      }),
    );

    const result = await queryRunner.manager.find(Room, {
      where: {
        buildingId: params.buildingId,
      },
    });

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateManyWithTx(
    params: FindOptionsWhere<Room>,
    data: DeepPartial<Room>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<Room[]> {
    await queryRunner.manager.update(Room, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
    });

    const updatedRoom = await queryRunner.manager.find(Room, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updatedRoom;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteManyWithTx(where: FindOptionsWhere<Room>, queryRunner: QueryRunner): Promise<Room[]> {
    const toBeDeleted = await queryRunner.manager.find(Room, { where });

    await queryRunner.manager.delete(Room, where);

    return toBeDeleted;
  }
}
