import { format } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { Between, FindOptionsWhere, ILike, In, IsNull, Not } from 'typeorm';
import { SalesOperationUnitDAO } from '../../dao/sales/operationUnit.dao';
import { OperationUnitLatestStockDAO } from '../../dao/sales/operationUnitLatestStock.dao';
import { ProductItemDAO } from '../../dao/sales/productItem.dao';
import { ProductsInPurchaseOrderDAO } from '../../dao/sales/productsInPurchaseOrder.dao';
import { PurchaseOrderDAO } from '../../dao/sales/purchaseOrder.dao';
import { UsersInOperationUnitDAO } from '../../dao/sales/usersInOperationUnit.dao';
import { UserDAO } from '../../dao/user.dao';
import {
  OperationUnitCategoryEnum,
  OperationUnitTypeEnum,
} from '../../datasources/entity/pgsql/sales/OperationUnit.entity';
import { ProductCategoryCodeEnum } from '../../datasources/entity/pgsql/sales/ProductCategory.entity';
import {
  PurchaseOrder,
  PurchaseOrderSourceEnum,
  PurchaseOrderStatusEnum,
} from '../../datasources/entity/pgsql/sales/PurchaseOrder.entity';
import {
  CreateSalesPurchaseOrderBody,
  GetSalesPurchaseOrdersByIdResponseItem,
  GetSalesPurchaseOrdersQuery,
  UpdateSalesPurchaseOrderBody,
} from '../../dto/sales/purchaseOrder.dto';
import { APP_ID, DATETIME_00_SQL_FORMAT, DATETIME_59_SQL_FORMAT } from '../../libs/constants';
import {
  ERR_BAD_REQUEST,
  ERR_SALES_PO_CANCEL,
  ERR_SALES_PURCHASE_ORDER_SOURCE,
} from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';

@Service()
export class SalesPurchaseOrderService {
  @Inject(OperationUnitLatestStockDAO)
  private operationUnitLatestStockDAO: OperationUnitLatestStockDAO;

  @Inject(PurchaseOrderDAO)
  private dao: PurchaseOrderDAO;

  @Inject(ProductItemDAO)
  private productItemDAO: ProductItemDAO;

  @Inject(ProductsInPurchaseOrderDAO)
  private productsInPurchaseOrder: ProductsInPurchaseOrderDAO;

  @Inject(SalesOperationUnitDAO)
  private operationUnitDAO: SalesOperationUnitDAO;

  @Inject(UserDAO)
  private userDAO: UserDAO;

  @Inject(UsersInOperationUnitDAO)
  private usersInOperationUnitDAO: UsersInOperationUnitDAO;

  async getPurchaseOrders(
    filter: GetSalesPurchaseOrdersQuery,
    requestUser: RequestUser,
    appId?: string,
  ): Promise<[GetSalesPurchaseOrdersByIdResponseItem[], number]> {
    if (filter.productItemId && !filter.productCategoryId) {
      throw new ERR_BAD_REQUEST('Product category is required!');
    }

    if (!filter.source && (filter.vendorId || filter.jagalId)) {
      throw new ERR_BAD_REQUEST('Source is required!');
    }

    if (
      (filter.source === PurchaseOrderSourceEnum.JAGAL && filter.vendorId) ||
      (filter.source === PurchaseOrderSourceEnum.VENDOR && filter.jagalId)
    ) {
      throw new ERR_BAD_REQUEST('source and vendor/jagal is not match!');
    }

    const limit = (filter.$limit && filter.$limit > 0 && filter.$limit) || undefined;
    const skip =
      limit && filter.$page !== undefined && filter.$page > 0 ? (filter.$page - 1) * limit : 0;

    const baseFilter: FindOptionsWhere<PurchaseOrder> = {
      id: (filter.code && ILike(`%${filter.code.split('/').pop()}%`)) || undefined,
      salesOperationUnitId: filter.operationUnitId,
      status: Array.isArray(filter.status) ? In(filter.status) : filter.status,
      createdDate: filter.createdDate
        ? Between(
            new Date(format(new Date(filter.createdDate), DATETIME_00_SQL_FORMAT)),
            new Date(format(new Date(filter.createdDate), DATETIME_59_SQL_FORMAT)),
          )
        : undefined,
      ...(filter.productCategoryId &&
        !filter.productItemId && {
          salesProductsInPurchaseOrder: {
            salesProductItem: {
              categoryId: filter.productCategoryId,
            },
          },
        }),
      ...(filter.productItemId && {
        salesProductsInPurchaseOrder: {
          salesProductItemId: filter.productItemId,
        },
      }),
      ...(filter.source &&
        !filter.vendorId &&
        !filter.jagalId && {
          [filter.source === PurchaseOrderSourceEnum.JAGAL ? 'salesJagalId' : 'salesVendorId']: Not(
            IsNull(),
          ),
          [filter.source !== PurchaseOrderSourceEnum.JAGAL ? 'salesJagalId' : 'salesVendorId']:
            IsNull(),
        }),
      ...(filter.vendorId && {
        salesVendorId: filter.vendorId,
      }),
      ...(filter.jagalId && {
        salesJagalId: filter.jagalId,
      }),
    };

    if (appId === APP_ID.DOWNSTREAM_APP) {
      const [user, [operationUnits]] = await Promise.all([
        this.userDAO.getOneStrict({
          where: {
            id: requestUser.id,
          },
        }),
        this.usersInOperationUnitDAO.getMany({
          where: {
            userId: requestUser.id,
          },
        }),
      ]);

      const myOperationUnitIds = operationUnits.map(
        (operationUnit) => operationUnit.salesOperationUnitId,
      );

      if (user.branchId) {
        baseFilter.salesOperationUnit = {
          branchId: user.branchId,
        };
      }

      baseFilter.salesOperationUnitId =
        (filter.operationUnitId &&
          myOperationUnitIds.find((id) => id === filter.operationUnitId)) ||
        In(myOperationUnitIds);
    }

    const [items, count] = await this.dao.getMany({
      where: baseFilter,
      relations: {
        goodsReceived: {
          salesProductsInGoodsReceived: {
            salesProductItem: {
              category: true,
            },
          },
        },
        salesVendor: {
          salesProductsInVendor: {
            salesProductCategory: true,
          },
          province: true,
          city: true,
          district: true,
        },
        salesJagal: {
          branch: true,
          province: true,
          city: true,
          district: true,
          salesUsersInOperationUnit: true,
        },
        salesOperationUnit: {
          branch: true,
          province: true,
          city: true,
          district: true,
          salesUsersInOperationUnit: true,
        },
        salesProductsInPurchaseOrder: {
          salesProductItem: {
            category: true,
          },
        },
        userCreator: true,
        userModifier: true,
      },
      order: {
        modifiedDate: 'DESC',
        goodsReceived: {
          createdDate: 'DESC',
        },
      },
      skip,
      take: limit,
    });

    return [items.map((item) => this.mapPurchaseOrderEntityToDTO(item)), count];
  }

  async getById(purchaseOrderId: string): Promise<GetSalesPurchaseOrdersByIdResponseItem> {
    const result = await this.dao.getOneStrict({
      where: {
        id: purchaseOrderId,
      },
      relations: {
        goodsReceived: {
          salesProductsInGoodsReceived: {
            salesProductItem: {
              category: true,
            },
          },
        },

        salesVendor: {
          salesProductsInVendor: {
            salesProductCategory: true,
          },
          province: true,
          city: true,
          district: true,
        },
        salesJagal: {
          branch: true,
          province: true,
          city: true,
          district: true,
          salesUsersInOperationUnit: true,
        },
        salesOperationUnit: {
          branch: true,
          province: true,
          city: true,
          district: true,
        },
        salesProductsInPurchaseOrder: {
          salesProductItem: {
            category: true,
          },
        },
        userCreator: true,
        userModifier: true,
      },
    });

    return this.mapPurchaseOrderEntityToDTO(result);
  }

  async create(
    input: CreateSalesPurchaseOrderBody,
    user: RequestUser,
  ): Promise<GetSalesPurchaseOrdersByIdResponseItem> {
    if (!input.jagalId && !input.vendorId) {
      throw new ERR_SALES_PURCHASE_ORDER_SOURCE('Source is required!');
    }

    if (input.jagalId && input.vendorId) {
      throw new ERR_SALES_PURCHASE_ORDER_SOURCE('Multiple purchase order source!');
    }

    const isLiveBird = await this.productItemDAO.getOne({
      where: {
        id: In(input.products.map((p) => p.productItemId)),
        category: {
          code: ProductCategoryCodeEnum.LIVE_BIRD,
        },
      },
      relations: {
        category: true,
      },
    });

    // validate quantity
    const [latestLbStock] = await Promise.all([
      isLiveBird
        ? this.operationUnitLatestStockDAO.sumStockByCategory(
            input.operationUnitId,
            ProductCategoryCodeEnum.LIVE_BIRD,
          )
        : null,
      this.productItemDAO.validateQuantityAndWeight(input.products),
    ]);

    const qr = await this.dao.startTransaction();

    if (input.jagalId) {
      const jagal = await this.operationUnitDAO.getOneStrict({
        where: {
          id: input.jagalId,
        },
      });

      if (
        jagal.type !== OperationUnitTypeEnum.JAGAL ||
        jagal.category !== OperationUnitCategoryEnum.EXTERNAL
      ) {
        throw new ERR_SALES_PURCHASE_ORDER_SOURCE('Source operation unit is not external jagal!');
      }
    }

    try {
      const created = await this.dao.upsertOne(
        user,
        {
          ...input,
          salesVendorId: input.vendorId,
          salesJagalId: input.jagalId,
          salesOperationUnitId: input.operationUnitId,
          status: input.status || PurchaseOrderStatusEnum.DRAFT,
          lbAvailableQuantity: latestLbStock?.availableQuantity,
          lbAvailableWeight: latestLbStock?.availableWeight,
          lbReservedQuantity: latestLbStock?.reservedQuantity,
          lbReservedWeight: latestLbStock?.reservedWeight,
          lbTotalQuantity: latestLbStock?.totalQuantity,
          lbTotalWeight: latestLbStock?.totalWeight,
        },
        {
          qr,
        },
      );

      await this.productsInPurchaseOrder.createManyWithTx(
        input.products.map((p) => ({
          ...p,
          salesProductItemId: p.productItemId,
          salesPurchaseOrderId: created.id,
        })),
        user,
        qr,
      );

      await this.dao.commitTransaction(qr);

      return this.getById(created.id);
    } catch (error) {
      await this.dao.rollbackTransaction(qr);
      throw error;
    }
  }

  async update(
    user: RequestUser,
    input: UpdateSalesPurchaseOrderBody,
    id: string,
  ): Promise<GetSalesPurchaseOrdersByIdResponseItem> {
    if (!input.jagalId && !input.vendorId) {
      throw new ERR_SALES_PURCHASE_ORDER_SOURCE('Source is required!');
    }

    if (input.jagalId && input.vendorId) {
      throw new ERR_SALES_PURCHASE_ORDER_SOURCE('Multiple purchase order source!');
    }
    // validate quantity
    await this.productItemDAO.validateQuantityAndWeight(input.products);

    const qr = await this.dao.startTransaction();

    if (input.jagalId) {
      const jagal = await this.operationUnitDAO.getOneStrict({
        where: {
          id: input.jagalId,
        },
      });

      if (
        jagal.type !== OperationUnitTypeEnum.JAGAL ||
        jagal.category !== OperationUnitCategoryEnum.EXTERNAL
      ) {
        throw new ERR_SALES_PURCHASE_ORDER_SOURCE('Source operation unit is not external jagal!');
      }
    }

    try {
      await this.dao.updateOneWithTx(
        { id },
        {
          totalWeight: input.totalWeight,
          salesOperationUnitId: input.operationUnitId,
          salesJagalId: input.jagalId,
          salesVendorId: input.vendorId,
          status: input.status || PurchaseOrderStatusEnum.DRAFT,
        },
        user,
        qr,
      );

      await this.productsInPurchaseOrder.softDeleteManyWithTx(
        {
          salesPurchaseOrderId: id,
        },
        qr,
      );

      await this.productsInPurchaseOrder.upsertMany(
        user,
        input.products.map((p) => ({
          ...p,
          salesPurchaseOrderId: id,
          salesProductItemId: p.productItemId,
        })),
        {
          qr,
        },
      );

      await this.dao.commitTransaction(qr);

      return this.getById(id);
    } catch (error) {
      await this.dao.rollbackTransaction(qr);
      throw error;
    }
  }

  async cancel(user: RequestUser, id: string): Promise<PurchaseOrder> {
    const existing = await this.dao.getOneStrict({
      where: {
        id,
      },
    });

    if (
      existing.status !== PurchaseOrderStatusEnum.DRAFT &&
      existing.status !== PurchaseOrderStatusEnum.CONFIRMED
    ) {
      throw ERR_SALES_PO_CANCEL(`Purcahse order status is ${existing.status}`);
    }

    const cancelled = await this.dao.updateOne(
      { id },
      { status: PurchaseOrderStatusEnum.CANCELLED },
      user,
    );

    return cancelled;
  }

  // eslint-disable-next-line class-methods-use-this
  private mapPurchaseOrderEntityToDTO(data: PurchaseOrder): GetSalesPurchaseOrdersByIdResponseItem {
    const { totalQuantity, totalPrice } = data.salesProductsInPurchaseOrder.reduce(
      (prev, item) => ({
        totalQuantity: prev.totalQuantity + item.quantity,
        totalPrice: prev.totalPrice + item.weight * item.price,
      }),
      { totalQuantity: 0, totalPrice: 0 },
    );

    return {
      ...data,
      code: `${data.salesOperationUnit.branch.code}/PO/${data.id}`,
      remarks: data.remarks || null,
      goodsReceived:
        (data.goodsReceived.length && {
          ...data.goodsReceived[0],
          id: data.goodsReceived[0].id,
          code: `${data.salesOperationUnit.branch.code}/GR/${data.goodsReceived[0].id}`,
          status: data.goodsReceived[0].status,
          products:
            (data.goodsReceived[0].salesProductsInGoodsReceived &&
              data.goodsReceived[0].salesProductsInGoodsReceived.map((product) => ({
                ...product,
                id: product.salesProductItem?.id,
                name: product.salesProductItem?.name,
                category: product.salesProductItem?.category,
                price: product.price,
                quantity: product.quantity,
                weight: product.weight,
              }))) ||
            [],
        }) ||
        null,
      vendor:
        (data.salesVendor && {
          ...data.salesVendor,
          name: data.salesVendor.vendorName,
          province: {
            ...data.salesVendor.province,
            name: data.salesVendor.province.provinceName,
          },
          city: {
            ...data.salesVendor.city,
            name: data.salesVendor.city.cityName,
          },
          district: {
            ...data.salesVendor.district,
            name: data.salesVendor.district.districtName,
          },
          purchasableProducts: data.salesVendor.salesProductsInVendor.map((productCategory) => ({
            ...productCategory,
            id: productCategory.salesProductCategory.id,
            name: productCategory.salesProductCategory.name,
          })),
        }) ||
        null,
      jagal:
        (data.salesJagal && {
          ...data.salesJagal,
          province: {
            ...data.salesJagal.province,
            name: data.salesJagal.province.provinceName,
          },
          city: {
            ...data.salesJagal.city,
            name: data.salesJagal.city.cityName,
          },
          district: {
            ...data.salesJagal.district,
            name: data.salesJagal.district.districtName,
          },
        }) ||
        null,
      operationUnit: {
        ...data.salesOperationUnit,
        province: {
          ...data.salesOperationUnit.province,
          name: data.salesOperationUnit.province.provinceName,
        },
        city: {
          ...data.salesOperationUnit.city,
          name: data.salesOperationUnit.city.cityName,
        },
        district: {
          ...data.salesOperationUnit.district,
          name: data.salesOperationUnit.district.districtName,
        },
      },
      products: data.salesProductsInPurchaseOrder.map((product) => ({
        ...product,
        id: product.salesProductItem.id,
        name: product.salesProductItem.name,
        minValue: product.salesProductItem.minValue || undefined,
        maxValue: product.salesProductItem.maxValue || undefined,
        category: product.salesProductItem.category,
      })),
      createdBy: data.userCreator?.email,
      modifiedBy: data.userModifier?.email,
      createdDate: data.createdDate.toISOString(),
      modifiedDate: data.modifiedDate.toISOString(),
      totalWeight: data.totalWeight || null,
      totalQuantity,
      totalPrice,
    };
  }
}
