import { Inject, Service } from 'fastify-decorators';
import { DeepPartial, ILike, In, Not } from 'typeorm';
import { B2BFarmDAO } from '../../dao/b2b/b2b.farm.dao';
import { B2BFarmInfrastructureDAO } from '../../dao/b2b/b2b.farmInfrastructure.dao';
import { B2BFarmMemberDAO } from '../../dao/b2b/b2b.farmMember.dao';
import { BuildingDAO } from '../../dao/building.dao';
import { BuildingTypeDAO } from '../../dao/buildingType.dao';
import { CoopDAO } from '../../dao/coop.dao';
import { CoopTypeDAO } from '../../dao/coopType.dao';
import { FarmDAO } from '../../dao/farm.dao';
import { RoomDAO } from '../../dao/room.dao';
import { RoomTypeDAO } from '../../dao/roomType.dao';
import { AutoNumbering } from '../../datasources/entity/pgsql/AutoNumbering.entity';
import { Coop } from '../../datasources/entity/pgsql/Coop.entity';
import { Farm } from '../../datasources/entity/pgsql/Farm.entity';
import { Room } from '../../datasources/entity/pgsql/Room.entity';
import { RoomType } from '../../datasources/entity/pgsql/RoomType.entity';
import {
  CreateB2BFarmInfrastructureCoopBody,
  CreateB2BFarmInfrastructureCoopItemResponse,
  GetB2BFarmInfrastructureCoopItemResponse,
  GetB2BFarmInfrastructureCoopListItemResponse,
  GetB2BFarmInfraStructureCoopParam,
  GetB2BFarmInfrastructureCoopRoomItemResponse,
  GetB2BFarmInfrastructureCoopRoomParam,
  GetB2BFarmInfrastructureHomeItemResponse,
  PatchB2BFarmInfrastructureCoopBody,
  PatchB2BFarmInfrastructureCoopItemResponse,
  PatchB2BFarmInfrastructureCoopParam,
  PatchB2BFarmInfrastructureCoopRoomBody,
  PatchB2BFarmInfrastructureCoopRoomItemResponse,
  PatchB2BFarmInfrastructureCoopRoomParam,
  PatchDeactivateB2BFarmInfrastructureCoopParam,
} from '../../dto/b2b/b2b.farmInfrastructure.dto';
import { AUTO_NUMBERING_TRX_TYPE } from '../../libs/constants';
import {
  B2B_BUILDING_DEFAULT_PAYLOAD,
  B2B_ROOM_DEFAULT_PAYLOAD,
  DEFAULT_ORGANIZATION_PITIK,
} from '../../libs/constants/b2bExternal';
import {
  ERR_B2B_COOP_NAME_ALREADY_EXISTS,
  ERR_B2B_NOT_AN_ORGANIZATION_MEMBER,
  ERR_B2B_ROOM_NOT_AVAILABLE,
  ERR_ROOM_TYPE_NOT_FOUND,
} from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { generateB2BCode } from '../../libs/utils/helpers';

@Service()
export class B2BFarmInfrastructureService {
  @Inject(B2BFarmInfrastructureDAO)
  private dao!: B2BFarmInfrastructureDAO;

  @Inject(B2BFarmDAO)
  private b2bFarmDAO!: B2BFarmDAO;

  @Inject(B2BFarmMemberDAO)
  private b2bFarmMemberDAO!: B2BFarmMemberDAO;

  @Inject(BuildingTypeDAO)
  private buildingTypeDAO!: BuildingTypeDAO;

  @Inject(BuildingDAO)
  private buildingDAO!: BuildingDAO;

  @Inject(CoopDAO)
  private coopDAO!: CoopDAO;

  @Inject(CoopTypeDAO)
  private coopTypeDAO!: CoopTypeDAO;

  @Inject(FarmDAO)
  private farmDAO!: FarmDAO;

  @Inject(RoomDAO)
  private roomDAO!: RoomDAO;

  @Inject(RoomTypeDAO)
  private roomTypeDAO!: RoomTypeDAO;

  async getB2BFarmList(user: RequestUser): Promise<Farm[]> {
    const [farmInfras] = await this.dao.getMany({
      where: {
        organizationId: user.organizationId,
      },
    });

    const farmIdLists = farmInfras?.map((farmInfra) => farmInfra.farmId);

    const [results] = await this.farmDAO.getMany({
      where: {
        id: In(farmIdLists),
        status: true,
      },
    });

    return results;
  }

  async getB2BCoopList(user: RequestUser): Promise<Coop[]> {
    const [farmInfras] = await this.dao.getMany({
      where: {
        organizationId: user.organizationId,
      },
    });

    const coopIdLists = farmInfras?.map((farmInfra) => farmInfra.coopId);

    const [results] = await this.coopDAO.getMany({
      where: {
        id: In(coopIdLists),
        status: true,
      },
    });

    return results;
  }

  async getB2BFarmInfrastructureHome(
    userId: string,
  ): Promise<GetB2BFarmInfrastructureHomeItemResponse> {
    const b2bFarmMember = await this.b2bFarmMemberDAO.getOne({
      where: {
        userId,
      },
      relations: {
        farm: {
          farm: true,
          organization: true,
        },
      },
    });

    if (!b2bFarmMember) {
      throw ERR_B2B_NOT_AN_ORGANIZATION_MEMBER();
    }

    const [b2bFarmInfra, count] = await this.dao.getMany({
      where: {
        farmId: b2bFarmMember.farm.farmId,
      },
      relations: {
        coop: {
          rooms: {
            roomType: true,
          },
        },
        devices: {
          iotDevice: true,
        },
      },
    });

    const b2bFarmInfraInfoCoops: any = [];
    if (count > 0) {
      b2bFarmInfra.forEach((infra) => {
        infra.coop?.rooms?.forEach((room) => {
          b2bFarmInfraInfoCoops.push({
            id: infra.coop.id,
            name: infra.coop.coopName,
            status: infra.coop.status ? 'active' : 'inactive',
            room: {
              id: room.id,
              name: room.roomName,
              level: room.roomType.level,
              status: room.isActive ? 'active' : 'inactive',
            },
          });
        });
      });
    }

    return {
      farm: {
        id: b2bFarmMember.farm.farm.id,
        name: b2bFarmMember.farm.farm.farmName,
        code: b2bFarmMember.farm.farm.farmCode,
      },
      organization: {
        id: b2bFarmMember.farm.organization.id,
        name: b2bFarmMember.farm.organization.name,
        image: b2bFarmMember.farm.organization.image,
      },
      coops: b2bFarmInfraInfoCoops,
    };
  }

  async getB2BFarmInfrastructureCoop(
    input: GetB2BFarmInfraStructureCoopParam,
  ): Promise<GetB2BFarmInfrastructureCoopItemResponse> {
    const farmInfra = await this.dao.getOneStrict({
      where: {
        coopId: input.coopId,
      },
      relations: {
        coop: {
          coopType: true,
          rooms: {
            roomType: true,
          },
        },
        devices: {
          iotDevice: true,
        },
      },
      order: {
        coop: {
          coopName: 'ASC',
          rooms: {
            roomType: {
              level: 'ASC',
            },
          },
        },
      },
    });

    return {
      id: farmInfra.coop.id,
      coopName: farmInfra.coop.coopName,
      coopType: farmInfra.coop.coopType.coopTypeName,
      rooms: farmInfra.coop.rooms.map((room) => ({
        id: room.id,
        name: room.roomName,
        level: room.roomType.level,
        status: room.isActive ? 'active' : 'inactive',
        devices: [],
      })),
    };
  }

  async getB2BFarmInfrastructureCoopList(
    user: RequestUser,
  ): Promise<[GetB2BFarmInfrastructureCoopListItemResponse[], number]> {
    const [farmInfraList, count] = await this.dao.getMany({
      where: {
        farm: {
          userOwnerId: user.id,
        },
        coop: {
          status: true,
        },
      },
      relations: {
        farm: true,
        coop: true,
      },
    });

    return [
      farmInfraList.map((farmInfra) => ({
        id: farmInfra.coop.id,
        name: farmInfra.coop.coopName,
      })) || [],
      count,
    ];
  }

  async getB2BFarmInfrastructureCoopRoom(
    input: GetB2BFarmInfrastructureCoopRoomParam,
    user: RequestUser,
    additional?: any,
  ): Promise<GetB2BFarmInfrastructureCoopRoomItemResponse> {
    const farmInfra = await this.dao.getOneStrict({
      where: {
        organizationId: user.organizationId,
        coopId: input.coopId,
        coop: {
          rooms: {
            id: input.roomId,
          },
        },
      },
      relations: {
        coop: {
          coopType: true,
          rooms: {
            roomType: true,
          },
        },
      },
      order: {
        coop: {
          coopName: 'ASC',
          rooms: {
            roomType: {
              level: 'ASC',
            },
          },
        },
      },
    });

    return {
      coopId: farmInfra.coop.id,
      coopName: farmInfra.coop.coopName,
      coopType: farmInfra.coop.coopType?.coopTypeName || '',
      coopStatus: farmInfra.coop?.status ? 'active' : 'inactive',
      room: {
        id: farmInfra.coop.rooms[0]?.id,
        name: farmInfra.coop.rooms[0]?.roomName,
        level: farmInfra.coop.rooms[0]?.roomType?.level,
        status: farmInfra.coop.rooms[0]?.isActive ? 'active' : 'inactive',
        devices: additional,
      },
    };
  }

  async createB2BFarmInfrastructureCoop(
    input: CreateB2BFarmInfrastructureCoopBody,
    user: RequestUser,
  ): Promise<CreateB2BFarmInfrastructureCoopItemResponse> {
    const queryRunner = await this.dao.startTransaction();

    const isInternalOrg = user.organizationId === DEFAULT_ORGANIZATION_PITIK.ORG_ID;

    try {
      const [existingCoop, buildingType, coopType, b2bFarm, [roomTypes], autoNumbering] =
        await Promise.all([
          this.coopDAO.getOne({
            where: {
              coopName: ILike(input.coopName),
            },
          }),
          this.buildingTypeDAO.getOneStrict({
            where: {
              name: input.coopType,
            },
          }),
          this.coopTypeDAO.getOneStrict({
            where: {
              coopTypeName: input.coopType,
            },
          }),
          this.b2bFarmDAO.getOneStrict({
            where: {
              ownerId: !isInternalOrg ? input.ownerId || user.id : undefined,
              organizationId: (isInternalOrg && user.organizationId) || undefined,
            },
            relations: {
              farm: true,
              organization: true,
            },
          }),
          this.roomTypeDAO.getMany({
            where: {
              isActive: true,
            },
          }),
          queryRunner.manager.findOneOrFail(AutoNumbering, {
            where: {
              transactionType: AUTO_NUMBERING_TRX_TYPE.B2B_COOP_CODE,
            },
          }),
        ]);

      if (existingCoop) {
        throw ERR_B2B_COOP_NAME_ALREADY_EXISTS();
      }

      const roomTypeMap = new Map<number, RoomType>();
      roomTypes?.forEach((item) => {
        roomTypeMap.set(item.level, item);
      });

      const isRoomAvailable = this.validateRoomTypes(input.rooms, roomTypeMap);
      if (!isRoomAvailable) {
        throw ERR_B2B_ROOM_NOT_AVAILABLE();
      }

      const building = await this.buildingDAO.createOneWithTx(
        {
          farmId: b2bFarm.farmId,
          name: `Bangunan ${input.coopName}`,
          buildingTypeId: buildingType.id,
          ...B2B_BUILDING_DEFAULT_PAYLOAD,
        },
        user,
        queryRunner,
      );

      const coop = await this.coopDAO.createOneWithTx(
        {
          coopName: input.coopName,
          coopCode: generateB2BCode(
            autoNumbering.lastNumber,
            autoNumbering.digitCount,
            autoNumbering.prefix,
          ),
          coopTypeId: coopType.id,
          farmId: b2bFarm.farmId,
          status: true,
        },
        user,
        queryRunner,
      );

      await this.dao.createOneWithTx(
        {
          organizationId: b2bFarm.organizationId,
          farmId: b2bFarm.farmId,
          buildingId: building.id,
          coopId: coop.id,
        },
        user,
        queryRunner,
      );

      await this.roomDAO.createManyWithTx(
        input.rooms.map<DeepPartial<Room>>((room) => ({
          buildingId: building.id,
          coopId: coop.id,
          roomName: room.name,
          roomTypeId: roomTypeMap.get(room.level)?.id,
          ...B2B_ROOM_DEFAULT_PAYLOAD,
        })),
        user,
        queryRunner,
      );

      await queryRunner.manager.update(AutoNumbering, autoNumbering.id, {
        lastNumber: () => 'last_number + 1',
      });

      await this.dao.commitTransaction(queryRunner);

      return {
        farmId: b2bFarm.farmId,
        coopId: coop.id,
        coopName: coop.coopName,
        coopType: input.coopType,
        rooms: input.rooms,
      };
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async patchB2BFarmInfrastructureCoopRoom(
    params: PatchB2BFarmInfrastructureCoopRoomParam,
    input: PatchB2BFarmInfrastructureCoopRoomBody,
    user: RequestUser,
  ): Promise<PatchB2BFarmInfrastructureCoopRoomItemResponse> {
    const queryRunner = await this.dao.startTransaction();

    try {
      const existingCoop = await this.coopDAO.getOne({
        where: {
          coopName: ILike(input.coopName),
          id: Not(params.coopId),
        },
      });

      if (existingCoop) {
        throw ERR_B2B_COOP_NAME_ALREADY_EXISTS();
      }

      const [b2bFarmInfra, coop, buildingType, coopType, [roomTypes]] = await Promise.all([
        this.dao.getOneStrict({
          where: {
            coopId: params.coopId,
          },
        }),
        this.coopDAO.getOneStrict({
          where: {
            id: params.coopId,
          },
        }),
        this.buildingTypeDAO.getOneStrict({
          where: {
            name: input.coopType,
          },
        }),
        this.coopTypeDAO.getOneStrict({
          where: {
            coopTypeName: input.coopType,
          },
        }),
        this.roomTypeDAO.getMany({
          where: {
            isActive: true,
          },
        }),
      ]);

      const roomTypeMap = new Map<number, RoomType>();
      roomTypes?.forEach((item) => {
        roomTypeMap.set(item.level, item);
      });

      const isRoomAvailable = this.validateRoomTypes([input.room], roomTypeMap);
      if (!isRoomAvailable) {
        throw ERR_ROOM_TYPE_NOT_FOUND();
      }

      await this.coopDAO.updateOneWithTx(
        { id: params.coopId },
        {
          ...coop,
          coopName: input.coopName,
          coopTypeId: coopType.id,
          status: input.coopStatus === 'active',
        },
        user,
        queryRunner,
      );

      await this.buildingDAO.updateOneWithTx(
        {
          id: b2bFarmInfra.buildingId,
          farmId: b2bFarmInfra.farmId,
        },
        {
          name: `Bangunan ${input.coopName}`,
          buildingTypeId: buildingType.id,
        },
        user,
        queryRunner,
      );

      await this.roomDAO.updateOneWithTx(
        {
          id: params.roomId,
        },
        {
          roomName: input.room.name,
          isActive: input.room.status === 'active',
        },
        user,
        queryRunner,
      );

      if (input.coopStatus === 'inactive' || coop.status !== (input.coopStatus === 'active')) {
        await this.roomDAO.updateManyWithTx(
          {
            coopId: params.coopId,
          },
          {
            isActive: input.coopStatus === 'active',
          },
          user,
          queryRunner,
        );
      }

      await this.dao.commitTransaction(queryRunner);

      return input;
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async patchB2BFarmInfrastructureCoop(
    params: PatchB2BFarmInfrastructureCoopParam,
    input: PatchB2BFarmInfrastructureCoopBody,
    user: RequestUser,
  ): Promise<PatchB2BFarmInfrastructureCoopItemResponse> {
    const queryRunner = await this.dao.startTransaction();

    try {
      const [b2bFarmInfra, coop, buildingType, coopType, [roomTypes]] = await Promise.all([
        this.dao.getOneStrict({
          where: {
            coopId: params.coopId,
          },
        }),
        this.coopDAO.getOneStrict({
          where: {
            id: params.coopId,
          },
          relations: {
            rooms: {
              roomType: true,
            },
          },
        }),
        this.buildingTypeDAO.getOneStrict({
          where: {
            name: input.coopType,
          },
        }),
        this.coopTypeDAO.getOneStrict({
          where: {
            coopTypeName: input.coopType,
          },
        }),
        this.roomTypeDAO.getMany({
          where: {
            isActive: true,
          },
        }),
      ]);

      // Remove room which not sent by input payload
      const currentRegisteredRooms = coop.rooms.map((room) => ({
        id: room.id,
        level: room.roomType.level,
        name: room.roomType.name,
      }));

      if (input.rooms.length < currentRegisteredRooms.length) {
        const inputLevels = input.rooms.map((room) => room.level);

        const roomsToDelete = coop.rooms.filter(
          (room) => !inputLevels.includes(room.roomType.level),
        );

        const roomIdsTobeDeleted = roomsToDelete.map((r) => r.id);

        await this.roomDAO.deleteManyWithTx(
          {
            id: In(roomIdsTobeDeleted),
            coopId: coop.id,
          },
          queryRunner,
        );
      }

      const mergedRoom = input.rooms.map((inRoom) => {
        const matchingSaved = currentRegisteredRooms.find((saved) => saved.level === inRoom.level);
        if (matchingSaved) {
          return { level: inRoom.level, name: inRoom.name, id: matchingSaved.id };
        }
        return inRoom;
      });

      const roomTypeMap = new Map<number, RoomType>();
      roomTypes.forEach((item) => {
        roomTypeMap.set(item.level, item);
      });

      const isRoomAvailable = this.validateRoomTypes(mergedRoom, roomTypeMap);
      if (!isRoomAvailable) {
        throw ERR_ROOM_TYPE_NOT_FOUND();
      }

      await this.coopDAO.updateOneWithTx(
        { id: params.coopId },
        {
          coopName: input.coopName,
          coopTypeId: coopType.id,
        },
        user,
        queryRunner,
      );

      await this.buildingDAO.updateOneWithTx(
        {
          id: b2bFarmInfra.buildingId,
          farmId: b2bFarmInfra.farmId,
        },
        {
          name: `Bangunan ${input.coopName}`,
          buildingTypeId: buildingType.id,
        },
        user,
        queryRunner,
      );

      await this.roomDAO.upsertManyWithTx(
        { buildingId: b2bFarmInfra.buildingId },
        mergedRoom.map<DeepPartial<Room>>((room) => ({
          id: room.id || undefined,
          buildingId: b2bFarmInfra.buildingId,
          coopId: coop.id,
          roomName: room.name,
          roomTypeId: roomTypeMap.get(room.level)?.id,
          ...B2B_ROOM_DEFAULT_PAYLOAD,
        })),
        user,
        queryRunner,
      );

      await this.dao.commitTransaction(queryRunner);

      return {
        farmId: b2bFarmInfra.farmId,
        coopId: coop.id,
        coopName: coop.coopName,
        coopType: input.coopType,
        rooms: input.rooms,
      };
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async patchDeactivateB2BFarmInfrastructureCoop(
    params: PatchDeactivateB2BFarmInfrastructureCoopParam,
    user: RequestUser,
  ): Promise<void> {
    const queryRunner = await this.dao.startTransaction();

    try {
      const b2bFarmInfra = await this.dao.getOneStrict({
        where: {
          coopId: params.coopId,
        },
      });

      const actionStatus = params.action === 'activate';

      await this.coopDAO.updateOneWithTx(
        { id: params.coopId },
        { status: actionStatus },
        user,
        queryRunner,
      );

      await this.buildingDAO.updateOneWithTx(
        {
          id: b2bFarmInfra.buildingId,
          farmId: b2bFarmInfra.farmId,
        },
        {
          isActive: actionStatus,
        },
        user,
        queryRunner,
      );

      await this.roomDAO.updateManyWithTx(
        {
          buildingId: b2bFarmInfra.buildingId,
          coopId: b2bFarmInfra.coopId,
        },
        {
          isActive: actionStatus,
        },
        user,
        queryRunner,
      );

      await this.dao.commitTransaction(queryRunner);
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async deleteFarmInfrastructureCoop(coopId: string): Promise<void> {
    const queryRunner = await this.dao.startTransaction();

    try {
      const coop = await this.coopDAO.getOneStrict({
        where: {
          id: coopId,
        },
      });

      const b2bFarmInfra = await this.dao.getOneStrict({
        where: {
          coopId: coop.id,
          farmId: coop.farmId,
        },
      });

      await this.roomDAO.deleteManyWithTx({ coopId: coop.id }, queryRunner);

      await this.buildingDAO.deleteOneWithTx({ id: b2bFarmInfra.buildingId }, queryRunner);

      await this.coopDAO.deleteOneWithTx({ id: b2bFarmInfra.coopId }, queryRunner);

      await this.dao.deleteOneWithTx({ id: b2bFarmInfra.id }, queryRunner);

      await this.dao.commitTransaction(queryRunner);
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private validateRoomTypes(rooms: any[], roomTypeMap: Map<number, RoomType>): boolean {
    let isAllowed: boolean = true;
    rooms.forEach((room) => {
      const roomTypeId = roomTypeMap.get(room.level)?.id;
      if (!roomTypeId) {
        isAllowed = false;
      }
    });
    return isAllowed;
  }
}
