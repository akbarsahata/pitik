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
import { FarmingCycleAlertInstructionD } from '../datasources/entity/pgsql/FarmingCycleAlertInstructionD.entity';
import { ERR_FARM_CYCLE_ALERT_INST_NOT_FOUND } from '../libs/constants/errors';

@Service()
export class FarmingCycleAlertInstructionDDAO {
  @Inject(PostgreSQLConnection)
  private pSql!: PostgreSQLConnection;

  private repository!: Repository<FarmingCycleAlertInstructionD>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(FarmingCycleAlertInstructionD);
  }

  async getMany(
    params: FindManyOptions<FarmingCycleAlertInstructionD>,
  ): Promise<FarmingCycleAlertInstructionD[]> {
    return this.repository.find(params);
  }

  async getOne(
    params: FindOneOptions<FarmingCycleAlertInstructionD>,
  ): Promise<FarmingCycleAlertInstructionD> {
    try {
      const fcAlertInst = await this.repository.findOneOrFail(params);

      return fcAlertInst;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_FARM_CYCLE_ALERT_INST_NOT_FOUND();
      }

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async createManyWithTx(
    data: DeepPartial<FarmingCycleAlertInstructionD>[],
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycleAlertInstructionD[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const items = queryRunner.manager.create(
      FarmingCycleAlertInstructionD,
      data.map<DeepPartial<FarmingCycleAlertInstructionD>>((input) => ({
        ...input,
        id: input.id ? input.id : randomHexString(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const result = await queryRunner.manager.save(FarmingCycleAlertInstructionD, items);

    return result;
  }
}
