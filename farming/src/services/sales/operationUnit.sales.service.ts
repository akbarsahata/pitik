import { minutesToMilliseconds } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, ILike, In, Like, Not } from 'typeorm';
import { SalesOperationUnitDAO } from '../../dao/sales/operationUnit.dao';
import { OperationUnitLatestStockDAO } from '../../dao/sales/operationUnitLatestStock.dao';
import { OperationUnitStockDAO } from '../../dao/sales/operationUnitStock.dao';
import { ProductCategoryDAO } from '../../dao/sales/productCategory.dao';
import { ProductItemDAO } from '../../dao/sales/productItem.dao';
import { ProductsInOperationUnitDAO } from '../../dao/sales/productsInOperationUnit.dao';
import { UsersInOperationUnitDAO } from '../../dao/sales/usersInOperationUnit.dao';
import { UserDAO } from '../../dao/user.dao';
import {
  OperationUnit,
  OperationUnitTypeEnum,
} from '../../datasources/entity/pgsql/sales/OperationUnit.entity';
import { ProductItem } from '../../datasources/entity/pgsql/sales/ProductItem.entity';
import {
  CreateCheckInBody,
  CreateSalesOperationUnitBody,
  GetLatestStockQuery,
  GetSalesOperationUnitByIdParams,
  GetSalesOperationUnitsByIdResponseItem,
  GetSalesOperationUnitsQuery,
  LatestStockItemWithCategoryDetail,
  UpdateSalesOperationUnitBody,
} from '../../dto/sales/operationUnit.dto';
import { APP_ID, SALES_TOTAL_WEIGHT_PRODUCT } from '../../libs/constants';
import {
  ERR_INVALID_TYPE_OPERATION_PAYLOAD,
  ERR_OPERAION_UNIT_CHECK_IN,
} from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { tap } from '../../libs/utils/debuggers';
import { calculateDistance } from '../../libs/utils/helpers';
import { DecodedPlusCode, decodePlusCode } from '../../libs/utils/plusCode';

@Service()
export class OperationUnitsService {
  @Inject(OperationUnitStockDAO)
  private operationUnitStockDAO: OperationUnitStockDAO;

  @Inject(OperationUnitLatestStockDAO)
  private operationUnitLatestStockDAO: OperationUnitLatestStockDAO;

  @Inject(ProductCategoryDAO)
  private productCategoryDAO: ProductCategoryDAO;

  @Inject(ProductItemDAO)
  private productItemDAO: ProductItemDAO;

  @Inject(UsersInOperationUnitDAO)
  private usersInOperationUnitDAO: UsersInOperationUnitDAO;

  @Inject(ProductsInOperationUnitDAO)
  private productsInOperationUnitDAO: ProductsInOperationUnitDAO;

  @Inject(SalesOperationUnitDAO)
  private salesOperationUnitDAO: SalesOperationUnitDAO;

  @Inject(UserDAO)
  private userDAO: UserDAO;

  async get(
    filter: GetSalesOperationUnitsQuery,
    requestUser: RequestUser,
    appId?: string,
  ): Promise<[GetSalesOperationUnitsByIdResponseItem[], number]> {
    const limit = (filter.$limit && filter.$limit > 0 && filter.$limit) || undefined;
    const skip =
      limit && filter.$page !== undefined && filter.$page > 0 ? (filter.$page - 1) * limit : 0;

    const [usersInOperationUnit] = await this.usersInOperationUnitDAO.getMany({
      where: {
        userId: requestUser.id,
      },
    });

    const myOperationUnitIds = usersInOperationUnit.map(
      (operationUnit) => operationUnit.salesOperationUnitId,
    );

    const baseFilter: FindOptionsWhere<OperationUnit> = {
      operationUnitName: filter.operationUnitName && ILike(`%${filter.operationUnitName}`),
      provinceId: filter.provinceId,
      cityId: filter.cityId,
      districtId: filter.districtId,
      branchId: filter.branchId,
      plusCode: filter.plusCode ? Like(`%${filter.plusCode}%`) : undefined,
      status: filter.status,
      type: filter.type,
      category: filter.category,
      id:
        (filter.withinProductionTeam !== undefined &&
          filter.withinProductionTeam !== null &&
          ((filter.withinProductionTeam && In(myOperationUnitIds)) ||
            Not(In(myOperationUnitIds)))) ||
        undefined,
    };

    if (appId === APP_ID.DOWNSTREAM_APP) {
      const user = await this.userDAO.getOneStrict({
        where: {
          id: requestUser.id,
        },
      });

      if (user.branchId) {
        baseFilter.branchId = user.branchId;
      }
    }

    const [operationUnits, count] = await this.salesOperationUnitDAO.getMany({
      where: baseFilter,
      relations: {
        branch: true,
        province: true,
        city: true,
        district: true,
        salesUsersInOperationUnit: {
          user: true,
        },
        salesProductsInOperationUnit: {
          salesProductCategory: {
            items: true,
          },
        },
        userCreator: true,
        userModifier: true,
      },
      order: {
        modifiedDate: 'DESC',
      },
      skip,
      take: limit,
      cache: minutesToMilliseconds(1),
    });

    const operationUnitIds = operationUnits.map((operationUnit) => operationUnit.id);

    const operationUnitStocks = await this.getOperationUnitsStocks(operationUnitIds);

    tap(operationUnitStocks);

    return [
      operationUnits.map((operationUnit) =>
        this.mapEntityToDTO({
          ...operationUnit,
          totalStockWeight: operationUnitStocks.get(operationUnit.id)! || 0,
        }),
      ),
      count,
    ];
  }

  private async getOperationUnitsStocks(operationUnitIds: string[]): Promise<Map<string, number>> {
    const [operationUnitIdStocks] = await this.operationUnitLatestStockDAO.getMany({
      where: {
        operationUnitId: In(operationUnitIds),
        productItemId: SALES_TOTAL_WEIGHT_PRODUCT.id,
      },
    });

    return operationUnitIdStocks.reduce((prev, { operationUnitId, totalWeight }) => {
      prev.set(operationUnitId, totalWeight);
      return prev;
    }, new Map<string, number>());
  }

  async getById(operationId: string): Promise<GetSalesOperationUnitsByIdResponseItem> {
    const operationUnit = await this.salesOperationUnitDAO.getOneStrict({
      where: {
        id: operationId,
      },
      relations: {
        branch: true,
        province: true,
        city: true,
        district: true,
        salesUsersInOperationUnit: {
          user: true,
        },
        salesProductsInOperationUnit: {
          salesProductCategory: {
            items: true,
          },
        },
        userCreator: true,
        userModifier: true,
      },
      order: {
        createdDate: 'DESC',
      },
    });

    const operationUnitStocks = await this.getOperationUnitsStocks([operationUnit.id]);

    return this.mapEntityToDTO({
      ...operationUnit,
      totalStockWeight: operationUnitStocks.get(operationId)! || 0,
    });
  }

  async create(
    input: CreateSalesOperationUnitBody,
    user: RequestUser,
  ): Promise<GetSalesOperationUnitsByIdResponseItem> {
    const location = await decodePlusCode(input.plusCode);
    const qr = await this.salesOperationUnitDAO.startTransaction();
    let data: DeepPartial<OperationUnit> = {
      ...input,
      status: input.status || false,
      latitude: location.lat,
      longitude: location.lng,
    };

    if (data.type === OperationUnitTypeEnum.JAGAL) {
      data = {
        ...input,
        ...input.jagalData,
        lbLoss: input.jagalData?.liveBird?.lossPrecentage,
        lbPrice: input.jagalData?.liveBird?.price,
        lbWeight: input.jagalData?.liveBird?.weight,
        lbQuantity: input.jagalData?.liveBird?.quantity,
        status: input.status || false,
        latitude: location.lat,
        longitude: location.lng,
      };
    }

    try {
      const created = await this.salesOperationUnitDAO.createOneWithTx(data, user, qr);

      await this.productsInOperationUnitDAO.createManyWithTx(
        input.purchasableProducts.map((p) => ({
          salesOperationUnitId: created.id,
          salesProductCategoryId: p,
        })),
        user,
        qr,
      );

      if (input.productionTeams) {
        await this.usersInOperationUnitDAO.createManyWithTx(
          input.productionTeams.map((p) => ({
            salesOperationUnitId: created.id,
            userId: p,
          })),
          user,
          qr,
        );
      }

      await this.salesOperationUnitDAO.commitTransaction(qr);

      return await this.getById(created.id);
    } catch (error) {
      await this.salesOperationUnitDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  async update(
    user: RequestUser,
    input: UpdateSalesOperationUnitBody,
    id: string,
  ): Promise<GetSalesOperationUnitsByIdResponseItem> {
    const operation = await this.salesOperationUnitDAO.getOneStrict({
      where: {
        id,
      },
    });

    if (operation.type !== input.type) {
      throw ERR_INVALID_TYPE_OPERATION_PAYLOAD('Operation units type cannot be change!');
    }

    const [latestStocks] = await this.latestStocks({ params: { operationUnitId: operation.id } });

    if (
      !input.status &&
      latestStocks.find((stock) => stock.totalQuantity > 0 || stock.totalWeight > 0)
    ) {
      throw ERR_INVALID_TYPE_OPERATION_PAYLOAD('Operation unit still have some stocks available!');
    }

    let location: DecodedPlusCode = {
      lat: operation.latitude,
      lng: operation.longitude,
    };

    if (input.plusCode && operation.plusCode !== input.plusCode) {
      location = await decodePlusCode(input.plusCode);
    }

    const qr = await this.salesOperationUnitDAO.startTransaction();
    const { purchasableProducts, productionTeams, jagalData, ...inputData } = input;

    let data: Partial<OperationUnit> = {
      ...inputData,
      status: input.status || false,
      latitude: location.lat,
      longitude: location.lng,
    };

    if (data.type === OperationUnitTypeEnum.JAGAL) {
      data = {
        ...inputData,

        lbLoss: jagalData?.liveBird?.lossPrecentage,
        lbPrice: jagalData?.liveBird?.price,
        lbWeight: jagalData?.liveBird?.weight,
        lbQuantity: jagalData?.liveBird?.quantity,
        operationalDays: jagalData?.operationalDays,
        operationalExpenses: jagalData?.operationalExpenses,

        status: input.status || false,
        latitude: location.lat,
        longitude: location.lng,
      };
    }

    try {
      await this.salesOperationUnitDAO.updateOneWithTx({ id }, data, user, qr);

      await this.productsInOperationUnitDAO.softDeleteManyWithTx(
        {
          salesOperationUnitId: id,
        },
        qr,
      );

      await this.productsInOperationUnitDAO.upsertMany(
        user,
        purchasableProducts.map((p) => ({
          salesOperationUnitId: id,
          salesProductCategoryId: p,
        })),
        {
          qr,
        },
      );

      await this.usersInOperationUnitDAO.softDeleteManyWithTx(
        {
          salesOperationUnitId: id,
        },
        qr,
      );

      if (productionTeams) {
        await this.usersInOperationUnitDAO.upsertMany(
          user,
          productionTeams.map((p) => ({
            salesOperationUnitId: id,
            userId: p,
          })),
          {
            qr,
          },
        );
      }

      await this.salesOperationUnitDAO.commitTransaction(qr);

      return await this.getById(id);
    } catch (error) {
      await this.salesOperationUnitDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  async latestStocks(opts: {
    params: GetSalesOperationUnitByIdParams;
    query?: GetLatestStockQuery;
  }): Promise<[LatestStockItemWithCategoryDetail[], number]> {
    const stocks = await this.operationUnitStockDAO.calculateStock(opts.params.operationUnitId);

    const [productCategories] = await this.productCategoryDAO.getMany({
      where: {
        id: opts.query?.productCategoryId,
        items: {
          id: In(stocks.map((s) => s.productItemId)),
        },
      },
      relations: {
        items: true,
      },
    });

    const [productItems] = await this.productItemDAO.getMany({
      where: {
        categoryId: In(productCategories.map((s) => s.id)),
      },
      order: {
        minValue: 'ASC',
      },
    });

    const mapProductItems = productItems.reduce((prev, item) => {
      const items = prev.get(item.categoryId) || [];
      items.push(item);
      prev.set(item.categoryId, items);
      return prev;
    }, new Map<string, ProductItem[]>());

    const stocksWithCategoryDetail = productCategories
      .filter((item) => item.id !== SALES_TOTAL_WEIGHT_PRODUCT.categoryId)
      .reduce((prev, productCategory) => {
        const stockPerCategory: LatestStockItemWithCategoryDetail = {
          productCategoryId: productCategory.id,
          productCategoryName: productCategory.name,
          totalQuantity: 0,
          totalWeight: 0,
          productItems: [],
        };

        (mapProductItems.get(productCategory.id) || []).forEach((item) => {
          const stock = stocks.find((s) => s.productItemId === item.id);

          if (stock) {
            stockPerCategory.totalQuantity += stock.availableQuantity;
            stockPerCategory.totalWeight += stock.availableWeight;
            stockPerCategory.productItems.push({
              ...stock,
              productItemId: item.id,
              name: item.name,
            });
          } else {
            stockPerCategory.productItems.push({
              productItemId: item.id,
              name: item.name,
              totalQuantity: 0,
              totalWeight: 0,
              availableQuantity: 0,
              availableWeight: 0,
              reservedQuantity: 0,
              reservedWeight: 0,
            });
          }
        });

        prev.push(stockPerCategory);
        return prev;
      }, [] as LatestStockItemWithCategoryDetail[]);

    return [stocksWithCategoryDetail, stocksWithCategoryDetail.length];
  }

  async checkIn(id: string, body: CreateCheckInBody): Promise<number> {
    const customer = await this.salesOperationUnitDAO.getOneStrict({
      where: {
        id,
      },
    });

    // calculate check-in distance
    const distanceMeter = calculateDistance(
      {
        lat: body.latitude,
        lon: body.longitude,
      },
      {
        lat: customer.latitude,
        lon: customer.longitude,
      },
    );

    if (distanceMeter > 100) {
      throw ERR_OPERAION_UNIT_CHECK_IN(`(${distanceMeter.toFixed(2)} meter)`);
    }

    return distanceMeter;
  }

  // eslint-disable-next-line class-methods-use-this
  private mapEntityToDTO(
    data: OperationUnit & { totalStockWeight: number },
  ): GetSalesOperationUnitsByIdResponseItem {
    return {
      ...data,
      branch: {
        ...data.branch,
        name: data.branch.name,
      },
      province: {
        ...data.province,
        name: data.province.provinceName,
      },
      city: {
        ...data.city,
        name: data.city.cityName,
      },
      district: {
        ...data.district,
        name: data.district.districtName,
      },
      jagalData:
        (data.type === OperationUnitTypeEnum.JAGAL && {
          priceBasis: data.priceBasis,
          liveBird: {
            quantity: data.lbQuantity,
            weight: data.lbWeight,
            price: data.lbPrice,
            lossPrecentage: data.lbLoss,
          },
          operationalDays: data.operationalDays,
          operationalExpenses: data.operationalExpenses,
        }) ||
        null,
      productionTeams: data.salesUsersInOperationUnit.map((user) => user.user),
      purchasableProducts: data.salesProductsInOperationUnit
        .map((productCategory) => ({
          ...productCategory.salesProductCategory,
          id: productCategory.salesProductCategory.id,
          name: productCategory.salesProductCategory.name,
          productItems: productCategory.salesProductCategory.items.sort(
            (a, b) => (a.minValue || 0) - (b.minValue || 0),
          ),
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
      createdDate: data.createdDate.toISOString(),
      modifiedDate: data.modifiedDate.toISOString(),
      createdBy: data.userCreator?.fullName || null,
      modifiedBy: data.userModifier?.fullName || null,
    };
  }
}
