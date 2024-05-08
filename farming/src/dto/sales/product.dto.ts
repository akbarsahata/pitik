import { Static, Type } from '@sinclair/typebox';
import { Nullable } from '../../libs/utils/typebox';

export const productCategoryDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export const productItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  uom: Nullable(Type.String()),
  value: Nullable(Type.Number()),
  minValue: Nullable(Type.Number()),
  maxValue: Nullable(Type.Number()),
  categoryId: Type.String(),
  category: productCategoryDTO,
});

export const getProductsQueryDTO = Type.Pick(Type.Partial(productItemDTO), ['categoryId']);

export const getProductsResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(productItemDTO),
});

export type GetProductsQuery = Static<typeof getProductsQueryDTO>;

export type ProductItem = Static<typeof productItemDTO>;

export type GetProductsResponse = Static<typeof getProductsResponseDTO>;
