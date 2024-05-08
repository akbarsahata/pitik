import { startOfYesterday } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { Between, FindOptionsWhere, In } from 'typeorm';
import { GoodsReceivedDAO } from '../../dao/sales/goodsReceived.dao';
import { InternalTransferDAO } from '../../dao/sales/internalTransfer.dao';
import { SalesOperationUnitDAO } from '../../dao/sales/operationUnit.dao';
import { OperationUnitStockDAO } from '../../dao/sales/operationUnitStock.dao';
import { ProductItemDAO } from '../../dao/sales/productItem.dao';
import { ProductsInGoodsReceivedDAO } from '../../dao/sales/productsInGoodReceived.dao';
import { ProductsInOperationUnitDAO } from '../../dao/sales/productsInOperationUnit.dao';
import { ProductsInStockOpnameDAO } from '../../dao/sales/productsInStockOpname.dao';
import { PurchaseOrderDAO } from '../../dao/sales/purchaseOrder.dao';
import { PurchaseOrderInvoiceDAO } from '../../dao/sales/purchaseOrderInvoice.dao';
import { SalesOrderDAO } from '../../dao/sales/salesOrder.dao';
import { StockOpnameDAO } from '../../dao/sales/stockOpname.dao';
import {
  GoodsReceived,
  GR_STATUS,
  GR_TYPE,
} from '../../datasources/entity/pgsql/sales/GoodsReceived.entity';
import { InternalTransferStatusEnum } from '../../datasources/entity/pgsql/sales/InternalTransfer.entity';
import {
  OperationUnitStock,
  STOCK_OPERATOR,
  STOCK_STATUS,
} from '../../datasources/entity/pgsql/sales/OperationUnitStock.entity';
import { ProductItem } from '../../datasources/entity/pgsql/sales/ProductItem.entity';
import { ProductsInGoodsReceived } from '../../datasources/entity/pgsql/sales/ProductsInGoodsReceived.entity';
import { ProductsInPurchaseOrder } from '../../datasources/entity/pgsql/sales/ProductsInPurchaseOrder.entity';
import { ProductsInPurchaseOrderInvoice } from '../../datasources/entity/pgsql/sales/ProductsInPurchaseOrderInvoice.entity';
import {
  PurchaseOrder,
  PurchaseOrderStatusEnum,
} from '../../datasources/entity/pgsql/sales/PurchaseOrder.entity';
import { InvoiceStatusEnum } from '../../datasources/entity/pgsql/sales/PurchaseOrderInvoice.entity';
import { SalesOrderGrStatusEnum } from '../../datasources/entity/pgsql/sales/SalesOrder.entity';
import { StockOpnameStatusEnum } from '../../datasources/entity/pgsql/sales/StockOpname.entity';
import { VendorPriceBasisEnum } from '../../datasources/entity/pgsql/sales/Vendor.entity';
import {
  CreateSalesGoodsReceivedBody,
  GetSalesGoodsReceivedByIdResponseItem,
  GetSalesGoodsReceivedQuery,
  ProductsInGoodsReceivedItemBody,
  SalesGoodReceivedIdentifier,
} from '../../dto/sales/goodsReceived.dto';
import { DEFAULT_TIME_ZONE, SALES_TOTAL_WEIGHT_PRODUCT } from '../../libs/constants';
import { ERR_SALES_GOODS_RECEIVED_NOT_ALLOWED } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';

@Service()
export class SalesGoodsReceivedService {
  @Inject(GoodsReceivedDAO)
  private dao: GoodsReceivedDAO;

  @Inject(InternalTransferDAO)
  private internalTransferDAO: InternalTransferDAO;

  @Inject(OperationUnitStockDAO)
  private operationUnitStockDAO: OperationUnitStockDAO;

  @Inject(ProductsInGoodsReceivedDAO)
  private productsInGoodsReceived: ProductsInGoodsReceivedDAO;

  @Inject(PurchaseOrderDAO)
  private purchaseOrderDAO: PurchaseOrderDAO;

  @Inject(PurchaseOrderInvoiceDAO)
  private purchaseOrderInvoiceDAO: PurchaseOrderInvoiceDAO;

  @Inject(ProductItemDAO)
  private productItemDAO: ProductItemDAO;

  @Inject(ProductsInStockOpnameDAO)
  private productsInStockOpnameDAO: ProductsInStockOpnameDAO;

  @Inject(ProductsInOperationUnitDAO)
  private productsInOperationUnitDAO: ProductsInOperationUnitDAO;

  @Inject(SalesOrderDAO)
  private salesOrderDAO: SalesOrderDAO;

  @Inject(StockOpnameDAO)
  private salesStockOpnameDAO: StockOpnameDAO;

  @Inject(SalesOperationUnitDAO)
  private salesOperationUnitDAO: SalesOperationUnitDAO;

  async get(
    filter: GetSalesGoodsReceivedQuery,
  ): Promise<[GetSalesGoodsReceivedByIdResponseItem[], number]> {
    const limit = (filter.$limit && filter.$limit > 0 && filter.$limit) || undefined;
    const skip =
      limit && filter.$page !== undefined && filter.$page > 0 ? (filter.$page - 1) * limit : 0;

    const [items, count] = await this.dao.getMany({
      where: {
        salesPurchaseOrderId: filter.purchaseOrderId,
        salesInternalTransferId: filter.internalTransferId,
        salesOrderId: filter.salesOrderId,
        salesPurchaseOrder: {
          salesOperationUnitId: filter.operationUnitId,
        },
        // FIXME: Check filter on operation unit in internalTransfer/manufacturing based GR
        salesOrder: {
          operationUnitId: filter.operationUnitId,
        },
      },
      relations: {
        salesPurchaseOrder: {
          salesVendor: {
            salesProductsInVendor: {
              salesProductCategory: true,
            },
            province: true,
            city: true,
            district: true,
          },
          salesOperationUnit: {
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
        salesInternalTransfer: {
          sourceOperationUnit: {
            province: true,
            city: true,
            district: true,
          },
          targetOperationUnit: {
            province: true,
            city: true,
            district: true,
          },
          products: {
            productItem: true,
          },
        },
        salesOrder: {
          customer: true,
          driver: true,
          operationUnit: {
            province: true,
            city: true,
            district: true,
          },
          products: {
            productItem: {
              category: true,
            },
          },
          salesperson: true,
        },
        salesProductsInGoodsReceived: {
          salesProductItem: true,
        },
        operationUnit: {
          branch: true,
          province: true,
          city: true,
          district: true,
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

    return [items.map((gr) => this.mapGrEntityToDTO(gr)), count];
  }

  async getById(grId: string): Promise<GetSalesGoodsReceivedByIdResponseItem> {
    const gr = await this.dao.getOneStrict({
      where: {
        id: grId,
      },
      relations: {
        salesPurchaseOrder: {
          salesVendor: {
            salesProductsInVendor: {
              salesProductCategory: true,
            },
            province: true,
            city: true,
            district: true,
          },
          salesOperationUnit: {
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
        salesInternalTransfer: {
          sourceOperationUnit: {
            province: true,
            city: true,
            district: true,
          },
          targetOperationUnit: {
            province: true,
            city: true,
            district: true,
          },
          products: {
            productItem: true,
          },
        },
        salesOrder: {
          customer: true,
          driver: true,
          operationUnit: {
            province: true,
            city: true,
            district: true,
          },
          products: {
            productItem: {
              category: true,
            },
          },
          salesperson: true,
        },
        salesProductsInGoodsReceived: {
          salesProductItem: {
            category: true,
          },
        },
        operationUnit: {
          branch: true,
          province: true,
          city: true,
          district: true,
        },
        userCreator: true,
        userModifier: true,
      },
    });

    return this.mapGrEntityToDTO(gr);
  }

  async create(
    input: CreateSalesGoodsReceivedBody,
    user: RequestUser,
  ): Promise<GetSalesGoodsReceivedByIdResponseItem> {
    // validate product input
    await this.validateProductInput(input.products);

    const grType = this.validateIdentifier(input);

    const existingGr = await this.dao.getOne({
      where: {
        ...((grType === GR_TYPE.PURCHASE_ORDER && {
          salesPurchaseOrderId: input.purchaseOrderId,
        }) ||
          (grType === GR_TYPE.SALES_ORDER && {
            salesOrderId: input.salesOrderId,
          }) ||
          (grType === GR_TYPE.INTERNAL_TRANSFER && {
            salesInternalTransferId: input.internalTransferId,
          })),
        status: GR_STATUS.CONFIRMED,
      },
    });

    if (existingGr) throw new Error(`GR for this ${grType} already exist!`);

    const qr = await this.dao.startTransaction();

    let operationUnitId: string | undefined;
    let po: PurchaseOrder | undefined;
    if (grType === GR_TYPE.PURCHASE_ORDER) {
      po = await this.purchaseOrderDAO.getOneStrict({
        where: {
          id: input.purchaseOrderId,
        },
        relations: {
          salesVendor: true,
          salesProductsInPurchaseOrder: {
            salesProductItem: true,
          },
        },
      });

      operationUnitId = po.salesOperationUnitId;
    } else if (grType === GR_TYPE.SALES_ORDER) {
      const so = await this.salesOrderDAO.getOneStrict({
        where: {
          id: input.salesOrderId,
        },
      });

      operationUnitId = so.operationUnitId!;
    } else if (grType === GR_TYPE.INTERNAL_TRANSFER) {
      const internalTransfer = await this.internalTransferDAO.getOneStrict({
        where: {
          id: input.internalTransferId,
        },
      });

      operationUnitId = internalTransfer.targetOperationUnitId;
    }

    try {
      // count confirmed GR
      const [, confirmedGrCount] = await this.dao.getMany({
        where: {
          status: GR_STATUS.CONFIRMED,
          operationUnitId,
        },
      });

      const existingOpname = await this.salesStockOpnameDAO.getOne({
        where: {
          salesOperationUnitId: operationUnitId!,
        },
      });

      const isAutoGenerateFirstOpname = confirmedGrCount === 0 && !existingOpname;
      if (isAutoGenerateFirstOpname) {
        const [productsInOperationUnit] = await this.productsInOperationUnitDAO.getMany({
          where: {
            salesOperationUnitId: operationUnitId!,
          },
          relations: {
            salesProductCategory: {
              items: true,
            },
          },
        });

        const opname = await this.salesStockOpnameDAO.upsertOne(
          {
            salesOperationUnitId: operationUnitId,
            confirmedDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
            status: StockOpnameStatusEnum.FINISHED,
          },
          user,
          qr,
        );

        const productItemIds = productsInOperationUnit
          .map((p) => p.salesProductCategory.items.map((i) => i.id))
          .flat();

        await this.productsInStockOpnameDAO.createManyWithTx(
          productItemIds.map((id) => ({
            quantity: 0,
            weight: 0,
            salesStockOpnameId: opname.id,
            salesProductItemId: id,
          })),
          user,
          qr,
        );

        await this.operationUnitStockDAO.createOpname({
          opnameId: opname.id,
          operationUnitId: operationUnitId!,
          products: productItemIds.map((id) => ({
            productItemId: id,
            quantity: 0,
            weight: 0,
          })),
          user,
          qr,
        });
      }

      const stockOpname = await this.salesStockOpnameDAO.getOne({
        where: {
          salesOperationUnitId: operationUnitId,
          confirmedDate: Between(
            utcToZonedTime(startOfYesterday(), DEFAULT_TIME_ZONE),
            utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
          ),
          status: StockOpnameStatusEnum.FINISHED,
        },
      });

      if (!stockOpname && !isAutoGenerateFirstOpname) {
        const operationUnit = await this.salesOperationUnitDAO.getOneStrict({
          where: { id: operationUnitId },
        });
        throw ERR_SALES_GOODS_RECEIVED_NOT_ALLOWED(
          `di ${operationUnit.operationUnitName}, silakan Stock Opname terlbih dahulu`,
        );
      }
      const gr = await this.dao.upsertOne(
        user,
        {
          ...input,
          operationUnitId,
          salesPurchaseOrderId: input.purchaseOrderId,
          salesOrderId: input.salesOrderId,
          salesInternalTransferId: input.internalTransferId,
        },
        {
          qr,
        },
      );

      // carryover price from parent stock
      const bookstockFilters: FindOptionsWhere<OperationUnitStock>[] = [];
      if (grType === GR_TYPE.INTERNAL_TRANSFER) {
        bookstockFilters.push({
          internalTransferId: input.internalTransferId,
        });
      }
      if (grType === GR_TYPE.SALES_ORDER) {
        bookstockFilters.push({
          salesOrderId: input.salesOrderId,
        });
      }
      const [bookstockDetails] = (bookstockFilters.length > 0 &&
        (await this.operationUnitStockDAO.getMany({
          where: [
            {
              internalTransferId: input.internalTransferId,
            },
            {
              salesOrderId: input.salesOrderId,
            },
          ],
        }))) || [[] as OperationUnitStock[]];

      const mapBookstockDetails = bookstockDetails.reduce((prev, item) => {
        const existing = prev.get(item.productItemId);

        // TODO: confirm this logic
        // if the product category has multiple row in book stock
        // then get the greater price
        if (!existing || !existing.price || existing.price < (item.price || 0)) {
          prev.set(item.productItemId, item);
        }

        return prev;
      }, new Map<string, OperationUnitStock>());

      let productsInGoodReceipt: ProductsInGoodsReceived[];
      if (input.purchaseOrderId && po) {
        let priceBasis:
          | Map<string, ProductsInPurchaseOrderInvoice>
          | Map<string, ProductsInPurchaseOrder>
          | undefined;

        const invoice = await this.purchaseOrderInvoiceDAO.getOne({
          where: {
            salesPurchaseOrderId: po.id,
            status: InvoiceStatusEnum.CONFIRMED,
          },
          relations: {
            salesProductsInPurchaseOrderInvoice: {
              salesProductItem: true,
            },
          },
        });

        const mapInputProduct = input.products.reduce((prev, item) => {
          prev.set(item.productItemId!, item);
          return prev;
        }, new Map<string, ProductsInGoodsReceivedItemBody>());

        if (po.salesVendor?.priceBasis === VendorPriceBasisEnum.INVOICE && invoice) {
          priceBasis = invoice.salesProductsInPurchaseOrderInvoice.reduce((prev, p) => {
            const inputProduct = mapInputProduct.get(p.salesProductItemId);

            if (!inputProduct) return prev;

            const weightPerItem = p.salesProductItem.value || 1;
            const originalTotalWeight = p.quantity * weightPerItem;
            const originalPricePerKg = p.price;
            const inputTotalWeight = inputProduct.quantity! * weightPerItem;

            const newPrice = (originalTotalWeight * originalPricePerKg) / inputTotalWeight;

            prev.set(p.salesProductItemId, {
              ...p,
              price: newPrice,
            });

            return prev;
          }, new Map<string, ProductsInPurchaseOrderInvoice>());
        } else if (po.salesVendor?.priceBasis === VendorPriceBasisEnum.PO) {
          priceBasis = po.salesProductsInPurchaseOrder.reduce((prev, p) => {
            const inputProduct = mapInputProduct.get(p.salesProductItemId);

            if (!inputProduct) return prev;

            const weightPerItem = p.salesProductItem.value || 1;
            const originalTotalWeight = p.quantity * weightPerItem;
            const originalPricePerKg = p.price;
            const inputTotalWeight = inputProduct.quantity! * weightPerItem;

            const newPrice = (originalTotalWeight * originalPricePerKg) / inputTotalWeight;

            prev.set(p.salesProductItemId, {
              ...p,
              price: newPrice,
            });

            return prev;
          }, new Map<string, ProductsInPurchaseOrder>());
        }

        productsInGoodReceipt = await this.productsInGoodsReceived.createManyWithTx(
          input.products.map((p) => ({
            ...p,
            price: priceBasis?.get(p.productItemId!)?.price || p.price!,
            salesGoodsReceivedId: gr.id,
            salesProductCategoryId: p.productCategoryId,
            salesProductItemId: p.productItemId,
          })),
          user,
          qr,
        );
      } else {
        productsInGoodReceipt = await this.productsInGoodsReceived.createManyWithTx(
          input.products.map((p) => ({
            ...p,
            salesGoodsReceivedId: gr.id,
            salesProductCategoryId: p.productCategoryId,
            salesProductItemId: p.productItemId,
          })),
          user,
          qr,
        );
      }

      const [productItems] = await this.productItemDAO.getMany({
        where: {
          id: In(input.products.map((p) => p.productItemId)),
        },
      });

      const mappedProductItem = productItems.reduce((prev, item) => {
        prev.set(item.id, item);
        return prev;
      }, new Map<string, ProductItem>());

      // add to stock
      const items = productsInGoodReceipt.map((product) => ({
        operationUnitId: gr.operationUnitId,
        goodsReceivedId: gr.id,
        productItemId:
          product.salesProductItemId || mappedProductItem.get(product.salesProductItemId!)!.id,
        quantity: product.quantity,
        weight: product.weight,
        availableQuantity: product.quantity,
        availableWeight: product.weight,
        price:
          product.price ||
          mapBookstockDetails.get(
            product.salesProductItemId ||
              mappedProductItem.get(product.salesProductItemId!)!.categoryId,
          )?.price ||
          0,
        cityBasedPrice:
          mapBookstockDetails.get(
            product.salesProductItemId ||
              mappedProductItem.get(product.salesProductItemId!)!.categoryId,
          )?.cityBasedPrice || 0,
        status: STOCK_STATUS.FINAL,
        operator: STOCK_OPERATOR.PLUS,
      }));

      // add total weight to operation unit stock
      const totalWeight =
        input.totalWeight || // this is for PO & SO return
        (grType === GR_TYPE.INTERNAL_TRANSFER &&
          mapBookstockDetails.get(SALES_TOTAL_WEIGHT_PRODUCT.id)?.weight) ||
        0;

      items.push({
        operationUnitId: gr.operationUnitId,
        goodsReceivedId: gr.id,
        productItemId: SALES_TOTAL_WEIGHT_PRODUCT.id,
        quantity: 0,
        weight: po?.totalWeight || 0,
        availableQuantity: 0,
        availableWeight: totalWeight,
        price: 0,
        cityBasedPrice: 0,
        status: STOCK_STATUS.FINAL,
        operator: STOCK_OPERATOR.PLUS,
      });

      await this.operationUnitStockDAO.upsertMany(user, items, {
        qr,
      });

      if (gr.salesPurchaseOrderId) {
        await this.purchaseOrderDAO.updateOneWithTx(
          {
            id: gr.salesPurchaseOrderId,
          },
          {
            status: PurchaseOrderStatusEnum.RECEIVED,
          },
          user,
          qr,
        );
      } else if (gr.salesOrderId) {
        await this.salesOrderDAO.updateOneWithTx(
          {
            id: gr.salesOrderId,
          },
          {
            grStatus: SalesOrderGrStatusEnum.RECEIVED,
          },
          user,
          qr,
        );
      } else if (gr.salesInternalTransferId) {
        await this.internalTransferDAO.updateOneWithTx(
          {
            id: gr.salesInternalTransferId,
          },
          {
            status: InternalTransferStatusEnum.RECEIVED,
          },
          user,
          qr,
        );
      }

      await this.dao.commitTransaction(qr);

      await this.operationUnitStockDAO.clearLatestStockCache(gr.operationUnitId);
      return this.getById(gr.id);
    } catch (error) {
      await this.dao.rollbackTransaction(qr);
      throw error;
    }
  }

  async cancel(id: string, user: RequestUser): Promise<GetSalesGoodsReceivedByIdResponseItem> {
    const gr = await this.dao.getOneStrict({
      where: {
        id,
      },
      relations: {
        salesPurchaseOrder: true,
        salesOrder: true,
        salesInternalTransfer: true,
      },
    });

    const grType = this.validateIdentifier({
      internalTransferId: gr.salesInternalTransferId || undefined,
      purchaseOrderId: gr.salesPurchaseOrderId || undefined,
      salesOrderId: gr.salesOrderId || undefined,
    });

    const qr = await this.dao.startTransaction();

    try {
      await this.dao.upsertOne(
        user,
        {
          ...gr,
          status: GR_STATUS.CANCELLED,
        },
        {
          qr,
        },
      );

      await this.operationUnitStockDAO.reverseFinalStock({
        qr,
        user,
        operator: STOCK_OPERATOR.PLUS,
        bookType: {
          goodsReceivedId: id,
        },
        reverseToStatus: STOCK_STATUS.CANCELLED,
      });

      if (grType === GR_TYPE.INTERNAL_TRANSFER) {
        await this.internalTransferDAO.upsertOne(
          user,
          {
            ...gr.salesInternalTransfer,
            status: InternalTransferStatusEnum.DELIVERED,
          },
          {
            qr,
          },
        );
      } else if (grType === GR_TYPE.SALES_ORDER) {
        await this.salesOrderDAO.upsertOne(
          {
            ...gr.salesOrder,
            grStatus: SalesOrderGrStatusEnum.REJECTED,
          },
          user,
        );
      } else {
        // revert PO status
        await this.purchaseOrderDAO.upsertOne(
          user,
          {
            ...gr.salesPurchaseOrder,
            status: PurchaseOrderStatusEnum.CONFIRMED,
          },
          {
            qr,
          },
        );
      }

      await this.dao.commitTransaction(qr);

      await this.operationUnitStockDAO.clearLatestStockCache(gr.operationUnitId);

      return this.getById(id);
    } catch (error) {
      await this.dao.rollbackTransaction(qr);
      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private validateIdentifier(keys: SalesGoodReceivedIdentifier): GR_TYPE {
    let count = 0;
    let grType: GR_TYPE = GR_TYPE.INTERNAL_TRANSFER;
    if (keys.internalTransferId) {
      grType = GR_TYPE.INTERNAL_TRANSFER;
      count += 1;
    }
    if (keys.purchaseOrderId) {
      grType = GR_TYPE.PURCHASE_ORDER;
      count += 1;
    }
    if (keys.salesOrderId) {
      grType = GR_TYPE.SALES_ORDER;
      count += 1;
    }

    if (count === 0 || count > 1) {
      throw new Error('Invalid GR identifier');
    }

    return grType;
  }

  // eslint-disable-next-line class-methods-use-this
  private mapGrEntityToDTO(gr: GoodsReceived): GetSalesGoodsReceivedByIdResponseItem {
    return {
      ...gr,
      code: `${gr.operationUnit.branch.code}/GR/${gr.id}`,
      remarks: gr.remarks || null,
      purchaseOrder:
        (gr.salesPurchaseOrder && {
          ...gr.salesPurchaseOrder,
          vendor:
            (gr.salesPurchaseOrder.salesVendor && {
              ...gr.salesPurchaseOrder.salesVendor,
              id: gr.salesPurchaseOrder.salesVendor.id,
              name: gr.salesPurchaseOrder.salesVendor.vendorName,
              plusCode: gr.salesPurchaseOrder.salesVendor.plusCode,
              province: {
                ...gr.salesPurchaseOrder.salesVendor.province,
                id: gr.salesPurchaseOrder.salesVendor.province.id,
                name: gr.salesPurchaseOrder.salesVendor.province.provinceName,
              },
              city: {
                ...gr.salesPurchaseOrder.salesVendor.city,
                id: gr.salesPurchaseOrder.salesVendor.city.id,
                name: gr.salesPurchaseOrder.salesVendor.city.cityName,
              },
              district: {
                ...gr.salesPurchaseOrder.salesVendor.district,
                id: gr.salesPurchaseOrder.salesVendor.district.id,
                name: gr.salesPurchaseOrder.salesVendor.district.districtName,
              },
              priceBasis: gr.salesPurchaseOrder.salesVendor.priceBasis,
              status: gr.salesPurchaseOrder.salesVendor.status,
              purchasableProducts: gr.salesPurchaseOrder.salesVendor.salesProductsInVendor.map(
                (productCategory) => ({
                  ...productCategory,
                  id: productCategory.salesProductCategory.id,
                  name: productCategory.salesProductCategory.name,
                }),
              ),
            }) ||
            null,
          operationUnitId: gr.salesPurchaseOrder.salesOperationUnitId,
          jagalId: gr.salesPurchaseOrder.salesJagalId,
          vendorId: gr.salesPurchaseOrder.salesVendorId,
          jagal:
            (gr.salesPurchaseOrder.salesJagal && {
              ...gr.salesPurchaseOrder.salesJagal,
              province: {
                ...gr.salesPurchaseOrder.salesJagal.province,
                name: gr.salesPurchaseOrder.salesJagal.province.provinceName,
              },
              city: {
                ...gr.salesPurchaseOrder.salesJagal.city,
                name: gr.salesPurchaseOrder.salesJagal.city.cityName,
              },
              district: {
                ...gr.salesPurchaseOrder.salesJagal.district,
                name: gr.salesPurchaseOrder.salesJagal.district.districtName,
              },
            }) ||
            null,
          operationUnit: {
            ...gr.salesPurchaseOrder.salesOperationUnit,
            province: {
              ...gr.salesPurchaseOrder.salesOperationUnit.province,
              name: gr.salesPurchaseOrder.salesOperationUnit.province.provinceName,
            },
            city: {
              ...gr.salesPurchaseOrder.salesOperationUnit.city,
              name: gr.salesPurchaseOrder.salesOperationUnit.city.cityName,
            },
            district: {
              ...gr.salesPurchaseOrder.salesOperationUnit.district,
              name: gr.salesPurchaseOrder.salesOperationUnit.district.districtName,
            },
          },
          products: gr.salesPurchaseOrder.salesProductsInPurchaseOrder.map((product) => ({
            ...product,
            id: product.salesProductItem.id,
            name: product.salesProductItem.name,
            category: product.salesProductItem.category,
          })),
        }) ||
        null,
      internalTransfer:
        (gr.salesInternalTransfer && {
          ...gr.salesInternalTransfer,
          sourceOperationUnit: {
            ...gr.salesInternalTransfer.sourceOperationUnit,
            province: {
              ...gr.salesInternalTransfer.sourceOperationUnit.province,
              name: gr.salesInternalTransfer.sourceOperationUnit.province.provinceName,
            },
            city: {
              ...gr.salesInternalTransfer.sourceOperationUnit.city,
              name: gr.salesInternalTransfer.sourceOperationUnit.city.cityName,
            },
            district: {
              ...gr.salesInternalTransfer.sourceOperationUnit.district,
              name: gr.salesInternalTransfer.sourceOperationUnit.district.districtName,
            },
          },
          targetOperationUnit: {
            ...gr.salesInternalTransfer.targetOperationUnit,
            province: {
              ...gr.salesInternalTransfer.targetOperationUnit.province,
              name: gr.salesInternalTransfer.targetOperationUnit.province.provinceName,
            },
            city: {
              ...gr.salesInternalTransfer.targetOperationUnit.city,
              name: gr.salesInternalTransfer.targetOperationUnit.city.cityName,
            },
            district: {
              ...gr.salesInternalTransfer.targetOperationUnit.district,
              name: gr.salesInternalTransfer.targetOperationUnit.district.districtName,
            },
          },
          createdDate: gr.salesInternalTransfer.createdDate.toISOString(),
          modifiedDate: gr.salesInternalTransfer.modifiedDate.toISOString(),
        }) ||
        null,
      salesOrder:
        (gr.salesOrder && {
          ...gr.salesOrder,
          createdDate: gr.salesOrder ? gr.salesOrder.createdDate.toISOString() : '',
          customer: gr.salesOrder.customerId ? gr.salesOrder.customer : null,
          customerId: gr.salesOrder.customerId || null,
          customerName: gr.salesOrder.customerName || null,
          operationUnit: {
            ...gr.salesOrder.operationUnit,
            province: {
              ...gr.salesOrder.operationUnit.province,
              name: gr.salesOrder.operationUnit.province.provinceName,
            },
            city: {
              ...gr.salesOrder.operationUnit.city,
              name: gr.salesOrder.operationUnit.city.cityName,
            },
            district: {
              ...gr.salesOrder.operationUnit.district,
              name: gr.salesOrder.operationUnit.district.districtName,
            },
          },
          salesperson: {
            ...gr.salesOrder.salesperson,
            name: gr.salesOrder.salesperson.fullName,
          },
          products: gr.salesOrder.products,
        }) ||
        null,
      products:
        (gr.salesProductsInGoodsReceived.length > 0 &&
          gr.salesProductsInGoodsReceived.map((product) => ({
            ...product,
            productItemId: product.salesProductItemId,
            productItem: product.salesProductItem,
          }))) ||
        [],
      createdDate: gr.createdDate.toISOString(),
      modifiedDate: gr.modifiedDate.toISOString(),
      createdBy: gr.userCreator?.fullName,
      modifiedBy: gr.userModifier?.fullName,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private async validateProductInput(products: ProductsInGoodsReceivedItemBody[]) {
    const productItems = products.filter((p) => p.productItemId);
    const productCategories = products.filter((p) => p.productCategoryId);

    if (productItems.length + productCategories.length !== products.length) {
      throw new Error('Something wrong in products');
    }

    if (productItems.length) {
      await this.productItemDAO.validateQuantityAndWeight(
        productItems.map((p) => ({
          ...p,
          productItemId: p.productItemId!,
        })),
      );
    }
  }
}
