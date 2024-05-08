import { Inject, Service } from 'fastify-decorators';
import { CustomerDAO } from '../../dao/sales/customer.dao';
import { CustomerVisitDAO } from '../../dao/sales/customerVisit.dao';
import { OrderIssueCategoryInVisitDAO } from '../../dao/sales/orderIssueCategoryInVisit.dao';
import { ProductsInCustomerDAO } from '../../dao/sales/productsInCustomer.dao';
import { ProductsInVisitDAO } from '../../dao/sales/productsInVisit.dao';
import {
  CheckInBody,
  CreateVisitBody,
  CreateVisitParam,
  GetVisitByIdResponseItem,
  GetVisitListItem,
  GetVisitListParam,
  GetVisitListQuery,
} from '../../dto/sales/visit.dto';
import { ERR_SALES_VISIT_CHECK_IN } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { calculateDistance } from '../../libs/utils/helpers';

@Service()
export class CustomerVisitService {
  @Inject(CustomerDAO)
  private customerDAO: CustomerDAO;

  @Inject(CustomerVisitDAO)
  private dao: CustomerVisitDAO;

  @Inject(OrderIssueCategoryInVisitDAO)
  private salesOrderIssueCategoryInVisitDAO: OrderIssueCategoryInVisitDAO;

  @Inject(ProductsInCustomerDAO)
  private productsInCustomerDAO: ProductsInCustomerDAO;

  @Inject(ProductsInVisitDAO)
  private productInVisitDAO: ProductsInVisitDAO;

  async create(opts: {
    user: RequestUser;
    body: CreateVisitBody;
    params: CreateVisitParam;
  }): Promise<void> {
    await this.checkIn(opts);

    const products = opts.body.products || [];

    const qr = await this.dao.startTransaction();

    try {
      const visit = await this.dao.createOneWithTx(
        {
          ...opts.body,
          salesCustomerId: opts.params.customerId,
          salespersonId: opts.user.id,
        },
        opts.user,
        qr,
      );

      if (products.length > 0) {
        await this.productInVisitDAO.createManyWithTx(
          products.map((p) => ({
            ...p,
            salesCustomerVisitId: visit.id,
            salesProductItemId: p.id,
          })),
          opts.user,
          qr,
        );

        await this.productsInCustomerDAO.upsertMany(
          opts.user,
          products.map((p) => ({
            salesCustomerId: opts.params.customerId,
            salesProductItemId: p.id,
            dailyQuantity: p.dailyQuantity,
            price: p.price,
          })),
          {
            qr,
          },
        );
      }

      if (opts.body.orderIssueCategories.length > 0) {
        await this.salesOrderIssueCategoryInVisitDAO.upsertMany(
          opts.user,
          opts.body.orderIssueCategories.map((category) => ({
            salesCustomerVisitId: visit.id,
            salesOrderIssueCategoryId: category.id,
          })),
          {
            qr,
          },
        );
      }

      await this.dao.commitTransaction(qr);
      return;
    } catch (error) {
      await this.dao.rollbackTransaction(qr);
      throw error;
    }
  }

  async getById(opts: { customerId: string; visitId: string }): Promise<GetVisitByIdResponseItem> {
    const visit = await this.dao.getOneStrict({
      where: {
        id: opts.visitId,
        salesCustomerId: opts.customerId,
      },
      relations: {
        salesperson: true,
        salesProductsInVisit: {
          salesProductItem: {
            category: true,
          },
        },
        salesOrderIssueCategoryInVisit: {
          salesOrderIssueCategory: true,
        },
      },
    });

    return {
      ...visit,
      orderIssueCategories: visit.salesOrderIssueCategoryInVisit.map(
        (category) => category.salesOrderIssueCategory,
      ),
      products: visit.salesProductsInVisit.map((p) => ({
        id: p.salesProductItemId,
        name: p.salesProductItem.name,
        dailyQuantity: p.dailyQuantity,
        price: p.price,
        uom: p.salesProductItem.uom,
        value: p.salesProductItem.value,
        category: p.salesProductItem.category,
      })),
    };
  }

  async getVisits(opts: {
    params: GetVisitListParam;
    query: GetVisitListQuery;
  }): Promise<[GetVisitListItem[], number]> {
    const skip =
      opts.query.$limit && opts.query.$page
        ? opts.query.$limit * (opts.query.$page - 1)
        : undefined;

    const [visits, count] = await this.dao.getMany({
      where: {
        salesCustomerId: opts.params.customerId,
      },
      relations: {
        salesperson: true,
      },
      order: {
        modifiedDate: 'DESC',
      },
      take: opts.query.$limit,
      skip,
    });

    return [
      visits.map((v) => ({
        ...v,
        createdDate: v.createdDate.toISOString(),
      })),
      count,
    ];
  }

  async checkIn(opts: { params: CreateVisitParam; body: CheckInBody }): Promise<number> {
    const customer = await this.customerDAO.getOneStrict({
      where: {
        id: opts.params.customerId,
      },
    });

    // calculate check-in distance
    const distanceMeter = calculateDistance(
      {
        lat: opts.body.latitude,
        lon: opts.body.longitude,
      },
      {
        lat: customer.latitude,
        lon: customer.longitude,
      },
    );

    const distanceThreshold = 500;

    if (distanceMeter > distanceThreshold) {
      throw ERR_SALES_VISIT_CHECK_IN(
        `(${distanceMeter.toFixed(
          2,
        )}m). Harap berada dalam radius ${distanceThreshold}m dari customer`,
      );
    }

    return distanceMeter;
  }
}
