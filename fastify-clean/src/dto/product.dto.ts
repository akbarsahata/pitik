import { Static, Type } from '@sinclair/typebox';
import { Product } from '../datasources/entity/elasticsearch/Product.entity';
import { paginationDTO } from './common.dto';

export const internalUpsertProductItemDTO = Type.Object({
  id: Type.Number(),
  categoryCode: Type.KeyOf(
    Type.Object({
      PAKAN: Type.String(),
      DOC: Type.String(),
      OVK: Type.String(),
    }),
  ),
  categoryName: Type.String(),
  subcategoryCode: Type.String(),
  subcategoryName: Type.String(),
  productCode: Type.String(),
  productName: Type.String(),
  isActive: Type.Boolean(),
  uom: Type.String(),
  purchaseMultiply: Type.Number(),
  purchaseUom: Type.String(),
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
  ...Type.Partial(paginationDTO).properties,
});

export const searchProductResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(Type.Partial(internalUpsertProductItemDTO)),
});

export type InternalUpsertProductItem = Static<typeof internalUpsertProductItemDTO>;

export type InternalUpsertProductBody = Static<typeof internalUpsertProductBodyDTO>;

export type InternalUpsertProductResponse = Static<typeof internalUpsertProductResponseDTO>;

export type SearchProductQuery = Static<typeof searchProductQueryDTO>;

export type SearchProductResponse = Static<typeof searchProductResponseDTO>;

export function mapProductResponse(
  input: Product | Partial<Product>,
): InternalUpsertProductItem | Partial<InternalUpsertProductItem> {
  return {
    id: input.id ? parseInt(input.id, 10) : undefined,
    categoryCode: input.categoryCode,
    categoryName: input.categoryName,
    subcategoryCode: input.subcategoryCode,
    subcategoryName: input.subcategoryName,
    productCode: input.productCode,
    productName: input.productName,
    isActive: input.isActive,
    uom: input.uom,
    purchaseMultiply: input.purchaseMultiply,
    purchaseUom: input.purchaseUOM,
  };
}

export function mapProductPayload(
  input: InternalUpsertProductItem | Partial<InternalUpsertProductItem>,
): Product | Partial<Product> {
  return {
    id: input.id ? `${input.id}` : undefined,
    categoryCode: input.categoryCode,
    categoryName: input.categoryName,
    subcategoryCode: input.subcategoryCode || '',
    subcategoryName: input.subcategoryName,
    productCode: input.productCode || '',
    productName: input.productName,
    isActive: input.isActive === undefined ? true : input.isActive,
    uom: input.uom,
    purchaseMultiply: input.purchaseMultiply,
    purchaseUOM: input.purchaseUom,
  };
}
