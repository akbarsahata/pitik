import { Static, Type } from '@sinclair/typebox';
import { ManufactureStatusEnum } from '../../datasources/entity/pgsql/sales/Manufacture.entity';
import { OperationUnitTypeEnum } from '../../datasources/entity/pgsql/sales/OperationUnit.entity';
import { Nullable } from '../../libs/utils/typebox';
import { paginationDTO } from '../common.dto';

export const locationItemDTO = Type.Object({
  id: Type.Number(),
  name: Type.String(),
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

export const productItemInManufactureDTO = Type.Object({
  id: Type.String(),
  name: Type.Optional(Type.String()),
  quantity: Type.Optional(Type.Number()),
  weight: Type.Number(),
});

export const productCategoryInManufactureDTO = Type.Object({
  id: Type.String(),
  name: Type.Optional(Type.String()),
  totalQuantity: Type.Number(),
  totalWeight: Type.Number(),
  quantityUOM: Nullable(Type.String()),
  weightUOM: Nullable(Type.String()),
  productItems: Type.Array(productItemInManufactureDTO, { default: [] }),
});

export const manufactureItemDTO = Type.Object({
  id: Type.String(),
  code: Type.String(),
  operationUnitId: Type.String(),
  operationUnit: operationUnitItemDTO,
  status: Type.Enum(ManufactureStatusEnum),
  input: productCategoryInManufactureDTO,
  output: Type.Array(productCategoryInManufactureDTO),
  outputTotalWeight: Type.Optional(Type.Number()),
  createdDate: Type.Optional(Type.String()),
  createdBy: Type.Optional(Type.String()),
  modifiedDate: Type.Optional(Type.String()),
  modifiedBy: Type.Optional(Type.String()),
});

export const getSalesManufacturesQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  ...Type.Partial(Type.Pick(manufactureItemDTO, ['operationUnitId', 'status'])).properties,
});

export const getSalesManufactureByIdResponseItemDTO = Type.Object({
  ...Type.Pick(manufactureItemDTO, [
    'id',
    'code',
    'operationUnit',
    'status',
    'input',
    'output',
    'createdDate',
    'createdBy',
    'modifiedDate',
    'modifiedBy',
    'outputTotalWeight',
  ]).properties,
});

export const getSalesManufacturesResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getSalesManufactureByIdResponseItemDTO),
});

export const getSalesManufactureByIdParamsDTO = Type.Object({
  manufactureId: Type.String(),
});

export const getSalesManufactureByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSalesManufactureByIdResponseItemDTO,
});

export const productItemBodyDTO = Type.Object({
  productItemId: Type.String(),
  quantity: Type.Number({ default: 0, minimum: 0 }),
  weight: Type.Number({ default: 0, minimum: 0 }),
});

export const salesManufactureBodyDTO = Type.Object({
  ...Type.Pick(manufactureItemDTO, ['operationUnitId', 'status', 'outputTotalWeight']).properties,
  input: productItemBodyDTO,
  output: Type.Array(productItemBodyDTO),
});

export const createSalesManufactureBodyDTO = Type.Object(
  {
    ...salesManufactureBodyDTO.properties,
  },
  { additionalProperties: false },
);

export const createSalesManufactureResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSalesManufactureByIdResponseItemDTO,
});

export const updateSalesManufactureParamsDTO = Type.Object({
  manufactureId: Type.String(),
});

export const updateSalesManufactureBodyDTO = Type.Object(
  {
    ...salesManufactureBodyDTO.properties,
  },
  { additionalProperties: false },
);

export const updateSalesManufactureResponseDTO = Type.Object({
  code: Type.Number(),
  data: getSalesManufactureByIdResponseItemDTO,
});

export type GetSalesManufacturesQuery = Static<typeof getSalesManufacturesQueryDTO>;

export type GetSalesManufactureByIdResponseItem = Static<
  typeof getSalesManufactureByIdResponseItemDTO
>;

export type GetSalesManufacturesResponse = Static<typeof getSalesManufacturesResponseDTO>;

export type GetSalesManufactureByIdParams = Static<typeof getSalesManufactureByIdParamsDTO>;

export type GetSalesManufactureByIdItemResponse = Static<
  typeof getSalesManufactureByIdResponseItemDTO
>;

export type GetSalesManufactureByIdResponse = Static<typeof getSalesManufactureByIdResponseDTO>;

export type CreateSalesManufactureBody = Static<typeof createSalesManufactureBodyDTO>;

export type CreateSalesManufactureResponse = Static<typeof createSalesManufactureResponseDTO>;

export type UpdateSalesManufactureParams = Static<typeof updateSalesManufactureParamsDTO>;

export type UpdateSalesManufactureBody = Static<typeof updateSalesManufactureBodyDTO>;

export type UpdateSalesManufactureResponse = Static<typeof updateSalesManufactureResponseDTO>;

export type SalesManufactureProductCategoryBody = Static<typeof productItemBodyDTO>;

export type ProductCategoryInManufacture = Static<typeof productCategoryInManufactureDTO>;
