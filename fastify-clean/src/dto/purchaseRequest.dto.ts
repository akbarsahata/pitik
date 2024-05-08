import { Static, Type } from '@sinclair/typebox';

export const purchaseRequestProductItemBodyDTO = Type.Object({
  categoryCode: Type.String({ minLength: 1 }),
  categoryName: Type.String({ minLength: 1 }),
  subcategoryCode: Type.String(),
  subcategoryName: Type.String(),
  productCode: Type.String(),
  productName: Type.String(),
  quantity: Type.Integer({ minimum: 0 }),
  uom: Type.String(),
});

export const purchaseRequestProductItemResponseDTO = Type.Object({
  ...purchaseRequestProductItemBodyDTO.properties,
  id: Type.String(),
});

export const purchaseRequestProductListBodyDTO = Type.Array(purchaseRequestProductItemBodyDTO);

export const purchaseRequestProductListResponseDTO = Type.Array(
  purchaseRequestProductItemResponseDTO,
);

export const createPurchaseRequestBodyDTO = Type.Object({
  type: Type.KeyOf(
    Type.Object({
      ovk: Type.String(),
      pakan: Type.String(),
      doc: Type.String(),
    }),
  ),
  farmingCycleId: Type.String(),
  requestSchedule: Type.String({ format: 'date' }),
  details: purchaseRequestProductListBodyDTO,
  notes: Type.Optional(Type.String()),
});

export const updatePurchaseRequestBodyDTO = Type.Object({
  type: Type.KeyOf(
    Type.Object({
      ovk: Type.String(),
      pakan: Type.String(),
      doc: Type.String(),
    }),
  ),
  farmingCycleId: Type.String(),
  requestSchedule: Type.String({ format: 'date' }),
  details: purchaseRequestProductListBodyDTO,
  notes: Type.Optional(Type.String()),
});

export const createPurchaseRequestOvkBodyDTO = Type.Object({
  coopId: Type.String(),
  requestSchedule: Type.String({ format: 'date' }),
  details: purchaseRequestProductListBodyDTO,
});

export const createPurchaseRequestResponseItemDTO = Type.Object({
  ...createPurchaseRequestBodyDTO.properties,
  id: Type.String(),
  details: purchaseRequestProductListResponseDTO,
});

export const createPurchaseRequestResponseDTO = Type.Object({
  data: createPurchaseRequestResponseItemDTO,
});

export const updatePurchaseRequestResponseItemDTO = Type.Object({
  ...createPurchaseRequestBodyDTO.properties,
  id: Type.String(),
  details: purchaseRequestProductListResponseDTO,
});

export const updatePurchaseRequestResponseDTO = Type.Object({
  code: Type.Integer(),
  data: updatePurchaseRequestResponseItemDTO,
});

export const getListPurchaseRequestQueryDTO = Type.Object({
  farmingCycleId: Type.String(),
  type: Type.Optional(
    Type.KeyOf(
      Type.Object({
        ovk: Type.String(),
        pakan: Type.String(),
        doc: Type.String(),
      }),
    ),
  ),
});

export const getListPurchaseRequestProductItemDTO = Type.Object({
  id: Type.String(),
  categoryCode: Type.String(),
  categoryName: Type.String(),
  subcategoryCode: Type.String(),
  subcategoryName: Type.String(),
  productCode: Type.String(),
  productName: Type.String(),
  quantity: Type.Integer({ minimum: 0 }),
  uom: Type.String(),
});

export const getListPurchaseRequestProductListDTO = Type.Array(
  getListPurchaseRequestProductItemDTO,
);

export const getListPurchaseRequestResponseItemDTO = Type.Object({
  id: Type.String(),
  type: Type.KeyOf(
    Type.Object({
      ovk: Type.String(),
      pakan: Type.String(),
      doc: Type.String(),
    }),
  ),
  deliveryDate: Type.String({ format: 'date' }),
  status: Type.Integer(),
  statusText: Type.String(),
  notes: Type.Optional(Type.String()),
  details: getListPurchaseRequestProductListDTO,
});

export const getlistPurchaseRequestResponseDTO = Type.Object({
  data: Type.Array(getListPurchaseRequestResponseItemDTO),
});

export const getDetailPurchaseRequestResponseDTO = Type.Object({
  data: getListPurchaseRequestResponseItemDTO,
});

export const getDetailPurchaseRequestParamsDTO = Type.Object({
  purchaseRequestId: Type.String(),
});

export const approvePurchaseRequestBodyDTO = Type.Object({
  remarks: Type.Optional(Type.String()),
});

export const rejectPurchaseRequestBodyDTO = Type.Object({
  remarks: Type.String(),
});

export const approveRejectPurchaseRequestParamsDTO = Type.Object({
  purchaseRequestId: Type.String(),
});

export const approveRejectPurchaseRequestResponseItemDTO = Type.Object({
  id: Type.String(),
  isApproved: Type.Boolean(),
  remarks: Type.String(),
  approvedBy: Type.String(),
});

export const approveRejectPurchaseRequestResponseDTO = Type.Object({
  data: approveRejectPurchaseRequestResponseItemDTO,
});

export type PurchaseRequestProductItemBody = Static<typeof purchaseRequestProductItemBodyDTO>;

export type PurchaseRequestProductItemResponse = Static<
  typeof purchaseRequestProductItemResponseDTO
>;

export type PurchaseRequestProductListBody = Static<typeof purchaseRequestProductListBodyDTO>;

export type PurchaseRequestProductListResponse = Static<
  typeof purchaseRequestProductListResponseDTO
>;

export type CreatePurchaseRequestResponseItem = Static<typeof createPurchaseRequestResponseItemDTO>;

export type UpdatePurchaseRequestResponseItem = Static<typeof updatePurchaseRequestResponseItemDTO>;

export type CreatePurchaseRequestBody = Static<typeof createPurchaseRequestBodyDTO>;

export type UpdatePurchaseRequestBody = Static<typeof updatePurchaseRequestBodyDTO>;

export type CreatePurchaseRequestOvkBody = Static<typeof createPurchaseRequestOvkBodyDTO>;

export type CreatePurchaseRequestResponse = Static<typeof createPurchaseRequestResponseDTO>;

export type GetListPurchaseRequestQuery = Static<typeof getListPurchaseRequestQueryDTO>;

export type GetListPurchaseRequestProductItem = Static<typeof getListPurchaseRequestProductItemDTO>;

export type GetListPurchaseRequestProductList = Static<typeof getListPurchaseRequestProductListDTO>;

export type GetListPurchaseRequestResponseItem = Static<
  typeof getListPurchaseRequestResponseItemDTO
>;

export type GetlistPurchaseRequestResponse = Static<typeof getlistPurchaseRequestResponseDTO>;

export type GetDetailPurchaseRequestResponse = Static<typeof getDetailPurchaseRequestResponseDTO>;

export type GetDetailPurchaseRequestParams = Static<typeof getDetailPurchaseRequestParamsDTO>;

export type ApprovePurchaseRequestBody = Static<typeof approvePurchaseRequestBodyDTO>;

export type RejectPurchaseRequestBody = Static<typeof rejectPurchaseRequestBodyDTO>;

export type ApproveRejectPurchaseRequestParams = Static<
  typeof approveRejectPurchaseRequestParamsDTO
>;

export type ApproveRejectPurchaseRequestResponseItem = Static<
  typeof approveRejectPurchaseRequestResponseItemDTO
>;

export type ApproveRejectPurchaseRequestResponse = Static<
  typeof approveRejectPurchaseRequestResponseDTO
>;

export type UpdatePurchaseRequestResponseDTO = Static<typeof updatePurchaseRequestResponseDTO>;
