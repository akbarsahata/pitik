import { Inject, Service } from 'fastify-decorators';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Building } from '../datasources/entity/pgsql/Building.entity';
import { FarmChickCategory } from '../datasources/entity/pgsql/Farm.entity';
import {
  CreateBuildingBody,
  GetBuildingByCoopIdItem,
  GetBuildingsQuery,
  UpdateBuildingBody,
} from '../dto/building.dto';
import { RequestUser } from '../libs/types/index.d';
import { BuildingService } from '../services/building.service';
import { FarmService } from '../services/farming/farm.service';
import { RoomService } from '../services/room.service';

@Service()
export class BuildingUsecase {
  @Inject(BuildingService)
  private buildingService!: BuildingService;

  @Inject(PostgreSQLConnection)
  private database!: PostgreSQLConnection;

  @Inject(FarmService)
  private farmService!: FarmService;

  @Inject(RoomService)
  private roomService!: RoomService;

  async get(filter: GetBuildingsQuery): Promise<[Building[], number]> {
    return this.buildingService.get(filter);
  }

  async create(input: CreateBuildingBody, user: RequestUser): Promise<Building> {
    const queryRunner = await this.database.startTransaction();
    try {
      const building = await this.buildingService.create(input, user, queryRunner);

      const farm = await this.farmService.getFarmById(input.farmId);

      // auto create room for layer farm
      if (farm.category === FarmChickCategory.LAYER && input.coopId) {
        await this.roomService.autoCreateRoomForLayerFarm(
          building.id,
          input.coopId,
          user,
          queryRunner,
        );
      }

      await this.database.commitTransaction(queryRunner);

      return this.buildingService.getById(building.id);
    } catch (error) {
      await this.database.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async update(user: RequestUser, input: UpdateBuildingBody, id?: string): Promise<Building> {
    return this.buildingService.update(user, input, id);
  }

  async getById(buildingId: string): Promise<Building> {
    return this.buildingService.getById(buildingId);
  }

  async getBuildingByCoopId(coopId: string): Promise<[GetBuildingByCoopIdItem[], number]> {
    return this.buildingService.getBuildingByCoopId(coopId);
  }
}
