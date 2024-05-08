import { Static, Type } from '@sinclair/typebox';

export const orderIssueCategoryItemDTO = Type.Object({
  id: Type.String(),
  title: Type.String(),
});

export const getOrderIssueCategoriesResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(orderIssueCategoryItemDTO),
});

export type OrderIssueCategoryItem = Static<typeof orderIssueCategoryItemDTO>;

export type GetOrderIssueCategoriesResponse = Static<typeof getOrderIssueCategoriesResponseDTO>;
