import { Static, Type } from '@sinclair/typebox';

export const createGoodsReceiptPhotoItemDTO = Type.Object({
  url: Type.String({ format: 'uri' }),
});

export const createGoodsReceiptPhotoListDTO = Type.Array(createGoodsReceiptPhotoItemDTO);

export const createGoodsReceiptPhotoItemResponseDTO = Type.Object({
  id: Type.String(),
  url: Type.String({ format: 'uri' }),
});

export const createGoodsReceiptPhotoListResponseDTO = Type.Array(
  createGoodsReceiptPhotoItemResponseDTO,
);

export const createGoodsReceiptDetailItemDTO = Type.Object({
  categoryCode: Type.String(),
  categoryName: Type.String(),
  subcategoryCode: Type.String(),
  subcategoryName: Type.String(),
  productCode: Type.String(),
  productName: Type.String(),
  quantity: Type.Number({ minimum: 0 }),
  uom: Type.String(),
  poProductId: Type.Optional(Type.String()),
});

export const createGoodsReceiptDetailListDTO = Type.Array(createGoodsReceiptDetailItemDTO);

export const createGoodReceiptDetailItemResponseDTO = Type.Object({
  id: Type.String(),
  ...createGoodsReceiptDetailItemDTO.properties,
});

export const createGoodReceiptDetailListResponseDTO = Type.Array(
  createGoodReceiptDetailItemResponseDTO,
);

export const createGoodsReceiptPurchaseOrderBodyDTO = Type.Object({
  purchaseOrderId: Type.String(),
  receivedDate: Type.String({ format: 'date' }),
  remarks: Type.String(),
  notes: Type.Optional(Type.String()),
  details: createGoodsReceiptDetailListDTO,
  photos: createGoodsReceiptPhotoListDTO,
});

export const createGoodsReceiptTransferRequestBodyDTO = Type.Object({
  transferRequestId: Type.String(),
  receivedDate: Type.String({ format: 'date' }),
  remarks: Type.String(),
  notes: Type.Optional(Type.String()),
  details: createGoodsReceiptDetailListDTO,
  photos: createGoodsReceiptPhotoListDTO,
});

export const createGoodsReceiptPurchaseOrderResponseItemDTO = Type.Object({
  id: Type.String(),
  ...createGoodsReceiptPurchaseOrderBodyDTO.properties,
  details: createGoodReceiptDetailListResponseDTO,
  photos: createGoodsReceiptPhotoListResponseDTO,
});

export const createGoodsReceiptPurchaseOrderResponseDTO = Type.Object({
  code: Type.Integer(),
  data: createGoodsReceiptPurchaseOrderResponseItemDTO,
});

export const createGoodsReceiptTransferRequestResponseItemDTO = Type.Object({
  id: Type.String(),
  ...createGoodsReceiptTransferRequestBodyDTO.properties,
  details: createGoodReceiptDetailListResponseDTO,
  photos: createGoodsReceiptPhotoListResponseDTO,
});

export const createGoodsReceiptTransferRequestResponseDTO = Type.Object({
  code: Type.Integer(),
  data: createGoodsReceiptTransferRequestResponseItemDTO,
});

const categoryCodeEnum = Type.KeyOf(
  Type.Object({
    OVK: Type.String(),
    PAKAN: Type.String(),
  }),
);

export const getProductNameParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
  categoryCode: categoryCodeEnum,
});

export const productNameItemDTO = Type.Object({
  name: Type.String(),
});

export const getProductNameResponseDTO = Type.Object({
  code: Type.Integer(),
  data: Type.Array(productNameItemDTO),
});

export type CreateGoodsReceiptPhotoItem = Static<typeof createGoodsReceiptPhotoItemDTO>;

export type CreateGoodsReceiptPhotoList = Static<typeof createGoodsReceiptPhotoListDTO>;

export type CreateGoodsReceiptPhotoItemResponse = Static<
  typeof createGoodsReceiptPhotoItemResponseDTO
>;

export type CreateGoodsReceiptPhotoListResponse = Static<
  typeof createGoodsReceiptPhotoListResponseDTO
>;

export type CreateGoodsReceiptDetailItem = Static<typeof createGoodsReceiptDetailItemDTO>;

export type CreateGoodsReceiptDetailList = Static<typeof createGoodsReceiptDetailListDTO>;

export type CreateGoodReceiptDetailItemResponse = Static<
  typeof createGoodReceiptDetailItemResponseDTO
>;

export type CreateGoodReceiptDetailListResponse = Static<
  typeof createGoodReceiptDetailListResponseDTO
>;

export type CreateGoodsReceiptPurchaseOrderBody = Static<
  typeof createGoodsReceiptPurchaseOrderBodyDTO
>;

export type CreateGoodsReceiptTransferRequestBody = Static<
  typeof createGoodsReceiptTransferRequestBodyDTO
>;

export type CreateGoodsReceiptPurchaseOrderResponseItem = Static<
  typeof createGoodsReceiptPurchaseOrderResponseItemDTO
>;

export type CreateGoodsReceiptPurchaseOrderResponse = Static<
  typeof createGoodsReceiptPurchaseOrderResponseDTO
>;

export type CreateGoodsReceiptTransferRequestResponseItem = Static<
  typeof createGoodsReceiptTransferRequestResponseItemDTO
>;

export type CreateGoodsReceiptTransferRequestResponse = Static<
  typeof createGoodsReceiptTransferRequestResponseDTO
>;

export type CategoryCodeEnum = Static<typeof categoryCodeEnum>;

export type GetProductNameParams = Static<typeof getProductNameParamsDTO>;

export type GetProductNameResponse = Static<typeof getProductNameResponseDTO>;

export type ProductNameItem = Static<typeof productNameItemDTO>;
