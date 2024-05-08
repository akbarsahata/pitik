import { Inject, Service } from 'fastify-decorators';
import { Between, FindOptionsWhere, ILike, In, IsNull, Not, Raw } from 'typeorm';
import { CustomerDAO } from '../../dao/sales/customer.dao';
import { OperationUnitStockDAO } from '../../dao/sales/operationUnitStock.dao';
import { ProductCategoryDAO } from '../../dao/sales/productCategory.dao';
import { ProductItemDAO } from '../../dao/sales/productItem.dao';
import { ProductNotesInSalesOrderDAO } from '../../dao/sales/productNotesInSalesOrder.dao';
import { ProductsInSalesOrderDAO } from '../../dao/sales/productsInSalesOrder.dao';
import { SalesOrderDAO } from '../../dao/sales/salesOrder.dao';
import { UsersInOperationUnitDAO } from '../../dao/sales/usersInOperationUnit.dao';
import { UserDAO } from '../../dao/user.dao';
import { SalesCustomer } from '../../datasources/entity/pgsql/sales/Customer.entity';
import {
  OperationUnitStock,
  STOCK_STATUS,
} from '../../datasources/entity/pgsql/sales/OperationUnitStock.entity';
import { ProductCategory } from '../../datasources/entity/pgsql/sales/ProductCategory.entity';
import { ProductItem } from '../../datasources/entity/pgsql/sales/ProductItem.entity';
import { ProductNotesInSalesOrderCutType } from '../../datasources/entity/pgsql/sales/ProductNotesInSalesOrder.entity';
import {
  ProductsInSalesOrder,
  ProductsInSalesOrderCutType,
} from '../../datasources/entity/pgsql/sales/ProductsInSalesOrder.entity';
import {
  SalesOrder,
  SalesOrderCategory,
  SalesOrderGrStatusEnum,
  SalesOrderReturnStatusEnum,
  SalesOrderStatusEnum,
  SalesOrderType,
} from '../../datasources/entity/pgsql/sales/SalesOrder.entity';
import {
  BookStockBody,
  CreateSalesOrderBody,
  DeliverBody,
  DriverPickUpBody,
  GetSalesOrderDetailParam,
  GetSalesOrderListQuery,
  ReturnProductBody,
  SalesOrderItem,
  SetDriverBody,
  UpdateSalesOrderBody,
} from '../../dto/sales/salesOrder.dto';
import { ROLE_RANK_CONTEXT, SALES_TOTAL_WEIGHT_PRODUCT } from '../../libs/constants';
import {
  ERR_INVALID_SALES_ORDER_DATA,
  ERR_INVALID_SALES_ORDER_STATUS,
  ERR_SALES_DELIVERY_CHECK_IN,
  ERR_SALES_ORDER_INCOMPLETE_DELIVERY_TIME_FILTER,
  ERR_SALES_ORDER_WEIGHT,
  ERR_SALES_SO_ASSIGN_DRIVER,
  ERR_SALES_SO_BOOK_STOCK_STATUS,
  ERR_SALES_SO_CANCEL_BOOK_STOCK_STATUS,
  ERR_SALES_SO_CANCEL_FAILED,
  ERR_SALES_SO_EDIT_CONFIRMED,
  ERR_SALES_SO_PICK_UP_ORDER,
} from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { calculateDistance } from '../../libs/utils/helpers';
import { UserService as UserCoreService } from '../usermanagement/userCore.service';

@Service()
export class SalesOrderService {
  @Inject(CustomerDAO)
  private customerDAO: CustomerDAO;

  @Inject(SalesOrderDAO)
  private salesOrderDAO: SalesOrderDAO;

  @Inject(OperationUnitStockDAO)
  private operationUnitStockDAO: OperationUnitStockDAO;

  @Inject(ProductItemDAO)
  private productItemDAO: ProductItemDAO;

  @Inject(ProductCategoryDAO)
  private productCategoryDAO: ProductCategoryDAO;

  @Inject(ProductNotesInSalesOrderDAO)
  private productNotesInSalesOrderDAO: ProductNotesInSalesOrderDAO;

  @Inject(ProductsInSalesOrderDAO)
  private productsInSalesOrderDAO: ProductsInSalesOrderDAO;

  @Inject(UserDAO)
  private userDAO: UserDAO;

  @Inject(UsersInOperationUnitDAO)
  private usersInOperationUnitDAO: UsersInOperationUnitDAO;

  @Inject(UserCoreService)
  private userCoreService: UserCoreService;

  async getById(opts: { params: GetSalesOrderDetailParam }): Promise<SalesOrderItem> {
    const order = await this.salesOrderDAO.getOneStrict({
      where: {
        id: opts.params.id,
        productNotes: {
          deletedDate: IsNull(),
        },
      },
      relations: {
        goodsReceived: {
          salesProductsInGoodsReceived: {
            salesProductItem: {
              category: true,
            },
          },
        },
        customer: true,
        driver: true,
        operationUnit: {
          branch: true,
          province: true,
          city: true,
          district: true,
        },
        operationUnitStocks: true,
        products: {
          productItem: {
            category: true,
          },
        },
        productNotes: {
          productcategory: true,
        },
        salesperson: {
          branch: true,
        },
        userModifier: true,
        userCreator: true,
      },
    });

    return this.convertEntityToSalesOrderItem(order);
  }

  async createSalesOrder(request: {
    body: CreateSalesOrderBody;
    user: RequestUser;
  }): Promise<SalesOrderItem> {
    await this.productItemDAO.validateQuantityAndWeight(request.body.products);

    if (request.body.category === SalesOrderCategory.OUTBOUND && !request.body.customerId) {
      throw ERR_INVALID_SALES_ORDER_DATA('customer must be registered for OUTBOUND orders!');
    }

    if (
      request.body.status !== SalesOrderStatusEnum.DRAFT &&
      request.body.status !== SalesOrderStatusEnum.CONFIRMED
    ) {
      throw ERR_INVALID_SALES_ORDER_STATUS(
        'New sales order only allows DRAFT or CONFIRMED status!',
      );
    }

    const queryRunner = await this.salesOrderDAO.startTransaction();

    try {
      const totalProduct = await this.getTotalProduct(request.body.products);

      if (request.body.type === SalesOrderType.LB) {
        const totalProductNotes = await this.getTotalProductNotes(
          request.body.productNotes.map((note) => ({ ...note, price: 0 })),
        );

        if (totalProduct.totalWeight < totalProductNotes.totalWeight) {
          throw ERR_SALES_ORDER_WEIGHT("Product's note weight is greater than the input!");
        }
      }

      const order = await this.salesOrderDAO.upsertOne(
        {
          ...request.body,
          ...totalProduct,
          salespersonId: request.user.id,
          deliveryFee: request.body.withDeliveryFee ? 10000 : 0,
        },
        request.user,
        queryRunner,
      );

      await this.productsInSalesOrderDAO.upsertMany(
        request.body.products.map((p) => ({
          ...p,
          cutType:
            p.numberOfCuts === 0 && p.cutType === ProductsInSalesOrderCutType.REGULAR
              ? ProductsInSalesOrderCutType.UTUH
              : p.cutType,
          salesOrderId: order.id,
        })),
        request.user,
        queryRunner,
      );

      await this.productNotesInSalesOrderDAO.upsertMany(
        request.body.productNotes.map((p) => ({
          ...p,
          cutType:
            p.numberOfCuts === 0 && p.cutType === ProductNotesInSalesOrderCutType.REGULAR
              ? ProductNotesInSalesOrderCutType.UTUH
              : p.cutType,
          salesOrderId: order.id,
        })),
        request.user,
        queryRunner,
      );

      await this.salesOrderDAO.commitTransaction(queryRunner);

      return this.getById({
        params: order,
      });
    } catch (error) {
      await this.salesOrderDAO.rollbackTransaction(queryRunner);
      throw error;
    }
  }

  async getSaleOrders(
    filter: GetSalesOrderListQuery,
    requestUser: RequestUser,
  ): Promise<[SalesOrderItem[], number]> {
    const take = filter.$limit || 10;
    const skip = filter.$page && filter.$page > 0 ? (filter.$page - 1) * take : 0;

    let deliveryTime: FindOptionsWhere<SalesOrder>['deliveryTime'];

    if (filter.maxDeliveryTime && filter.minDeliveryTime) {
      deliveryTime = Between(new Date(filter.minDeliveryTime), new Date(filter.maxDeliveryTime));
    } else if (filter.maxDeliveryTime || filter.minDeliveryTime) {
      throw ERR_SALES_ORDER_INCOMPLETE_DELIVERY_TIME_FILTER();
    }

    const user = await this.userDAO.getOneStrict({
      where: {
        id: requestUser.id,
      },
      relations: {
        branch: {
          branchCities: true,
        },
      },
    });

    const [operationUnits] = await this.usersInOperationUnitDAO.getMany({
      where: {
        userId: requestUser.id,
      },
    });

    const myOperationUnitIds = operationUnits.map(
      (operationUnit) => operationUnit.salesOperationUnitId,
    );

    let salesTeamIds: string[] = [];

    if (filter.withinSalesTeam) {
      const [subordinates] = await this.userCoreService.getSubordinates({
        query: { context: ROLE_RANK_CONTEXT.downstream },
        params: { userId: requestUser.userManagementId as string },
      });
      salesTeamIds = subordinates.map((u) => u.cmsId);
    }

    const baseFilter: FindOptionsWhere<SalesOrder>[] = [
      {
        id: (filter.code && ILike(`%${filter.code.split('/').pop()}%`)) || undefined,
        customerId: filter.customerId || undefined,
        category: filter.category || undefined,
        status: Array.isArray(filter.status) ? In(filter.status) : filter.status,
        grStatus: Array.isArray(filter.grStatus) ? In(filter.grStatus) : filter.grStatus,
        returnStatus: Array.isArray(filter.returnStatus)
          ? In(filter.returnStatus)
          : filter.returnStatus,
        deliveryTime,
        productNotes: {
          deletedDate: IsNull(),
        },
        // eslint-disable-next-line no-nested-ternary
        salespersonId: filter.salespersonId
          ? filter.salespersonId
          : filter.withinSalesTeam
          ? In([...salesTeamIds, requestUser.id])
          : undefined,
        driverId: filter.driverId || undefined,
        createdBy: filter.createdBy ? filter.createdBy : undefined,
        operationUnitId: filter.operationUnitId ? filter.operationUnitId : undefined,
        salesperson: filter.branchId ? { branchId: filter.branchId } : undefined,
        products:
          filter.productItemId || filter.productCategoryId
            ? {
                productItem:
                  filter.productItemId || filter.productCategoryId
                    ? {
                        id: filter.productItemId ? filter.productItemId : undefined,
                        categoryId: filter.productCategoryId ? filter.productCategoryId : undefined,
                      }
                    : undefined,
              }
            : undefined,
        customer:
          filter.customerName || filter.customerCityId || filter.customerProvinceId
            ? {
                cityId: filter.customerCityId,
                provinceId:
                  // eslint-disable-next-line no-nested-ternary
                  filter.customerCityId && filter.customerProvinceId
                    ? undefined
                    : !filter.customerCityId && filter.customerProvinceId
                    ? filter.customerProvinceId
                    : undefined,
                businessName: filter.customerName ? ILike(`%${filter.customerName}%`) : undefined,
              }
            : undefined,
        createdDate: filter.date
          ? Raw((createdDate) => `DATE(${createdDate}) = :date`, { date: filter.date })
          : undefined,
        // eslint-disable-next-line no-nested-ternary
        totalQuantity: filter.quantity
          ? filter.quantity
          : filter.minQuantityRange !== undefined && filter.maxQuantityRange !== undefined
          ? Raw(
              (totalQuantity) =>
                `${totalQuantity} >= :minQuantityRange AND ${totalQuantity} <= :maxQuantityRange`,
              {
                minQuantityRange: filter.minQuantityRange,
                maxQuantityRange: filter.maxQuantityRange,
              },
            )
          : undefined,
        operationUnit: ((filter.withinProductionTeam !== undefined &&
          filter.withinProductionTeam !== null) ||
          filter.sameBranch) && {
          id:
            (filter.withinProductionTeam !== undefined &&
              filter.withinProductionTeam !== null &&
              ((filter.withinProductionTeam && In(myOperationUnitIds)) ||
                Not(In(myOperationUnitIds)))) ||
            undefined,
          branchId: (filter.sameBranch && user.branchId) || undefined,
        },
      },
    ];

    const [orders, count] = await this.salesOrderDAO.getMany({
      where: baseFilter.filter(
        (item) =>
          Object.keys(item).length && !Object.values(item).every((value) => value === undefined),
      ),
      relations: {
        goodsReceived: {
          salesProductsInGoodsReceived: {
            salesProductItem: {
              category: true,
            },
          },
        },
        customer: true,
        driver: true,
        operationUnit: {
          branch: true,
          province: true,
          city: true,
          district: true,
          salesUsersInOperationUnit: {
            user: true,
          },
        },
        operationUnitStocks: true,
        products: {
          productItem: {
            category: true,
          },
        },
        productNotes: {
          productcategory: true,
        },
        userModifier: true,
        userCreator: true,
        salesperson: {
          branch: true,
        },
      },
      order: {
        modifiedDate: 'DESC',
      },
      take,
      skip,
    });

    return [orders.map((order) => this.convertEntityToSalesOrderItem(order)), count];
  }

  async updateSalesOrder(request: {
    body: UpdateSalesOrderBody;
    params: GetSalesOrderDetailParam;
    user: RequestUser;
  }): Promise<SalesOrderItem> {
    const existingOrder = await this.salesOrderDAO.getOneStrict({
      where: {
        id: request.params.id,
      },
    });

    if (existingOrder.category === SalesOrderCategory.OUTBOUND && !request.body.customerId) {
      throw ERR_INVALID_SALES_ORDER_DATA('customer must be registered for OUTBOUND orders!');
    }

    if (
      existingOrder.status === SalesOrderStatusEnum.CONFIRMED &&
      request.body.status === SalesOrderStatusEnum.DRAFT
    ) {
      throw ERR_INVALID_SALES_ORDER_STATUS('Cannot revert a CONFIRMED sales order to DRAFT');
    }

    if (
      request.body.status !== SalesOrderStatusEnum.DRAFT &&
      request.body.status !== SalesOrderStatusEnum.CONFIRMED &&
      !request.body.operationUnitId
    ) {
      throw ERR_SALES_SO_EDIT_CONFIRMED('Source operation unit is required!');
    }

    if (request.body.status === SalesOrderStatusEnum.ALLOCATED && !request.body.operationUnitId) {
      throw ERR_INVALID_SALES_ORDER_DATA('jagal/lapak data is missing!');
    }

    const qr = await this.salesOrderDAO.startTransaction();

    try {
      const totalProduct = await this.getTotalProduct(request.body.products);

      if (existingOrder.type === SalesOrderType.LB) {
        const totalProductNotes = await this.getTotalProductNotes(
          request.body.productNotes.map((note) => ({ ...note, price: 0 })),
        );

        if (totalProduct.totalWeight < totalProductNotes.totalWeight) {
          throw ERR_SALES_ORDER_WEIGHT("Product's note weight is greater than the input!");
        }
      }

      const order = await this.salesOrderDAO.upsertOne(
        {
          ...existingOrder,
          ...request.body,
          ...totalProduct,
          id: request.params.id,
          // eslint-disable-next-line no-nested-ternary
          deliveryFee: request.body.withDeliveryFee
            ? 10000
            : request.body.withDeliveryFee === undefined
            ? existingOrder.deliveryFee
            : 0,
        },
        request.user,
        qr,
      );

      await this.productsInSalesOrderDAO.softDeleteManyWithTx(
        {
          salesOrderId: request.params.id,
        },
        qr,
      );

      await this.productsInSalesOrderDAO.upsertMany(
        request.body.products.map((p) => ({
          ...p,
          cutType:
            p.numberOfCuts === 0 && p.cutType === ProductsInSalesOrderCutType.REGULAR
              ? ProductsInSalesOrderCutType.UTUH
              : p.cutType,
          salesOrderId: order.id,
        })),
        request.user,
        qr,
      );

      await this.productNotesInSalesOrderDAO.softDeleteManyWithTx(
        {
          salesOrderId: request.params.id,
        },
        qr,
      );

      await this.productNotesInSalesOrderDAO.upsertMany(
        request.body.productNotes.map((p) => ({
          ...p,
          cutType:
            p.numberOfCuts === 0 && p.cutType === ProductNotesInSalesOrderCutType.REGULAR
              ? ProductNotesInSalesOrderCutType.UTUH
              : p.cutType,
          salesOrderId: order.id,
        })),
        request.user,
        qr,
      );

      await this.salesOrderDAO.commitTransaction(qr);

      return this.getById({
        params: order,
      });
    } catch (error) {
      await this.salesOrderDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  async setDriver(opts: {
    body: SetDriverBody;
    params: GetSalesOrderDetailParam;
    user: RequestUser;
  }): Promise<SalesOrderItem> {
    const existingOrder = await this.salesOrderDAO.getOneStrict({
      where: {
        id: opts.params.id,
      },
      relations: {
        products: {
          productItem: true,
        },
      },
    });

    if (existingOrder.category === SalesOrderCategory.INBOUND) {
      throw ERR_INVALID_SALES_ORDER_DATA('cannot set driver in INBOUND order!');
    }

    if (
      existingOrder.category === SalesOrderCategory.OUTBOUND &&
      opts.body.withDeliveryFee === undefined
    ) {
      throw ERR_INVALID_SALES_ORDER_DATA('OUTBOUND order must specify deliver fee calculation!');
    }

    if (
      existingOrder.status !== SalesOrderStatusEnum.BOOKED &&
      existingOrder.status !== SalesOrderStatusEnum.READY_TO_DELIVER
    ) {
      throw ERR_SALES_SO_ASSIGN_DRIVER();
    }

    const qr = await this.salesOrderDAO.startTransaction();

    try {
      const order = await this.salesOrderDAO.upsertOne(
        {
          ...existingOrder,
          deliveryTime: opts.body.deliveryTime,
          driverId: opts.body.driverId,
          status: SalesOrderStatusEnum.READY_TO_DELIVER,
          deliveryFee: opts.body.withDeliveryFee ? 10000 : 0,
        },
        opts.user,
        qr,
      );

      await this.salesOrderDAO.commitTransaction(qr);

      return this.getById({
        params: order,
      });
    } catch (error) {
      await this.salesOrderDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  async bookStock(opts: {
    body: BookStockBody;
    params: GetSalesOrderDetailParam;
    user: RequestUser;
  }): Promise<SalesOrderItem> {
    const existingOrder = await this.salesOrderDAO.getOneStrict({
      where: {
        id: opts.params.id,
        productNotes: {
          deletedDate: IsNull(),
        },
        products: {
          deletedDate: IsNull(),
        },
      },
      relations: {
        products: {
          productItem: true,
        },
        productNotes: {
          productcategory: true,
        },
      },
    });

    const bookProductByProductItemIdMap = opts.body.products.reduce((prev, item) => {
      prev.set(item.productItemId, {
        quantity: item.quantity,
        weight: item.weight,
        productItemId: item.productItemId,
      });

      return prev;
    }, new Map<string, { quantity: number; weight: number; productItemId: string }>());

    if (
      existingOrder.category === SalesOrderCategory.OUTBOUND &&
      existingOrder.status !== SalesOrderStatusEnum.ALLOCATED
    ) {
      throw ERR_SALES_SO_BOOK_STOCK_STATUS(`Current status is ${existingOrder.status}`);
    }

    if (
      existingOrder.category === SalesOrderCategory.INBOUND &&
      existingOrder.status !== SalesOrderStatusEnum.CONFIRMED
    ) {
      throw ERR_SALES_SO_BOOK_STOCK_STATUS(`Current status is ${existingOrder.status}`);
    }

    const qr = await this.salesOrderDAO.startTransaction();

    try {
      const order = await this.salesOrderDAO.upsertOne(
        {
          ...existingOrder,
          status:
            existingOrder.category === SalesOrderCategory.INBOUND
              ? SalesOrderStatusEnum.DELIVERED
              : SalesOrderStatusEnum.BOOKED,
          operationUnitId: opts.body.operationUnitId,
          customerId: opts.body.customerId,
        },
        opts.user,
        qr,
      );

      if (existingOrder.type === SalesOrderType.LB) {
        const totalProductNotes = await this.getTotalProductNotes(
          opts.body.productNotes.map((note) => ({ ...note, price: 0 })),
        );

        const totalBookedProduct = await this.getTotalProduct(opts.body.products);

        if (totalBookedProduct.totalWeight < totalProductNotes.totalWeight) {
          throw ERR_SALES_ORDER_WEIGHT("Product's note weight is greater than the input!");
        }
      }

      await this.productsInSalesOrderDAO.upsertMany(
        existingOrder.products.map((p) => ({
          ...p,
          bookedWeight: bookProductByProductItemIdMap.get(p.productItemId)?.weight,
        })),
        opts.user,
        qr,
      );

      await this.productNotesInSalesOrderDAO.softDeleteManyWithTx(
        {
          salesOrderId: opts.params.id,
        },
        qr,
      );

      await this.productNotesInSalesOrderDAO.upsertMany(
        opts.body.productNotes.map((p) => {
          const existingProductNotes = existingOrder.productNotes.find(
            (i) => i.productCategoryId === p.productCategoryId,
          );

          // FIXME: dynamically merge existing productNotes data
          // with PARTIALLY inputted data
          return {
            numberOfCuts: p.numberOfCuts ? p.numberOfCuts : existingProductNotes?.numberOfCuts,
            cutType: existingProductNotes?.cutType,
            quantity: p.quantity ? p.quantity : existingProductNotes?.quantity,
            weight: p.weight ? p.weight : existingProductNotes?.weight,
            productCategoryId: p.productCategoryId,
            salesOrderId: order.id,
          };
        }),
        opts.user,
        qr,
      );

      const totalWeight = opts.body.products.reduce((prev, item) => prev + item.weight, 0);

      // book available stock from selected operation unit
      await this.operationUnitStockDAO.bookStock({
        bookType: {
          salesOrderId: existingOrder.id,
        },
        operationUnitId: order.operationUnitId!,
        products: [
          ...opts.body.products.map((p) => ({
            productItemId: p.productItemId,
            quantity: p.quantity,
            weight: p.weight,
          })),
          {
            productItemId: SALES_TOTAL_WEIGHT_PRODUCT.id,
            quantity: 0,
            weight: totalWeight,
          },
        ],
        qr,
        user: opts.user,
      });

      await this.salesOrderDAO.commitTransaction(qr);

      await this.operationUnitStockDAO.clearLatestStockCache(order.operationUnitId!);

      return this.getById({
        params: order,
      });
    } catch (error) {
      await this.salesOrderDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  async cancel(opts: {
    params: GetSalesOrderDetailParam;
    user: RequestUser;
  }): Promise<SalesOrderItem> {
    const existingOrder = await this.salesOrderDAO.getOneStrict({
      where: {
        id: opts.params.id,
      },
    });

    if (
      existingOrder.status !== SalesOrderStatusEnum.DRAFT &&
      existingOrder.status !== SalesOrderStatusEnum.CONFIRMED
    ) {
      throw ERR_SALES_SO_CANCEL_FAILED(`Current status is ${existingOrder.status}`);
    }

    const qr = await this.salesOrderDAO.startTransaction();

    try {
      await this.salesOrderDAO.upsertOne(
        {
          ...existingOrder,
          status: SalesOrderStatusEnum.CANCELLED,
        },
        opts.user,
        qr,
      );

      await this.salesOrderDAO.commitTransaction(qr);

      return this.getById(opts);
    } catch (error) {
      await this.salesOrderDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  async cancelBookedStock(opts: {
    params: GetSalesOrderDetailParam;
    user: RequestUser;
  }): Promise<SalesOrderItem> {
    const existingOrder = await this.salesOrderDAO.getOneStrict({
      where: {
        id: opts.params.id,
      },
    });

    if (existingOrder.status !== SalesOrderStatusEnum.BOOKED) {
      throw ERR_SALES_SO_CANCEL_BOOK_STOCK_STATUS(`Current status is ${existingOrder.status}`);
    }

    const qr = await this.salesOrderDAO.startTransaction();

    try {
      const order = await this.salesOrderDAO.upsertOne(
        {
          ...existingOrder,
          status: SalesOrderStatusEnum.ALLOCATED,
        },
        opts.user,
        qr,
      );

      // cancel booked stock
      await this.operationUnitStockDAO.cancelBookStock({
        user: opts.user,
        qr,
        bookType: {
          salesOrderId: order.id,
        },
      });

      await this.salesOrderDAO.commitTransaction(qr);

      await this.operationUnitStockDAO.clearLatestStockCache(existingOrder.operationUnitId!);
      return this.getById({
        params: order,
      });
    } catch (error) {
      await this.salesOrderDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  async cancelAllocated(opts: {
    user: RequestUser;
    params: GetSalesOrderDetailParam;
  }): Promise<SalesOrderItem> {
    const so = await this.salesOrderDAO.getOneStrict({
      where: {
        id: opts.params.id,
      },
    });

    const qr = await this.salesOrderDAO.startTransaction();
    try {
      await this.salesOrderDAO.upsertOne(
        {
          ...so,
          status: SalesOrderStatusEnum.CONFIRMED,
          operationUnitId: null,
        },
        opts.user,
        qr,
      );

      await this.salesOrderDAO.commitTransaction(qr);

      return this.getById(opts);
    } catch (error) {
      await this.salesOrderDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  async cancelReadyToDeliver(opts: {
    user: RequestUser;
    params: GetSalesOrderDetailParam;
  }): Promise<SalesOrderItem> {
    const so = await this.salesOrderDAO.getOneStrict({
      where: {
        id: opts.params.id,
      },
    });

    const qr = await this.salesOrderDAO.startTransaction();
    try {
      await this.salesOrderDAO.upsertOne(
        {
          ...so,
          status: SalesOrderStatusEnum.BOOKED,
          driverId: null,
        },
        opts.user,
        qr,
      );

      await this.salesOrderDAO.commitTransaction(qr);

      return this.getById(opts);
    } catch (error) {
      await this.salesOrderDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  async pickUp(opts: {
    body: DriverPickUpBody;
    params: GetSalesOrderDetailParam;
    user: RequestUser;
  }): Promise<SalesOrderItem> {
    const existingOrder = await this.salesOrderDAO.getOneStrict({
      where: {
        id: opts.params.id,
      },
    });

    if (existingOrder.category === SalesOrderCategory.INBOUND) {
      throw ERR_INVALID_SALES_ORDER_DATA('cannot pickup in INBOUND order!');
    }

    if (
      existingOrder.status !== SalesOrderStatusEnum.READY_TO_DELIVER ||
      existingOrder.driverId !== opts.user.id
    ) {
      throw ERR_SALES_SO_PICK_UP_ORDER();
    }

    const qr = await this.salesOrderDAO.startTransaction();

    try {
      const order = await this.salesOrderDAO.upsertOne(
        {
          ...existingOrder,
          driverRemarks: opts.body.driverRemarks,
          status: SalesOrderStatusEnum.ON_DELIVERY,
        },
        opts.user,
        qr,
      );

      // set status booked stock to FINAL, reduce stock from operation unit
      await this.operationUnitStockDAO.releaseBookedStock({
        user: opts.user,
        qr,
        bookType: {
          salesOrderId: order.id,
        },
      });

      await this.salesOrderDAO.commitTransaction(qr);

      await this.operationUnitStockDAO.clearLatestStockCache(order.operationUnitId!);
      return this.getById({
        params: order,
      });
    } catch (error) {
      await this.salesOrderDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  async deliver(opts: {
    params: GetSalesOrderDetailParam;
    body: DeliverBody;
    user: RequestUser;
  }): Promise<SalesOrderItem> {
    const existingOrder = await this.salesOrderDAO.getOneStrict({
      where: {
        id: opts.params.id,
      },
    });

    if (existingOrder.category === SalesOrderCategory.INBOUND) {
      throw ERR_INVALID_SALES_ORDER_DATA('cannot deliver in INBOUND order!');
    }

    if (!existingOrder.customerId) {
      throw new Error('Data customer belum terdaftar');
    }

    const checkInDistance = await this.checkIn({
      customerId: existingOrder.customerId,
      latitude: opts.body.latitude,
      longitude: opts.body.longitude,
    });

    const qr = await this.salesOrderDAO.startTransaction();

    try {
      const order = await this.salesOrderDAO.upsertOne(
        {
          ...existingOrder,
          status: SalesOrderStatusEnum.DELIVERED,
          paymentMethod: opts.body.paymentMethod,
          paymentAmount: opts.body.paymentAmount,
          latitude: opts.body.latitude,
          longitude: opts.body.longitude,
          driverRemarks: opts.body.driverRemarks || existingOrder.driverRemarks,
          checkInDistance,
        },
        opts.user,
        qr,
      );

      await this.salesOrderDAO.commitTransaction(qr);

      return this.getById({
        params: order,
      });
    } catch (error) {
      await this.salesOrderDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  async returnProduct(opts: {
    params: GetSalesOrderDetailParam;
    body: ReturnProductBody;
    user: RequestUser;
  }): Promise<SalesOrderItem> {
    const existingOrder = await this.salesOrderDAO.getOneStrict({
      where: {
        id: opts.params.id,
      },
      relations: {
        operationUnitStocks: true,
      },
    });

    if (existingOrder.category === SalesOrderCategory.INBOUND) {
      throw ERR_INVALID_SALES_ORDER_DATA('cannot return product in INBOUND order!');
    }

    const totalOrderedWeight = existingOrder.operationUnitStocks.reduce(
      (weight, item) => weight + item.weight,
      0,
    );

    const totalReturnedWeight = opts.body.returnedProducts.reduce(
      (weight, item) => weight + item.weight,
      0,
    );

    if (totalOrderedWeight < totalReturnedWeight) {
      throw new Error("Returned product's weight is greater then ordered!");
    }

    const qr = await this.salesOrderDAO.startTransaction();

    try {
      const [productsInSalesOrder] = await this.productsInSalesOrderDAO.getMany({
        where: {
          salesOrderId: opts.params.id,
        },
      });

      let isPartialReturn = false;

      if (productsInSalesOrder.length !== opts.body.returnedProducts.length) {
        isPartialReturn = true;
      }

      const returnedProducts = opts.body.returnedProducts.reduce((prev, item) => {
        const product = productsInSalesOrder.find((p) => p.productItemId === item.productItemId);
        if (product) {
          prev.push({
            ...product,
            returnQuantity: item.quantity,
            returnWeight: item.weight,
          });

          if (product.quantity !== item.quantity || product.weight !== item.weight) {
            isPartialReturn = true;
          }
        } else {
          isPartialReturn = true;
        }

        return prev;
      }, [] as ProductsInSalesOrder[]);

      await this.productsInSalesOrderDAO.upsertManyWithoutCount(opts.user, returnedProducts, {
        qr,
      });

      const order = await this.salesOrderDAO.upsertOne(
        {
          ...existingOrder,
          status: SalesOrderStatusEnum.REJECTED,
          grStatus: SalesOrderGrStatusEnum.REJECTED,
          returnReason: opts.body.reason,
          returnStatus: isPartialReturn
            ? SalesOrderReturnStatusEnum.PARTIAL
            : SalesOrderReturnStatusEnum.FULL,
        },
        opts.user,
        qr,
      );

      await this.salesOrderDAO.commitTransaction(qr);

      return this.getById({
        params: order,
      });
    } catch (error) {
      await this.salesOrderDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private convertEntityToSalesOrderItem(entity: SalesOrder): SalesOrderItem {
    const isBookedStockAlready =
      [
        SalesOrderStatusEnum.BOOKED,
        SalesOrderStatusEnum.READY_TO_DELIVER,
        SalesOrderStatusEnum.ON_DELIVERY,
        SalesOrderStatusEnum.DELIVERED,
        SalesOrderStatusEnum.REJECTED,
      ].indexOf(entity.status) > -1;

    const bookedStockItems = entity.operationUnitStocks.reduce((prev, item) => {
      if (item.status === STOCK_STATUS.CANCELLED) return prev;

      // exclude system product
      // if (item.productItemId === SALES_TOTAL_WEIGHT_PRODUCT.id) return prev;

      const prevItem = prev.get(item.productItemId);
      if (prevItem) {
        prev.set(item.productItemId, {
          ...prevItem,
          quantity: prevItem.quantity + item.quantity,
          weight: prevItem.weight + item.weight,
        });
        return prev;
      }

      prev.set(item.productItemId, item);
      return prev;
    }, new Map<string, OperationUnitStock>());

    return {
      ...entity,
      customer: entity.customerId ? entity.customer : null,
      customerId: entity.customerId || null,
      customerName: entity.customerName || null,
      code: `${entity.operationUnit?.branch.code || 'TEMP'}/SO/${entity.id}`,
      remarks: entity.remarks || null,
      driverRemarks: entity.driverRemarks || null,
      deliveryTime: entity.deliveryTime?.toISOString() || null,
      createdDate: entity.createdDate.toISOString(),
      modifiedDate: entity.modifiedDate.toISOString(),
      operationUnit:
        (entity.operationUnit && {
          ...entity.operationUnit,
          province: {
            ...entity.operationUnit.province,
            name: entity.operationUnit.province.provinceName,
          },
          city: {
            ...entity.operationUnit.city,
            name: entity.operationUnit.city.cityName,
          },
          district: {
            ...entity.operationUnit.district,
            name: entity.operationUnit.district.districtName,
          },
        }) ||
        null,
      products: entity.products.map((item) => ({
        ...item,
        id: item.productItem.id,
        name: item.productItem.name,
        quantity: isBookedStockAlready
          ? bookedStockItems.get(item.productItemId)?.quantity || 0
          : item.quantity,
        weight: isBookedStockAlready ? item.bookedWeight || 0 : item.weight,
        minValue: item.productItem.minValue || undefined,
        maxValue: item.productItem.maxValue || undefined,
        category: item.productItem.category,
      })),
      goodsReceived:
        (entity.goodsReceived.length && {
          ...entity.goodsReceived[0],
          id: entity.goodsReceived[0].id,
          code: `${entity.operationUnit.branch.code}/GR/${entity.goodsReceived[0].id}`,
          status: entity.goodsReceived[0].status,
          products:
            (entity.goodsReceived[0].salesProductsInGoodsReceived &&
              entity.goodsReceived[0].salesProductsInGoodsReceived.map((product) => ({
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
      productNotes: entity.productNotes.map((item) => ({
        ...item,
        name: item.productcategory.name,
      })),
    };
  }

  private async getTotalProduct(
    products: {
      productItemId: string;
      quantity: number;
      weight: number;
      price: number;
    }[],
  ) {
    const [productItems] = await this.productItemDAO.getMany({
      where: {
        id: In(products.map((item) => item.productItemId)),
      },
    });

    const mappedProductItem = productItems.reduce(
      (prev, item) => prev.set(item.id, item),
      new Map<string, ProductItem>(),
    );

    return products.reduce(
      (prev, item) => {
        const productItem = mappedProductItem.get(item.productItemId);

        if (!productItem) return prev;

        return {
          totalWeight: prev.totalWeight + (item.weight || item.quantity * (productItem.value || 1)),
          totalQuantity: prev.totalQuantity + item.quantity,
          totalPrice: prev.totalPrice + item.weight * item.price,
        };
      },
      {
        totalWeight: 0,
        totalQuantity: 0,
        totalPrice: 0,
      },
    );
  }

  private async getTotalProductNotes(
    products: {
      productCategoryId: string;
      quantity: number;
      weight: number;
      price: number;
    }[],
  ) {
    const [productCategories] = await this.productCategoryDAO.getMany({
      where: {
        id: In(products.map((item) => item.productCategoryId)),
      },
    });

    const mappedProductCategory = productCategories.reduce(
      (prev, item) => prev.set(item.id, item),
      new Map<string, ProductCategory>(),
    );

    return products.reduce(
      (prev, item) => {
        const productCategory = mappedProductCategory.get(item.productCategoryId);

        if (!productCategory) return prev;

        return {
          totalWeight: 0,
          totalQuantity: prev.totalQuantity + item.quantity,
          totalPrice: prev.totalPrice + item.weight * item.price,
        };
      },
      {
        totalWeight: 0,
        totalQuantity: 0,
        totalPrice: 0,
      },
    );
  }

  async checkIn(opts: {
    customerId?: string;
    salesOrderId?: string;
    latitude: number;
    longitude: number;
  }): Promise<number> {
    if (!opts.customerId && !opts.salesOrderId) {
      throw ERR_SALES_DELIVERY_CHECK_IN('Customer ID or Sales Order ID is required!');
    }

    let customer: SalesCustomer;
    if (opts.customerId) {
      customer = await this.customerDAO.getOneStrict({
        where: {
          id: opts.customerId,
        },
      });
    } else {
      const salesOrder = await this.salesOrderDAO.getOneStrict({
        where: {
          id: opts.salesOrderId,
        },
        relations: {
          customer: true,
        },
      });

      customer = salesOrder.customer;
    }

    // calculate check-in distance
    const distanceMeter = calculateDistance(
      {
        lat: opts.latitude,
        lon: opts.longitude,
      },
      {
        lat: customer.latitude,
        lon: customer.longitude,
      },
    );

    if (distanceMeter > 20000) {
      throw ERR_SALES_DELIVERY_CHECK_IN(`Distance: ${distanceMeter} meter`);
    }

    return distanceMeter;
  }
}
