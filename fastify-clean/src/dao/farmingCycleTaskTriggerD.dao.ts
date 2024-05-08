import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, QueryRunner, Repository } from 'typeorm';
import { FarmingCycleTaskTriggerD } from '../datasources/entity/pgsql/FarmingCycleTaskTriggerD.entity';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { FarmingCycleTaskD } from '../datasources/entity/pgsql/FarmingCycleTaskD.entity';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { DEFAULT_TIME_ZONE } from '../libs/constants';

@Service()
export class FarmingCycleTaskTriggerDDAO {
  @Inject(PostgreSQLConnection)
  private pSql!: PostgreSQLConnection;

  private repository!: Repository<FarmingCycleTaskTriggerD>;

  private farmingCycleTaskDRepository!: Repository<FarmingCycleTaskD>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(FarmingCycleTaskTriggerD);
    this.farmingCycleTaskDRepository = this.pSql.connection.getRepository(FarmingCycleTaskD);
  }

  async getFarmingCycleLastDay(farmingCycleId: string): Promise<number> {
    const farmingCycleTasks = await this.farmingCycleTaskDRepository
      .createQueryBuilder('fmctd')
      .select('fmctd.id', 'id')
      .where('fmctd.ref_farmingcycle_id = :id', { id: farmingCycleId })
      .getRawMany();

    const farmingCycleTaskIds = farmingCycleTasks.map((f) => f.id);

    if (!farmingCycleTaskIds.length) return -1;

    const { lastDay } = await this.repository
      .createQueryBuilder('fcttd')
      .select('MAX(fcttd.day)', 'lastDay')
      .where('fcttd.ref_farmingcycletask_id IN (:...taskIds)', {
        taskIds: farmingCycleTaskIds,
      })
      .getRawOne();

    return Number(lastDay);
  }

  // eslint-disable-next-line class-methods-use-this
  async createManyWithTx(
    data: DeepPartial<FarmingCycleTaskTriggerD>[],
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycleTaskTriggerD[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const items = queryRunner.manager.create(
      FarmingCycleTaskTriggerD,
      data.map<DeepPartial<FarmingCycleTaskTriggerD>>((input) => ({
        ...input,
        id: input.id ? input.id : randomHexString(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const result = await queryRunner.manager.save(FarmingCycleTaskTriggerD, items);

    return result;
  }
}
