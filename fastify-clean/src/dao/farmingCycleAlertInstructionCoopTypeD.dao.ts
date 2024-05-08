import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindManyOptions, QueryRunner, Repository } from 'typeorm';
import { FarmingCycleAlertInstructionCoopTypeD } from '../datasources/entity/pgsql/FarmingCycleAlertInstructionCoopTypeD.entity';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';

@Service()
export class FarmingCycleAlertInstructionCoopTypeDDAO {
  @Inject(PostgreSQLConnection)
  private pSql!: PostgreSQLConnection;

  private repository!: Repository<FarmingCycleAlertInstructionCoopTypeD>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(FarmingCycleAlertInstructionCoopTypeD);
  }

  async getMany(
    params: FindManyOptions<FarmingCycleAlertInstructionCoopTypeD>,
  ): Promise<FarmingCycleAlertInstructionCoopTypeD[]> {
    return this.repository.find(params);
  }

  // eslint-disable-next-line class-methods-use-this
  async createManyWithTx(
    data: DeepPartial<FarmingCycleAlertInstructionCoopTypeD>[],
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycleAlertInstructionCoopTypeD[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const items = queryRunner.manager.create(
      FarmingCycleAlertInstructionCoopTypeD,
      data.map<DeepPartial<FarmingCycleAlertInstructionCoopTypeD>>((input) => ({
        ...input,
        id: input.id ? input.id : randomHexString(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const result = await queryRunner.manager.save(FarmingCycleAlertInstructionCoopTypeD, items);

    return result;
  }
}
