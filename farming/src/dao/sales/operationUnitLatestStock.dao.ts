/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { OperationUnitLatestStock } from '../../datasources/entity/pgsql/sales/OperationUnitLatestStock.entity';
import { ProductCategoryCodeEnum } from '../../datasources/entity/pgsql/sales/ProductCategory.entity';
import { LatestStockItem } from '../../dto/sales/operationUnit.dto';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { BaseSQLDAO } from '../base.dao';

type SumByCategory = Pick<
  OperationUnitLatestStock,
  | 'availableQuantity'
  | 'availableWeight'
  | 'totalQuantity'
  | 'totalWeight'
  | 'reservedQuantity'
  | 'reservedWeight'
> & {
  categoryCode: ProductCategoryCodeEnum;
};

@Service()
export class OperationUnitLatestStockDAO extends BaseSQLDAO<OperationUnitLatestStock> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(OperationUnitLatestStock);
  }

  async storeLatestStock(operationUnitId: string, values: LatestStockItem[]) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItems = values.map<DeepPartial<OperationUnitLatestStock>>((item) => ({
      operationUnitId,
      productItemId: item.productItemId,
      totalQuantity: item.totalQuantity,
      totalWeight: item.totalWeight,
      availableQuantity: item.availableQuantity,
      availableWeight: item.availableWeight,
      reservedQuantity: item.reservedQuantity,
      reservedWeight: item.reservedWeight,
      createdDate: now,
      modifiedDate: now,
    }));

    await this.repository
      .createQueryBuilder()
      .insert()
      .into(OperationUnitLatestStock)
      .values(upsertItems)
      .orUpdate(
        [
          'total_quantity',
          'total_weight',
          'available_quantity',
          'available_weight',
          'reserved_quantity',
          'reserved_weight',
          'modified_date',
        ],
        ['ref_operation_unit_id', 'ref_product_item_id'],
      )
      .execute();
  }

  // sum stock by category
  async sumStockByCategory(
    operationUnitId: string,
    categoryCode: ProductCategoryCodeEnum,
  ): Promise<SumByCategory> {
    const latestStocks = await this.repository.find({
      where: {
        operationUnitId,
        productItem: {
          category: {
            code: categoryCode,
          },
        },
      },
      relations: {
        productItem: {
          category: true,
        },
      },
    });

    return latestStocks.reduce(
      (prev, item) => ({
        availableQuantity: prev.availableQuantity + item.availableQuantity,
        availableWeight: prev.availableWeight + item.availableWeight,
        totalQuantity: prev.totalQuantity + item.totalQuantity,
        totalWeight: prev.totalWeight + item.totalWeight,
        reservedQuantity: prev.reservedQuantity + item.reservedQuantity,
        reservedWeight: prev.reservedWeight + item.reservedWeight,
        categoryCode,
      }),
      {
        availableQuantity: 0,
        availableWeight: 0,
        totalQuantity: 0,
        totalWeight: 0,
        reservedQuantity: 0,
        reservedWeight: 0,
        categoryCode,
      } as SumByCategory,
    );
  }
}
