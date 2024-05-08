import { Static, Type } from '@sinclair/typebox';
import { GR_STATUS } from '../../datasources/entity/pgsql/sales/GoodsReceived.entity';
import { OperationUnitTypeEnum } from '../../datasources/entity/pgsql/sales/OperationUnit.entity';
import {
  PurchaseOrderSourceEnum,
  PurchaseOrderStatusEnum,
} from '../../datasources/entity/pgsql/sales/PurchaseOrder.entity';
import {
  VendorPriceBasisEnum,
  VendorTypeEnum,
} from '../../datasources/entity/pgsql/sales/Vendor.entity';
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
  purchasableProducts: Type.Array(productCategoryDTO),
  type: Type.Optional(Type.Enum(VendorTypeEnum)),
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
  quantity: Type.Optional(Type.Number()),
  minValue: Type.Optional(Type.Number()),
  maxValue: Type.Optional(Type.Number()),
  price: Type.Number(),
  weight: Type.Number(),
  category: Type.Optional(productCategoryDTO),
});

export const productsInGoodsReceivedItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  name: Type.Optional(Type.String()),
  category: Type.Optional(productCategoryDTO),
  price: Nullable(Type.Number()),
  quantity: Type.Optional(Type.Number()),
  weight: Type.Number(),
});

export const goodsReceivedItemDTO = Type.Object({
  id: Type.String(),
  code: Type.String(),
  status: Type.Enum(GR_STATUS),
  products: Type.Array(productsInGoodsReceivedItemDTO),
});

export const purchaseOrderItemDTO = Type.Object({
  id: Type.String(),
  vendorId: Nullable(Type.String()),
  code: Type.String(),
  vendor: Nullable(
    Type.Object(
      Type.Omit(Type.Partial(vendorItemDTO), ['provinceId', 'cityId', 'districtId']).properties,
    ),
  ),
  totalWeight: Nullable(Type.Number()),
  remarks: Type.Optional(Nullable(Type.String())),
  jagalId: Nullable(Type.String()),
  jagal: Nullable(operationUnitItemDTO),
  operationUnitId: Type.String(),
  operationUnit: operationUnitItemDTO,
  status: Type.Enum(PurchaseOrderStatusEnum),
  products: Type.Array(productItemDTO),
  goodsReceived: Nullable(goodsReceivedItemDTO),
  createdDate: Type.Optional(Type.String()),
  createdBy: Type.Optional(Type.String()),
  modifiedDate: Type.Optional(Type.String()),
  modifiedBy: Type.Optional(Type.String()),
});

export const getSalesPurchaseOrdersQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  ...Type.Partial(
    Type.Pick(purchaseOrderItemDTO, ['vendorId', 'operationUnitId', 'code', 'jagalId']),
  ).properties,
  status: Type.Optional(
    Type.Union([
      Type.Enum(PurchaseOrderStatusEnum),
      Type.Array(Type.Enum(PurchaseOrderStatusEnum)),
    ]),
  ),
  createdDate: Type.Optional(Type.String({ format: 'date' })),
  productCategoryId: Type.Optional(Type.String()),
  productItemId: Type.Optional(Type.String()),
  source: Type.Optional(Type.Enum(PurchaseOrderSourceEnum)),
});

export const getSalesPurchaseOrdersByIdResponseItemDTO = Type.Object({
  ...Type.Pick(purchaseOrderItemDTO, [
    'id',
    'code',
    'vendor',
    'jagal',
    'operationUnit',
    'totalWeight',
    'status',
    'products',
    'goodsReceived',
    'remarks',
    'createdDate',
    'createdBy',
    'modifiedDate',
    'modifiedBy',
  ]).properties,
  totalQuantity: Type.Optional(Type.Number()),
  totalPrice: Type.Optional(Type.Number()),
});

export const getSalesPurchaseOrdersResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getSalesPurchaseOrdersByIdResponseItemDTO),
});

export const getSalesPurchaseOrderByIdParamsDTO = Type.Object({
  purchaseOrderId: Type.String(),
});

export const getSalesPurchaseOrderByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSalesPurchaseOrdersByIdResponseItemDTO,
});

export const productItemBodyDTO = Type.Object({
  productItemId: Type.String(),
  quantity: Type.Optional(Type.Number({ default: 0, minimum: 0 })),
  price: Type.Optional(Type.Number({ default: 0, minimum: 0 })),
  weight: Type.Number({ default: 0, minimum: 0 }),
});

export const salesPurchaseOrderBodyDTO = Type.Object({
  ...Type.Pick(purchaseOrderItemDTO, ['operationUnitId', 'status', 'remarks', 'totalWeight'])
    .properties,
  products: Type.Array(productItemBodyDTO),
  jagalId: Type.Optional(Type.String()),
  vendorId: Type.Optional(Type.String()),
});

export const createSalesPurchaseOrderBodyDTO = Type.Object(
  {
    ...salesPurchaseOrderBodyDTO.properties,
  },
  { additionalProperties: false },
);

export const createSalesPurchaseOrderResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSalesPurchaseOrdersByIdResponseItemDTO,
});

export const updatePurchaseOrderParamsDTO = Type.Object({
  purchaseOrderId: Type.String(),
});

export const updateSalesPurchaseOrderBodyDTO = Type.Object(
  {
    ...Type.Pick(purchaseOrderItemDTO, ['operationUnitId', 'status', 'totalWeight']).properties,
    products: Type.Array(productItemBodyDTO),
    jagalId: Type.Optional(Type.String()),
    vendorId: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

export const updateSalesPurchaseOrderResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSalesPurchaseOrdersByIdResponseItemDTO,
});

export const cancelSalesPurchaseOrderResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    message: Type.String(),
  }),
});

export type GetSalesPurchaseOrdersQuery = Static<typeof getSalesPurchaseOrdersQueryDTO>;

export type GetSalesPurchaseOrdersByIdResponseItem = Static<
  typeof getSalesPurchaseOrdersByIdResponseItemDTO
>;

export type GetSalesPurchaseOrdersResponse = Static<typeof getSalesPurchaseOrdersResponseDTO>;

export type GetSalesPurchaseOrderByIdParams = Static<typeof getSalesPurchaseOrderByIdParamsDTO>;

export type GetSalesPurchaseOrderByIdResponse = Static<typeof getSalesPurchaseOrderByIdResponseDTO>;

export type CreateSalesPurchaseOrderBody = Static<typeof createSalesPurchaseOrderBodyDTO>;

export type CreateSalesPurchaseOrderResponse = Static<typeof createSalesPurchaseOrderResponseDTO>;

export type UpdateSalesPurchaseOrderParams = Static<typeof updatePurchaseOrderParamsDTO>;

export type UpdateSalesPurchaseOrderBody = Static<typeof updateSalesPurchaseOrderBodyDTO>;

export type UpdateSalesPurchaseOrderResponse = Static<typeof updateSalesPurchaseOrderResponseDTO>;

export type CancelSalesPurchaseOrderResponse = Static<typeof cancelSalesPurchaseOrderResponseDTO>;
