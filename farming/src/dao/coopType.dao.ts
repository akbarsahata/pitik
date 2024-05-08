import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  EntityNotFoundError,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { CoopType } from '../datasources/entity/pgsql/CoopType.entity';
import { User } from '../datasources/entity/pgsql/User.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_COOP_TYPE_NOT_FOUND } from '../libs/constants/errors';
import { randomHexString } from '../libs/utils/helpers';

@Service()
export class CoopTypeDAO {
  @Inject(PostgreSQLConnection)
  private pSql!: PostgreSQLConnection;

  private repository!: Repository<CoopType>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(CoopType);
  }

  async getOneById(id: string): Promise<CoopType> {
    try {
      return this.repository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_COOP_TYPE_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getAll(params?: FindManyOptions<CoopType>): Promise<[CoopType[], number]> {
    return this.repository.findAndCount(params);
  }

  async getOne(params: FindOneOptions<CoopType>): Promise<CoopType | null> {
    return this.repository.findOne(params);
  }

  async getOneStrict(params: FindOneOptions<CoopType>): Promise<CoopType> {
    try {
      const coopType = await this.repository.findOneOrFail(params);

      return coopType;
    } catch (error) {
      throw ERR_COOP_TYPE_NOT_FOUND();
    }
  }

  async createOne(
    input: Partial<CoopType>,
    userRequest: Partial<User>,
    transactionHooks?: Function[],
  ): Promise<CoopType> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const queryRunner = this.pSql.connection.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const coopType = queryRunner.manager.create(CoopType, {
        ...input,
        id: randomHexString(),
        createdBy: userRequest.id,
        createdDate: now,
        modifiedBy: userRequest.id,
        modifiedDate: now,
      });

      const result = await queryRunner.manager.save(CoopType, coopType);

      await Promise.all(transactionHooks?.map((trxHook) => trxHook(coopType)) ?? []);

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateOne(
    params: FindOptionsWhere<CoopType>,
    data: Partial<CoopType>,
    user: Partial<User>,
  ): Promise<CoopType> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const result = await this.repository.update(params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    if (!result.affected) {
      throw ERR_COOP_TYPE_NOT_FOUND();
    }

    return this.repository.findOneOrFail({
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });
  }
}
