/* eslint-disable class-methods-use-this */
import { randomUUID } from 'crypto';
import { hoursToSeconds } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { Between, DeepPartial, FindOptionsWhere, In, IsNull, Not, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { RedisConnection } from '../../datasources/connection/redis.connection';
import {
  OperationUnitStock,
  STOCK_OPERATOR,
  STOCK_STATUS,
} from '../../datasources/entity/pgsql/sales/OperationUnitStock.entity';
import { LatestStockItem } from '../../dto/sales/operationUnit.dto';
import {
  DEFAULT_TIME_ZONE,
  SALES_CACHE_PATTERN,
  SALES_PRODUCT_CATEGORY_GROUP,
} from '../../libs/constants';
import {
  ERR_SALES_BOOK_STOCK_INSUFFICIENT_STOCK,
  ERR_SALES_OPERATION_UNIT_STOCK_UPSERT_FAILED,
  ERR_SALES_REVERSE_STOCK,
} from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';
import { OperationUnitLatestStockDAO } from './operationUnitLatestStock.dao';
import { ProductItemDAO } from './productItem.dao';

type BookStockProduct = {
  productItemId: string;
  quantity: number;
  weight: number;
};

type BookStockType = {
  salesOrderId?: string;
  internalTransferId?: string;
  stockDisposalId?: string;
  manufacturingId?: string;
  goodsReceivedId?: string;
  // TODO: add more ids...
};

@Service()
export class OperationUnitStockDAO extends BaseSQLDAO<OperationUnitStock> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Inject(RedisConnection)
  private redis: RedisConnection;

  @Inject(ProductItemDAO)
  private productItemDAO: ProductItemDAO;

  @Inject(OperationUnitLatestStockDAO)
  private operationUnitLatestStockDAO: OperationUnitLatestStockDAO;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(OperationUnitStock);
  }

  async upsertMany(
    user: RequestUser,
    items: DeepPartial<OperationUnitStock>[],
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<OperationUnitStock[]> {
    if (items.length === 0) return [];

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItems = items.map<DeepPartial<OperationUnitStock>>((item) => ({
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
      .into(OperationUnitStock)
      .values(upsertItems)
      .orUpdate(
        [
          'quantity',
          'weight',
          'available_quantity',
          'available_weight',
          'status',
          'modified_by',
          'modified_date',
          'deleted_date',
          'price',
          'city_based_price',
        ],
        ['id'],
      )
      .execute();

    const [results, count] = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('id IN (:...ids)', { ids: upsertItems.map((item) => item.id) })
      .getManyAndCount();

    if (count !== upsertItems.length) {
      throw ERR_SALES_OPERATION_UNIT_STOCK_UPSERT_FAILED('result count not match');
    }

    return results;
  }

  async softDeleteManyWithTx(
    where: FindOptionsWhere<OperationUnitStock>,
    queryRunner: QueryRunner,
  ): Promise<OperationUnitStock[]> {
    const toBeDeleted = await queryRunner.manager.find(OperationUnitStock, { where });

    await queryRunner.manager.softDelete(OperationUnitStock, where);

    return toBeDeleted;
  }

  async calculateStock(operationUnitId: string): Promise<LatestStockItem[]> {
    type RawItem = {
      productitemid: string;
      operator: STOCK_OPERATOR;
      status: STOCK_STATUS;
      quantity: number;
      weight: number;
    };

    // get from cache
    const cacheKey = SALES_CACHE_PATTERN.LATEST_STOCK.replace('$operationUnitId', operationUnitId);
    const cached = await this.redis.connection.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const latestOpname = await this.getOne({
      where: {
        operationUnitId,
        opnameId: Not(IsNull()),
        status: STOCK_STATUS.FINAL,
      },
      order: {
        createdDate: 'DESC',
      },
    });

    // calculate from db
    const sql = this.repository
      .createQueryBuilder('stock')
      .select([
        'stock.ref_product_item_id as productitemid',
        'stock."operator" as "operator"',
        'stock.status as status',
        'sum(stock.quantity::int)::int as quantity',
        'sum(stock.weight)::float4 as weight',
      ])
      .where('stock.ref_operation_unit_id = :operationUnitId', { operationUnitId })
      .groupBy('stock."operator"')
      .addGroupBy('stock.ref_product_item_id')
      .addGroupBy('stock.status');

    if (latestOpname) {
      // calculate stock since latest opname
      sql.andWhere('stock.created_date >= :createdDate', latestOpname);
    }

    const stocks = (await sql.getRawMany()) as RawItem[];

    const latestStocks = new Map<string, LatestStockItem>();

    const mappedByProductAndStatus = stocks.reduce((prev, item) => {
      latestStocks.set(item.productitemid, {
        productItemId: item.productitemid,
        availableQuantity: 0,
        availableWeight: 0,
        reservedQuantity: 0,
        reservedWeight: 0,
        totalQuantity: 0,
        totalWeight: 0,
      });
      prev.set(`${item.productitemid}_${item.status}_${item.operator}`, item);
      return prev;
    }, new Map<string, RawItem>());

    latestStocks.forEach((_, key) => {
      const inputRow = mappedByProductAndStatus.get(
        `${key}_${STOCK_STATUS.FINAL}_${STOCK_OPERATOR.PLUS}`,
      );
      const reservedRow = mappedByProductAndStatus.get(
        `${key}_${STOCK_STATUS.RESERVED}_${STOCK_OPERATOR.MINUS}`,
      );
      const outputRow = mappedByProductAndStatus.get(
        `${key}_${STOCK_STATUS.FINAL}_${STOCK_OPERATOR.MINUS}`,
      );

      latestStocks.set(key, {
        productItemId: key,
        reservedQuantity: reservedRow?.quantity || 0,
        reservedWeight: reservedRow?.weight || 0,
        totalQuantity: (inputRow?.quantity || 0) - (outputRow?.quantity || 0),
        totalWeight: (inputRow?.weight || 0) - (outputRow?.weight || 0),
        availableQuantity:
          (inputRow?.quantity || 0) - (reservedRow?.quantity || 0) - (outputRow?.quantity || 0),
        availableWeight:
          (inputRow?.weight || 0) - (reservedRow?.weight || 0) - (outputRow?.weight || 0),
      });
    });

    const values = Array.from(latestStocks.values());

    await Promise.all([
      // cache result to redis
      this.redis.connection.set(cacheKey, JSON.stringify(values), 'EX', hoursToSeconds(24)),

      // store result to table operation_unit_latest_stock for reporting purpose (Metabase)
      this.operationUnitLatestStockDAO.storeLatestStock(operationUnitId, values),
    ]);

    return values;
  }

  async clearLatestStockCache(operationUnitId: string) {
    const cacheKey = SALES_CACHE_PATTERN.LATEST_STOCK.replace('$operationUnitId', operationUnitId);
    await this.redis.connection.del(cacheKey);

    await this.calculateStock(operationUnitId);
  }

  async bookStock(opts: {
    operationUnitId: string;
    products: BookStockProduct[];
    qr: QueryRunner;
    user: RequestUser;
    bookType: BookStockType;
  }) {
    const mapIdToRequestedProduct = opts.products.reduce((prev, item) => {
      // handle duplicate product request
      const prevRequest = prev.get(item.productItemId);

      prev.set(item.productItemId, {
        productItemId: item.productItemId,
        quantity: item.quantity + (prevRequest?.quantity || 0),
        weight: item.weight + (prevRequest?.weight || 0),
      });

      return prev;
    }, new Map<string, BookStockProduct>());
    const latestOpname = await this.getOne({
      where: {
        operationUnitId: opts.operationUnitId,
        opnameId: Not(IsNull()),
      },
      order: {
        createdDate: 'DESC',
      },
    });

    const sql = this.repository
      .createQueryBuilder(undefined, opts.qr)
      .select()
      .where('ref_operation_unit_id = :operationUnitId', {
        operationUnitId: opts.operationUnitId,
      })
      .andWhere('"operator" = :operator', { operator: STOCK_OPERATOR.PLUS })
      .andWhere('ref_product_item_id IN (:...productIds)', {
        productIds: Array.from(mapIdToRequestedProduct.keys()),
      })
      .andWhere('(available_quantity > 0 OR available_weight > 0)')
      .orderBy('created_date', 'ASC');

    if (latestOpname) {
      // fetch data since latest opname
      sql.andWhere('created_date >= :createdDate', latestOpname);
    }

    const availableStocks = await sql.getMany();

    const mapAvailableStockByProductItemId = availableStocks.reduce((prev, item) => {
      const temp = prev.get(item.productItemId) || [];

      temp.push(item);

      prev.set(item.productItemId, temp);

      return prev;
    }, new Map<string, OperationUnitStock[]>());

    const bookStocks: DeepPartial<OperationUnitStock>[] = [];
    const updateStockRows: OperationUnitStock[] = [];

    const [productItems] = await this.productItemDAO.getMany({
      relations: {
        category: true,
      },
    });

    mapIdToRequestedProduct.forEach((productRequest, productItemId) => {
      const stocks = mapAvailableStockByProductItemId.get(productItemId);

      if (!stocks || stocks.length === 0) {
        throw ERR_SALES_BOOK_STOCK_INSUFFICIENT_STOCK(
          `Produk: ${productItems.find((p) => p.id === productItemId)?.name}`,
        );
      }

      const remainingRequest = productRequest;
      for (let i = 0; i < stocks.length; i += 1) {
        const row = stocks[i];

        let fulfilledQty = 0;
        if (remainingRequest.quantity <= row.availableQuantity) {
          fulfilledQty = remainingRequest.quantity;
          row.availableQuantity -= remainingRequest.quantity;
          remainingRequest.quantity = 0;
        } else {
          fulfilledQty = row.availableQuantity;
          remainingRequest.quantity -= row.availableQuantity;
          row.availableQuantity = 0;
        }

        let fulfilledWeight = 0;
        if (remainingRequest.weight <= row.availableWeight) {
          fulfilledWeight = remainingRequest.weight;
          row.availableWeight -= remainingRequest.weight;
          remainingRequest.weight = 0;
        } else {
          fulfilledWeight = row.availableWeight;
          remainingRequest.weight -= row.availableWeight;
          row.availableWeight = 0;
        }

        bookStocks.push({
          operationUnitId: opts.operationUnitId,
          productItemId,
          parentId: row.id,
          quantity: fulfilledQty,
          weight: fulfilledWeight,
          status: STOCK_STATUS.RESERVED,
          operator: STOCK_OPERATOR.MINUS,
          price: row.price,
          cityBasedPrice: row.cityBasedPrice,
          ...opts.bookType,
        });
        updateStockRows.push(row);

        if (remainingRequest.quantity === 0 && remainingRequest.weight === 0) {
          break;
        }
      }

      const productCategoryCode = productItems.find((p) => p.id === productItemId)?.category.code;

      if (
        remainingRequest.weight > 0 &&
        !SALES_PRODUCT_CATEGORY_GROUP.QUANTITY.some((code) => code === productCategoryCode)
      ) {
        throw ERR_SALES_BOOK_STOCK_INSUFFICIENT_STOCK(
          `Produk: ${productItems.find((p) => p.id === productItemId)?.name}`,
        );
      }

      if (
        remainingRequest.quantity > 0 &&
        SALES_PRODUCT_CATEGORY_GROUP.QUANTITY.some((code) => code === productCategoryCode)
      ) {
        throw ERR_SALES_BOOK_STOCK_INSUFFICIENT_STOCK(
          `Produk: ${productItems.find((p) => p.id === productItemId)?.name}`,
        );
      }
    });

    const products = await this.upsertMany(opts.user, [...bookStocks, ...updateStockRows], {
      qr: opts.qr,
    });

    return products;
  }

  async cancelBookStock(opts: { user: RequestUser; bookType: BookStockType; qr: QueryRunner }) {
    const [stocks] = await this.getMany({
      where: {
        ...opts.bookType,
        status: STOCK_STATUS.RESERVED,
      },
    });

    const [parentStocks] = await this.getMany({
      where: {
        id: In(stocks.map((stock) => stock.parentId)),
      },
    });

    const mapParentStockById = parentStocks.reduce((prev, item) => {
      prev.set(item.id, item);
      return prev;
    }, new Map<string, OperationUnitStock>());

    for (let i = 0; i < stocks.length; i += 1) {
      const stock = stocks[i];

      const parentStock = mapParentStockById.get(stock.parentId!)!;

      parentStock.availableQuantity += stock.quantity;
      parentStock.availableWeight += stock.weight;

      mapParentStockById.set(stock.parentId!, parentStock);
    }

    await this.upsertMany(
      opts.user,
      [
        ...stocks.map((stock) => ({
          ...stock,
          status: STOCK_STATUS.CANCELLED,
        })),
        ...Array.from(mapParentStockById.values()),
      ],
      opts,
    );
  }

  async releaseBookedStock(opts: { qr: QueryRunner; user: RequestUser; bookType: BookStockType }) {
    const [stocks] = await this.getMany({
      where: {
        ...opts.bookType,
        status: STOCK_STATUS.RESERVED,
      },
    });

    await this.upsertMany(
      opts.user,
      stocks.map((stock) => ({
        ...stock,
        status: STOCK_STATUS.FINAL,
      })),
      opts,
    );
  }

  /**
   * reverse stock with status = FINAL
   * to status RESERVED or CANCELLED
   *
   * stock with operator PLUS can be cancelled if quantity
   * and weight not in use by other transaction.
   * - gr
   * - manufacture output
   *
   * stock with operator MINUS depend on the transaction
   * - stock disposal: reversable without further check
   * - manufacture input: reversable as long as manufacture output is reversable
   * - sales order: irreversable
   */
  async reverseFinalStock(opts: {
    qr: QueryRunner;
    user: RequestUser;
    bookType: BookStockType;
    operator: STOCK_OPERATOR;
    reverseToStatus: STOCK_STATUS.RESERVED | STOCK_STATUS.CANCELLED;
  }) {
    const [stocks] = await this.getMany({
      where: {
        ...opts.bookType,
        operator: opts.operator,
        status: STOCK_STATUS.FINAL,
      },
    });

    const [parentStocks] = await this.getMany({
      where: {
        id: In(stocks.map((stock) => stock.parentId)),
      },
    });

    const mapParentStockById = parentStocks.reduce((prev, item) => {
      prev.set(item.id, item);
      return prev;
    }, new Map<string, OperationUnitStock>());

    for (let i = 0; i < stocks.length; i += 1) {
      const stock = stocks[i];

      if (
        opts.operator === STOCK_OPERATOR.PLUS &&
        (stock.quantity !== stock.availableQuantity || stock.weight !== stock.availableWeight)
      ) {
        throw ERR_SALES_REVERSE_STOCK();
      } else if (
        opts.operator === STOCK_OPERATOR.MINUS &&
        !stock.stockDisposalId &&
        !stock.manufacturingId
      ) {
        // TODO: add more reversible whitelist
        throw ERR_SALES_REVERSE_STOCK();
      }

      if (
        opts.operator === STOCK_OPERATOR.MINUS &&
        stock.parentId &&
        opts.reverseToStatus === STOCK_STATUS.CANCELLED
      ) {
        const parentStock = mapParentStockById.get(stock.parentId!)!;

        parentStock.availableQuantity += stock.quantity;
        parentStock.availableWeight += stock.weight;

        mapParentStockById.set(stock.parentId!, parentStock);
      }
    }

    await this.upsertMany(
      opts.user,
      [
        ...stocks.map((stock) => ({
          ...stock,
          status: opts.reverseToStatus,
        })),
        ...Array.from(mapParentStockById.values()),
      ],
      opts,
    );
  }

  async createOpname(opts: {
    opnameId: string;
    operationUnitId: string;
    products: BookStockProduct[];
    qr: QueryRunner;
    user: RequestUser;
  }): Promise<OperationUnitStock[]> {
    const latestOpname = await this.getOne({
      where: {
        operationUnitId: opts.operationUnitId,
      },
      order: {
        createdDate: 'DESC',
      },
    });

    const [latestStockBeforeOpname] = await this.getMany({
      where: {
        operationUnitId: opts.operationUnitId,
        createdDate: latestOpname?.createdDate && Between(latestOpname.createdDate, new Date()),
      },
    });

    const mapLatestStock = latestStockBeforeOpname.reduce((prev, item) => {
      const existing = prev.get(item.productItemId);

      // TODO: confirm this logic
      // if the product item has multiple row in book stock
      // then get the greater price
      if (!existing || !existing.price || existing.price < (item.price || 0)) {
        prev.set(item.productItemId, item);
      }

      return prev;
    }, new Map<string, OperationUnitStock>());

    const stocks = await this.upsertMany(
      opts.user,
      opts.products.map((product) => ({
        ...product,
        operationUnitId: opts.operationUnitId,
        availableQuantity: product.quantity,
        availableWeight: product.weight,
        status: STOCK_STATUS.FINAL,
        opnameId: opts.opnameId,
        operator: STOCK_OPERATOR.PLUS,
        price: mapLatestStock.get(product.productItemId)?.price || 0,
        cityBasedPrice: mapLatestStock.get(product.productItemId)?.cityBasedPrice || 0,
      })),
      {
        qr: opts.qr,
      },
    );

    return stocks;
  }
}
