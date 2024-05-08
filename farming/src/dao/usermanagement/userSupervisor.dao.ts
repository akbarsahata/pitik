import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner, Repository } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { UserSupervisor } from '../../datasources/entity/pgsql/usermanagement/UserSupervisor.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_SUPERVISOR_UPSERT_FAILED } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class UserSupervisorDAO extends BaseSQLDAO<UserSupervisor> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  protected repository: Repository<UserSupervisor>;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(UserSupervisor);
  }

  async upsertMany(
    user: RequestUser,
    items: DeepPartial<UserSupervisor>[],
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<UserSupervisor[]> {
    if (items.length === 0) return [];

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItems: DeepPartial<UserSupervisor>[] = items.map((item) => ({
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
      .into(UserSupervisor)
      .values(upsertItems)
      .orUpdate(
        ['modified_by', 'modified_date', 'deleted_date'],
        ['subordinate_id', 'supervisor_id', 'context'],
      )
      .execute();

    const [supervisors, count] = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('subordinate_id = :subordinateId', { subordinateId: upsertItems[0].subordinateId })
      .getManyAndCount();

    if (count !== upsertItems.length) {
      throw ERR_SUPERVISOR_UPSERT_FAILED('result count not match');
    }

    return supervisors;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteManyWithTx(
    where: FindOptionsWhere<UserSupervisor>,
    queryRunner: QueryRunner,
  ): Promise<UserSupervisor[]> {
    const toBeDeleted = await queryRunner.manager.find(UserSupervisor, { where });

    await queryRunner.manager.softDelete(UserSupervisor, where);

    return toBeDeleted;
  }
}
