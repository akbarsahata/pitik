import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  EntityNotFoundError,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { User } from '../datasources/entity/pgsql/User.entity';
import { CreateChickTypeBody } from '../dto/chickType.dto';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { randomHexString } from '../libs/utils/helpers';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { ChickType } from '../datasources/entity/pgsql/ChickType.entity';
import { ERR_CHICK_TYPE_NOT_FOUND } from '../libs/constants/errors';

@Service()
export class ChickTypeDAO {
  @Inject(PostgreSQLConnection)
  private pSql!: PostgreSQLConnection;

  private repository: Repository<ChickType>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(ChickType);
  }

  async getOneById(id: string): Promise<ChickType> {
    try {
      const user = await this.repository.findOneOrFail({ where: { id } });

      return user;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_CHICK_TYPE_NOT_FOUND();
      }

      throw error;
    }
  }

  async getOne(params: FindOneOptions<ChickType>): Promise<ChickType | null> {
    const user = await this.repository.findOne(params);

    return user;
  }

  async getMany(params: FindManyOptions<ChickType>): Promise<ChickType[]> {
    return this.repository.find(params);
  }

  async getManyAndCount(params: FindManyOptions<ChickType>): Promise<[ChickType[], number]> {
    return this.repository.findAndCount(params);
  }

  async createOne(
    input: CreateChickTypeBody,
    user: Partial<User>,
    transactionHooks?: Function[],
  ): Promise<ChickType> {
    const queryRunner = this.pSql.connection.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
      const chickType = queryRunner.manager.create(ChickType, {
        ...input,
        id: randomHexString(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      });

      const result = await queryRunner.manager.save(ChickType, chickType);

      await Promise.all(transactionHooks?.map((trxHook) => trxHook(chickType)) ?? []);

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
    params: FindOptionsWhere<ChickType>,
    data: Partial<ChickType>,
    user: Partial<User>,
  ): Promise<ChickType> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const result = await this.repository.update(params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    if (!result.affected) {
      throw ERR_CHICK_TYPE_NOT_FOUND();
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
}
