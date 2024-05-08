import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindManyOptions, QueryRunner, Repository } from 'typeorm';
import { randomHexString } from '../libs/utils/helpers';
import { RequestUser } from '../libs/types/index.d';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { FarmingCycleTaskGamificationPoint } from '../datasources/entity/pgsql/FarmingCycleTaskGamificationPoint.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';

@Service()
export class FarmingCycleTaskGamificationPointDAO {
  @Inject(PostgreSQLConnection)
  private pSql!: PostgreSQLConnection;

  private repository: Repository<FarmingCycleTaskGamificationPoint>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(FarmingCycleTaskGamificationPoint);
  }

  async getMany(
    params: FindManyOptions<FarmingCycleTaskGamificationPoint>,
  ): Promise<FarmingCycleTaskGamificationPoint[]> {
    return this.repository.find(params);
  }

  // eslint-disable-next-line class-methods-use-this
  async createManyWithTx(
    data: DeepPartial<FarmingCycleTaskGamificationPoint>[],
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycleTaskGamificationPoint[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const items = queryRunner.manager.create(
      FarmingCycleTaskGamificationPoint,
      data.map<DeepPartial<FarmingCycleTaskGamificationPoint>>((input) => ({
        ...input,
        id: randomHexString(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const result = await queryRunner.manager.save(FarmingCycleTaskGamificationPoint, items);

    return result;
  }
}
