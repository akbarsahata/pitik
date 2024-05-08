import { Static, Type } from '@sinclair/typebox';
import { GR_STATUS } from '../../datasources/entity/pgsql/sales/GoodsReceived.entity';
import { OperationUnitTypeEnum } from '../../datasources/entity/pgsql/sales/OperationUnit.entity';
import { PurchaseOrderStatusEnum } from '../../datasources/entity/pgsql/sales/PurchaseOrder.entity';
import {
  SalesOrderReturnStatusEnum,
  SalesOrderStatusEnum,
} from '../../datasources/entity/pgsql/sales/SalesOrder.entity';
import { VendorPriceBasisEnum } from '../../datasources/entity/pgsql/sales/Vendor.entity';
import { Nullable } from '../../libs/utils/typebox';
import { paginationDTO } from '../common.dto';

export const customerItemDTO = Type.Object({
  id: Type.String(),
  businessName: Type.String(),
});

export const userItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

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
  purchasableProducts: Type.Array(productCategoryDTO),
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
  name: Type.String(),
  minValue: Nullable(Type.Number()),
  maxValue: Nullable(Type.Number()),
  uom: Nullable(Type.String()),
  value: Nullable(Type.Number()),
  category: Type.Optional(productCategoryDTO),
});

export const productsInGoodsReceivedItemDTO = Type.Object({
  productItemId: Nullable(Type.String()),
  productItem: Nullable(productItemDTO),
  price: Nullable(Type.Number()),
  quantity: Type.Optional(Type.Number()),
  weight: Type.Number(),
});

export const productsInPurchaseOrderItemDTO = Type.Object({
  id: Type.String(),
  name: Type.Optional(Type.String()),
  quantity: Type.Optional(Type.Number()),
  price: Type.Number(),
  weight: Type.Number(),
  category: Type.Optional(productCategoryDTO),
});

export const purchaseOrderItemDTO = Type.Object({
  id: Type.String(),
  vendorId: Nullable(Type.String()),
  vendor: Nullable(
    Type.Object(
      Type.Omit(Type.Partial(vendorItemDTO), ['provinceId', 'cityId', 'districtId']).properties,
    ),
  ),
  operationUnitId: Type.String(),
  operationUnit: operationUnitItemDTO,
  jagalId: Nullable(Type.String()),
  jagal: Nullable(operationUnitItemDTO),
  status: Type.Enum(PurchaseOrderStatusEnum),
  products: Type.Array(productsInPurchaseOrderItemDTO),
});

export const productsInSalesOrderItemDTO = Type.Object({
  productItemId: Type.String(),
  productItem: productItemDTO,
  quantity: Type.Number(),
  numberOfCuts: Type.Number(),
  weight: Type.Number(),
  price: Type.Number(),
});

export const salesOrderItemDTO = Type.Object(
  {
    id: Type.String(),
    customerId: Type.Optional(Nullable(Type.String())),
    customerName: Type.Optional(Nullable(Type.String({ maxLength: 256 }))),
    salespersonId: Type.String(),
    driverId: Nullable(Type.String()),
    operationUnitId: Nullable(Type.String()),
    status: Type.Enum(SalesOrderStatusEnum),
    returnStatus: Type.Union([Type.Null(), Type.Enum(SalesOrderReturnStatusEnum)]),
    totalWeight: Type.Number(),
    totalQuantity: Type.Number(),
    totalPrice: Type.Number(),
    createdDate: Type.String(),
    customer: Nullable(customerItemDTO),
    salesperson: userItemDTO,
    operationUnit: Nullable(operationUnitItemDTO),
    products: Type.Array(productsInSalesOrderItemDTO),
  },
  { additionalProperties: false },
);

export const productInInternalTransferItemDTO = Type.Object(
  {
    internalTransferId: Type.String(),
    productItemId: Type.String(),
    quantity: Type.Number(),
    weight: Type.Number(),
    productItem: productItemDTO,
  },
  {
    additionalProperties: false,
  },
);

export const internalTransferItemDTO = Type.Object({
  id: Type.String(),
  sourceOperationUnit: operationUnitItemDTO,
  targetOperationUnit: operationUnitItemDTO,
  createdDate: Type.String(),
  modifiedDate: Type.String(),
  products: Type.Array(productInInternalTransferItemDTO),
});

export const salesGoodsReceivedItemDTO = Type.Object({
  id: Type.String(),
  code: Type.String(),
  status: Type.Enum(GR_STATUS),
  totalWeight: Nullable(Type.Number()),
  remarks: Type.Optional(Nullable(Type.String())),
  purchaseOrderId: Type.String(),
  purchaseOrder: Nullable(purchaseOrderItemDTO),
  // TODO: Add GR from manufacturing
  // manufacturingId: Type.String(),
  // manufactirung: Nullable(manufacturingItemDTO),
  internalTransferId: Type.String(),
  internalTransfer: Nullable(internalTransferItemDTO),
  salesOrderId: Type.String(),
  salesOrder: Nullable(salesOrderItemDTO),
  products: Type.Array(productsInGoodsReceivedItemDTO),
  modifiedBy: Type.Optional(Type.String()),
  modifiedDate: Type.Optional(Type.String()),
  createdBy: Type.Optional(Type.String()),
  createdDate: Type.Optional(Type.String()),
});

export const salesGoodReceivedIdentifierDTO = Type.Pick(Type.Partial(salesGoodsReceivedItemDTO), [
  'purchaseOrderId',
  'internalTransferId',
  'salesOrderId',
  // TODO: manufacturing id
]);

export const getSalesGoodsReceivedQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  ...Type.Partial(
    Type.Pick(salesGoodsReceivedItemDTO, ['purchaseOrderId', 'internalTransferId', 'salesOrderId']),
  ).properties,
  operationUnitId: Type.Optional(Type.String()),
});

export const getSalesGoodsReceivedByIdResponseItemDTO = Type.Object({
  ...Type.Pick(salesGoodsReceivedItemDTO, [
    'id',
    'code',
    'status',
    'totalWeight',
    'purchaseOrder',
    'internalTransfer',
    'salesOrder',
    'products',
    'remarks',
    'createdBy',
    'modifiedBy',
    'createdDate',
    'modifiedDate',
  ]).properties,
});

export const getSalesGoodsReceivedResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getSalesGoodsReceivedByIdResponseItemDTO),
});

export const getSalesGoodsReceivedByIdParamsDTO = Type.Object({
  goodsReceivedId: Type.String(),
});

export const getSalesGoodsReceivedByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSalesGoodsReceivedByIdResponseItemDTO,
});

export const productsInGoodsReceivedItemBodyDTO = Type.Object({
  productItemId: Type.Optional(Type.String()),
  productCategoryId: Type.Optional(Type.String()),
  quantity: Type.Optional(Type.Number({ default: 0, minimum: 0 })),
  price: Type.Optional(Type.Number()),
  weight: Type.Number({ default: 0, minimum: 0 }),
});

export const salesGoodsReceivedBodyDTO = Type.Object({
  ...Type.Partial(
    Type.Pick(salesGoodsReceivedItemDTO, [
      'purchaseOrderId',
      'internalTransferId',
      'salesOrderId',
      'totalWeight',
      'remarks',
    ]),
  ).properties,
  products: Type.Array(productsInGoodsReceivedItemBodyDTO),
});

export const createSalesGoodsReceivedBodyDTO = Type.Object(
  {
    ...salesGoodsReceivedBodyDTO.properties,
  },
  { additionalProperties: false },
);

export const createSalesGoodsReceivedResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSalesGoodsReceivedByIdResponseItemDTO,
});

export const updateSalesGoodsReceivedParamsDTO = Type.Object({
  goodsReceivedId: Type.String(),
});

export const updateSalesGoodsReceivedBodyDTO = Type.Object(
  {
    ...salesGoodsReceivedBodyDTO.properties,
  },
  { additionalProperties: false },
);

export const updateSalesGoodsReceivedResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSalesGoodsReceivedByIdResponseItemDTO,
});

export type GetSalesGoodsReceivedQuery = Static<typeof getSalesGoodsReceivedQueryDTO>;

export type GetSalesGoodsReceivedByIdResponseItem = Static<
  typeof getSalesGoodsReceivedByIdResponseItemDTO
>;

export type GetSalesGoodsReceivedResponse = Static<typeof getSalesGoodsReceivedResponseDTO>;

export type GetSalesGoodsReceivedByIdParams = Static<typeof getSalesGoodsReceivedByIdParamsDTO>;

export type GetSalesGoodsReceivedByIdResponse = Static<typeof getSalesGoodsReceivedByIdResponseDTO>;

export type CreateSalesGoodsReceivedBody = Static<typeof createSalesGoodsReceivedBodyDTO>;

export type CreateSalesGoodsReceivedResponse = Static<typeof createSalesGoodsReceivedResponseDTO>;

export type UpdateSalesGoodsReceivedParams = Static<typeof updateSalesGoodsReceivedParamsDTO>;

export type UpdateSalesGoodsReceivedBody = Static<typeof updateSalesGoodsReceivedBodyDTO>;

export type UpdateSalesGoodsReceivedResponse = Static<typeof updateSalesGoodsReceivedResponseDTO>;

export type SalesGoodReceivedIdentifier = Static<typeof salesGoodReceivedIdentifierDTO>;

export type ProductsInGoodsReceivedItemBody = Static<typeof productsInGoodsReceivedItemBodyDTO>;
