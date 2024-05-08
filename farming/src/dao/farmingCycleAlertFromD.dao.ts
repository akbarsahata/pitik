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
import { randomHexString } from '../libs/utils/helpers';
import { RequestUser } from '../libs/types/index.d';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { FarmingCycleAlertFormD } from '../datasources/entity/pgsql/FarmingCycleAlertFormD.entity';
import { ERR_FARM_CYCLE_ALERT_FORM_NOT_FOUND } from '../libs/constants/errors';

@Service()
export class FarmingCycleAlertFormDDAO {
  @Inject(PostgreSQLConnection)
  private pSql!: PostgreSQLConnection;

  private repository!: Repository<FarmingCycleAlertFormD>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(FarmingCycleAlertFormD);
  }

  async getOneById(id: string): Promise<FarmingCycleAlertFormD> {
    try {
      const fcAlertForm = await this.repository.findOneOrFail({
        where: {
          id,
        },
      });

      return fcAlertForm;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_FARM_CYCLE_ALERT_FORM_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getOne(params: FindOneOptions<FarmingCycleAlertFormD>): Promise<FarmingCycleAlertFormD> {
    try {
      const fcAlertForm = await this.repository.findOneOrFail(params);

      return fcAlertForm;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_FARM_CYCLE_ALERT_FORM_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getMany(
    params: FindManyOptions<FarmingCycleAlertFormD>,
  ): Promise<FarmingCycleAlertFormD[]> {
    return this.repository.find(params);
  }

  // eslint-disable-next-line class-methods-use-this
  async createManyWithTx(
    data: DeepPartial<FarmingCycleAlertFormD>[],
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycleAlertFormD[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const items = queryRunner.manager.create(
      FarmingCycleAlertFormD,
      data.map<DeepPartial<FarmingCycleAlertFormD>>((input) => ({
        ...input,
        id: input.id ? input.id : randomHexString(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const result = await queryRunner.manager.save(FarmingCycleAlertFormD, items);

    return result;
  }
}
