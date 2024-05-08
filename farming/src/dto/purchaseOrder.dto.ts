import { Static, Type } from '@sinclair/typebox';
import { Nullable } from '../libs/utils/typebox';

export const purchaseOrderFulfilledBodyDTO = Type.Object({
  purchaseOrderCode: Type.String(),
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

export const upsertPurchaseOrderBodyDTO = Type.Object(
  {
    purchaseRequestCode: Type.String(),
    purchaseOrderCode: Type.String(),
    status: Type.Optional(
      Type.KeyOf(
        Type.Object({
          draft: Type.String(),
          approved: Type.String(),
          rejected: Type.String(),
        }),
      ),
    ),
    isApproved: Type.Optional(Type.Boolean()),
    isDoc: Type.Boolean(),
    datePlanned: Type.String({ format: 'date' }),
    notes: Type.Optional(Type.String()),
    details: Type.Array(purchaseOrderProductItemDTO),
    isReverted: Type.Optional(Type.Boolean({ default: false })),
    purchaseOrderIdReference: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

export const createPurchaseOrderResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    id: Type.String(),
  }),
});

export const getFeedHistoryParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const feedHistoryItemDTO = Type.Object({
  date: Type.String(),
  productCode: Type.String(),
  productName: Type.String(),
  subcategoryName: Type.String(),
  subcategoryCode: Type.String(),
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
  productCode: Type.String(),
  productName: Type.String(),
  subcategoryName: Type.String(),
  subcategoryCode: Type.String(),
  quantity: Type.Number(),
});

export const getOvkHistoryResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(ovkHistoryItemDTO),
});

export const getPurchaseOrderQueryDTO = Type.Object({
  farmingCycleId: Type.Optional(Type.String()),
  coopId: Type.Optional(Type.String()),
  isBeforeDoc: Type.Optional(Type.Boolean({ default: false })),
  type: Type.Optional(
    Type.KeyOf(
      Type.Object({
        doc: Type.String(),
        ovk: Type.String(),
        pakan: Type.String(),
      }),
    ),
  ),
  fromDate: Type.Optional(Type.String({ format: 'date' })),
  untilDate: Type.Optional(Type.String({ format: 'date' })),
  status: Type.Optional(
    Type.RegEx(/^(draft|approved|rejected)(,(draft|approved|rejected))*$/, {
      examples: ['approved', 'draft,rejected', 'draft,approved,rejected'],
    }),
  ),
  isFulfilled: Type.Optional(Type.Boolean()),
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
  purchaseRequestErpCode: Type.String(),
  deliveryDate: Type.String({ format: 'date' }),
  arrivalDate: Type.String({ format: 'date' }),
  isFulfilled: Type.Boolean({ default: false }),
  type: Type.String(),
  status: Type.Integer(),
  statusText: Type.String(),
  description: Type.String(),
  notes: Type.Optional(Type.String()),
  details: getPurchaseOrderProductListDTO,
  isTransferRequest: Type.Boolean({ default: false }),
});

export const getPurchaseOrderListDTO = Type.Array(getPurchaseOrderItemDTO);

export const getPurchaseOrderResponseDTO = Type.Object({
  code: Type.Integer(),
  data: getPurchaseOrderListDTO,
  count: Type.Integer(),
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
  isReturned: Type.Boolean(),
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

export const purchaseOrderWithMergedLogisticInfo = Type.Object({
  mergedLogistic: Type.Optional(Type.Boolean()),
  mergedLogisticCoopName: Nullable(Type.String()),
  mergedLogisticFarmingCycleDays: Nullable(Type.Number()),
});

export const getPurchaseOrderDetailItemDTO = Type.Object({
  ...getPurchaseOrderItemDTO.properties,
  goodsReceipts: goodsReceiptListDTO,
  ...Type.Partial(purchaseOrderWithMergedLogisticInfo).properties,
});

export const getPurchaseOrderDetailResponseDTO = Type.Object({
  code: Type.Integer(),
  data: getPurchaseOrderDetailItemDTO,
});

export const getPurchaseOrderDetailParamsDTO = Type.Object({
  purchaseOrderId: Type.String(),
});

export const updatePurchaseOrderProductParamsDTO = Type.Object({
  purchaseOrderId: Type.String(),
});

export const updatePurchaseOrderProductBodyDTO = Type.Object({
  details: Type.Array(
    Type.Object({
      id: Type.String(),
      purchaseOrderId: Type.String(),
      isReturned: Type.Boolean(),
      ...purchaseOrderProductItemDTO.properties,
    }),
  ),
});

export const updatePurchaseOrderProductResponseItemDTO = Type.Object({
  ...updatePurchaseOrderProductBodyDTO.properties,
});

export type PurchaseOrderFulfilledBody = Static<typeof purchaseOrderFulfilledBodyDTO>;

export type PurchaseOrderFulfilledResponse = Static<typeof purchaseOrderFulfilledResponseDTO>;

export type PurchaseOrderProductItem = Static<typeof purchaseOrderProductItemDTO>;

export type UpsertPurchaseOrderBody = Static<typeof upsertPurchaseOrderBodyDTO>;

export type CreatePurchaseOrderResponse = Static<typeof createPurchaseOrderResponseDTO>;

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

export type UpdatePurchaseOrderProductParams = Static<typeof updatePurchaseOrderProductParamsDTO>;

export type UpdatePurchaseOrderProductBody = Static<typeof updatePurchaseOrderProductBodyDTO>;

export type UpdatePurchaseOrderProductResponseItem = Static<
  typeof updatePurchaseOrderProductResponseItemDTO
>;
