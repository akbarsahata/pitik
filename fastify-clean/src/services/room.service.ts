import { Inject, Service } from 'fastify-decorators';
import { DeepPartial, ILike } from 'typeorm';
import { CreateRoomBody, GetRoomsQuery, UpdateRoomBody } from '../dto/room.dto';
import { generateOrderQuery } from '../libs/utils/helpers';
import { RoomDAO } from '../dao/room.dao';
import { Room } from '../datasources/entity/pgsql/Room.entity';
import { RequestUser } from '../libs/types/index.d';
import { FanDAO } from '../dao/fan.dao';
import { HeaterInRoomDAO } from '../dao/heaterInRoom.dao';
import { Fan } from '../datasources/entity/pgsql/Fan.entity';
import { HeaterInRoom } from '../datasources/entity/pgsql/HeaterInRoom.entity';
import { ERR_ROOM_TYPE_ALREADY_USED } from '../libs/constants/errors';

@Service()
export class RoomService {
  @Inject(RoomDAO)
  private dao: RoomDAO;

  @Inject(FanDAO)
  private fanDAO: FanDAO;

  @Inject(HeaterInRoomDAO)
  private heaterInRoomDAO: HeaterInRoomDAO;

  async get(filter: GetRoomsQuery): Promise<[Room[], number]> {
    const limit = (filter.$limit && filter.$limit > 0 && filter.$limit) || undefined;
    const skip =
      limit && filter.$page !== undefined && filter.$page > 0 ? (filter.$page - 1) * limit : 0;

    return this.dao.getMany({
      where: {
        isActive: filter.isActive,
        buildingId: filter.buildingId || undefined,
        building:
          ((filter.farmId ||
            filter.buildingId ||
            filter.buildingTypeId ||
            filter.buildingName ||
            filter.ownerId) && {
            id: filter.buildingId,
            buildingTypeId: filter.buildingTypeId,
            name: filter.buildingName && ILike(`%${filter.buildingName}%`),
            farm:
              ((filter.farmId || filter.ownerId) && {
                id: filter.farmId,
                owner:
                  (filter.ownerId && {
                    id: filter.ownerId,
                  }) ||
                  undefined,
              }) ||
              undefined,
          }) ||
          undefined,
        coopId: filter.coopId,
        floorTypeId: filter.floorTypeId,
        roomTypeId: filter.roomTypeId,
      },
      relations: {
        building: {
          farm: {
            owner: true,
          },
          buildingType: true,
        },
        roomType: true,
        floorType: true,
        controllerType: true,
        coop: true,
        heaterInRooms: {
          heaterType: true,
        },
        fans: true,
      },
      skip,
      order: (filter.$order && generateOrderQuery(filter.$order)) || undefined,
      take: limit,
    });
  }

  async getById(roomId: string): Promise<Room> {
    return this.dao.getOneStrict({
      where: {
        id: roomId,
      },
      relations: {
        building: {
          farm: {
            owner: true,
          },
          buildingType: true,
        },
        roomType: true,
        floorType: true,
        controllerType: true,
        coop: true,
        heaterInRooms: {
          heaterType: true,
        },
        fans: true,
      },
    });
  }

  async create(user: RequestUser, input: CreateRoomBody): Promise<Room> {
    const qr = await this.dao.startTransaction();
    try {
      const existing = await this.dao.getOne({
        where: {
          buildingId: input.buildingId,
          roomTypeId: input.roomTypeId,
        },
      });

      if (existing) {
        throw ERR_ROOM_TYPE_ALREADY_USED();
      }

      const room = await this.dao.upsertOne(user, input, {
        qr,
      });

      await Promise.all([
        input.fans.length &&
          this.fanDAO.upsertMany(
            user,
            input.fans.map<DeepPartial<Fan>>((fan) => ({
              ...fan,
              roomId: room.id,
            })),
            {
              qr,
            },
          ),
        input.heaterInRooms.length &&
          this.heaterInRoomDAO.upsertMany(
            user,
            input.heaterInRooms.map<DeepPartial<HeaterInRoom>>((heater) => ({
              ...heater,
              roomId: room.id,
            })),
            {
              qr,
            },
          ),
      ]);

      await this.dao.commitTransaction(qr);

      return this.getById(room.id);
    } catch (error) {
      this.dao.rollbackTransaction(qr);

      throw error;
    }
  }

  async update(user: RequestUser, input: UpdateRoomBody, id: string): Promise<Room> {
    const qr = await this.dao.startTransaction();
    try {
      const currentRoom = await this.dao.getOne({
        where: {
          buildingId: input.buildingId,
          roomTypeId: input.roomTypeId,
        },
      });

      if (currentRoom && currentRoom?.id !== id) {
        throw ERR_ROOM_TYPE_ALREADY_USED();
      }

      const room = await this.dao.upsertOne(
        user,
        {
          ...input,
          id,
        },
        {
          qr,
        },
      );

      await Promise.all([
        this.fanDAO.deleteByRoomId(room.id),
        this.heaterInRoomDAO.deleteByRoomId(room.id),
      ]);

      await Promise.all([
        input.fans.length &&
          this.fanDAO.upsertMany(
            user,
            input.fans.map<DeepPartial<Fan>>((fan) => ({
              ...fan,
              roomId: room.id,
            })),
            {
              qr,
            },
          ),
        input.heaterInRooms.length &&
          this.heaterInRoomDAO.upsertMany(
            user,
            input.heaterInRooms.map<DeepPartial<HeaterInRoom>>((heater) => ({
              ...heater,
              roomId: room.id,
            })),
            {
              qr,
            },
          ),
      ]);

      await this.dao.commitTransaction(qr);

      return this.getById(room.id);
    } catch (error) {
      this.dao.rollbackTransaction(qr);

      throw error;
    }
  }
}
