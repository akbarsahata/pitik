/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { UsersInOperationUnit } from '../../datasources/entity/pgsql/sales/UsersInOperationUnit.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_SALES_USERS_IN_OPERATION_UNIT_UPSERT_FAILED } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class UsersInOperationUnitDAO extends BaseSQLDAO<UsersInOperationUnit> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(UsersInOperationUnit);
  }

  async createManyWithTx(
    data: DeepPartial<UsersInOperationUnit>[],
    _user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<UsersInOperationUnit[]> {
    const items = queryRunner.manager.create(
      UsersInOperationUnit,
      data.map<DeepPartial<UsersInOperationUnit>>((input) => ({
        ...input,
      })),
    );

    const result = await queryRunner.manager.save(UsersInOperationUnit, items);

    return result;
  }

  async softDeleteManyWithTx(
    where: FindOptionsWhere<UsersInOperationUnit>,
    queryRunner: QueryRunner,
  ): Promise<UsersInOperationUnit[]> {
    const toBeDeleted = await queryRunner.manager.find(UsersInOperationUnit, { where });

    await queryRunner.manager.softDelete(UsersInOperationUnit, where);

    return toBeDeleted;
  }

  async upsertMany(
    user: RequestUser,
    items: DeepPartial<UsersInOperationUnit>[],
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<UsersInOperationUnit[]> {
    if (items.length === 0) return [];

    const operationUnitId = items[0].salesOperationUnitId;
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItems = items.map<DeepPartial<UsersInOperationUnit>>((item) => ({
      ...item,
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
      deletedDate: null,
    }));

    await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .insert()
      .into(UsersInOperationUnit)
      .values(upsertItems)
      .orUpdate(
        ['modified_by', 'modified_date', 'deleted_date'],
        ['ref_sales_operation_unit_id', 'ref_user_id'],
      )
      .execute();

    const [results, count] = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('ref_sales_operation_unit_id = :operationUnitId', { operationUnitId })
      .andWhere('ref_user_id IN (:...userIds)', {
        userIds: upsertItems.map((p) => p.userId),
      })
      .getManyAndCount();

    if (count !== upsertItems.length) {
      throw ERR_SALES_USERS_IN_OPERATION_UNIT_UPSERT_FAILED('result count not match');
    }

    return results;
  }
}
