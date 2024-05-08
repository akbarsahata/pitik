import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { FindOptionsWhere } from 'typeorm';
import { OperationUnitStockDAO } from '../../dao/sales/operationUnitStock.dao';
import { ProductCategoryDAO } from '../../dao/sales/productCategory.dao';
import { ProductsInStockDisposalDAO } from '../../dao/sales/productsInStockDisposal.dao';
import { StockDisposalDAO } from '../../dao/sales/stockDisposal.dao';
import { UserDAO } from '../../dao/user.dao';
import {
  StockDisposal,
  StockDisposalStatusEnum,
} from '../../datasources/entity/pgsql/sales/StockDisposal.entity';
import {
  CreateSalesStockDisposalBody,
  GetSalesStockDisposalByIdResponseItem,
  GetSalesStockDisposalsQuery,
  UpdateSalesStockDisposalBody,
} from '../../dto/sales/stockDisposal.dto';
import { APP_ID, DEFAULT_TIME_ZONE, SALES_TOTAL_WEIGHT_PRODUCT } from '../../libs/constants';
import { ERR_SALES_STOCK_DISPOSAL_INVALID_STATUS } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';

@Service()
export class SalesStockDisposalService {
  @Inject(StockDisposalDAO)
  private dao: StockDisposalDAO;

  @Inject(OperationUnitStockDAO)
  private operationUnitStockDAO: OperationUnitStockDAO;

  @Inject(ProductCategoryDAO)
  private productCategoryDAO: ProductCategoryDAO;

  @Inject(ProductsInStockDisposalDAO)
  private productsInStockDisposalDAO: ProductsInStockDisposalDAO;

  @Inject(UserDAO)
  private userDAO: UserDAO;

  async get(
    filter: GetSalesStockDisposalsQuery,
    requestUser: RequestUser,
    appId?: string,
  ): Promise<[GetSalesStockDisposalByIdResponseItem[], number]> {
    const limit = (filter.$limit && filter.$limit > 0 && filter.$limit) || undefined;
    const skip =
      limit && filter.$page !== undefined && filter.$page > 0 ? (filter.$page - 1) * limit : 0;

    const baseFilter: FindOptionsWhere<StockDisposal> = {
      salesOperationUnitId: filter.operationUnitId,
      status: filter.status,
    };

    if (appId === APP_ID.DOWNSTREAM_APP) {
      const user = await this.userDAO.getOneStrict({
        where: {
          id: requestUser.id,
        },
      });

      baseFilter.salesOperationUnit = {
        branchId: user.branchId,
        salesUsersInOperationUnit: {
          userId: requestUser.id,
        },
      };
    }

    const [disposals, count] = await this.dao.getMany({
      where: baseFilter,
      relations: {
        salesOperationUnit: {
          branch: true,
          province: true,
          city: true,
          district: true,
          salesUsersInOperationUnit: true,
        },
        salesProductsInStockDisposal: {
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

    return [disposals.map((item) => this.mapStockDisposalEntityToDTO(item)), count];
  }

  async getById(id: string): Promise<GetSalesStockDisposalByIdResponseItem> {
    const item = await this.dao.getOneStrict({
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
        reviewer: true,
        salesProductsInStockDisposal: {
          salesProductItem: {
            category: true,
          },
        },
        userCreator: true,
        userModifier: true,
      },
    });

    return this.mapStockDisposalEntityToDTO(item);
  }

  async createStockDisposal(
    input: CreateSalesStockDisposalBody,
    user: RequestUser,
  ): Promise<GetSalesStockDisposalByIdResponseItem> {
    await this.productCategoryDAO.validateQuantityAndWeight([input.product]);

    const qr = await this.dao.startTransaction();

    try {
      const created = await this.dao.upsertOne(
        user,
        {
          ...input,
          salesOperationUnitId: input.operationUnitId,
        },
        {
          qr,
        },
      );

      await this.productsInStockDisposalDAO.createManyWithTx(
        [
          {
            ...input.product,
            salesStockDisposalId: created.id,
            salesProductItemId: input.product.productItemId,
          },
        ],
        user,
        qr,
      );

      await this.dao.commitTransaction(qr);

      return await this.getById(created.id);
    } catch (error) {
      await this.dao.rollbackTransaction(qr);
      throw error;
    }
  }

  async update(
    user: RequestUser,
    input: UpdateSalesStockDisposalBody,
    id: string,
  ): Promise<GetSalesStockDisposalByIdResponseItem> {
    await this.productCategoryDAO.validateQuantityAndWeight([input.product]);

    const currentStockDisposal = await this.dao.getOneStrict({
      where: {
        id,
      },
      relations: {
        salesOperationUnit: true,
      },
    });

    if (
      currentStockDisposal.status === StockDisposalStatusEnum.CANCELLED &&
      input.status !== StockDisposalStatusEnum.CANCELLED
    ) {
      throw ERR_SALES_STOCK_DISPOSAL_INVALID_STATUS(
        'Cannot perform request on CANCELLED stock disposal! Please create a new one',
      );
    }

    if (currentStockDisposal.status === StockDisposalStatusEnum.REJECTED) {
      throw ERR_SALES_STOCK_DISPOSAL_INVALID_STATUS(
        'Cannot perform request on REJECTED stock disposal! Please create a new one',
      );
    }

    if (
      (input.status === StockDisposalStatusEnum.REJECTED ||
        input.status === StockDisposalStatusEnum.FINISHED) &&
      !input.reviewerId
    ) {
      throw ERR_SALES_STOCK_DISPOSAL_INVALID_STATUS('user reviewer data is missing');
    }

    const { product, ...customerInput } = input;

    const qr = await this.dao.startTransaction();
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    try {
      await this.dao.updateOneWithTx(
        { id },
        {
          status: customerInput.status,
          salesOperationUnitId: customerInput.operationUnitId,
          imageLink: customerInput.imageLink,
          reviewerId: customerInput.reviewerId,
          reviewedDate:
            input.status === StockDisposalStatusEnum.FINISHED ||
            input.status === StockDisposalStatusEnum.REJECTED
              ? now
              : undefined,
        },
        user,
        qr,
      );

      await this.productsInStockDisposalDAO.softDeleteManyWithTx(
        {
          salesStockDisposalId: id,
        },
        qr,
      );

      await this.productsInStockDisposalDAO.upsertMany(
        user,
        [
          {
            ...product,
            salesStockDisposalId: id,
            salesProductItemId: product.productItemId,
          },
        ],
        {
          qr,
        },
      );

      if (
        input.status === StockDisposalStatusEnum.BOOKED &&
        currentStockDisposal.status === StockDisposalStatusEnum.CONFIRMED
      ) {
        // Book stock
        await this.operationUnitStockDAO.bookStock({
          operationUnitId: currentStockDisposal.salesOperationUnitId,
          qr,
          user,
          bookType: {
            stockDisposalId: id,
          },
          products: [
            {
              productItemId: product.productItemId,
              quantity: product.quantity,
              weight: 0,
            },
            {
              productItemId: SALES_TOTAL_WEIGHT_PRODUCT.id,
              quantity: 0,
              weight: product.weight,
            },
          ],
        });
      } else if (
        input.status === StockDisposalStatusEnum.FINISHED &&
        currentStockDisposal.status === StockDisposalStatusEnum.BOOKED
      ) {
        // Release booked stock
        await this.operationUnitStockDAO.releaseBookedStock({
          qr,
          user,
          bookType: {
            stockDisposalId: id,
          },
        });
      } else if (
        input.status === StockDisposalStatusEnum.BOOKED &&
        currentStockDisposal.status === StockDisposalStatusEnum.FINISHED
      ) {
        throw ERR_SALES_STOCK_DISPOSAL_INVALID_STATUS(
          'stock disposal already approved and finished!',
        );
      } else if (
        (input.status === StockDisposalStatusEnum.DRAFT ||
          input.status === StockDisposalStatusEnum.CONFIRMED ||
          input.status === StockDisposalStatusEnum.CANCELLED ||
          input.status === StockDisposalStatusEnum.REJECTED) &&
        currentStockDisposal.status === StockDisposalStatusEnum.BOOKED
      ) {
        // Cancel booked stock
        await this.operationUnitStockDAO.cancelBookStock({
          qr,
          user,
          bookType: {
            stockDisposalId: id,
          },
        });
      } else if (
        currentStockDisposal.status !== StockDisposalStatusEnum.BOOKED &&
        (input.status === StockDisposalStatusEnum.REJECTED ||
          input.status === StockDisposalStatusEnum.FINISHED)
      ) {
        throw ERR_SALES_STOCK_DISPOSAL_INVALID_STATUS(
          'cannot APPROVED or REJECT stock disposal. Stock is not being BOOKED yet',
        );
      } else if (
        currentStockDisposal.status === StockDisposalStatusEnum.DRAFT &&
        input.status === StockDisposalStatusEnum.DRAFT
      ) {
        // edit draft, do nothing
      } else if (
        input.status === StockDisposalStatusEnum.CONFIRMED &&
        (currentStockDisposal.status === StockDisposalStatusEnum.DRAFT ||
          currentStockDisposal.status === StockDisposalStatusEnum.CONFIRMED)
      ) {
        // edit confirmed, do nothing
      } else if (
        input.status === StockDisposalStatusEnum.CANCELLED &&
        (currentStockDisposal.status === StockDisposalStatusEnum.DRAFT ||
          currentStockDisposal.status === StockDisposalStatusEnum.CONFIRMED)
      ) {
        // cancel draft/confirmed, do nothing
      } else {
        throw ERR_SALES_STOCK_DISPOSAL_INVALID_STATUS('Unhandled status change');
      }

      await this.dao.commitTransaction(qr);

      await this.operationUnitStockDAO.clearLatestStockCache(
        currentStockDisposal.salesOperationUnitId,
      );

      return await this.getById(id);
    } catch (error) {
      await this.dao.rollbackTransaction(qr);
      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private mapStockDisposalEntityToDTO(item: StockDisposal): GetSalesStockDisposalByIdResponseItem {
    return {
      ...item,
      code: `${item.salesOperationUnit.branch.code}/PM/${item.id}`,
      operationUnit: {
        ...item.salesOperationUnit,
        province: {
          ...item.salesOperationUnit.province,
          name: item.salesOperationUnit.province.provinceName,
        },
        city: {
          ...item.salesOperationUnit.city,
          name: item.salesOperationUnit.city.cityName,
        },
        district: {
          ...item.salesOperationUnit.district,
          name: item.salesOperationUnit.district.districtName,
        },
      },
      product: {
        ...item.salesProductsInStockDisposal[0].salesProductItem.category,
        productItem: {
          ...item.salesProductsInStockDisposal[0].salesProductItem,
          weight: item.salesProductsInStockDisposal[0].weight,
          quantity: item.salesProductsInStockDisposal[0].quantity,
        },
      },
      reviewer: item.reviewer ? item.reviewer : null,
      reviewedDate: item.reviewedDate ? item.reviewedDate.toISOString() : null,
      createdDate: item.createdDate.toISOString(),
      modifiedDate: item.modifiedDate.toISOString(),
      createdBy: item.userCreator?.email,
      modifiedBy: item.userModifier?.email,
    };
  }
}
