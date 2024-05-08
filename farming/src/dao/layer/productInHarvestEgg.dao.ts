/* eslint-disable class-methods-use-this */
import { randomUUID } from 'crypto';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { ProductInHarvestEgg } from '../../datasources/entity/pgsql/layer/ProductInHarvestEgg.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_DAILY_MONITORING_MORTALITY_UPSERT_FAILED } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class ProductInHarvestEggDAO extends BaseSQLDAO<ProductInHarvestEgg> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ProductInHarvestEgg);
  }

  async upsertMany(
    user: RequestUser,
    items: DeepPartial<ProductInHarvestEgg>[],
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<ProductInHarvestEgg[]> {
    if (items.length === 0) return [];

    const { harvestEggId } = items[0];
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItems = items.map<DeepPartial<ProductInHarvestEgg>>((item) => ({
      ...item,
      id: item.id || randomUUID(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
      deletedDate: null,
    }));

    await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .insert()
      .into(ProductInHarvestEgg)
      .values(upsertItems)
      .orUpdate(
        ['quantity', 'weight', 'modified_by', 'modified_date', 'deleted_date'],
        ['harvest_egg_id', 'product_item_id'],
      )
      .execute();

    const [results, count] = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('harvest_egg_id = :harvestEggId', { harvestEggId })
      .getManyAndCount();

    if (count !== upsertItems.length) {
      throw ERR_DAILY_MONITORING_MORTALITY_UPSERT_FAILED('result count not match');
    }

    return results;
  }

  async softDeleteManyWithTx(
    where: FindOptionsWhere<ProductInHarvestEgg>,
    queryRunner: QueryRunner,
  ): Promise<ProductInHarvestEgg[]> {
    const toBeDeleted = await queryRunner.manager.find(ProductInHarvestEgg, { where });

    await queryRunner.manager.softDelete(ProductInHarvestEgg, where);

    return toBeDeleted;
  }
}
