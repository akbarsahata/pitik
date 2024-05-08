import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOneOptions, FindOptionsWhere, QueryRunner, Repository } from 'typeorm';
import { utcToZonedTime } from 'date-fns-tz';
import { randomUUID } from 'crypto';
import { Role } from '../datasources/entity/pgsql/Role.entity';
import { ERR_RECORD_NOT_FOUND, ERR_USER_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { CACHE_KEY_AUTH_VERIFY, DEFAULT_TIME_ZONE } from '../libs/constants';
import { User } from '../datasources/entity/pgsql/User.entity';
import { BaseSQLDAO } from './base.dao';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { UserRole } from '../datasources/entity/pgsql/UserRole.entity';
import { RedisConnection } from '../datasources/connection/redis.connection';
import { Logger } from '../libs/utils/logger';

@Service()
export class UserDAO extends BaseSQLDAO<User> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Inject(RedisConnection)
  private redisConnection: RedisConnection;

  protected repository: Repository<User>;

  @Inject(Logger)
  private logger: Logger;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(User);
  }

  async getOneStrict(params: FindOneOptions<User>): Promise<User> {
    try {
      const user = await this.repository.findOneOrFail(params);

      return user;
    } catch (error) {
      throw ERR_RECORD_NOT_FOUND();
    }
  }

  async upsertOne(
    user: RequestUser,
    item: DeepPartial<User>,
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<User> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItem: DeepPartial<User> = {
      ...item,
      id: item.id ? item.id : randomUUID(),
      createdBy: user?.id ? user.id : 'system',
      createdDate: now,
      modifiedBy: user?.id ? user.id : 'system',
      modifiedDate: now,
    };

    await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .insert()
      .into(User)
      .values(upsertItem)
      .orUpdate(
        [
          'full_name',
          'email',
          'phone',
          'password',
          'status',
          'lang',
          'accept_tnc',
          'parent_id',
          'role_id',
          'organization_id',
          'modified_by',
          'modified_date',
        ],
        ['id'],
      )
      .execute();

    const [updatedUser] = await Promise.all([
      this.repository
        .createQueryBuilder(undefined, opts && opts.qr)
        .where('id = :id', { id: upsertItem.id })
        .getOneOrFail(),
      this.clearUserCache(upsertItem.id!),
    ]);

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

    await this.clearUserCache(updated.id);

    return updated;
  }

  async getUserByIdCms(idCms: string): Promise<User> {
    const user = await this.repository
      .createQueryBuilder('user')
      .leftJoinAndMapOne('user.role', Role, 'role', 'role.id = user.role_id')
      // eslint-disable-next-line quotes
      .where(`user.additional ->> 'id_cms' = :idCms`, { idCms })
      .getOneOrFail();

    return user;
  }

  async searchUserIds(filter: { roleIds?: string[] }): Promise<[User[], number]> {
    const sql = await this.repository
      .createQueryBuilder('user')
      .select(['user.id', 'user.additional'])
      .where('1=1')
      .leftJoin(UserRole, 'user_role', 'user_role.user_id = user.id');

    if (filter.roleIds) {
      sql.andWhere('(user.role_id IN (:...roleIds) OR user_role.role_id IN (:...roleIds))', filter);
    }

    const [users, count] = await sql.getManyAndCount();

    return [users, count];
  }

  async clearUserCache(userId: string) {
    try {
      await this.redisConnection.connection.del(`${CACHE_KEY_AUTH_VERIFY.USER}:${userId}`);
    } catch (error) {
      this.logger.error(error, 'Error when clearing user cache');
    }
  }
}
