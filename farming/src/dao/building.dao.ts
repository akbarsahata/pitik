import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOneOptions, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Building } from '../datasources/entity/pgsql/Building.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_BUILDING_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class BuildingDAO extends BaseSQLDAO<Building> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(Building);
  }

  async getOneStrict(params: FindOneOptions<Building>): Promise<Building> {
    try {
      const building = await this.repository.findOneOrFail(params);

      return building;
    } catch (error) {
      throw ERR_BUILDING_NOT_FOUND();
    }
  }

  async upsertOne(
    user: RequestUser,
    item: DeepPartial<Building>,
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<Building> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItem: DeepPartial<Building> = {
      ...item,
      id: item.id || randomHexString(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    };

    await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .insert()
      .into(Building)
      .values(upsertItem)
      .orUpdate(
        [
          'name',
          'is_active',
          'length',
          'width',
          'height',
          'farm_id',
          'building_type_id',
          'modified_by',
          'modified_date',
        ],
        ['id'],
      )
      .execute();

    return this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('id = :id', { id: upsertItem.id })
      .getOneOrFail();
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: Partial<Building>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<Building> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const item = queryRunner.manager.create(Building, {
      ...data,
      id: randomHexString(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const newBuilding = await queryRunner.manager.save(Building, item);

    return newBuilding;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<Building>,
    data: Partial<Building>,
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<Building> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const updatedCoop = await queryRunner.manager.findOneOrFail(Building, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    await queryRunner.manager.update(Building, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const promises = transactionHooks?.map((trxHook) => trxHook(updatedCoop, queryRunner));
    await Promise.all(promises || []);

    return {
      ...updatedCoop,
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteOneWithTx(
    params: FindOptionsWhere<Building>,
    queryRunner: QueryRunner,
  ): Promise<Building> {
    const toBeDeleted = await queryRunner.manager.findOneOrFail(Building, { where: params });

    await queryRunner.manager.delete(Building, {
      id: toBeDeleted.id,
    });

    return toBeDeleted;
  }
}
