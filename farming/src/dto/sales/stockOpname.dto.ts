import { Static, Type } from '@sinclair/typebox';
import { OperationUnitTypeEnum } from '../../datasources/entity/pgsql/sales/OperationUnit.entity';
import { StockOpnameStatusEnum } from '../../datasources/entity/pgsql/sales/StockOpname.entity';
import { Nullable } from '../../libs/utils/typebox';
import { paginationDTO } from '../common.dto';

export const locationItemDTO = Type.Object({
  id: Type.Number(),
  name: Type.String(),
});

export const reviewerItemDTO = Type.Object({
  id: Type.String(),
  fullName: Type.String(),
  email: Type.String(),
});

export const operationUnitItemDTO = Type.Object({
  id: Type.String(),
  type: Type.Enum(OperationUnitTypeEnum),
  district: locationItemDTO,
  city: locationItemDTO,
  province: locationItemDTO,
  operationUnitName: Type.String(),
  plusCode: Type.String(),
  latitude: Type.Number(),
  longitude: Type.Number(),
  status: Type.Boolean(),
});

export const productItemStockOpnameDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  quantity: Type.Optional(Nullable(Type.Number())),
  weight: Nullable(Type.Number()),
  previousQuantity: Type.Number(),
  previousWeight: Type.Number(),
});

export const productCategoryDTO = Type.Object({
  id: Type.String(),
  name: Type.Optional(Type.String()),
  totalQuantity: Type.Number(),
  totalWeight: Type.Number(),
  quantityUOM: Nullable(Type.String()),
  weightUOM: Nullable(Type.String()),
  productItems: Type.Array(productItemStockOpnameDTO, { default: [] }),
});

export const stockOpnameItemDTO = Type.Object({
  id: Type.String(),
  code: Type.String(),
  operationUnitId: Type.String(),
  operationUnit: operationUnitItemDTO,
  totalWeight: Nullable(Type.Number()),
  status: Type.Enum(StockOpnameStatusEnum),
  confirmedDate: Nullable(Type.String({ format: 'date' })),
  reviewedDate: Nullable(Type.String({ format: 'date' })),
  reviewerId: Type.Optional(Type.String()),
  reviewer: Nullable(reviewerItemDTO),
  products: Type.Array(productCategoryDTO),
  createdDate: Type.Optional(Type.String()),
  createdBy: Type.Optional(Type.String()),
  modifiedDate: Type.Optional(Type.String()),
  modifiedBy: Type.Optional(Type.String()),
});

export const getSalesStockOpnamesQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  ...Type.Partial(Type.Pick(stockOpnameItemDTO, ['operationUnitId', 'status', 'confirmedDate']))
    .properties,
});

export const getSalesStockOpnameByIdResponseItemDTO = Type.Object({
  ...Type.Pick(stockOpnameItemDTO, [
    'id',
    'code',
    'operationUnit',
    'status',
    'totalWeight',
    'confirmedDate',
    'products',
    'reviewer',
    'createdDate',
    'createdBy',
    'modifiedDate',
    'modifiedBy',
  ]).properties,
});

export const getSalesStockOpnamesResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getSalesStockOpnameByIdResponseItemDTO),
});

export const getSalesStockOpnameByIdParamsDTO = Type.Object({
  stockOpnameId: Type.String(),
});

export const getSalesStockOpnameByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSalesStockOpnameByIdResponseItemDTO,
});

export const productItemBodyDTO = Type.Object({
  productItemId: Type.String(),
  quantity: Nullable(Type.Number({ default: null })),
  weight: Nullable(Type.Number({ default: null })),
});

export const salesStockOpnameBodyDTO = Type.Object({
  ...Type.Pick(stockOpnameItemDTO, ['operationUnitId', 'status', 'reviewerId', 'totalWeight'])
    .properties,
  products: Type.Array(productItemBodyDTO),
});

export const createSalesStockOpnameBodyDTO = Type.Object(
  {
    ...salesStockOpnameBodyDTO.properties,
  },
  { additionalProperties: false },
);

export const createSalesStockOpnameResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSalesStockOpnameByIdResponseItemDTO,
});

export const updateSalesStockOpnameParamsDTO = Type.Object({
  stockOpnameId: Type.String(),
});

export const updateSalesStockOpnameBodyDTO = Type.Object(
  {
    ...Type.Pick(stockOpnameItemDTO, ['operationUnitId', 'status', 'reviewerId', 'totalWeight'])
      .properties,
    products: Type.Array(productItemBodyDTO),
  },
  { additionalProperties: false },
);

export const updateSalesStockOpnameResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSalesStockOpnameByIdResponseItemDTO,
});

export type StockOpnamesProductItemBody = Static<typeof productItemBodyDTO>;

export type GetSalesStockOpnamesQuery = Static<typeof getSalesStockOpnamesQueryDTO>;

export type GetSalesStockOpnameByIdResponseItem = Static<
  typeof getSalesStockOpnameByIdResponseItemDTO
>;

export type GetSalesStockOpnamesResponse = Static<typeof getSalesStockOpnamesResponseDTO>;

export type GetSalesStockOpnameByIdParams = Static<typeof getSalesStockOpnameByIdParamsDTO>;

export type GetSalesStockOpnameByIdItemResponse = Static<
  typeof getSalesStockOpnameByIdResponseItemDTO
>;

export type GetSalesStockOpnameByIdResponse = Static<typeof getSalesStockOpnameByIdResponseDTO>;

export type CreateSalesStockOpnameBody = Static<typeof createSalesStockOpnameBodyDTO>;

export type CreateSalesStockOpnameResponse = Static<typeof createSalesStockOpnameResponseDTO>;

export type UpdateSalesStockOpnameParams = Static<typeof updateSalesStockOpnameParamsDTO>;

export type UpdateSalesStockOpnameBody = Static<typeof updateSalesStockOpnameBodyDTO>;

export type UpdateSalesStockOpnameResponse = Static<typeof updateSalesStockOpnameResponseDTO>;

export type ProductCategory = Static<typeof productCategoryDTO>;

export type ProductItemStockOpname = Static<typeof productItemStockOpnameDTO>;
