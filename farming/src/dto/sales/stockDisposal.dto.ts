import { Static, Type } from '@sinclair/typebox';
import { OperationUnitTypeEnum } from '../../datasources/entity/pgsql/sales/OperationUnit.entity';
import { StockDisposalStatusEnum } from '../../datasources/entity/pgsql/sales/StockDisposal.entity';
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

export const productItemDTO = Type.Object({
  id: Type.String(),
  name: Type.Optional(Type.String()),
  quantity: Type.Optional(Type.Number()),
  weight: Type.Number(),
});

export const productCategoryDTO = Type.Object({
  id: Type.String(),
  name: Type.Optional(Type.String()),
  quantityUOM: Nullable(Type.String()),
  weightUOM: Nullable(Type.String()),
  productItem: productItemDTO,
});

export const stockDisposalItemDTO = Type.Object({
  id: Type.String(),
  code: Type.String(),
  operationUnitId: Type.String(),
  operationUnit: operationUnitItemDTO,
  status: Type.Enum(StockDisposalStatusEnum),
  imageLink: Type.String({ format: 'uri' }),
  product: productCategoryDTO,
  reviewerId: Type.Optional(Type.String()),
  reviewedDate: Nullable(Type.String()),
  reviewer: Nullable(reviewerItemDTO),
  createdDate: Type.Optional(Type.String()),
  createdBy: Type.Optional(Type.String()),
  modifiedDate: Type.Optional(Type.String()),
  modifiedBy: Type.Optional(Type.String()),
});

export const getSalesStockDisposalsQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  ...Type.Partial(Type.Pick(stockDisposalItemDTO, ['operationUnitId', 'status', 'reviewerId']))
    .properties,
});

export const getSalesStockDisposalByIdResponseItemDTO = Type.Object({
  ...Type.Pick(stockDisposalItemDTO, [
    'id',
    'code',
    'operationUnit',
    'status',
    'imageLink',
    'product',
    'reviewer',
    'reviewedDate',
    'createdDate',
    'createdBy',
    'modifiedDate',
    'modifiedBy',
  ]).properties,
});

export const getSalesStockDisposalsResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getSalesStockDisposalByIdResponseItemDTO),
});

export const getSalesStockDisposalByIdParamsDTO = Type.Object({
  stockDisposalId: Type.String(),
});

export const getSalesStockDisposalByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSalesStockDisposalByIdResponseItemDTO,
});

export const productItemBodyDTO = Type.Object({
  productItemId: Type.String(),
  quantity: Type.Number({ default: 0, minimum: 0 }),
  weight: Type.Number({ default: 0, minimum: 0 }),
});

export const salesStockDisposalBodyDTO = Type.Object({
  ...Type.Pick(stockDisposalItemDTO, ['operationUnitId', 'status', 'imageLink']).properties,
  product: productItemBodyDTO,
});

export const createSalesStockDisposalBodyDTO = Type.Object(
  {
    ...salesStockDisposalBodyDTO.properties,
  },
  { additionalProperties: false },
);

export const createSalesStockDisposalResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSalesStockDisposalByIdResponseItemDTO,
});

export const updateSalesStockDisposalParamsDTO = Type.Object({
  stockDisposalId: Type.String(),
});

export const updateSalesStockDisposalBodyDTO = Type.Object(
  {
    ...Type.Pick(stockDisposalItemDTO, ['operationUnitId', 'status', 'reviewerId']).properties,
    ...Type.Pick(Type.Partial(stockDisposalItemDTO), ['imageLink']).properties,
    product: productItemBodyDTO,
  },
  { additionalProperties: false },
);

export const updateSalesStockDisposalResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSalesStockDisposalByIdResponseItemDTO,
});

export type GetSalesStockDisposalsQuery = Static<typeof getSalesStockDisposalsQueryDTO>;

export type GetSalesStockDisposalByIdResponseItem = Static<
  typeof getSalesStockDisposalByIdResponseItemDTO
>;

export type GetSalesStockDisposalsResponse = Static<typeof getSalesStockDisposalsResponseDTO>;

export type GetSalesStockDisposalByIdParams = Static<typeof getSalesStockDisposalByIdParamsDTO>;

export type GetSalesStockDisposalByIdItemResponse = Static<
  typeof getSalesStockDisposalByIdResponseItemDTO
>;

export type GetSalesStockDisposalByIdResponse = Static<typeof getSalesStockDisposalByIdResponseDTO>;

export type CreateSalesStockDisposalBody = Static<typeof createSalesStockDisposalBodyDTO>;

export type CreateSalesStockDisposalResponse = Static<typeof createSalesStockDisposalResponseDTO>;

export type UpdateSalesStockDisposalParams = Static<typeof updateSalesStockDisposalParamsDTO>;

export type UpdateSalesStockDisposalBody = Static<typeof updateSalesStockDisposalBodyDTO>;

export type UpdateSalesStockDisposalResponse = Static<typeof updateSalesStockDisposalResponseDTO>;
