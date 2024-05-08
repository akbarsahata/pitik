/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import {
  OperationUnit,
  OperationUnitCategoryEnum,
  OperationUnitTypeEnum,
} from '../../datasources/entity/pgsql/sales/OperationUnit.entity';
import {
  ProductCategory,
  ProductCategoryCodeEnum,
} from '../../datasources/entity/pgsql/sales/ProductCategory.entity';
import { ProductsInManufacture } from '../../datasources/entity/pgsql/sales/ProductsInManufacture.entity';
import { SalesManufactureProductCategoryBody } from '../../dto/sales/manufacture.dto';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import {
  ERR_SALES_MANUFACTURE_INVALID_INPUT,
  ERR_SALES_PRODUCTS_IN_MANUFACTURE_UPSERT_FAILED,
} from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import {
  calculatePriceFromAyamUtuh,
  calculatePriceFromBrankas,
  calculatePriceFromLB,
} from '../../libs/utils/cogs';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class ProductsInManufactureDAO extends BaseSQLDAO<ProductsInManufacture> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ProductsInManufacture);
  }

  async createManyWithTx(
    data: DeepPartial<ProductsInManufacture>[],
    _user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<ProductsInManufacture[]> {
    const items = queryRunner.manager.create(
      ProductsInManufacture,
      data.map<DeepPartial<ProductsInManufacture>>((input) => ({
        ...input,
      })),
    );

    const result = await queryRunner.manager.save(ProductsInManufacture, items);

    return result;
  }

  async softDeleteManyWithTx(
    where: FindOptionsWhere<ProductsInManufacture>,
    queryRunner: QueryRunner,
  ): Promise<ProductsInManufacture[]> {
    const toBeDeleted = await queryRunner.manager.find(ProductsInManufacture, { where });

    await queryRunner.manager.softDelete(ProductsInManufacture, where);

    return toBeDeleted;
  }

  async upsertMany(
    user: RequestUser,
    items: DeepPartial<ProductsInManufacture>[],
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<ProductsInManufacture[]> {
    if (items.length === 0) return [];

    const manufactureId = items[0].salesManufactureId;
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItems = items.map<DeepPartial<ProductsInManufacture>>((item) => ({
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
      .into(ProductsInManufacture)
      .values(upsertItems)
      .orUpdate(
        [
          'modified_by',
          'modified_date',
          'deleted_date',
          'quantity',
          'weight',
          'price',
          'city_based_price',
        ],
        ['ref_sales_manufacture_id', 'ref_sales_product_item_id'],
      )
      .execute();

    const [results, count] = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('ref_sales_manufacture_id = :manufactureId', { manufactureId })
      .andWhere('ref_sales_product_item_id IN (:...productIds)', {
        productIds: upsertItems.map((p) => p.salesProductItemId),
      })
      .getManyAndCount();

    if (count !== upsertItems.length) {
      throw ERR_SALES_PRODUCTS_IN_MANUFACTURE_UPSERT_FAILED('result count not match');
    }

    return results;
  }

  async calculateCOGS(
    data: {
      operationUnit: OperationUnit;
      productManufactureInput: ProductsInManufacture;
      productManufactureOutput: SalesManufactureProductCategoryBody[];
      lbPriceInCity?: number;
    },
    queryRunner: QueryRunner,
  ): Promise<
    {
      quantity: number;
      weight: number;
      productItemId: string;
      price: number | null;
    }[]
  > {
    const [productCategories] = await queryRunner.manager.findAndCount(ProductCategory, {
      relations: {
        items: true,
      },
    });

    const { operationUnit, productManufactureInput, productManufactureOutput, lbPriceInCity } =
      data;

    if (operationUnit.status === false) {
      throw new Error('Cannot manufacture in an inactive operation unit!');
    }

    if (
      operationUnit.type === OperationUnitTypeEnum.JAGAL &&
      operationUnit.category === OperationUnitCategoryEnum.EXTERNAL
    ) {
      throw new Error('Cannot manufacture in EXTERNAL JAGAL!');
    }

    if (
      operationUnit.type === OperationUnitTypeEnum.LAPAK &&
      operationUnit.category === OperationUnitCategoryEnum.EXTERNAL
    ) {
      throw new Error('Cannot manufacture in EXTERNAL LAPAK!');
    }

    if (!productManufactureOutput.length) {
      throw new Error('Missing product manufacture output!');
    }

    let outputData: {
      quantity: number;
      weight: number;
      productItemId: string;
      price: number | null;
    }[] = [];

    const input = productCategories.find((product) =>
      product.items.some((item) => item.id === productManufactureInput.salesProductItemId),
    );
    if (!input) {
      throw new Error('Invalid product manufacture input!');
    }

    const {
      innardsPrice: innardsInventoryPrice,
      headPrice: headInventoryPrice,
      feetPrice: feetInventoryPrice,
    } = operationUnit;

    if (
      innardsInventoryPrice === null ||
      headInventoryPrice === null ||
      feetInventoryPrice === null
    ) {
      throw new Error('Missing inventory price data!');
    }

    const { ratio: ayamUtuhRatio } = productCategories.find(
      (category) => category.code === ProductCategoryCodeEnum.AYAM_UTUH,
    )!;
    const { ratio: brankasRatio } = productCategories.find(
      (category) => category.code === ProductCategoryCodeEnum.BRANKAS,
    )!;
    const { ratio: innardsRatio } = productCategories.find(
      (category) => category.code === ProductCategoryCodeEnum.INNARDS,
    )!;
    const { ratio: headRatio } = productCategories.find(
      (category) => category.code === ProductCategoryCodeEnum.HEAD,
    )!;
    const { ratio: feetRatio } = productCategories.find(
      (category) => category.code === ProductCategoryCodeEnum.FEET,
    )!;

    if (data.operationUnit.type === OperationUnitTypeEnum.JAGAL) {
      // NOTE: Calculate price in JAGAL
      let lbPrice: number;
      const { lbWeight, lbLoss, operationalDays, operationalExpenses } = operationUnit;

      if (
        operationUnit.lbPrice === null ||
        lbWeight === null ||
        lbLoss === null ||
        !operationalDays ||
        !operationalExpenses
      ) {
        throw new Error('Missing jagal OPEX data!');
      }

      if (lbPriceInCity) {
        lbPrice = lbPriceInCity;
      } else {
        lbPrice = operationUnit.lbPrice;
      }

      // NEED REVISIT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      const productCategoriesAndBaseWeight = productCategories.map((category) => ({
        ...category,
        baseWeight: category.ratio * lbWeight * operationalDays * (1 - lbLoss / 100) || 0,
      }));

      const { baseWeight: ayamUtuhBaseWeight } = productCategoriesAndBaseWeight.find(
        (category) => category.code === ProductCategoryCodeEnum.AYAM_UTUH,
      )!;
      const { baseWeight: brankasBaseWeight } = productCategoriesAndBaseWeight.find(
        (category) => category.code === ProductCategoryCodeEnum.BRANKAS,
      )!;
      const { baseWeight: innardsBaseWeight } = productCategoriesAndBaseWeight.find(
        (category) => category.code === ProductCategoryCodeEnum.INNARDS,
      )!;
      const { baseWeight: headBaseWeight } = productCategoriesAndBaseWeight.find(
        (category) => category.code === ProductCategoryCodeEnum.HEAD,
      )!;
      const { baseWeight: feetBaseWeight } = productCategoriesAndBaseWeight.find(
        (category) => category.code === ProductCategoryCodeEnum.FEET,
      )!;

      const jagalCOGS = lbPrice * lbWeight * operationalDays + operationalExpenses;
      const brankasCOGS = jagalCOGS / brankasBaseWeight;
      const ayamUtuhCOGS =
        (jagalCOGS - innardsInventoryPrice * innardsBaseWeight) / ayamUtuhBaseWeight;

      // NEED REVISIT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      if (input.code === ProductCategoryCodeEnum.LIVE_BIRD) {
        outputData = calculatePriceFromLB({
          productOutput: productManufactureOutput,
          productCategoriesAndBaseWeight,
          jagalCOGS,
          brankasCOGS,
          ayamUtuhCOGS,
          innardsInventoryPrice,
          feetInventoryPrice,
          headInventoryPrice,
          innardsBaseWeight,
          headBaseWeight,
          feetBaseWeight,
        });
      } else if (input.code === ProductCategoryCodeEnum.BRANKAS) {
        outputData = calculatePriceFromBrankas({
          productOutput: productManufactureOutput,
          productCategories,
          brankasCOGS,
          brankasBaseWeight,
          innardsInventoryPrice,
          feetInventoryPrice,
          headInventoryPrice,
          brankasRatio,
          innardsRatio,
          feetRatio,
          headRatio,
        });
      } else if (input.code === ProductCategoryCodeEnum.AYAM_UTUH) {
        outputData = calculatePriceFromAyamUtuh({
          productOutput: productManufactureOutput,
          productCategories,
          ayamUtuhCOGS,
          ayamUtuhBaseWeight,
          feetInventoryPrice,
          headInventoryPrice,
          ayamUtuhRatio,
          feetRatio,
          headRatio,
        });
      } else {
        throw ERR_SALES_MANUFACTURE_INVALID_INPUT(
          'Jagal only accept live bird, brankas, and ayam utuh!',
        );
      }
    }

    if (data.operationUnit.type === OperationUnitTypeEnum.LAPAK) {
      if (input.code === ProductCategoryCodeEnum.BRANKAS) {
        const { price: brankasCOGS, weight: brankasBaseWeight } = productManufactureInput;
        if (brankasCOGS === null || brankasBaseWeight === null) {
          throw new Error('Missing BRANKAS price and weight!');
        }

        outputData = calculatePriceFromBrankas({
          productOutput: productManufactureOutput,
          productCategories,
          brankasCOGS,
          brankasBaseWeight,
          innardsInventoryPrice,
          feetInventoryPrice,
          headInventoryPrice,
          brankasRatio,
          innardsRatio,
          feetRatio,
          headRatio,
        });
      } else if (input.code === ProductCategoryCodeEnum.AYAM_UTUH) {
        const { price: ayamUtuhCOGS, weight: ayamUtuhBaseWeight } = productManufactureInput;
        if (ayamUtuhCOGS === null || ayamUtuhBaseWeight === null) {
          throw new Error('Missing AYAM UTUH price and weight!');
        }
        outputData = calculatePriceFromAyamUtuh({
          productOutput: productManufactureOutput,
          productCategories,
          ayamUtuhCOGS,
          ayamUtuhBaseWeight,
          feetInventoryPrice,
          headInventoryPrice,
          ayamUtuhRatio,
          feetRatio,
          headRatio,
        });
      } else {
        throw ERR_SALES_MANUFACTURE_INVALID_INPUT('Lapak only accept brankas and ayam utuh!');
      }
    }

    return outputData;
  }
}
