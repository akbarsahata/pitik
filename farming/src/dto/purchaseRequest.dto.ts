import { Static, Type } from '@sinclair/typebox';
import { Nullable } from '../libs/utils/typebox';
import {
  createTransferRequestBodyDTO,
  getTransferRequestDetailResponseItemDTO,
  updateTransferRequestBodyDTO,
} from './transferRequest.dto';

export const purchaseRequestProductItemBodyDTO = Type.Object(
  {
    categoryCode: Type.String({ minLength: 1 }),
    categoryName: Type.String({ minLength: 1 }),
    subcategoryCode: Type.String(),
    subcategoryName: Type.String(),
    productCode: Type.String({ minLength: 1 }),
    productName: Type.String({ minLength: 1 }),
    quantity: Type.Integer({ minimum: 1 }),
    uom: Type.String(),
  },
  { additionalProperties: false },
);

export const purchaseRequestProductItemResponseDTO = Type.Object({
  ...purchaseRequestProductItemBodyDTO.properties,
  id: Type.String(),
});

export const purchaseRequestProductListBodyDTO = Type.Array(purchaseRequestProductItemBodyDTO);

export const purchaseRequestProductListResponseDTO = Type.Array(
  purchaseRequestProductItemResponseDTO,
);

export const createPurchaseRequestBodyDTO = Type.Object(
  {
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
    mergedLogistic: Type.Optional(Type.Boolean({ default: false })),
    mergedCoopId: Type.Optional(Type.String()),
    internalOvkTransferRequest: Type.Optional(
      Nullable(
        Type.Object({
          ...createTransferRequestBodyDTO.properties,
          id: Type.Optional(Nullable(Type.String())),
        }),
      ),
    ),
  },
  { additionalProperties: false },
);

export const updatePurchaseRequestBodyDTO = Type.Object(
  {
    coopId: Type.Optional(Type.String()),
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
    mergedLogistic: Type.Optional(Type.Boolean({ default: false })),
    mergedCoopId: Type.Optional(Type.String()),
    notes: Type.Optional(Type.String()),
    internalOvkTransferRequest: Type.Optional(
      Nullable(
        Type.Object({
          ...updateTransferRequestBodyDTO.properties,
          id: Type.Optional(Nullable(Type.String())),
        }),
      ),
    ),
  },
  { additionalProperties: false },
);

export const createPurchaseRequestOvkBodyDTO = Type.Object({
  coopId: Type.String(),
  requestSchedule: Type.String({ format: 'date' }),
  details: purchaseRequestProductListBodyDTO,
  internalOvkTransferRequest: Type.Optional(
    Nullable(
      Type.Object({
        ...updateTransferRequestBodyDTO.properties,
        id: Type.Optional(Type.String()),
      }),
    ),
  ),
});

export const createPurchaseRequestResponseItemDTO = Type.Object(
  {
    ...createPurchaseRequestBodyDTO.properties,
    id: Type.String(),
    details: purchaseRequestProductListResponseDTO,
    internalOvkTransferRequest: Type.Optional(
      Nullable(
        Type.Object({
          ...createTransferRequestBodyDTO.properties,
          id: Type.String(),
        }),
      ),
    ),
  },
  { additionalProperties: false },
);

export const createPurchaseRequestSapronakBodyDTO = Type.Object(
  {
    type: Type.KeyOf(
      Type.Object({
        ovk: Type.String(),
        pakan: Type.String(),
      }),
    ),
    coopId: Type.String(),
    farmingCycleId: Type.Optional(Type.String()),
    requestSchedule: Type.String({ format: 'date' }),
    details: purchaseRequestProductListBodyDTO,
    mergedLogistic: Type.Optional(Type.Boolean({ default: false })),
    mergedCoopId: Type.Optional(Type.String()),
    internalOvkTransferRequest: Type.Optional(
      Nullable(
        Type.Object({
          ...updateTransferRequestBodyDTO.properties,
          id: Type.Optional(Type.String()),
        }),
      ),
    ),
  },
  { additionalProperties: false },
);

export const createPurchaseRequestResponseDTO = Type.Object({
  code: Type.Integer(),
  data: createPurchaseRequestResponseItemDTO,
});

export const updatePurchaseRequestResponseItemDTO = Type.Object(
  {
    ...updatePurchaseRequestBodyDTO.properties,
    id: Type.String(),
    details: purchaseRequestProductListResponseDTO,
  },
  { additionalProperties: false },
);

export const updatePurchaseRequestResponseDTO = Type.Object({
  code: Type.Integer(),
  data: updatePurchaseRequestResponseItemDTO,
});

export const getListPurchaseRequestQueryDTO = Type.Object(
  {
    farmingCycleId: Type.Optional(Type.String()),
    coopId: Type.Optional(Type.String()),
    type: Type.Optional(
      Type.KeyOf(
        Type.Object({
          ovk: Type.String(),
          pakan: Type.String(),
          doc: Type.String(),
        }),
      ),
    ),
    isBeforeDoc: Type.Optional(Type.Boolean({ default: false })),
    fromDate: Type.Optional(Type.String({ format: 'date' })),
    untilDate: Type.Optional(Type.String({ format: 'date' })),
  },
  { additionalProperties: false },
);

export const getListPurchaseRequestProductItemDTO = Type.Object(
  {
    id: Type.String(),
    categoryCode: Type.String(),
    categoryName: Type.String(),
    subcategoryCode: Type.String(),
    subcategoryName: Type.String(),
    productCode: Type.String(),
    productName: Type.String(),
    quantity: Type.Integer({ minimum: 0 }),
    uom: Type.String(),
    purchaseUom: Type.String(),
  },
  { additionalProperties: false },
);

export const getListPurchaseRequestProductListDTO = Type.Array(
  getListPurchaseRequestProductItemDTO,
);

export const purchaseRequestWithMergedLogisticInfo = Type.Object({
  mergedLogistic: Type.Optional(Type.Boolean()),
  mergedLogisticCoopName: Nullable(Type.String()),
  mergedLogisticFarmingCycleDays: Nullable(Type.Number()),
});

export const getListPurchaseRequestResponseItemDTO = Type.Object({
  id: Type.String(),
  erpCode: Type.String(),
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
  description: Type.String(),
  internalOvkTransferRequestId: Type.Optional(Nullable(Type.String())),
  ...Type.Partial(purchaseRequestWithMergedLogisticInfo).properties,
});

export const getlistPurchaseRequestResponseDTO = Type.Object({
  code: Type.Integer(),
  data: Type.Array(getListPurchaseRequestResponseItemDTO),
  count: Type.Integer(),
});

export const getDetailPurchaseRequestResponseItemDTO = Type.Object({
  ...getListPurchaseRequestResponseItemDTO.properties,
  internalOvkTransferRequest: Type.Optional(
    Nullable(
      Type.Object({
        ...getTransferRequestDetailResponseItemDTO.properties,
      }),
    ),
  ),
});

export const getDetailPurchaseRequestResponseDTO = Type.Object({
  code: Type.Integer(),
  data: getDetailPurchaseRequestResponseItemDTO,
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

export type CreatePurchaseRequestSapronakBody = Static<typeof createPurchaseRequestSapronakBodyDTO>;

export type CreatePurchaseRequestResponse = Static<typeof createPurchaseRequestResponseDTO>;

export type GetListPurchaseRequestQuery = Static<typeof getListPurchaseRequestQueryDTO>;

export type GetListPurchaseRequestProductItem = Static<typeof getListPurchaseRequestProductItemDTO>;

export type GetListPurchaseRequestProductList = Static<typeof getListPurchaseRequestProductListDTO>;

export type GetListPurchaseRequestResponseItem = Static<
  typeof getListPurchaseRequestResponseItemDTO
>;

export type GetlistPurchaseRequestResponse = Static<typeof getlistPurchaseRequestResponseDTO>;

export type GetDetailPurchaseRequestResponseItem = Static<
  typeof getDetailPurchaseRequestResponseItemDTO
>;

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
