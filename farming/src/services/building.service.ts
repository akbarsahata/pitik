import { Inject, Service } from 'fastify-decorators';
import { ILike, QueryRunner } from 'typeorm';
import { BuildingDAO } from '../dao/building.dao';
import { Building } from '../datasources/entity/pgsql/Building.entity';
import {
  CreateBuildingBody,
  GetBuildingByCoopIdItem,
  GetBuildingsQuery,
  UpdateBuildingBody,
} from '../dto/building.dto';
import { Transactional } from '../libs/decorators/transactional';
import { RequestUser } from '../libs/types/index.d';
import { generateOrderQuery } from '../libs/utils/helpers';

@Service()
export class BuildingService {
  @Inject(BuildingDAO)
  private dao: BuildingDAO;

  async get(filter: GetBuildingsQuery): Promise<[Building[], number]> {
    const limit = (filter.$limit && filter.$limit > 0 && filter.$limit) || undefined;
    const skip =
      limit && filter.$page !== undefined && filter.$page > 0 ? (filter.$page - 1) * limit : 0;

    return this.dao.getMany({
      where: {
        isActive: filter.isActive,
        farmId: filter.farmId || undefined,
        buildingTypeId: filter.buildingTypeId || undefined,
        farm:
          (filter.ownerId && {
            owner: {
              id: filter.ownerId,
            },
          }) ||
          undefined,
        name: filter.buildingName && ILike(`%${filter.buildingName}%`),
      },
      relations: {
        farm: {
          owner: true,
        },
        buildingType: true,
      },
      skip,
      order: (filter.$order && generateOrderQuery(filter.$order)) || undefined,
      take: limit,
    });
  }

  @Transactional()
  async create(
    input: CreateBuildingBody,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<Building> {
    const created = await this.dao.upsertOne(user, input, {
      qr: queryRunner,
    });

    return created;
  }

  async update(user: RequestUser, input: UpdateBuildingBody, id?: string): Promise<Building> {
    await this.dao.getOneStrict({
      where: {
        id,
      },
    });

    const updated = await this.dao.upsertOne(user, {
      ...input,
      farmId: input.farmId,
      buildingTypeId: input.buildingTypeId,
      id,
    });

    return this.getById(updated.id);
  }

  async getById(buildingId: string): Promise<Building> {
    return this.dao.getOneStrict({
      where: {
        id: buildingId,
      },
      relations: {
        farm: {
          owner: true,
        },
        buildingType: true,
      },
    });
  }

  async getBuildingByCoopId(coopId: string): Promise<[GetBuildingByCoopIdItem[], number]> {
    const [buildings, count] = await this.dao.getMany({
      where: {
        isActive: true,
        rooms: {
          coopId,
          isActive: true,
          iotSensors: {
            iotDevice: {
              deviceType: 'SMART_MONITORING',
            },
          },
        },
      },
      relations: {
        rooms: {
          roomType: true,
          floorType: true,
          coop: true,
        },
      },
      order: {
        name: 'ASC',
        rooms: {
          floorType: {
            name: 'ASC',
          },
        },
      },
    });

    const results: GetBuildingByCoopIdItem[] = [];
    buildings.forEach((building) => {
      building.rooms.forEach((room) => {
        results.push({
          buildingId: building.id,
          buildingName: building.name,
          roomId: room.id,
          roomCode: room.roomCode,
          roomTypeName: room.roomType.name,
        });
      });
    });

    return [results, count];
  }
}
