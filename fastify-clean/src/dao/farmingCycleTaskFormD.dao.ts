import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, QueryRunner } from 'typeorm';
import { RequestUser } from '../libs/types/index.d';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { FarmingCycleTaskD } from '../datasources/entity/pgsql/FarmingCycleTaskD.entity';
import { FarmingCycleTaskFormD } from '../datasources/entity/pgsql/FarmingCycleTaskFormD.entity';
import { BaseSQLDAO } from './base.dao';
import { randomHexString } from '../libs/utils/helpers';
import { DEFAULT_TIME_ZONE } from '../libs/constants';

@Service()
export class FarmingCycleTaskFormDDAO extends BaseSQLDAO<FarmingCycleTaskFormD> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(FarmingCycleTaskFormD);
  }

  // eslint-disable-next-line class-methods-use-this
  async createManyWithTx(
    data: DeepPartial<FarmingCycleTaskFormD>[],
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycleTaskFormD[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const items = queryRunner.manager.create(
      FarmingCycleTaskFormD,
      data.map<DeepPartial<FarmingCycleTaskFormD>>((input) => ({
        ...input,
        id: randomHexString(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const result = await queryRunner.manager.save(FarmingCycleTaskFormD, items);

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async upsertOneWithTx(
    data: Partial<FarmingCycleTaskFormD>,
    userId: string,
    queryRunner: QueryRunner,
  ): Promise<Partial<FarmingCycleTaskFormD>> {
    const existing = await queryRunner.manager.findOne(FarmingCycleTaskFormD, {
      where: {
        farmingCycleTaskId: data.farmingCycleTaskId,
      },
    });

    if (existing) {
      return existing;
    }

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const farmingCycleTaskFormD = queryRunner.manager.create(FarmingCycleTaskFormD, {
      ...data,
      id: randomHexString(),
      createdBy: userId,
      createdDate: now,
      modifiedBy: userId,
      modifiedDate: now,
    });

    await queryRunner.manager.save(farmingCycleTaskFormD);

    return farmingCycleTaskFormD;
  }

  wrapUpsertHook(farmingCycleTaskFormD: FarmingCycleTaskFormD, userId: string): Function {
    return async (farmingCycleTaskD: FarmingCycleTaskD, queryRunner: QueryRunner) =>
      this.upsertOneWithTx(
        {
          farmingCycleTaskId: farmingCycleTaskD.id,
          instructionTitle: farmingCycleTaskFormD.instructionTitle,
          dataRequired: farmingCycleTaskFormD.dataRequired,
          dataInstruction: farmingCycleTaskFormD.dataInstruction,
          dataType: farmingCycleTaskFormD.dataType,
          dataOption: farmingCycleTaskFormD.dataOption,
          variableId: farmingCycleTaskFormD.variableId,
          feedbrandId: farmingCycleTaskFormD.feedbrandId,
          dataOperator: farmingCycleTaskFormD.dataOperator,
          photoRequired: farmingCycleTaskFormD.photoRequired,
          photoInstruction: farmingCycleTaskFormD.photoInstruction,
          videoRequired: farmingCycleTaskFormD.videoRequired,
          videoInstruction: farmingCycleTaskFormD.videoInstruction,
          needAdditionalDetail: farmingCycleTaskFormD.needAdditionalDetail,
          additionalDetail: farmingCycleTaskFormD.additionalDetail,
          checkDataCorrectness: farmingCycleTaskFormD.checkDataCorrectness,
        },
        userId,
        queryRunner,
      );
  }
}
