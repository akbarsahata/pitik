import { Between, DeepPartial, FindOptionsWhere, QueryRunner, Repository } from 'typeorm';
import { endOfDay, startOfDay } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { RequestUser } from '../libs/types/index.d';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_WEIGHING_DATA_NOT_FOUND } from '../libs/constants/errors';
import { randomHexString } from '../libs/utils/helpers';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { SmartScaleWeighing } from '../datasources/entity/pgsql/SmartScaleWeighing.entity';
import { BaseSQLDAO } from './base.dao';

@Service()
export class SmartScaleWeighingDAO extends BaseSQLDAO {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  protected repository!: Repository<SmartScaleWeighing>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(SmartScaleWeighing);
  }

  async getOneByFarmingCycleId(
    farmingCycleId: string,
    date: string,
  ): Promise<SmartScaleWeighing | null> {
    const execDate = new Date(date);
    const smartScaleWeighing = await this.repository.findOne({
      where: {
        farmingCycleId,
        executedDate: Between(startOfDay(execDate), endOfDay(execDate)),
      },
      relations: {
        farmingCycle: true,
        details: true,
      },
    });

    return smartScaleWeighing;
  }

  async getManyByFarmingCycleId(farmingCycleId: string): Promise<[SmartScaleWeighing[], number]> {
    return this.repository
      .createQueryBuilder('ssw')
      .select(['ssw', 'fc.farmingCycleStartDate'])
      .leftJoin('ssw.farmingCycle', 'fc')
      .where('ssw.ref_farmingcycle_id = :farmingCycleId', { farmingCycleId })
      .orderBy('ssw.executed_date', 'ASC')
      .getManyAndCount();
  }

  async createOne(
    data: Partial<SmartScaleWeighing>,
    user: RequestUser,
  ): Promise<SmartScaleWeighing> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const smartScaleWeighing = this.repository.create({
      ...data,
      id: randomHexString(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    await this.repository.save(smartScaleWeighing);

    return smartScaleWeighing;
  }

  async createMany(
    data: Partial<SmartScaleWeighing>[],
    user: RequestUser,
  ): Promise<SmartScaleWeighing[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const weighings = this.repository.create(
      data.map<Partial<SmartScaleWeighing>>((d) => ({
        ...d,
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    await this.repository.save(weighings);

    return weighings;
  }

  async updateOne(
    params: FindOptionsWhere<SmartScaleWeighing>,
    data: Partial<SmartScaleWeighing>,
    user: RequestUser,
  ) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const result = await this.repository.update(params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    if (!result.affected) {
      throw ERR_WEIGHING_DATA_NOT_FOUND();
    }

    const updated = await this.repository.findOneOrFail({
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updated;
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: DeepPartial<SmartScaleWeighing>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<SmartScaleWeighing> {
    const item = queryRunner.manager.create(SmartScaleWeighing, {
      ...data,
      id: data.id || randomHexString(),
      createdBy: user.id,
      createdDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
    });

    const result = await queryRunner.manager.save(SmartScaleWeighing, item);

    return result;
  }
}
