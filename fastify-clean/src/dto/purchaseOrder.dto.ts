import { Static, Type } from '@sinclair/typebox';

export const purchaseOrderFulfilledBodyDTO = Type.Object({
  purchaseOrderCode: Type.String(),
  goodsReceiptCode: Type.String(),
});

export const purchaseOrderFulfilledResponseDTO = Type.Object({
  code: Type.Number(),
});

export const purchaseOrderProductItemDTO = Type.Object({
  categoryCode: Type.String(),
  categoryName: Type.String(),
  subcategoryCode: Type.String(),
  subcategoryName: Type.String(),
  productCode: Type.String(),
  productName: Type.String(),
  quantity: Type.Number(),
  uom: Type.String(),
});

export const purchaseOrderItemDTO = Type.Object({
  purchaseOrderCode: Type.String(),
  isApproved: Type.Boolean(),
  isDoc: Type.Boolean(),
  datePlanned: Type.String(),
  notes: Type.Optional(Type.String()),
  details: Type.Array(purchaseOrderProductItemDTO),
});

export const purchaseOrderBodyDTO = Type.Object({
  ...purchaseOrderItemDTO.properties,
});

export const purchaseOrderResponseDTO = Type.Object({
  code: Type.Number(),
});

export const getFeedHistoryParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const feedHistoryItemDTO = Type.Object({
  date: Type.String(),
  productCode: Type.String(),
  subcategoryName: Type.String(),
  quantity: Type.Number(),
});

export const getFeedHistoryResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(feedHistoryItemDTO),
});

export const getOvkHistoryParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const ovkHistoryItemDTO = Type.Object({
  date: Type.String(),
  productName: Type.String(),
  quantity: Type.Number(),
});

export const getOvkHistoryResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(ovkHistoryItemDTO),
});

export const getPurchaseOrderQueryDTO = Type.Object({
  farmingCycleId: Type.String(),
  type: Type.KeyOf(
    Type.Object({
      doc: Type.String(),
      ovk: Type.String(),
      pakan: Type.String(),
    }),
  ),
});

export const getPurchaseOrderProductItemDTO = Type.Object({
  id: Type.String(),
  categoryCode: Type.String(),
  categoryName: Type.String(),
  subcategoryCode: Type.String(),
  subcategoryName: Type.String(),
  productCode: Type.String(),
  productName: Type.String(),
  quantity: Type.Number({ minimum: 0 }),
  uom: Type.String(),
  remaining: Type.Optional(Type.Number()),
});

export const getPurchaseOrderProductListDTO = Type.Array(getPurchaseOrderProductItemDTO);

export const getPurchaseOrderItemDTO = Type.Object({
  id: Type.String(),
  erpCode: Type.String(),
  deliveryDate: Type.String({ format: 'date' }),
  arrivalDate: Type.String({ format: 'date' }),
  isFulfilled: Type.Boolean({ default: false }),
  status: Type.Integer(),
  statusText: Type.String(),
  description: Type.String(),
  notes: Type.Optional(Type.String()),
  details: getPurchaseOrderProductListDTO,
});

export const getPurchaseOrderListDTO = Type.Array(getPurchaseOrderItemDTO);

export const getPurchaseOrderResponseDTO = Type.Object({
  code: Type.Integer(),
  data: getPurchaseOrderListDTO,
});

export const goodsReceiptPhotoItemDTO = Type.Object({
  id: Type.String(),
  url: Type.String({ format: 'uri' }),
});

export const goodsReceiptPhotoListDTO = Type.Array(goodsReceiptPhotoItemDTO);

export const goodsReceiptDetailItemDTO = Type.Object({
  id: Type.String(),
  categoryCode: Type.String(),
  categoryName: Type.String(),
  subcategoryCode: Type.String(),
  subcategoryName: Type.String(),
  productCode: Type.String(),
  productName: Type.String(),
  quantity: Type.Number(),
  uom: Type.String(),
});

export const goodsReceiptDetailListDTO = Type.Array(goodsReceiptDetailItemDTO);

export const goodsReceiptItemDTO = Type.Object({
  receivedDate: Type.String({ format: 'date' }),
  remarks: Type.String(),
  notes: Type.String(),
  details: goodsReceiptDetailListDTO,
  photos: goodsReceiptPhotoListDTO,
});

export const goodsReceiptListDTO = Type.Array(goodsReceiptItemDTO);

export const getPurchaseOrderDetailItemDTO = Type.Object({
  ...getPurchaseOrderItemDTO.properties,
  goodsReceipts: goodsReceiptListDTO,
});

export const getPurchaseOrderDetailResponseDTO = Type.Object({
  code: Type.Integer(),
  data: getPurchaseOrderDetailItemDTO,
});

export const getPurchaseOrderDetailParamsDTO = Type.Object({
  purchaseOrderId: Type.String(),
});

export type PurchaseOrderFulfilledBody = Static<typeof purchaseOrderFulfilledBodyDTO>;

export type PurchaseOrderFulfilledResponse = Static<typeof purchaseOrderFulfilledResponseDTO>;

export type PurchaseOrderProductItem = Static<typeof purchaseOrderProductItemDTO>;

export type PurchaseOrderItem = Static<typeof purchaseOrderItemDTO>;

export type PurchaseOrderBody = Static<typeof purchaseOrderBodyDTO>;

export type PurchaseOrderResponse = Static<typeof purchaseOrderResponseDTO>;

export type GetFeedHistoryParams = Static<typeof getFeedHistoryParamsDTO>;

export type FeedHistoryItem = Static<typeof feedHistoryItemDTO>;

export type GetFeedHistoryResponse = Static<typeof getFeedHistoryResponseDTO>;

export type GetOvkHistoryParams = Static<typeof getOvkHistoryParamsDTO>;

export type OvkHistoryItem = Static<typeof ovkHistoryItemDTO>;

export type GetOvkHistoryResponse = Static<typeof getOvkHistoryResponseDTO>;

export type GetPurchaseOrderQuery = Static<typeof getPurchaseOrderQueryDTO>;

export type GetPurchaseOrderProductItem = Static<typeof getPurchaseOrderProductItemDTO>;

export type GetPurchaseOrderProductList = Static<typeof getPurchaseOrderProductListDTO>;

export type GetPurchaseOrderItem = Static<typeof getPurchaseOrderItemDTO>;

export type GetPurchaseOrderList = Static<typeof getPurchaseOrderListDTO>;

export type GetPurchaseOrderResponse = Static<typeof getPurchaseOrderResponseDTO>;

export type GoodsReceiptPhotoItem = Static<typeof goodsReceiptPhotoItemDTO>;

export type GoodsReceiptPhotoList = Static<typeof goodsReceiptPhotoListDTO>;

export type GoodsReceiptDetailItem = Static<typeof goodsReceiptDetailItemDTO>;

export type GoodsReceiptDetailList = Static<typeof goodsReceiptDetailListDTO>;

export type GoodsReceiptItem = Static<typeof goodsReceiptItemDTO>;

export type GoodsReceiptList = Static<typeof goodsReceiptListDTO>;

export type GetPurchaseOrderDetailItem = Static<typeof getPurchaseOrderDetailItemDTO>;

export type GetPurchaseOrderDetailResponse = Static<typeof getPurchaseOrderDetailResponseDTO>;

export type GetPurchaseOrderDetailParams = Static<typeof getPurchaseOrderDetailParamsDTO>;
