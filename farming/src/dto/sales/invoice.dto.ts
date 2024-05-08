import { Static, Type } from '@sinclair/typebox';
import { OperationUnitTypeEnum } from '../../datasources/entity/pgsql/sales/OperationUnit.entity';
import { PurchaseOrderStatusEnum } from '../../datasources/entity/pgsql/sales/PurchaseOrder.entity';
import { InvoiceStatusEnum } from '../../datasources/entity/pgsql/sales/PurchaseOrderInvoice.entity';
import { VendorPriceBasisEnum } from '../../datasources/entity/pgsql/sales/Vendor.entity';
import { Nullable } from '../../libs/utils/typebox';
import { paginationDTO } from '../common.dto';

export const locationItemDTO = Type.Object({
  id: Type.Number(),
  name: Type.String(),
});

export const productCategoryDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export const vendorItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  provinceId: Type.Number(),
  province: locationItemDTO,
  cityId: Type.Number(),
  city: locationItemDTO,
  districtId: Type.Number(),
  district: locationItemDTO,
  plusCode: Type.String(),
  priceBasis: Type.Enum(VendorPriceBasisEnum),
  status: Type.Boolean(),
});

export const operationUnitItemDTO = Type.Object({
  id: Type.String(),
  operationUnitName: Type.String(),
  type: Type.Enum(OperationUnitTypeEnum),
  district: locationItemDTO,
  city: locationItemDTO,
  province: locationItemDTO,
  plusCode: Type.String(),
  latitude: Type.Number(),
  longitude: Type.Number(),
  status: Type.Boolean(),
});

export const productItemDTO = Type.Object({
  id: Type.String(),
  name: Type.Optional(Type.String()),
  minValue: Type.Optional(Type.Number()),
  maxValue: Type.Optional(Type.Number()),
  quantity: Type.Optional(Type.Number()),
  price: Type.Number(),
  weight: Type.Optional(Type.Number()),
  category: Type.Optional(productCategoryDTO),
});

export const purchaseOrderItemDTO = Type.Object({
  id: Type.String(),
  code: Type.String(),
  vendor: Nullable(
    Type.Object(
      Type.Omit(Type.Partial(vendorItemDTO), ['provinceId', 'cityId', 'districtId']).properties,
    ),
  ),
  jagal: Nullable(operationUnitItemDTO),
  operationUnit: operationUnitItemDTO,
  status: Type.Enum(PurchaseOrderStatusEnum),
  products: Type.Array(productItemDTO),
});

export const invoiceItemDTO = Type.Object({
  id: Type.String(),
  code: Type.String(),
  date: Type.String({ format: 'date' }),
  purchaseOrderId: Type.String(),
  purchaseOrder: purchaseOrderItemDTO,
  status: Type.Enum(InvoiceStatusEnum),
  products: Type.Array(productItemDTO),
  createdBy: Type.Optional(Type.String()),
  createdDate: Type.Optional(Type.String()),
  modifiedBy: Type.Optional(Type.String()),
  modifiedDate: Type.Optional(Type.String()),
});

export const getSalesPurchaseOrderInvoicesQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  purchaseOrderCode: Type.Optional(Type.String()),
  ...Type.Partial(Type.Pick(invoiceItemDTO, ['purchaseOrderId', 'status', 'date', 'code']))
    .properties,
});

export const getSalesPurchaseOrderInvoicesByIdResponseItemDTO = Type.Object({
  ...Type.Pick(invoiceItemDTO, [
    'id',
    'code',
    'date',
    'purchaseOrder',
    'status',
    'products',
    'createdBy',
    'createdDate',
    'modifiedBy',
    'modifiedDate',
  ]).properties,
});

export const getSalesPurchaseOrderInvoicesResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getSalesPurchaseOrderInvoicesByIdResponseItemDTO),
});

export const getSalesPurchaseOrderInvoiceByIdParamsDTO = Type.Object({
  invoiceId: Type.String(),
});

export const getSalesPurchaseOrderInvoiceByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSalesPurchaseOrderInvoicesByIdResponseItemDTO,
});

export const productItemBodyDTO = Type.Object({
  id: Type.String(),
  quantity: Type.Number(),
  price: Type.Number(),
});

export const salesPurchaseOrderInvoiceBodyDTO = Type.Object({
  ...Type.Pick(invoiceItemDTO, ['purchaseOrderId', 'status', 'date']).properties,
  products: Type.Array(productItemDTO),
});

export const createSalesPurchaseOrderInvoiceBodyDTO = Type.Object(
  {
    ...salesPurchaseOrderInvoiceBodyDTO.properties,
  },
  { additionalProperties: false },
);

export const createSalesPurchaseOrderInvoiceResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSalesPurchaseOrderInvoicesByIdResponseItemDTO,
});

export const updateInvoiceParamsDTO = Type.Object({
  vendorId: Type.String(),
});

export const updateSalesPurchaseOrderInvoiceBodyDTO = Type.Object(
  {
    ...Type.Pick(invoiceItemDTO, ['status', 'date']).properties,
    products: Type.Array(productItemDTO),
  },
  { additionalProperties: false },
);

export const updateSalesPurchaseOrderInvoiceResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSalesPurchaseOrderInvoicesByIdResponseItemDTO,
});

export type GetSalesPurchaseOrderInvoicesQuery = Static<
  typeof getSalesPurchaseOrderInvoicesQueryDTO
>;

export type GetSalesPurchaseOrderInvoicesByIdResponseItem = Static<
  typeof getSalesPurchaseOrderInvoicesByIdResponseItemDTO
>;

export type GetSalesPurchaseOrderInvoicesResponse = Static<
  typeof getSalesPurchaseOrderInvoicesResponseDTO
>;

export type GetSalesPurchaseOrderInvoiceByIdParams = Static<
  typeof getSalesPurchaseOrderInvoiceByIdParamsDTO
>;

export type GetSalesPurchaseOrderInvoiceByIdResponse = Static<
  typeof getSalesPurchaseOrderInvoiceByIdResponseDTO
>;

export type CreateSalesPurchaseOrderInvoiceBody = Static<
  typeof createSalesPurchaseOrderInvoiceBodyDTO
>;

export type CreateSalesPurchaseOrderInvoiceResponse = Static<
  typeof createSalesPurchaseOrderInvoiceResponseDTO
>;

export type UpdateSalesPurchaseOrderInvoiceParams = Static<typeof updateInvoiceParamsDTO>;

export type UpdateSalesPurchaseOrderInvoiceBody = Static<
  typeof updateSalesPurchaseOrderInvoiceBodyDTO
>;

export type UpdateSalesPurchaseOrderInvoiceResponse = Static<
  typeof updateSalesPurchaseOrderInvoiceResponseDTO
>;
