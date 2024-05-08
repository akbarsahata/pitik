import { Inject, Service } from 'fastify-decorators';
import { In } from 'typeorm';
import { ProductsInPurchaseOrderInvoiceDAO } from '../../dao/sales/productsInPurchaseOrderInvoice.dao';
import { PurchaseOrderDAO } from '../../dao/sales/purchaseOrder.dao';
import { PurchaseOrderInvoiceDAO } from '../../dao/sales/purchaseOrderInvoice.dao';
import { PurchaseOrderStatusEnum } from '../../datasources/entity/pgsql/sales/PurchaseOrder.entity';
import {
  InvoiceStatusEnum,
  PurchaseOrderInvoice,
} from '../../datasources/entity/pgsql/sales/PurchaseOrderInvoice.entity';
import {
  CreateSalesPurchaseOrderInvoiceBody,
  GetSalesPurchaseOrderInvoicesByIdResponseItem,
  GetSalesPurchaseOrderInvoicesQuery,
  UpdateSalesPurchaseOrderInvoiceBody,
} from '../../dto/sales/invoice.dto';
import {
  ERR_SALES_PURCHASE_ORDER_INVOICE_ALREADY_EXIST,
  ERR_SALES_PURCHASE_ORDER_INVOICE_INVALID_PO,
} from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';

@Service()
export class SalesPurchaseOrderInvoiceService {
  @Inject(PurchaseOrderInvoiceDAO)
  private dao: PurchaseOrderInvoiceDAO;

  @Inject(ProductsInPurchaseOrderInvoiceDAO)
  private productsInPurchaseOrderInvoiceDAO: ProductsInPurchaseOrderInvoiceDAO;

  @Inject(PurchaseOrderDAO)
  private purchaseOrderDAO: PurchaseOrderDAO;

  async get(
    filter: GetSalesPurchaseOrderInvoicesQuery,
  ): Promise<[GetSalesPurchaseOrderInvoicesByIdResponseItem[], number]> {
    const limit = (filter.$limit && filter.$limit > 0 && filter.$limit) || undefined;
    const skip =
      limit && filter.$page !== undefined && filter.$page > 0 ? (filter.$page - 1) * limit : 0;

    const [invoices, count] = await this.dao.getMany({
      where: {
        status: filter.status,
        id: filter.code?.split('/')[2],
        date: filter.date ? new Date(filter.date) : undefined,
        salesPurchaseOrder: {
          id: filter.purchaseOrderId || filter.purchaseOrderCode?.split('/')[2] || undefined,
        },
      },
      relations: {
        salesPurchaseOrder: {
          salesProductsInPurchaseOrder: {
            salesProductItem: {
              category: true,
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
        },
        salesProductsInPurchaseOrderInvoice: {
          salesProductItem: {
            category: true,
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
    });

    return [invoices.map((item) => this.convertEntityToInvoiceItem(item)), count];
  }

  async getById(invoiceId: string): Promise<GetSalesPurchaseOrderInvoicesByIdResponseItem> {
    const invoice = await this.dao.getOneStrict({
      where: {
        id: invoiceId,
      },
      relations: {
        salesPurchaseOrder: {
          salesProductsInPurchaseOrder: {
            salesProductItem: {
              category: true,
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
        },
        salesProductsInPurchaseOrderInvoice: {
          salesProductItem: {
            category: true,
          },
        },
        userCreator: true,
        userModifier: true,
      },
    });

    return this.convertEntityToInvoiceItem(invoice);
  }

  async create(
    input: CreateSalesPurchaseOrderInvoiceBody,
    user: RequestUser,
  ): Promise<GetSalesPurchaseOrderInvoicesByIdResponseItem> {
    const po = await this.purchaseOrderDAO.getOneStrict({
      where: {
        id: input.purchaseOrderId,
      },
      relations: {
        salesProductsInPurchaseOrder: {
          salesProductItem: true,
        },
      },
    });

    if (po.status !== PurchaseOrderStatusEnum.CONFIRMED) {
      throw ERR_SALES_PURCHASE_ORDER_INVOICE_INVALID_PO();
    }

    const invoice = await this.dao.getOne({
      where: {
        salesPurchaseOrderId: input.purchaseOrderId,
        status: In([InvoiceStatusEnum.DRAFT, InvoiceStatusEnum.CONFIRMED]),
      },
    });

    if (invoice) {
      throw ERR_SALES_PURCHASE_ORDER_INVOICE_ALREADY_EXIST();
    }

    input.products.forEach((product) => {
      const inputProduct = po.salesProductsInPurchaseOrder.find(
        (p) => p.salesProductItemId === product.id,
      );
      if (!inputProduct) {
        throw ERR_SALES_PURCHASE_ORDER_INVOICE_INVALID_PO('Product is not in Purchase Order!');
      }
    });

    const qr = await this.dao.startTransaction();

    try {
      const created = await this.dao.upsertOne(user, {
        ...input,
        date: new Date(input.date),
        salesPurchaseOrderId: input.purchaseOrderId,
        status: input.status || InvoiceStatusEnum.DRAFT,
      });

      await this.productsInPurchaseOrderInvoiceDAO.createManyWithTx(
        input.products.map((p) => ({
          salesPurchaseOrderInvoiceId: created.id,
          salesProductItemId: p.id,
          quantity: p.quantity,
          price: p.price,
        })),
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
    input: UpdateSalesPurchaseOrderInvoiceBody,
    id: string,
  ): Promise<GetSalesPurchaseOrderInvoicesByIdResponseItem> {
    const invoice = await this.dao.getOneStrict({
      where: {
        id,
      },
      relations: {
        salesPurchaseOrder: {
          salesProductsInPurchaseOrder: {
            salesProductItem: true,
          },
        },
      },
    });

    input.products.forEach((product) => {
      const inputProduct = invoice.salesPurchaseOrder.salesProductsInPurchaseOrder.find(
        (p) => p.salesProductItemId === product.id,
      );
      if (!inputProduct) {
        throw ERR_SALES_PURCHASE_ORDER_INVOICE_INVALID_PO('Product is not in Purchase Order!');
      }
    });
    const qr = await this.dao.startTransaction();

    try {
      await this.dao.upsertOne(user, {
        ...invoice,
        date: new Date(input.date),
        status: input.status || InvoiceStatusEnum.DRAFT,
      });

      await this.productsInPurchaseOrderInvoiceDAO.softDeleteManyWithTx(
        {
          salesPurchaseOrderInvoiceId: id,
        },
        qr,
      );

      await this.productsInPurchaseOrderInvoiceDAO.upsertMany(
        user,
        input.products.map((p) => ({
          salesPurchaseOrderInvoiceId: id,
          salesProductItemId: p.id,
          quantity: p.quantity,
          price: p.price,
        })),
        {
          qr,
        },
      );

      await this.dao.commitTransaction(qr);

      return await this.getById(id);
    } catch (error) {
      await this.dao.rollbackTransaction(qr);
      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private convertEntityToInvoiceItem(
    invoice: PurchaseOrderInvoice,
  ): GetSalesPurchaseOrderInvoicesByIdResponseItem {
    return {
      ...invoice,
      code: `${invoice.salesPurchaseOrder.salesOperationUnit.branch.code}/INV/${invoice.id}`,
      date: invoice.date.toString(),
      purchaseOrder: {
        ...invoice.salesPurchaseOrder,
        code: `${invoice.salesPurchaseOrder.salesOperationUnit.branch.code}/PO/${invoice.salesPurchaseOrder.id}`,
        vendor:
          (invoice.salesPurchaseOrder.salesVendor && {
            ...invoice.salesPurchaseOrder.salesVendor,
            id: invoice.salesPurchaseOrder.salesVendor.id,
            name: invoice.salesPurchaseOrder.salesVendor.vendorName,
            plusCode: invoice.salesPurchaseOrder.salesVendor.plusCode,
            province: {
              ...invoice.salesPurchaseOrder.salesVendor.province,
              id: invoice.salesPurchaseOrder.salesVendor.province.id,
              name: invoice.salesPurchaseOrder.salesVendor.province.provinceName,
            },
            city: {
              ...invoice.salesPurchaseOrder.salesVendor.city,
              id: invoice.salesPurchaseOrder.salesVendor.city.id,
              name: invoice.salesPurchaseOrder.salesVendor.city.cityName,
            },
            district: {
              ...invoice.salesPurchaseOrder.salesVendor.district,
              id: invoice.salesPurchaseOrder.salesVendor.district.id,
              name: invoice.salesPurchaseOrder.salesVendor.district.districtName,
            },
            priceBasis: invoice.salesPurchaseOrder.salesVendor.priceBasis,
            status: invoice.salesPurchaseOrder.salesVendor.status,
          }) ||
          null,
        jagal:
          (invoice.salesPurchaseOrder.salesJagal && {
            ...invoice.salesPurchaseOrder.salesJagal,
            province: {
              ...invoice.salesPurchaseOrder.salesJagal.province,
              name: invoice.salesPurchaseOrder.salesJagal.province.provinceName,
            },
            city: {
              ...invoice.salesPurchaseOrder.salesJagal.city,
              name: invoice.salesPurchaseOrder.salesJagal.city.cityName,
            },
            district: {
              ...invoice.salesPurchaseOrder.salesJagal.district,
              name: invoice.salesPurchaseOrder.salesJagal.district.districtName,
            },
          }) ||
          null,
        operationUnit: {
          ...invoice.salesPurchaseOrder.salesOperationUnit,
          province: {
            ...invoice.salesPurchaseOrder.salesOperationUnit.province,
            name: invoice.salesPurchaseOrder.salesOperationUnit.province.provinceName,
          },
          city: {
            ...invoice.salesPurchaseOrder.salesOperationUnit.city,
            name: invoice.salesPurchaseOrder.salesOperationUnit.city.cityName,
          },
          district: {
            ...invoice.salesPurchaseOrder.salesOperationUnit.district,
            name: invoice.salesPurchaseOrder.salesOperationUnit.district.districtName,
          },
        },
        products: invoice.salesPurchaseOrder.salesProductsInPurchaseOrder.map((product) => ({
          ...product,
          id: product.salesProductItem.id,
          minValue: product.salesProductItem.minValue || undefined,
          maxValue: product.salesProductItem.maxValue || undefined,
          name: product.salesProductItem.name,
          category: product.salesProductItem.category,
        })),
      },
      products: invoice.salesProductsInPurchaseOrderInvoice.map((product) => ({
        ...product,
        id: product.salesProductItem.id,
        name: product.salesProductItem.name,
        minValue: product.salesProductItem.minValue || undefined,
        maxValue: product.salesProductItem.maxValue || undefined,
        category: product.salesProductItem.category,
      })),
      createdBy: invoice.userCreator.fullName,
      modifiedBy: invoice.userModifier.fullName,
      createdDate: invoice.createdDate.toISOString(),
      modifiedDate: invoice.modifiedDate.toISOString(),
    };
  }
}
