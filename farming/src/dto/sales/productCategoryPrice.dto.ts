import { Static, Type } from '@sinclair/typebox';
import { paginationDTO } from '../common.dto';

export const locationItemDTO = Type.Object({
  id: Type.Number(),
  name: Type.String(),
});

export const productCategoryDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  price: Type.Number(),
});

export const productCategoryPriceItemDTO = Type.Object({
  id: Type.String(),
  provinceId: Type.Number(),
  cityId: Type.Number(),
  province: locationItemDTO,
  city: locationItemDTO,
  products: Type.Array(productCategoryDTO),
  createdDate: Type.Optional(Type.String()),
  createdBy: Type.Optional(Type.String()),
  modifiedDate: Type.Optional(Type.String()),
  modifiedBy: Type.Optional(Type.String()),
});

export const getProductCategoryPricesQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  ...Type.Partial(Type.Pick(productCategoryPriceItemDTO, ['provinceId', 'cityId'])).properties,
});

export const getProductCategoryPriceByIdResponseItemDTO = Type.Object({
  ...Type.Pick(productCategoryPriceItemDTO, [
    'province',
    'city',
    'products',
    'createdDate',
    'createdBy',
    'modifiedDate',
    'modifiedBy',
  ]).properties,
});

export const getProductCategoryPricesResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getProductCategoryPriceByIdResponseItemDTO),
});

export const getProductCategoryPriceByIdParamsDTO = Type.Object({
  cityId: Type.Number(),
});

export const getProductCategoryPriceByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: getProductCategoryPriceByIdResponseItemDTO,
});

export const productCategoryBodyDTO = Type.Object({
  productCategoryId: Type.String(),
  price: Type.Number(),
});

export const salesProductCategoryPricesBodyDTO = Type.Object({
  ...Type.Pick(productCategoryPriceItemDTO, ['provinceId', 'cityId']).properties,
  products: Type.Array(productCategoryBodyDTO),
});

export const createProductCategoryPriceBodyDTO = Type.Object(
  {
    ...salesProductCategoryPricesBodyDTO.properties,
  },
  { additionalProperties: false },
);

export const createProductCategoryPriceResponseDTO = Type.Object({
  code: Type.Number(),
  data: getProductCategoryPriceByIdResponseItemDTO,
});

export const updateProductCategoryPriceParamsDTO = Type.Object({
  cityId: Type.Number(),
});

export const updateProductCategoryPriceBodyDTO = Type.Object(
  {
    ...salesProductCategoryPricesBodyDTO.properties,
  },
  { additionalProperties: false },
);

export const updateProductCategoryPriceResponseDTO = Type.Object({
  code: Type.Number(),
  data: getProductCategoryPriceByIdResponseItemDTO,
});

export type GetProductCategoryPricesQuery = Static<typeof getProductCategoryPricesQueryDTO>;

export type GetProductCategoryPriceByIdResponseItem = Static<
  typeof getProductCategoryPriceByIdResponseItemDTO
>;

export type GetProductCategoryPricesResponse = Static<typeof getProductCategoryPricesResponseDTO>;

export type GetProductCategoryPriceByIdParams = Static<typeof getProductCategoryPriceByIdParamsDTO>;

export type GetProductCategoryPriceByIdResponse = Static<
  typeof getProductCategoryPriceByIdResponseDTO
>;

export type SalesProductCategoryPricesBody = Static<typeof salesProductCategoryPricesBodyDTO>;

export type CreateProductCategoryPriceBody = Static<typeof createProductCategoryPriceBodyDTO>;

export type CreateProductCategoryPriceResponse = Static<
  typeof createProductCategoryPriceResponseDTO
>;

export type UpdateProductCategoryPriceParams = Static<typeof updateProductCategoryPriceParamsDTO>;

export type UpdateProductCategoryPriceBody = Static<typeof updateProductCategoryPriceBodyDTO>;

export type UpdateProductCategoryPriceResponse = Static<
  typeof updateProductCategoryPriceResponseDTO
>;
