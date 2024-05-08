import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner, Repository } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Role } from '../datasources/entity/pgsql/Role.entity';
import { RoleRank } from '../datasources/entity/pgsql/RoleRank.entity';
import { UserRole } from '../datasources/entity/pgsql/UserRole.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class UserRoleDAO extends BaseSQLDAO<UserRole> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  protected repository: Repository<UserRole>;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(UserRole);
  }

  async upsertMany(
    user: RequestUser,
    items: DeepPartial<UserRole>[],
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<UserRole[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItems: DeepPartial<UserRole>[] = items.map((item) => ({
      ...item,
      createdBy: user?.id ? user.id : 'system',
      createdDate: now,
      modifiedBy: user?.id ? user.id : 'system',
      modifiedDate: now,
      deletedDate: null,
    }));

    await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .insert()
      .into(UserRole)
      .values(upsertItems)
      .orUpdate(['modified_by', 'modified_date', 'deleted_date'], ['role_id', 'user_id'])
      .execute();

    const query = this.repository.createQueryBuilder('ur', opts && opts.qr);
    for (let i = 0; i < upsertItems.length; i += 1) {
      const item = upsertItems[i];

      const param = {} as any;
      param[`userId${i}`] = item.userId;
      param[`roleId${i}`] = item.roleId;

      if (i === 0) {
        query.where(`(user_id = :userId${i} AND role_id = :roleId${i})`, param);
      } else {
        query.orWhere(`(user_id = :userId${i} AND role_id = :roleId${i})`, param);
      }
    }

    return query
      .leftJoinAndMapOne('ur.role', Role, 'r', 'r.id = ur.role_id')
      .leftJoinAndMapMany('r.roleRank', RoleRank, 'rr', 'rr.ref_role_id = r.id')
      .getMany();
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteManyWithTx(
    where: FindOptionsWhere<UserRole>,
    queryRunner: QueryRunner,
  ): Promise<UserRole[]> {
    const toBeDeleted = await queryRunner.manager.find(UserRole, { where });

    await queryRunner.manager.softDelete(UserRole, where);

    return toBeDeleted;
  }
}
