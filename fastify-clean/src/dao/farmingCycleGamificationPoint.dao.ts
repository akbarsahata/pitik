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
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import env from '../config/env';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { FarmingCycle } from '../datasources/entity/pgsql/FarmingCycle.entity';
import { FarmingCycleGamificationPoint } from '../datasources/entity/pgsql/FarmingCycleGamificationPoint.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_FC_GAMIFICATION_POINT } from '../libs/constants/errors';

@Service()
export class FarmingCycleGamificationPointDAO {
  @Inject(PostgreSQLConnection)
  private pSql!: PostgreSQLConnection;

  private repository!: Repository<FarmingCycleGamificationPoint>;

  private fcRepository!: Repository<FarmingCycle>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(FarmingCycleGamificationPoint);
    this.fcRepository = this.pSql.connection.getRepository(FarmingCycle);
  }

  async getOne(
    params: FindOneOptions<FarmingCycleGamificationPoint>,
  ): Promise<FarmingCycleGamificationPoint> {
    try {
      const fcgPoint = await this.repository.findOneOrFail(params);

      return fcgPoint;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_FC_GAMIFICATION_POINT();
      }

      throw error;
    }
  }

  async getMany(
    params: FindManyOptions<FarmingCycleGamificationPoint>,
  ): Promise<FarmingCycleGamificationPoint[]> {
    const results = await this.repository.find(params);

    return results;
  }

  async getManyWithPreviousSameCoop(
    farmingCycleId: string,
  ): Promise<FarmingCycleGamificationPoint[]> {
    const farmingCycle = await this.fcRepository.findOneOrFail({
      where: {
        id: farmingCycleId,
      },
    });

    const fcSubQuery = this.fcRepository
      .createQueryBuilder('fc')
      .select('fc.id')
      .where('fc.ref_coop_id = :coopId')
      .andWhere('fc.farmingcycle_startdate <= :startDate')
      .andWhere('fc.farmingcycle_startdate >= :gamificationStartDate')
      .setParameters({
        coopId: farmingCycle.coopId,
        startDate: farmingCycle.farmingCycleStartDate,
        gamificationStartDate: env.GAMIFICATION_START_DATE,
      });

    const fcgPoints = await this.repository
      .createQueryBuilder('fcgp')
      .innerJoinAndSelect(
        'fcgp.farmingCycle',
        'farmingCycle',
        `farmingCycle.id IN (${fcSubQuery.getQuery()})`,
      )
      .setParameters(fcSubQuery.getParameters())
      .groupBy('fcgp.ref_farmingcycle_id')
      .orderBy('fcgp.created_date', 'DESC')
      .getMany();

    return fcgPoints;
  }

  async increaseFarmingCyclePoint(farmingCycleId: string, increment: number, userId: string) {
    if (increment < 0) {
      throw new Error('point cannot be increment negatively');
    }

    await this.repository.update(
      {
        farmingCycleId,
      },
      {
        currentPoints: () => `current_points + ${increment}`,
        modifiedBy: userId,
        modifiedDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
      },
    );
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: DeepPartial<FarmingCycleGamificationPoint>,
    userRequest: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycleGamificationPoint> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const alertPreset = queryRunner.manager.create(FarmingCycleGamificationPoint, {
      ...data,
      id: randomHexString(),
      createdBy: userRequest.id,
      createdDate: now,
      modifiedBy: userRequest.id,
      modifiedDate: now,
    });

    const result = await queryRunner.manager.save(FarmingCycleGamificationPoint, alertPreset);

    return result;
  }
}
