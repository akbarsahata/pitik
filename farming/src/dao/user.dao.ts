import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  DeepPartial,
  EntityNotFoundError,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
  Repository,
} from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { AutoNumbering } from '../datasources/entity/pgsql/AutoNumbering.entity';
import { FarmingCycleMemberD } from '../datasources/entity/pgsql/FarmingCycleMemberD.entity';
import { User } from '../datasources/entity/pgsql/User.entity';
import { OperatorTypeEnum } from '../dto/farmingCycle.dto';
import { SelfRegisCoopOperatorBody } from '../dto/selfRegistration.dto';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_USER_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { generateHashCMS, generateUserOperatorCode, randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class UserDAO extends BaseSQLDAO<User> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  protected repository: Repository<User>;

  private fcmdRepository: Repository<FarmingCycleMemberD>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(User);
    this.fcmdRepository = this.pSql.connection.getRepository(FarmingCycleMemberD);
  }

  async getOneById(id: string): Promise<User> {
    try {
      const user = await this.repository.findOneOrFail({
        where: { id },
        relations: { branch: true },
      });

      return user;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_USER_NOT_FOUND();
      }

      throw error;
    }
  }

  async getOne(params: FindOneOptions<User>): Promise<User | null> {
    const user = await this.repository.findOne(params);

    return user;
  }

  async getOneStrict(params: FindOneOptions<User>): Promise<User> {
    try {
      const po = await this.repository.findOneOrFail(params);

      return po;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_USER_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getUserOperatorNotInFarmingCycle(ownerId: string, farmingCycleId: string): Promise<User[]> {
    const fcmdSubQuery = this.fcmdRepository
      .createQueryBuilder('fcmd')
      .select('fcmd.ref_user_id')
      .where('fcmd.ref_farmingcycle_id = :farmingCycleId')
      .setParameters({
        farmingCycleId,
      });

    const users = this.repository
      .createQueryBuilder('u')
      .where('u.ref_owner_id = :ownerId', { ownerId })
      .andWhere('u.status = 1')
      .andWhere(`u.id NOT IN (${fcmdSubQuery.getQuery()})`)
      .setParameters(fcmdSubQuery.getParameters())
      .orderBy('u.user_type', 'ASC') // poultry leader -> poultry worker
      .getMany();

    return users;
  }

  async registerCoopOperator(data: SelfRegisCoopOperatorBody, owner: User): Promise<User> {
    const queryRunner = this.pSql.connection.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const operatorNumbering = await queryRunner.manager.findOneOrFail(AutoNumbering, {
        where: {
          transactionType: data.role,
        },
      });

      const password = await generateHashCMS(data.password);

      const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

      const userOperator = queryRunner.manager.create(User, {
        password,
        id: randomHexString(),
        userCode: generateUserOperatorCode(
          operatorNumbering.lastNumber,
          operatorNumbering.digitCount,
          operatorNumbering.prefix,
          owner.userCode,
        ),
        userType: data.role === OperatorTypeEnum.KK ? 'poultry leader' : 'poultry worker',
        status: true,
        phoneNumber: data.phoneNumber,
        waNumber: data.phoneNumber,
        fullName: data.fullName,
        ownerId: owner.id,
        createdBy: owner.id,
        createdDate: now,
        modifiedBy: owner.id,
        modifiedDate: now,
      });

      await queryRunner.manager.save(User, userOperator);

      await queryRunner.manager.update(AutoNumbering, operatorNumbering.id, {
        lastNumber: () => 'last_number + 1',
      });

      await queryRunner.commitTransaction();

      return userOperator;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: DeepPartial<User>,
    requestMaker: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<User> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const user = queryRunner.manager.create(User, {
      ...data,
      id: randomHexString(),
      password: await generateHashCMS(data.password || ''),
      createdBy: requestMaker.id,
      createdDate: now,
      modifiedBy: requestMaker.id,
      modifiedDate: now,
    });

    const newUser = await queryRunner.manager.save(User, user);

    await Promise.all(transactionHooks?.map((trxHook) => trxHook(user)) ?? []);

    return newUser;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<User>,
    data: DeepPartial<User>,
    requestMaker: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<User> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(User, params, {
      ...data,
      modifiedBy: requestMaker.id,
      modifiedDate: now,
    });

    const updatedUser = await queryRunner.manager.findOneOrFail(User, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    const promises = transactionHooks?.map((trxHook) => trxHook(updatedUser, queryRunner));
    await Promise.all(promises || []);

    return updatedUser;
  }

  async updateOne(params: FindOptionsWhere<User>, data: DeepPartial<User>, user: RequestUser) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const result = await this.repository.update(params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    if (!result.affected) {
      throw ERR_USER_NOT_FOUND();
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
