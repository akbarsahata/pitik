import { Static, Type } from '@sinclair/typebox';
import { Nullable } from '../../libs/utils/typebox';

export const productCategoryDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  ratio: Type.Number(),
  code: Type.String(),
  quantityUOM: Nullable(Type.String()),
  weightUOM: Nullable(Type.String()),
  isManufacturable: Type.Boolean(),
});

export const getProductCategoriesResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(productCategoryDTO),
});

export const getSalesManufactureOutputParamsDTO = Type.Object({
  productCategoryId: Type.String(),
});

export const getSalesManufactureOutputResponseItemDTO = Type.Object({
  input: Type.Pick(productCategoryDTO, ['name', 'id']),
  output: Type.Array(Type.Pick(productCategoryDTO, ['name', 'id'])),
});

export const getSalesManufactureOutputResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(getSalesManufactureOutputResponseItemDTO),
});

export const getProductCategoriesQueryDTO = Type.Object({
  isManufacturable: Type.Optional(Type.Boolean()),
});

export type ProductCategory = Static<typeof productCategoryDTO>;

export type GetProductCategiriesResponse = Static<typeof getProductCategoriesResponseDTO>;

export type GetSalesManufactureOutputParams = Static<typeof getSalesManufactureOutputParamsDTO>;

export type GetSalesManufactureOutputResponseItem = Static<
  typeof getSalesManufactureOutputResponseItemDTO
>;

export type GetSalesManufactureOutputResponse = Static<typeof getSalesManufactureOutputResponseDTO>;

export type GetProductCategoriesQuery = Static<typeof getProductCategoriesQueryDTO>;
