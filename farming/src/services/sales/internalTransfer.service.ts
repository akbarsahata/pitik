/* eslint-disable class-methods-use-this */
import { format } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { Between, FindOptionsWhere, ILike, In } from 'typeorm';
import { InternalTransferDAO } from '../../dao/sales/internalTransfer.dao';
import { OperationUnitStockDAO } from '../../dao/sales/operationUnitStock.dao';
import { ProductCategoryDAO } from '../../dao/sales/productCategory.dao';
import { ProductsInInternalTransferDAO } from '../../dao/sales/productsInInternalTransfer.dao';
import { UsersInOperationUnitDAO } from '../../dao/sales/usersInOperationUnit.dao';
import {
  InternalTransfer,
  InternalTransferStatusEnum,
} from '../../datasources/entity/pgsql/sales/InternalTransfer.entity';
import {
  GetInternalTransfersQuery,
  InternalTransferDeliveredBody,
  InternalTransferForm,
  InternalTransferIdParam,
  InternalTransferItem,
  InternalTransferPickUpBody,
  InternalTransfersetDriver,
  ProductCategory,
} from '../../dto/sales/internalTransfer.dto';
import {
  APP_ID,
  DATETIME_00_SQL_FORMAT,
  DATETIME_59_SQL_FORMAT,
  SALES_PRODUCT_CATEGORY_GROUP,
  SALES_TOTAL_WEIGHT_PRODUCT,
  USER_TYPE,
} from '../../libs/constants';
import {
  ERR_BAD_REQUEST,
  ERR_SALES_ARRIVED_INTERNAL_TRANSFER_FAILED,
  ERR_SALES_BOOK_STOCK_INTERNAL_TRANSFER_FAILED,
  ERR_SALES_CANCEL_BOOK_STOCK_INTERNAL_TRANSFER_FAILED,
  ERR_SALES_CANCEL_INTERNAL_TRANSFER_FAILED,
  ERR_SALES_CANCEL_READY_TO_DELIVER_INTERNAL_TRANSFER_FAILED,
  ERR_SALES_CREATE_INTERNAL_TRANSFER_FAILED,
  ERR_SALES_DELIVERY_CHECK_IN,
  ERR_SALES_PICKUP_INTERNAL_TRANSFER_FAILED_1,
  ERR_SALES_PICKUP_INTERNAL_TRANSFER_FAILED_2,
  ERR_SALES_SET_DRIVER_INTERNAL_TRANSFER_FAILED,
  ERR_SALES_UPDATE_INTERNAL_TRANSFER_FAILED,
} from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { calculateDistance } from '../../libs/utils/helpers';

@Service()
export class InternalTransferService {
  @Inject(InternalTransferDAO)
  private internalTransferDAO!: InternalTransferDAO;

  @Inject(OperationUnitStockDAO)
  private operationUnitStockDAO: OperationUnitStockDAO;

  @Inject(ProductCategoryDAO)
  private productCategoryDAO: ProductCategoryDAO;

  @Inject(ProductsInInternalTransferDAO)
  private productsInInternalTransferDAO!: ProductsInInternalTransferDAO;

  @Inject(UsersInOperationUnitDAO)
  private usersInOperationUnitDAO: UsersInOperationUnitDAO;

  async create(opts: {
    body: InternalTransferForm;
    user: RequestUser;
  }): Promise<InternalTransferItem> {
    // validate products
    await this.productCategoryDAO.validateQuantityAndWeight(opts.body.products);

    if (
      opts.body.status !== InternalTransferStatusEnum.DRAFT &&
      opts.body.status !== InternalTransferStatusEnum.CONFIRMED
    ) {
      throw ERR_SALES_CREATE_INTERNAL_TRANSFER_FAILED(
        'Invalid transfer status. You can only create transfer with status DRAFT or CONFIRMED',
      );
    }

    const qr = await this.internalTransferDAO.startTransaction();

    try {
      const transfer = await this.internalTransferDAO.upsertOne(opts.user, opts.body);

      await this.productsInInternalTransferDAO.upsertMany(
        opts.user,
        opts.body.products.map((p) => ({
          internalTransferId: transfer.id,
          ...p,
        })),
        {
          qr,
        },
      );

      await this.internalTransferDAO.commitTransaction(qr);

      return this.getById({
        params: transfer,
      });
    } catch (error) {
      await this.internalTransferDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  async update(opts: {
    body: InternalTransferForm;
    params: InternalTransferIdParam;
    user: RequestUser;
  }): Promise<InternalTransferItem> {
    // validate products
    await this.productCategoryDAO.validateQuantityAndWeight(opts.body.products);

    const existingTransfer = await this.internalTransferDAO.getOneStrict({
      where: {
        id: opts.params.id,
      },
    });

    if (existingTransfer.status !== InternalTransferStatusEnum.DRAFT) {
      throw ERR_SALES_UPDATE_INTERNAL_TRANSFER_FAILED();
    }

    const qr = await this.internalTransferDAO.startTransaction();

    try {
      const transfer = await this.internalTransferDAO.upsertOne(
        opts.user,
        {
          ...existingTransfer,
          ...opts.body,
        },
        { qr },
      );

      await this.productsInInternalTransferDAO.softDeleteManyWithTx(
        {
          internalTransferId: transfer.id,
        },
        qr,
      );

      await this.productsInInternalTransferDAO.upsertMany(
        opts.user,
        opts.body.products.map((p) => ({
          internalTransferId: transfer.id,
          ...p,
        })),
        {
          qr,
        },
      );

      await this.internalTransferDAO.commitTransaction(qr);

      return this.getById({
        params: transfer,
      });
    } catch (error) {
      await this.internalTransferDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  async getById(opts: { params: InternalTransferIdParam }): Promise<InternalTransferItem> {
    const transfer = await this.internalTransferDAO.getOneStrict({
      where: {
        id: opts.params.id,
      },
      relations: {
        goodsReceived: {
          salesProductsInGoodsReceived: {
            salesProductItem: {
              category: true,
            },
          },
        },
        sourceOperationUnit: {
          branch: true,
        },
        targetOperationUnit: true,
        driver: true,
        products: {
          productItem: {
            category: true,
          },
        },
        userCreator: true,
        userModifier: true,
      },
    });

    return this.convertTransferEntityToDTO(transfer);
  }

  async getInternalTransfers(
    filter: GetInternalTransfersQuery,
    user: RequestUser,
    appId?: string,
  ): Promise<[InternalTransferItem[], number]> {
    if (filter.productItemId && !filter.productCategoryId) {
      throw new ERR_BAD_REQUEST('Product category is required!');
    }

    if (!filter.source && filter.sourceOperationUnitId) {
      throw new ERR_BAD_REQUEST('Source is required!');
    }

    const take = filter.$limit || 10;
    const skip = filter.$page && filter.$page > 0 ? (filter.$page - 1) * take : 0;

    const isShopkeeper = user.roles?.some((role) => role.name === USER_TYPE.SHOPKEEPER) || false;
    const isDriver = user.roles?.some((role) => role.name === USER_TYPE.DRIVER) || false;
    const isOperationalLead =
      user.roles?.some((role) => role.name === USER_TYPE.OPERATIONAL_LEAD) || false;

    const baseFilter: FindOptionsWhere<InternalTransfer> = {
      id: (filter.code && ILike(`%${filter.code.split('/').pop()}%`)) || undefined,
      createdBy: filter.createdBy,
      driverId: filter.driverId || undefined,
      targetOperationUnitId: filter.targetOperationUnitId,
      status: Array.isArray(filter.status) ? In(filter.status) : filter.status,
      createdDate: filter.createdDate
        ? Between(
            new Date(format(new Date(filter.createdDate), DATETIME_00_SQL_FORMAT)),
            new Date(format(new Date(filter.createdDate), DATETIME_59_SQL_FORMAT)),
          )
        : undefined,
      ...(filter.source &&
        !filter.sourceOperationUnitId && {
          sourceOperationUnit: {
            type: filter.source,
          },
        }),
      ...(filter.sourceOperationUnitId &&
        !isOperationalLead &&
        !isShopkeeper && {
          sourceOperationUnitId: filter.sourceOperationUnitId,
        }),
      ...(filter.productCategoryId &&
        !filter.productItemId && {
          products: {
            productItem: {
              categoryId: filter.productCategoryId,
            },
          },
        }),
      ...(filter.productItemId && {
        products: {
          productItemId: filter.productItemId,
        },
      }),
    };

    const mapRoleToFilter = new Map<string, FindOptionsWhere<InternalTransfer>>();

    const [operationUnits] = await this.usersInOperationUnitDAO.getMany({
      where: {
        userId: user.id,
      },
    });
    const operationUnitIds = operationUnits.map(
      (operationUnit) => operationUnit.salesOperationUnitId,
    );

    if (appId === APP_ID.DOWNSTREAM_APP) {
      let defaultStatusFilter = [
        InternalTransferStatusEnum.ON_DELIVERY,
        InternalTransferStatusEnum.DELIVERED,
        InternalTransferStatusEnum.RECEIVED,
      ];

      if (filter.status) {
        defaultStatusFilter = (
          (Array.isArray(filter.status) && filter.status) || [filter.status]
        ).filter((status) => defaultStatusFilter.some((defaultStatus) => status === defaultStatus));
      }

      // operational lead filter
      if (isOperationalLead) {
        const sourceOperationalLeadFilter = { ...baseFilter };

        sourceOperationalLeadFilter.sourceOperationUnitId = filter.sourceOperationUnitId
          ? filter.sourceOperationUnitId
          : In(operationUnitIds);

        sourceOperationalLeadFilter.driverId = undefined;

        mapRoleToFilter.set(`${USER_TYPE.OPERATIONAL_LEAD}_SOURCE`, sourceOperationalLeadFilter);

        const targetOperationalLeadFilter = { ...baseFilter };

        targetOperationalLeadFilter.status = In(defaultStatusFilter);

        targetOperationalLeadFilter.targetOperationUnitId = filter.targetOperationUnitId
          ? filter.targetOperationUnitId
          : In(operationUnitIds);

        targetOperationalLeadFilter.driverId = undefined;

        mapRoleToFilter.set(`${USER_TYPE.OPERATIONAL_LEAD}_TARGET`, targetOperationalLeadFilter);
      }

      // shopkeeper filter
      if (isShopkeeper) {
        const sourceShopkeeperFilter = { ...baseFilter };

        sourceShopkeeperFilter.sourceOperationUnitId = filter.sourceOperationUnitId
          ? filter.sourceOperationUnitId
          : In(operationUnitIds);

        sourceShopkeeperFilter.driverId = undefined;

        mapRoleToFilter.set(`${USER_TYPE.SHOPKEEPER}_SOURCE`, sourceShopkeeperFilter);

        const targetShopkeeperFilter = { ...baseFilter };

        targetShopkeeperFilter.status = In(defaultStatusFilter);

        targetShopkeeperFilter.targetOperationUnitId = filter.targetOperationUnitId
          ? filter.targetOperationUnitId
          : In(operationUnitIds);

        targetShopkeeperFilter.driverId = undefined;

        mapRoleToFilter.set(`${USER_TYPE.SHOPKEEPER}_TARGET`, targetShopkeeperFilter);
      }

      // driver filter
      if (isDriver) {
        const driverFilter = { ...baseFilter };

        driverFilter.driverId = user.id;

        mapRoleToFilter.set(USER_TYPE.DRIVER, driverFilter);
      }
    }

    const filters = Array.from(mapRoleToFilter.values());

    const [transfers, count] = await this.internalTransferDAO.getMany({
      where: (filters.length > 0 && filters) || baseFilter,
      take,
      skip,
      order: {
        modifiedDate: 'DESC',
      },
      relations: {
        goodsReceived: {
          salesProductsInGoodsReceived: {
            salesProductItem: {
              category: true,
            },
          },
        },
        sourceOperationUnit: {
          branch: true,
          salesUsersInOperationUnit: true,
        },
        targetOperationUnit: {
          salesUsersInOperationUnit: true,
        },
        driver: true,
        products: {
          productItem: {
            category: true,
          },
        },
        userCreator: true,
        userModifier: true,
      },
    });

    return [transfers.map((transfer) => this.convertTransferEntityToDTO(transfer)), count];
  }

  async cancel(opts: { user: RequestUser; params: InternalTransferIdParam }) {
    const existingTransfer = await this.internalTransferDAO.getOneStrict({
      where: {
        id: opts.params.id,
      },
    });

    if (
      existingTransfer.status !== InternalTransferStatusEnum.DRAFT &&
      existingTransfer.status !== InternalTransferStatusEnum.CONFIRMED
    ) {
      throw ERR_SALES_CANCEL_INTERNAL_TRANSFER_FAILED(
        `Current status is ${existingTransfer.status}`,
      );
    }

    const qr = await this.internalTransferDAO.startTransaction();

    try {
      await this.internalTransferDAO.upsertOne(
        opts.user,
        {
          ...existingTransfer,
          status: InternalTransferStatusEnum.CANCELLED,
        },
        {
          qr,
        },
      );

      await this.internalTransferDAO.commitTransaction(qr);

      return;
    } catch (error) {
      await this.internalTransferDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  async bookStock(opts: { user: RequestUser; params: InternalTransferIdParam }) {
    const existingTransfer = await this.internalTransferDAO.getOneStrict({
      where: {
        id: opts.params.id,
      },
      relations: {
        products: {
          productItem: {
            category: true,
          },
        },
      },
    });

    if (existingTransfer.status !== InternalTransferStatusEnum.CONFIRMED) {
      throw ERR_SALES_BOOK_STOCK_INTERNAL_TRANSFER_FAILED(
        `Current status is ${existingTransfer.status}`,
      );
    }

    const qr = await this.internalTransferDAO.startTransaction();

    try {
      await this.internalTransferDAO.upsertOne(
        opts.user,
        {
          ...existingTransfer,
          status: InternalTransferStatusEnum.BOOKED,
        },
        {
          qr,
        },
      );

      await this.operationUnitStockDAO.bookStock({
        qr,
        user: opts.user,
        products: [
          ...existingTransfer.products.map((item) => {
            if (
              SALES_PRODUCT_CATEGORY_GROUP.QUANTITY.some(
                (code) => code === item.productItem.category.code,
              )
            ) {
              return {
                productItemId: item.productItemId,
                quantity: item.quantity,
                weight: 0,
              };
            }

            return item;
          }),
          {
            productItemId: SALES_TOTAL_WEIGHT_PRODUCT.id,
            quantity: 0,
            weight: existingTransfer.products.reduce((prev, item) => prev + item.weight, 0),
          },
        ],
        operationUnitId: existingTransfer.sourceOperationUnitId,
        bookType: {
          internalTransferId: existingTransfer.id,
        },
      });

      await this.internalTransferDAO.commitTransaction(qr);

      await this.operationUnitStockDAO.clearLatestStockCache(
        existingTransfer.sourceOperationUnitId,
      );
      return;
    } catch (error) {
      await this.internalTransferDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  async cancelBookStock(opts: { user: RequestUser; params: InternalTransferIdParam }) {
    const existingTransfer = await this.internalTransferDAO.getOneStrict({
      where: {
        id: opts.params.id,
      },
      relations: {
        products: true,
      },
    });

    if (existingTransfer.status !== InternalTransferStatusEnum.BOOKED) {
      throw ERR_SALES_CANCEL_BOOK_STOCK_INTERNAL_TRANSFER_FAILED(
        `Current status is ${existingTransfer.status}`,
      );
    }

    const qr = await this.internalTransferDAO.startTransaction();

    try {
      await this.internalTransferDAO.upsertOne(
        opts.user,
        {
          ...existingTransfer,
          status: InternalTransferStatusEnum.CONFIRMED,
        },
        {
          qr,
        },
      );

      await this.operationUnitStockDAO.cancelBookStock({
        user: opts.user,
        bookType: {
          internalTransferId: existingTransfer.id,
        },
        qr,
      });

      await this.internalTransferDAO.commitTransaction(qr);

      await this.operationUnitStockDAO.clearLatestStockCache(
        existingTransfer.sourceOperationUnitId,
      );
      return;
    } catch (error) {
      await this.internalTransferDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  async setDriver(opts: {
    user: RequestUser;
    params: InternalTransferIdParam;
    body: InternalTransfersetDriver;
  }) {
    const existingTransfer = await this.internalTransferDAO.getOneStrict({
      where: {
        id: opts.params.id,
      },
      relations: {
        products: true,
      },
    });

    if (
      existingTransfer.status !== InternalTransferStatusEnum.BOOKED &&
      existingTransfer.status !== InternalTransferStatusEnum.READY_TO_DELIVER
    ) {
      throw ERR_SALES_SET_DRIVER_INTERNAL_TRANSFER_FAILED(
        `Current status is ${existingTransfer.status}`,
      );
    }

    const qr = await this.internalTransferDAO.startTransaction();

    try {
      await this.internalTransferDAO.upsertOne(
        opts.user,
        {
          ...existingTransfer,
          status: InternalTransferStatusEnum.READY_TO_DELIVER,
          driverId: opts.body.driverId,
        },
        {
          qr,
        },
      );

      await this.internalTransferDAO.commitTransaction(qr);

      return;
    } catch (error) {
      await this.internalTransferDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  async cancelReadyToDeliver(opts: { params: InternalTransferIdParam; user: RequestUser }) {
    const existingTransfer = await this.internalTransferDAO.getOneStrict({
      where: {
        id: opts.params.id,
      },
    });

    if (existingTransfer.status !== InternalTransferStatusEnum.READY_TO_DELIVER) {
      throw ERR_SALES_CANCEL_READY_TO_DELIVER_INTERNAL_TRANSFER_FAILED(
        `Current status is ${existingTransfer.status}`,
      );
    }

    const qr = await this.internalTransferDAO.startTransaction();

    try {
      await this.internalTransferDAO.upsertOne(
        opts.user,
        {
          ...existingTransfer,
          status: InternalTransferStatusEnum.BOOKED,
          driverId: null,
        },
        {
          qr,
        },
      );

      await this.internalTransferDAO.commitTransaction(qr);

      return;
    } catch (error) {
      await this.internalTransferDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  async pickUp(opts: {
    user: RequestUser;
    params: InternalTransferIdParam;
    body: InternalTransferPickUpBody;
  }) {
    const existingTransfer = await this.internalTransferDAO.getOneStrict({
      where: {
        id: opts.params.id,
      },
      relations: {
        products: true,
      },
    });

    if (existingTransfer.status !== InternalTransferStatusEnum.READY_TO_DELIVER) {
      throw ERR_SALES_PICKUP_INTERNAL_TRANSFER_FAILED_1(
        `Current status is ${existingTransfer.status}`,
      );
    }

    if (existingTransfer.driverId !== opts.user.id) {
      throw ERR_SALES_PICKUP_INTERNAL_TRANSFER_FAILED_2();
    }

    const qr = await this.internalTransferDAO.startTransaction();

    try {
      await this.internalTransferDAO.upsertOne(
        opts.user,
        {
          ...existingTransfer,
          status: InternalTransferStatusEnum.ON_DELIVERY,
          driverRemarks: opts.body.driverRemarks || existingTransfer.driverRemarks,
        },
        {
          qr,
        },
      );

      // set status booked stock to FINAL, reduce stock from operation unit
      await this.operationUnitStockDAO.releaseBookedStock({
        user: opts.user,
        qr,
        bookType: {
          internalTransferId: existingTransfer.id,
        },
      });

      await this.internalTransferDAO.commitTransaction(qr);

      await this.operationUnitStockDAO.clearLatestStockCache(
        existingTransfer.sourceOperationUnitId!,
      );
      return;
    } catch (error) {
      await this.internalTransferDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  async delivered(opts: {
    user: RequestUser;
    params: InternalTransferIdParam;
    body: InternalTransferDeliveredBody;
  }) {
    const checkInDistance = await this.checkIn({
      id: opts.params.id,
      latitude: opts.body.latitude,
      longitude: opts.body.longitude,
    });

    const existingTransfer = await this.internalTransferDAO.getOneStrict({
      where: {
        id: opts.params.id,
      },
      relations: {
        products: true,
        targetOperationUnit: true,
      },
    });

    if (existingTransfer.status !== InternalTransferStatusEnum.ON_DELIVERY) {
      throw ERR_SALES_ARRIVED_INTERNAL_TRANSFER_FAILED(
        `Current status is ${existingTransfer.status}`,
      );
    }

    const qr = await this.internalTransferDAO.startTransaction();

    try {
      await this.internalTransferDAO.upsertOne(
        opts.user,
        {
          ...existingTransfer,
          status: InternalTransferStatusEnum.DELIVERED,
          checkInLatitude: opts.body.latitude,
          checkInLongitude: opts.body.longitude,
          driverRemarks: opts.body.driverRemarks || existingTransfer.driverRemarks,
          checkInDistance,
        },
        {
          qr,
        },
      );

      await this.internalTransferDAO.commitTransaction(qr);

      return;
    } catch (error) {
      await this.internalTransferDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  async checkIn(opts: { id: string; latitude: number; longitude: number }): Promise<number> {
    const existingTransfer = await this.internalTransferDAO.getOneStrict({
      where: {
        id: opts.id,
      },
      relations: {
        products: true,
        targetOperationUnit: true,
      },
    });

    const distanceMeter = calculateDistance(
      {
        lat: opts.latitude,
        lon: opts.longitude,
      },
      {
        lat: existingTransfer.targetOperationUnit!.latitude,
        lon: existingTransfer.targetOperationUnit!.longitude,
      },
    );

    if (distanceMeter > 20000) {
      throw ERR_SALES_DELIVERY_CHECK_IN(`Distance: ${distanceMeter} meter`);
    }

    return distanceMeter;
  }

  private convertTransferEntityToDTO(transfer: InternalTransfer): InternalTransferItem {
    const groupProductByCategory = transfer.products.reduce((prev, item) => {
      if (!prev.has(item.productItem.categoryId)) {
        prev.set(item.productItem.categoryId, {
          ...item.productItem.category,
          totalQuantity: 0,
          totalWeight: 0,
          productItems: [],
        });
      }

      const category = prev.get(item.productItem.categoryId)!;
      category.totalQuantity += item.quantity;
      category.totalWeight += item.weight;
      category.productItems.push({
        id: item.productItem.id,
        name: item.productItem.name,
        quantity: item.quantity,
        weight: item.weight,
      });

      prev.set(item.productItem.categoryId, category);

      return prev;
    }, new Map<string, ProductCategory>());
    return {
      ...transfer,
      products: Array.from(groupProductByCategory.values()),
      code: `${transfer.sourceOperationUnit.branch.code}/TF/${transfer.id}`,
      remarks: transfer.remarks || null,
      driverRemarks: transfer.driverRemarks || null,
      goodsReceived:
        (transfer.goodsReceived.length && {
          ...transfer.goodsReceived[0],
          id: transfer.goodsReceived[0].id,
          code: `${transfer.sourceOperationUnit.branch.code}/GR/${transfer.goodsReceived[0].id}`,
          status: transfer.goodsReceived[0].status,
          products:
            (transfer.goodsReceived[0].salesProductsInGoodsReceived &&
              transfer.goodsReceived[0].salesProductsInGoodsReceived.map((product) => ({
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
      createdDate: transfer.createdDate.toISOString(),
      modifiedDate: transfer.modifiedDate.toISOString(),
      createdBy: transfer.userCreator.email,
      modifiedBy: transfer.userModifier.email,
    };
  }
}
