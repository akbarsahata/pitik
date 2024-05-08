import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  DeepPartial,
  EntityNotFoundError,
  FindManyOptions,
  FindOneOptions,
  QueryRunner,
  Repository,
} from 'typeorm';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { FarmingCycleAlertD } from '../datasources/entity/pgsql/FarmingCycleAlertD.entity';
import { ERR_FARM_CYCLE_ALERT_NOT_FOUND } from '../libs/constants/errors';

@Service()
export class FarmingCycleAlertDDAO {
  @Inject(PostgreSQLConnection)
  private pSql!: PostgreSQLConnection;

  private repository: Repository<FarmingCycleAlertD>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(FarmingCycleAlertD);
  }

  async getManualTriggerAlerts(farmingCycleId: string): Promise<FarmingCycleAlertD[]> {
    return this.repository.find({
      where: {
        farmingCycleId,
        manualTrigger: true,
      },
      order: {
        alertName: 'ASC',
      },
    });
  }

  async getOne(params: FindOneOptions<FarmingCycleAlertD>): Promise<FarmingCycleAlertD> {
    try {
      const fcAlert = await this.repository.findOneOrFail(params);

      return fcAlert;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_FARM_CYCLE_ALERT_NOT_FOUND();
      }

      throw error;
    }
  }

  async getMany(
    params: FindManyOptions<FarmingCycleAlertD>,
  ): Promise<[FarmingCycleAlertD[], number]> {
    const [entities, count] = await this.repository.findAndCount(params);
    return [entities, count];
  }

  // eslint-disable-next-line class-methods-use-this
  async createManyWithTx(
    data: DeepPartial<FarmingCycleAlertD>[],
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycleAlertD[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const items = queryRunner.manager.create(
      FarmingCycleAlertD,
      data.map<DeepPartial<FarmingCycleAlertD>>((input) => ({
        ...input,
        id: input.id ? input.id : randomHexString(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const result = await queryRunner.manager.save(FarmingCycleAlertD, items);

    return result;
  }
}
