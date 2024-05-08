import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  EntityNotFoundError,
  FindOptionsWhere,
  FindManyOptions,
  FindOneOptions,
  QueryRunner,
  DeepPartial,
} from 'typeorm';
import { utcToZonedTime } from 'date-fns-tz';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { SmartScaleWeighingD } from '../datasources/entity/pgsql/SmartScaleWeighingD.entity';
import { ERR_WEIGHING_DETAIL_NOT_FOUND } from '../libs/constants/errors';
import { BaseSQLDAO } from './base.dao';

@Service()
export class SmartScaleWeighingDDAO extends BaseSQLDAO<SmartScaleWeighingD> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(SmartScaleWeighingD);
  }

  async getOne(params: FindOneOptions<SmartScaleWeighingD>): Promise<SmartScaleWeighingD> {
    try {
      const smartScaleWeighingD = await this.repository.findOneOrFail(params);

      return smartScaleWeighingD;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_WEIGHING_DETAIL_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getMany(
    params: FindManyOptions<SmartScaleWeighingD>,
  ): Promise<[SmartScaleWeighingD[], number]> {
    const [entities, count] = await this.repository.findAndCount(params);

    return [entities, count];
  }

  async createMany(data: Partial<SmartScaleWeighingD>[]): Promise<SmartScaleWeighingD[]> {
    const details = this.repository.create(
      data.map<Partial<SmartScaleWeighingD>>((d) => ({
        ...d,
        id: randomHexString(),
      })),
    );

    await this.repository.save(details);

    return details;
  }

  async deleteMany(params: FindOptionsWhere<SmartScaleWeighingD>) {
    await this.repository.delete(params);

    return [];
  }

  // eslint-disable-next-line class-methods-use-this
  async createManyWithTx(
    data: DeepPartial<SmartScaleWeighingD>[],
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<SmartScaleWeighingD[]> {
    const items = queryRunner.manager.create(
      SmartScaleWeighingD,
      data.map<DeepPartial<SmartScaleWeighingD>>((input) => ({
        ...input,
        id: input.id || randomHexString(),
        createdBy: user.id,
        createdDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
      })),
    );

    const result = await queryRunner.manager.save(SmartScaleWeighingD, items);

    return result;
  }
}
