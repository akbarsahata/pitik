import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { FindOptionsWhere, In } from 'typeorm';
import { SalesOperationUnitDAO } from '../../dao/sales/operationUnit.dao';
import { OperationUnitStockDAO } from '../../dao/sales/operationUnitStock.dao';
import { ProductsInStockOpnameDAO } from '../../dao/sales/productsInStockOpname.dao';
import { StockOpnameDAO } from '../../dao/sales/stockOpname.dao';
import { UsersInOperationUnitDAO } from '../../dao/sales/usersInOperationUnit.dao';
import { UserDAO } from '../../dao/user.dao';
import {
  StockOpname,
  StockOpnameStatusEnum,
} from '../../datasources/entity/pgsql/sales/StockOpname.entity';
import { LatestStockItem } from '../../dto/sales/operationUnit.dto';
import {
  CreateSalesStockOpnameBody,
  GetSalesStockOpnameByIdResponseItem,
  GetSalesStockOpnamesQuery,
  ProductCategory,
  StockOpnamesProductItemBody,
  UpdateSalesStockOpnameBody,
} from '../../dto/sales/stockOpname.dto';
import { APP_ID, DEFAULT_TIME_ZONE, SALES_TOTAL_WEIGHT_PRODUCT } from '../../libs/constants';
import {
  ERR_SALES_STOCK_DISPOSAL_INVALID_STATUS,
  ERR_SALES_STOCK_OPNAME_INPUT_ERROR,
} from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';

@Service()
export class SalesStockOpnameService {
  @Inject(StockOpnameDAO)
  private stockOpnameDAO: StockOpnameDAO;

  @Inject(OperationUnitStockDAO)
  private operationUnitStockDAO: OperationUnitStockDAO;

  @Inject(ProductsInStockOpnameDAO)
  private productsInStockOpnameDAO: ProductsInStockOpnameDAO;

  @Inject(SalesOperationUnitDAO)
  private salesOperationUnitDAO: SalesOperationUnitDAO;

  @Inject(UserDAO)
  private userDAO: UserDAO;

  @Inject(UsersInOperationUnitDAO)
  private usersInOperationUnitDAO: UsersInOperationUnitDAO;

  async get(
    filter: GetSalesStockOpnamesQuery,
    requestUser: RequestUser,
    appId?: string,
  ): Promise<[GetSalesStockOpnameByIdResponseItem[], number]> {
    const limit = (filter.$limit && filter.$limit > 0 && filter.$limit) || undefined;
    const skip =
      limit && filter.$page !== undefined && filter.$page > 0 ? (filter.$page - 1) * limit : 0;
    const confirmedDate = filter.confirmedDate
      ? utcToZonedTime(new Date(filter.confirmedDate), DEFAULT_TIME_ZONE)
      : undefined;

    const baseFilter: FindOptionsWhere<StockOpname> = {
      salesOperationUnitId: filter.operationUnitId,
      status: filter.status,
      confirmedDate,
    };

    if (appId === APP_ID.DOWNSTREAM_APP) {
      const user = await this.userDAO.getOneStrict({
        where: {
          id: requestUser.id,
        },
      });

      if (user.branchId) {
        baseFilter.salesOperationUnit = {
          branchId: user.branchId,
        };
      }

      const [operationUnits] = await this.usersInOperationUnitDAO.getMany({
        where: {
          userId: requestUser.id,
        },
      });

      const myOperationUnitIds = operationUnits.map(
        (operationUnit) => operationUnit.salesOperationUnitId,
      );

      baseFilter.salesOperationUnitId =
        (filter.operationUnitId &&
          myOperationUnitIds.find((id) => id === filter.operationUnitId)) ||
        In(myOperationUnitIds) ||
        undefined;
    }

    const [opnames, count] = await this.stockOpnameDAO.getMany({
      where: baseFilter,
      relations: {
        salesOperationUnit: {
          branch: true,
          province: true,
          city: true,
          district: true,
          salesUsersInOperationUnit: true,
        },
        salesProductsInStockOpname: {
          salesProductItem: {
            category: true,
          },
        },
        reviewer: true,
        userCreator: true,
        userModifier: true,
      },
      order: {
        modifiedDate: 'DESC',
      },
      skip,
      take: limit,
    });

    return [opnames.map((item) => this.mapStockOpnameEntityToDTO(item)), count];
  }

  async getById(id: string): Promise<GetSalesStockOpnameByIdResponseItem> {
    const item = await this.stockOpnameDAO.getOneStrict({
      where: {
        id,
      },
      relations: {
        salesOperationUnit: {
          branch: true,
          province: true,
          city: true,
          district: true,
        },
        salesProductsInStockOpname: {
          salesProductItem: {
            category: true,
          },
        },
        reviewer: true,
        userCreator: true,
        userModifier: true,
      },
      order: {
        salesProductsInStockOpname: {
          salesProductItem: {
            minValue: 'ASC',
          },
        },
      },
    });

    return this.mapStockOpnameEntityToDTO(item);
  }

  async createStockOpname(
    input: CreateSalesStockOpnameBody,
    user: RequestUser,
  ): Promise<GetSalesStockOpnameByIdResponseItem> {
    if (input.status === StockOpnameStatusEnum.FINISHED) {
      throw ERR_SALES_STOCK_OPNAME_INPUT_ERROR('cannot set opname status directly as FINISHED');
    }

    if (input.status === StockOpnameStatusEnum.CANCELLED) {
      throw ERR_SALES_STOCK_OPNAME_INPUT_ERROR('cannot set opname status directly as CANCELLED');
    }

    if (
      input.status !== StockOpnameStatusEnum.DRAFT &&
      input.status !== StockOpnameStatusEnum.CONFIRMED
    ) {
      throw ERR_SALES_STOCK_OPNAME_INPUT_ERROR('new opname can only be set as DRAFT or CONFIRMED');
    }

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const queryRunner = await this.stockOpnameDAO.startTransaction();

    const operationUnit = await this.salesOperationUnitDAO.getOneStrict({
      where: { id: input.operationUnitId },
      relations: {
        salesProductsInOperationUnit: {
          salesProductCategory: {
            items: true,
          },
        },
      },
    });

    const stocks = await this.operationUnitStockDAO.calculateStock(operationUnit.id);
    const isProductsChange = await this.isOpnameProductDifferentFromStock(stocks, input.products);

    const purchaseableItemIds =
      operationUnit?.salesProductsInOperationUnit
        .map((item) => item.salesProductCategory.items.map((productItem) => productItem.id))
        .flat() || [];

    input.products.forEach((inputProduct) => {
      const isExist = purchaseableItemIds.find(
        (productItemId) => productItemId === inputProduct.productItemId,
      );
      if (!isExist) {
        throw ERR_SALES_STOCK_OPNAME_INPUT_ERROR(
          `Product is not purchasable in ${operationUnit?.operationUnitName}`,
        );
      }
    });

    try {
      const stockOpname = await this.stockOpnameDAO.upsertOne(
        {
          ...input,
          salesOperationUnitId: input.operationUnitId,
          confirmedDate:
            input.status === StockOpnameStatusEnum.CONFIRMED && !isProductsChange ? now : undefined,
          status:
            // eslint-disable-next-line no-nested-ternary
            input.status === StockOpnameStatusEnum.CONFIRMED && !isProductsChange
              ? StockOpnameStatusEnum.FINISHED
              : input.status === StockOpnameStatusEnum.CONFIRMED && isProductsChange
              ? StockOpnameStatusEnum.CONFIRMED
              : input.status,
        },
        user,
        queryRunner,
      );

      await this.productsInStockOpnameDAO.createManyWithTx(
        input.products.map((p) => ({
          ...p,
          salesStockOpnameId: stockOpname.id,
          salesProductItemId: p.productItemId,
          previousQuantity:
            input.status === StockOpnameStatusEnum.CONFIRMED
              ? stocks.find((item) => item.productItemId === p.productItemId)?.totalQuantity || 0
              : undefined,
          previousWeight:
            input.status === StockOpnameStatusEnum.CONFIRMED
              ? stocks.find((item) => item.productItemId === p.productItemId)?.totalWeight || 0
              : undefined,
        })),
        user,
        queryRunner,
      );

      if (input.status === StockOpnameStatusEnum.CONFIRMED && !isProductsChange) {
        // Adjust stock
        await this.operationUnitStockDAO.createOpname({
          operationUnitId: input.operationUnitId,
          opnameId: stockOpname.id,
          products: [
            ...input.products.map((p) => ({
              ...p,
              quantity: p.quantity || 0,
              weight: p.weight || 0,
            })),
            {
              productItemId: SALES_TOTAL_WEIGHT_PRODUCT.id,
              quantity: 0,
              weight: input.totalWeight || 0,
            },
          ],
          qr: queryRunner,
          user,
        });
      }

      await this.stockOpnameDAO.commitTransaction(queryRunner);

      if (input.status === StockOpnameStatusEnum.CONFIRMED) {
        await this.operationUnitStockDAO.clearLatestStockCache(input.operationUnitId);
      }

      const created = await this.getById(stockOpname.id);

      return created;
    } catch (error) {
      await this.stockOpnameDAO.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async update(
    user: RequestUser,
    body: UpdateSalesStockOpnameBody,
    id: string,
  ): Promise<GetSalesStockOpnameByIdResponseItem> {
    if (
      (body.status === StockOpnameStatusEnum.REJECTED ||
        body.status === StockOpnameStatusEnum.FINISHED) &&
      !body.reviewerId
    ) {
      throw ERR_SALES_STOCK_OPNAME_INPUT_ERROR('reviewer data is missing');
    }

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const currentStockOpname = await this.stockOpnameDAO.getOneStrict({
      where: {
        id,
      },
      relations: {
        salesOperationUnit: true,
      },
    });
    if (
      body.status === StockOpnameStatusEnum.CANCELLED &&
      currentStockOpname.status !== StockOpnameStatusEnum.DRAFT &&
      currentStockOpname.status !== StockOpnameStatusEnum.CONFIRMED
    ) {
      throw ERR_SALES_STOCK_OPNAME_INPUT_ERROR(
        'can only cancel stock opname from DRAFT or CONFIRMED opname',
      );
    }

    const stocks = await this.operationUnitStockDAO.calculateStock(
      currentStockOpname.salesOperationUnitId,
    );

    const isProductsChange = await this.isOpnameProductDifferentFromStock(stocks, body.products);

    if (
      body.status === StockOpnameStatusEnum.DRAFT &&
      currentStockOpname.status === StockOpnameStatusEnum.CONFIRMED
    ) {
      throw ERR_SALES_STOCK_DISPOSAL_INVALID_STATUS(
        'Cannot change status to DRAFT from a CONFIRMED stock opname!',
      );
    }

    if (currentStockOpname.status === StockOpnameStatusEnum.FINISHED) {
      throw ERR_SALES_STOCK_DISPOSAL_INVALID_STATUS('Cannot edit a FINISHED stock opname!');
    }

    const { products, ...input } = body;

    const qr = await this.stockOpnameDAO.startTransaction();

    try {
      await this.stockOpnameDAO.updateOneWithTx(
        { id },
        {
          salesOperationUnitId: input.operationUnitId,
          totalWeight: input.totalWeight,
          reviewedDate:
            input.status === StockOpnameStatusEnum.FINISHED ||
            input.status === StockOpnameStatusEnum.REJECTED
              ? now
              : undefined,
          reviewerId: input.reviewerId,
          confirmedDate:
            (input.status === StockOpnameStatusEnum.CONFIRMED && !isProductsChange) ||
            StockOpnameStatusEnum.FINISHED
              ? now
              : undefined,
          status:
            // eslint-disable-next-line no-nested-ternary
            input.status === StockOpnameStatusEnum.CONFIRMED && !isProductsChange
              ? StockOpnameStatusEnum.FINISHED
              : input.status === StockOpnameStatusEnum.CONFIRMED && isProductsChange
              ? StockOpnameStatusEnum.CONFIRMED
              : input.status,
        },
        user,
        qr,
      );

      await this.productsInStockOpnameDAO.softDeleteManyWithTx(
        {
          salesStockOpnameId: id,
        },
        qr,
      );

      await this.productsInStockOpnameDAO.upsertMany(
        user,
        products.map((p) => ({
          ...p,
          salesStockOpnameId: id,
          salesProductItemId: p.productItemId,
          previousQuantity:
            input.status === StockOpnameStatusEnum.CONFIRMED
              ? stocks.find((item) => item.productItemId === p.productItemId)?.totalQuantity || 0
              : undefined,
          previousWeight:
            input.status === StockOpnameStatusEnum.CONFIRMED
              ? stocks.find((item) => item.productItemId === p.productItemId)?.totalWeight || 0
              : undefined,
        })),
        {
          qr,
        },
      );

      if (
        (input.status === StockOpnameStatusEnum.CONFIRMED && !isProductsChange) ||
        input.status === StockOpnameStatusEnum.FINISHED
      ) {
        // Adjust stock
        await this.operationUnitStockDAO.createOpname({
          operationUnitId: currentStockOpname.salesOperationUnitId,
          opnameId: id,
          products: [
            ...products.map((p) => ({
              ...p,
              quantity: p.quantity || 0,
              weight: p.weight || 0,
            })),
            {
              productItemId: SALES_TOTAL_WEIGHT_PRODUCT.id,
              quantity: 0,
              weight: body.totalWeight || 0,
            },
          ],
          qr,
          user,
        });
      }

      await this.stockOpnameDAO.commitTransaction(qr);

      if (
        (input.status === StockOpnameStatusEnum.CONFIRMED && !isProductsChange) ||
        input.status === StockOpnameStatusEnum.FINISHED
      ) {
        await this.operationUnitStockDAO.clearLatestStockCache(input.operationUnitId);
      }

      return await this.getById(id);
    } catch (error) {
      await this.stockOpnameDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private async isOpnameProductDifferentFromStock(
    stocks: LatestStockItem[],
    products: StockOpnamesProductItemBody[],
  ): Promise<boolean> {
    // eslint-disable-next-line no-restricted-syntax
    for (const productInput of products) {
      const stock = stocks.find((item) => item.productItemId === productInput.productItemId);

      // NOTE: currently still take account for the 'productInput.weight'
      // will be removed in the near future

      if (!stock) {
        if (productInput.quantity && productInput.quantity > 0) {
          return true;
        }

        if (productInput.weight && productInput.weight > 0) {
          return true;
        }
      }

      if (stock) {
        if (productInput.quantity !== stock.totalQuantity) {
          return true;
        }

        if (productInput.weight !== stock.totalWeight) {
          return true;
        }
      }
    }

    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  private mapStockOpnameEntityToDTO(stockOpname: StockOpname): GetSalesStockOpnameByIdResponseItem {
    const groupProductByCategory = stockOpname.salesProductsInStockOpname.reduce((prev, item) => {
      if (!prev.has(item.salesProductItem.categoryId)) {
        prev.set(item.salesProductItem.categoryId, {
          ...item.salesProductItem.category,
          totalQuantity: 0,
          totalWeight: 0,
          productItems: [],
        });
      }

      const productCategory = prev.get(item.salesProductItem.categoryId)!;
      productCategory.totalQuantity += item.quantity || 0;
      productCategory.totalWeight += item.weight || 0;
      productCategory.productItems.push({
        id: item.salesProductItem.id,
        name: item.salesProductItem.name,
        weight: item.weight,
        quantity: item.quantity,
        previousWeight: item.previousWeight || 0,
        previousQuantity: item.previousQuantity || 0,
      });

      prev.set(item.salesProductItem.categoryId, productCategory);

      return prev;
    }, new Map<string, ProductCategory>());

    return {
      ...stockOpname,
      code: `${stockOpname.salesOperationUnit.branch.code}/STOCK/${stockOpname.id}`,
      confirmedDate: stockOpname.confirmedDate ? stockOpname.confirmedDate.toISOString() : null,
      operationUnit: {
        ...stockOpname.salesOperationUnit,
        province: {
          ...stockOpname.salesOperationUnit.province,
          name: stockOpname.salesOperationUnit.province.provinceName,
        },
        city: {
          ...stockOpname.salesOperationUnit.city,
          name: stockOpname.salesOperationUnit.city.cityName,
        },
        district: {
          ...stockOpname.salesOperationUnit.district,
          name: stockOpname.salesOperationUnit.district.districtName,
        },
      },
      products: Array.from(groupProductByCategory.values()),
      createdDate: stockOpname.createdDate.toISOString(),
      modifiedDate: stockOpname.modifiedDate.toISOString(),
      createdBy: stockOpname.userCreator?.email,
      modifiedBy: stockOpname.userModifier?.email,
    };
  }
}
