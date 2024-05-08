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
import { ERR_USER_REGISTRATION_RECORD_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { UserRegister } from '../datasources/entity/pgsql/UserRegister.entity';
import { BaseSQLDAO } from './base.dao';

@Service()
export class UserRegisterDAO extends BaseSQLDAO<UserRegister> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  protected repository: Repository<UserRegister>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(UserRegister);
  }

  async getOneStrict(params: FindOneOptions<UserRegister>): Promise<UserRegister> {
    try {
      const userRegistration = await this.repository.findOneOrFail(params);

      return userRegistration;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_USER_REGISTRATION_RECORD_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<UserRegister>,
    data: DeepPartial<UserRegister>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<UserRegister> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(UserRegister, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const updatedRegisterUser = await queryRunner.manager.findOneOrFail(UserRegister, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updatedRegisterUser;
  }
}
