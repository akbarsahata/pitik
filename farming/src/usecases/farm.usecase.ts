import { Inject, Service } from 'fastify-decorators';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Farm } from '../datasources/entity/pgsql/Farm.entity';
import {
  ActiveFarmingCycleItem,
  CreateFarmBody,
  GetFarmsQuery,
  UpdateFarmBody,
} from '../dto/farm.dto';
import { FarmUpsertQueue } from '../jobs/queues/farm-upsert.queue';
import { RequestUser } from '../libs/types/index.d';
import { ContractService } from '../services/contract.service';
import { CoopService } from '../services/coop.service';
import { FarmService } from '../services/farming/farm.service';

@Service()
export class FarmUsecase {
  @Inject(CoopService)
  private coopService!: CoopService;

  @Inject(ContractService)
  private contractService!: ContractService;

  @Inject(PostgreSQLConnection)
  private database!: PostgreSQLConnection;

  @Inject(FarmUpsertQueue)
  private farmUpsertQueue: FarmUpsertQueue;

  @Inject(FarmService)
  private farmService!: FarmService;

  async getActiveFarmingCycle(user: RequestUser): Promise<ActiveFarmingCycleItem[]> {
    const activeFarmingCycles = await this.farmService.getActiveFarmingCycle(user);

    return activeFarmingCycles;
  }

  async createFarm(input: CreateFarmBody, user: RequestUser): Promise<Farm> {
    const farm = await this.farmService.create(input, user);

    await this.farmUpsertQueue.addJob(farm);

    return farm;
  }

  async getFarms(filter: GetFarmsQuery): Promise<[Farm[], number]> {
    const [farms, count] = await this.farmService.getFarms(filter);

    return [farms, count];
  }

  async getFarmById(id: string): Promise<Farm> {
    const farm = await this.farmService.getFarmById(id);

    return farm;
  }

  async updateFarm(id: string, input: UpdateFarmBody, user: RequestUser): Promise<Farm> {
    const queryRunner = await this.database.startTransaction();

    try {
      const currentFarm = await this.farmService.getFarmById(id);

      if (currentFarm.branchId !== input.branchId) {
        await this.contractService.updateCoopAndFarmingCycleContract(
          currentFarm.id,
          currentFarm.branchId,
          input.branchId,
          user,
          queryRunner,
        );
      }

      if (currentFarm.status !== input.status) {
        await this.coopService.updateCoopStatusByFarmId(
          currentFarm.id,
          input.status,
          user,
          queryRunner,
        );
      }

      const updatedFarm = await this.farmService.updateV2(id, input, user, queryRunner);

      await this.database.commitTransaction(queryRunner);

      await this.farmUpsertQueue.addJob(updatedFarm);

      return updatedFarm;
    } catch (error) {
      await this.database.rollbackTransaction(queryRunner);

      throw error;
    }
  }
}
