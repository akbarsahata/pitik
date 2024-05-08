import { Static, Type } from '@sinclair/typebox';
import { Product } from '../datasources/entity/elasticsearch/Product.entity';
import { paginationDTO } from './common.dto';

export const internalUpsertProductItemDTO = Type.Object({
  id: Type.Integer(),
  categoryCode: Type.KeyOf(
    Type.Object({
      PAKAN: Type.String(),
      DOC: Type.String(),
      OVK: Type.String(),
    }),
  ),
  categoryName: Type.String(),
  subcategoryCode: Type.Optional(Type.String()),
  subcategoryName: Type.Optional(Type.String()),
  productCode: Type.String(),
  productName: Type.String(),
  isActive: Type.Boolean(),
  uom: Type.String(),
  purchaseMultiply: Type.Number(),
  purchaseUom: Type.String(),
  order: Type.Optional(Type.Integer({ default: -1 })),
});

export const internalUpsertProductBodyDTO = Type.Object({
  ...internalUpsertProductItemDTO.properties,
});

export const internalUpsertProductResponseDTO = Type.Object({
  code: Type.Number(),
});

export const searchProductQueryDTO = Type.Object({
  productName: Type.Optional(Type.String()),
  categoryName: Type.Optional(Type.String()),
  subcategoryName: Type.Optional(Type.String()),
  groupBy: Type.Optional(
    Type.KeyOf(
      Type.Object({
        categoryName: Type.String(),
        subcategoryName: Type.String(),
      }),
    ),
  ),
  ...Type.Partial(paginationDTO).properties,
});

export const searchProductResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(internalUpsertProductItemDTO),
});

export type InternalUpsertProductItem = Static<typeof internalUpsertProductItemDTO>;

export type InternalUpsertProductBody = Static<typeof internalUpsertProductBodyDTO>;

export type InternalUpsertProductResponse = Static<typeof internalUpsertProductResponseDTO>;

export type SearchProductQuery = Static<typeof searchProductQueryDTO>;

export type SearchProductResponse = Static<typeof searchProductResponseDTO>;

export function mapProductResponse(input: Product): InternalUpsertProductItem {
  return {
    id: parseInt(input.id, 10),
    categoryCode: input.categoryCode,
    categoryName: input.categoryName,
    subcategoryCode: input.subcategoryCode,
    subcategoryName: input.subcategoryName,
    productCode: input.productCode,
    productName: input.productName,
    isActive: input.isActive,
    uom: input.uom,
    purchaseMultiply: input.purchaseMultiply,
    purchaseUom: input.purchaseUom,
    order: input.order,
  };
}

export function mapProductPayload(input: InternalUpsertProductItem): Product {
  const PAKAN_ORDER: { [key: string]: number } = {
    PRESTARTER: 0,
    STARTER: 1,
    FINISHER: 2,
  };

  let order = -1;

  if (input.categoryCode === 'PAKAN' && input.subcategoryCode) {
    order = PAKAN_ORDER[input.subcategoryCode];
  }

  return {
    id: `${input.id}`,
    categoryCode: input.categoryCode,
    categoryName: input.categoryName,
    subcategoryCode: input.subcategoryCode || '',
    subcategoryName: input.subcategoryName || '',
    productCode: input.productCode || '',
    productName: input.productName,
    isActive: input.isActive === undefined ? true : input.isActive,
    uom: input.uom,
    purchaseMultiply: input.purchaseMultiply,
    purchaseUom: input.purchaseUom,
    order,
  };
}
