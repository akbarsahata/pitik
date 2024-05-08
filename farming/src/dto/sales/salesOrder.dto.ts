import { Static, Type } from '@sinclair/typebox';
import { GR_STATUS } from '../../datasources/entity/pgsql/sales/GoodsReceived.entity';
import { OperationUnitTypeEnum } from '../../datasources/entity/pgsql/sales/OperationUnit.entity';
import { ProductNotesInSalesOrderCutType } from '../../datasources/entity/pgsql/sales/ProductNotesInSalesOrder.entity';
import { ProductsInSalesOrderCutType } from '../../datasources/entity/pgsql/sales/ProductsInSalesOrder.entity';
import {
  SalesOrderCategory,
  SalesOrderGrStatusEnum,
  SalesOrderPaymentMethod,
  SalesOrderReturnStatusEnum,
  SalesOrderStatusEnum,
  SalesOrderType,
} from '../../datasources/entity/pgsql/sales/SalesOrder.entity';
import { Nullable } from '../../libs/utils/typebox';
import { paginationDTO } from '../common.dto';

export const locationItemDTO = Type.Object({
  id: Type.Number(),
  name: Type.String(),
});

export const customerItemDTO = Type.Object({
  id: Type.String(),
  businessName: Type.String(),
});

export const userItemDTO = Type.Object({
  id: Type.String(),
  fullName: Type.String(),
  email: Type.String(),
  branch: Type.Optional(Nullable(Type.Object({ id: Type.String(), name: Type.String() }))),
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
});

export const productsInSalesOrderItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  productItemId: Type.String(),
  name: Type.Optional(Type.String()),
  minValue: Type.Optional(Type.Number()),
  maxValue: Type.Optional(Type.Number()),
  quantity: Type.Number({ default: 0, minimum: 0 }),
  cutType: Type.Enum(ProductsInSalesOrderCutType, {
    default: ProductsInSalesOrderCutType.REGULAR,
  }),
  numberOfCuts: Type.Number({ default: 0, minimum: 0 }),
  weight: Type.Number({ default: 0, minimum: 0 }),
  returnQuantity: Type.Optional(Nullable(Type.Number())),
  returnWeight: Type.Optional(Nullable(Type.Number())),
  price: Type.Number(),
  category: Type.Optional(Nullable(productItemDTO)),
});

export const productNotesInSalesOrderItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  productCategoryId: Type.String(),
  name: Type.Optional(Type.String()),
  quantity: Type.Number({ default: 0, minimum: 0 }),
  cutType: Type.Enum(ProductNotesInSalesOrderCutType, {
    default: ProductNotesInSalesOrderCutType.REGULAR,
  }),
  numberOfCuts: Type.Number({ default: 0, minimum: 0 }),
  weight: Type.Number({ default: 0, minimum: 0 }),
});

export const productCategoryDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
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

export const salesOrderItemDTO = Type.Object(
  {
    id: Type.String(),
    code: Type.String(),
    remarks: Type.Optional(Nullable(Type.String())),
    deliveryTime: Type.Optional(Nullable(Type.String({ format: 'date-time' }))),
    driverRemarks: Type.Optional(Nullable(Type.String())),
    customerId: Type.Optional(Nullable(Type.String())),
    customerName: Type.Optional(Nullable(Type.String({ maxLength: 256 }))),
    salespersonId: Type.String(),
    driverId: Nullable(Type.String()),
    operationUnitId: Type.Optional(Nullable(Type.String())),
    type: Type.Enum(SalesOrderType),
    category: Type.Enum(SalesOrderCategory, { default: SalesOrderCategory.OUTBOUND }),
    status: Type.Enum(SalesOrderStatusEnum),
    grStatus: Type.Enum(SalesOrderGrStatusEnum),
    returnStatus: Type.Union([Type.Null(), Type.Enum(SalesOrderReturnStatusEnum)]),
    returnReason: Nullable(Type.String()),
    totalWeight: Type.Number(),
    totalQuantity: Type.Number(),
    totalPrice: Type.Number(),
    deliveryFee: Type.Number(),
    goodsReceived: Nullable(goodsReceivedItemDTO),
    paymentMethod: Type.Union([Type.Null(), Type.Enum(SalesOrderPaymentMethod)]),
    paymentAmount: Nullable(Type.Number()),
    createdDate: Type.String(),
    modifiedDate: Type.String(),
    customer: Nullable(customerItemDTO),
    salesperson: userItemDTO,
    operationUnit: Nullable(operationUnitItemDTO),
    products: Type.Array(productsInSalesOrderItemDTO, { minItems: 1 }),
    productNotes: Type.Array(productNotesInSalesOrderItemDTO, { default: [] }),
    userModifier: userItemDTO,
    userCreator: userItemDTO,
    driver: Nullable(userItemDTO),
  },
  {
    additionalProperties: false,
  },
);

export const createSalesOrderBodyDTO = Type.Object({
  ...Type.Pick(
    salesOrderItemDTO,
    [
      'customerId',
      'customerName',
      'type',
      'category',
      'status',
      'products',
      'productNotes',
      'remarks',
      'driverRemarks',
      'deliveryTime',
      'operationUnitId',
    ],
    {
      additionalProperties: false,
    },
  ).properties,
  withDeliveryFee: Type.Optional(Type.Boolean()),
});

export const getSalesOrderDetailParamDTO = Type.Pick(salesOrderItemDTO, ['id']);

export const getSalesOrderDetailResponseDTO = Type.Object({
  code: Type.Number(),
  data: salesOrderItemDTO,
});

export const getSalesOrderListQueryDTO = Type.Object({
  ...Type.Pick(Type.Partial(salesOrderItemDTO), ['code', 'customerId', 'salespersonId', 'driverId'])
    .properties,
  category: Type.Optional(Type.Enum(SalesOrderCategory)),
  ...Type.Partial(paginationDTO).properties,
  status: Type.Optional(
    Type.Union([Type.Array(Type.Enum(SalesOrderStatusEnum)), Type.Enum(SalesOrderStatusEnum)]),
  ),
  grStatus: Type.Optional(
    Type.Union([Type.Array(Type.Enum(SalesOrderGrStatusEnum)), Type.Enum(SalesOrderGrStatusEnum)]),
  ),
  returnStatus: Type.Optional(
    Type.Union([
      Type.Array(Type.Enum(SalesOrderReturnStatusEnum)),
      Type.Enum(SalesOrderReturnStatusEnum),
    ]),
  ),
  sameBranch: Type.Optional(Type.Boolean()),
  withinProductionTeam: Type.Optional(Nullable(Type.Boolean())),
  withinSalesTeam: Type.Optional(Nullable(Type.Boolean())),
  customerCityId: Type.Optional(Type.Number()),
  customerProvinceId: Type.Optional(Type.Number()),
  customerName: Type.Optional(Type.String()),
  operationUnitId: Type.Optional(Type.String()),
  productCategoryId: Type.Optional(Type.String()),
  productItemId: Type.Optional(Type.String()),
  createdBy: Type.Optional(Type.String()),
  date: Type.Optional(Type.String({ format: 'date' })),
  minQuantityRange: Type.Optional(Type.Number({ minimum: 0 })),
  maxQuantityRange: Type.Optional(Type.Number({ minimum: 0 })),
  quantity: Type.Optional(Type.Number({ minimum: 0 })),
  minDeliveryTime: Type.Optional(Type.String({ format: 'date-time' })),
  maxDeliveryTime: Type.Optional(Type.String({ format: 'date-time' })),
  branchId: Type.Optional(Type.String()),
});

export const getSalesOrderListResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(salesOrderItemDTO),
});

export const updateSalesOrderBodyDTO = Type.Object({
  ...Type.Pick(salesOrderItemDTO, [
    'customerId',
    'customerName',
    'status',
    'operationUnitId',
    'products',
    'productNotes',
    'remarks',
    'driverRemarks',
    'deliveryTime',
  ]).properties,
  withDeliveryFee: Type.Optional(Type.Boolean()),
});

export const setDriverBodyDTO = Type.Object({
  deliveryTime: Type.Optional(Nullable(Type.String({ format: 'date-time' }))),
  driverId: Type.String(),
  withDeliveryFee: Type.Boolean(),
});

export const driverPickUpBodyDTO = Type.Object({
  driverRemarks: Type.Optional(Nullable(Type.String())),
});

export const deliverBodyDTO = Type.Object({
  ...Type.Pick(salesOrderItemDTO, ['paymentMethod', 'paymentAmount', 'driverRemarks']).properties,
  latitude: Type.Number(),
  longitude: Type.Number(),
});

export const returnProductBodyDTO = Type.Object({
  reason: Type.String(),
  returnedProducts: Type.Array(
    Type.Pick(productsInSalesOrderItemDTO, ['productItemId', 'quantity', 'weight']),
  ),
});

export const checkInBodyDTO = Type.Object({
  latitude: Type.Number(),
  longitude: Type.Number(),
});

export const checkInResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    distance: Type.Number(),
  }),
});

export const bookStockBodyDTO = Type.Pick(salesOrderItemDTO, [
  'operationUnitId',
  'customerId',
  'products',
  'productNotes',
]);

export type SalesOrderItem = Static<typeof salesOrderItemDTO>;

export type CreateSalesOrderBody = Static<typeof createSalesOrderBodyDTO>;

export type GetSalesOrderDetailParam = Static<typeof getSalesOrderDetailParamDTO>;

export type GetSalesOrderDetailResponse = Static<typeof getSalesOrderDetailResponseDTO>;

export type GetSalesOrderListQuery = Static<typeof getSalesOrderListQueryDTO>;

export type GetSalesOrderListResponse = Static<typeof getSalesOrderListResponseDTO>;

export type UpdateSalesOrderBody = Static<typeof updateSalesOrderBodyDTO>;

export type DeliverBody = Static<typeof deliverBodyDTO>;

export type SetDriverBody = Static<typeof setDriverBodyDTO>;

export type DriverPickUpBody = Static<typeof driverPickUpBodyDTO>;

export type ProductsInSalesOrderItem = Static<typeof productsInSalesOrderItemDTO>;

export type ProductNotesInSalesOrderItem = Static<typeof productNotesInSalesOrderItemDTO>;

export type ReturnProductBody = Static<typeof returnProductBodyDTO>;

export type BookStockBody = Static<typeof bookStockBodyDTO>;

export type CheckInBody = Static<typeof checkInBodyDTO>;

export type CheckInResponse = Static<typeof checkInResponseDTO>;
