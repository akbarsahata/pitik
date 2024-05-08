import { Static, Type } from '@sinclair/typebox';
import { Nullable } from '../libs/utils/typebox';
import { goodsReceiptListDTO } from './purchaseOrder.dto';

export const transferRequestProductItemDTO = Type.Object({
  categoryCode: Type.String(),
  categoryName: Type.String(),
  subcategoryCode: Type.String(),
  subcategoryName: Type.String(),
  productCode: Type.String(),
  productName: Type.String(),
  quantity: Type.Number(),
  uom: Type.String(),
});

export const createTransferRequestBodyDTO = Type.Object(
  {
    coopSourceId: Type.Optional(Nullable(Type.String())),
    coopTargetId: Type.Optional(Nullable(Type.String())),
    branchSourceId: Type.Optional(Nullable(Type.String())),
    branchTargetId: Type.Optional(Nullable(Type.String())),
    farmingCycleId: Type.String(),
    datePlanned: Type.String({ format: 'date' }),
    subcategoryCode: Type.String(),
    subcategoryName: Type.String(),
    productName: Nullable(Type.String()),
    productCode: Type.Optional(Nullable(Type.String())),
    quantity: Type.Integer({ minimum: 1 }),
    notes: Type.Optional(Type.String()),
    logisticOption: Type.KeyOf(
      Type.Object({
        Pribadi: Type.String(),
        DisediakanProcurement: Type.String(),
      }),
    ),
    details: Type.Optional(Nullable(Type.Array(transferRequestProductItemDTO, { minItems: 1 }))),
    photos: Type.Array(
      Type.Object({
        url: Type.String({ format: 'uri' }),
      }),
    ),
    type: Type.Optional(
      Type.KeyOf(
        Type.Object({
          pakan: Type.String(),
          ovk: Type.String(),
        }),
      ),
    ),
    route: Type.Optional(
      Type.KeyOf(
        Type.Object({
          'COOP-TO-COOP': Type.String(),
          'COOP-TO-BRANCH': Type.String(),
          'BRANCH-TO-COOP': Type.String(),
        }),
      ),
    ),
  },
  { additionalProperties: false },
);

export const updateTransferRequestProductBodyDTO = Type.Object({
  details: Type.Array(transferRequestProductItemDTO, {
    minItems: 1,
  }),
});

export const updateTransferRequestBodyDTO = Type.Object(
  {
    coopSourceId: Type.Optional(Nullable(Type.String())),
    coopTargetId: Type.Optional(Nullable(Type.String())),
    branchSourceId: Type.Optional(Nullable(Type.String())),
    branchTargetId: Type.Optional(Nullable(Type.String())),
    farmingCycleId: Type.String(),
    datePlanned: Type.String({ format: 'date' }),
    subcategoryCode: Type.String(),
    subcategoryName: Type.String(),
    productName: Nullable(Type.String()),
    productCode: Type.Optional(Nullable(Type.String())),
    quantity: Type.Integer({ minimum: 1 }),
    notes: Type.Optional(Type.String()),
    logisticOption: Type.KeyOf(
      Type.Object({
        Pribadi: Type.String(),
        DisediakanProcurement: Type.String(),
      }),
    ),
    details: Type.Optional(
      Nullable(
        Type.Array(transferRequestProductItemDTO, {
          minItems: 1,
        }),
      ),
    ),
    photos: Type.Array(
      Type.Object({
        url: Type.String({ format: 'uri' }),
      }),
    ),
    type: Type.Optional(
      Type.KeyOf(
        Type.Object({
          pakan: Type.String(),
          ovk: Type.String(),
        }),
      ),
    ),
    route: Type.Optional(
      Type.KeyOf(
        Type.Object({
          'COOP-TO-COOP': Type.String(),
          'COOP-TO-BRANCH': Type.String(),
          'BRANCH-TO-COOP': Type.String(),
        }),
      ),
    ),
  },
  { additionalProperties: false },
);

export const createTransferRequestResponseItemDTO = Type.Object({
  id: Type.String(),
  ...createTransferRequestBodyDTO.properties,
  details: Type.Array(
    Type.Object({
      id: Type.String(),
      ...transferRequestProductItemDTO.properties,
    }),
  ),
  photos: Type.Array(
    Type.Object({
      id: Type.String(),
      url: Type.String({ format: 'uri' }),
    }),
  ),
});

export const createTransferRequestResponseDTO = Type.Object({
  code: Type.Integer(),
  data: createTransferRequestResponseItemDTO,
});

export const updateTransferRequestResponseItemDTO = Type.Object({
  id: Type.String(),
  ...updateTransferRequestBodyDTO.properties,
  details: Type.Array(
    Type.Object({
      id: Type.String(),
      ...transferRequestProductItemDTO.properties,
    }),
  ),
  photos: Type.Array(
    Type.Object({
      id: Type.String(),
      url: Type.String({ format: 'uri' }),
    }),
  ),
});

export const updateTransferRequestResponseDTO = Type.Object({
  code: Type.Integer(),
  data: updateTransferRequestResponseItemDTO,
});

export const getTransferRequestItemDTO = Type.Object({
  id: Type.String(),
  erpCode: Type.String(),
  description: Type.String(),
  deliveryDate: Type.String({ format: 'date' }),
  farmingCycleSourceId: Type.String(),
  farmingCycleTargetId: Type.String(),
  coopSourceId: Type.String(),
  coopTargetId: Type.String(),
  coopSourceName: Type.String(),
  coopTargetName: Type.String(),
  branchSourceName: Type.String(),
  branchTargetName: Type.String(),
  subcategoryCode: Type.String(),
  subcategoryName: Type.String(),
  quantity: Type.Integer({ minimum: 0 }),
  status: Type.Integer(),
  statusText: Type.String(),
  type: Type.String(),
  productName: Nullable(Type.String()),
  notes: Type.Optional(Type.String()),
  logisticOption: Type.KeyOf(
    Type.Object({
      Pribadi: Type.String(),
      DisediakanProcurement: Type.String(),
    }),
  ),
  route: Type.String(),
});

export const getTransferRequestListDTO = Type.Array(getTransferRequestItemDTO);

export const getTransferRequestListResponseDTO = Type.Object({
  code: Type.Integer(),
  data: getTransferRequestListDTO,
});

export const getTransferRequestDetailResponseItemDTO = Type.Object({
  ...getTransferRequestItemDTO.properties,
  goodsReceipts: goodsReceiptListDTO,
  photos: Type.Array(
    Type.Object({
      id: Type.String(),
      url: Type.String({ format: 'uri' }),
    }),
  ),
  details: Type.Array(
    Type.Object({
      ...transferRequestProductItemDTO.properties,
      remaining: Type.Number(),
    }),
  ),
});

export const getTransferRequestDetailResponseDTO = Type.Object({
  code: Type.Integer(),
  data: getTransferRequestDetailResponseItemDTO,
});

export const getTransferRequestListQueryDTO = Type.Object({
  farmingCycleId: Type.String(),
  status: Type.Optional(Nullable(Type.Array(Type.Number()))),
  type: Type.Optional(
    Type.KeyOf(
      Type.Object({
        pakan: Type.String(),
        ovk: Type.String(),
      }),
    ),
  ),
  fromDate: Type.Optional(Type.String({ format: 'date' })),
  untilDate: Type.Optional(Type.String({ format: 'date' })),
});

export const getTransferRequestDetailParamsDTO = Type.Object({
  transferRequestId: Type.String(),
});

export const approveRejectTransferRequestParamsDTO = Type.Object({
  transferRequestId: Type.String(),
});

export const rejectTransferRequestBodyDTO = Type.Object({
  remarks: Type.String(),
});

export const approveTransferRequestBodyDTO = Type.Object({
  remarks: Type.Optional(Type.String()),
});

export const approveRejectTransferRequestResponseItemDTO = Type.Object({
  id: Type.String(),
  isApproved: Type.Boolean(),
  remarks: Type.String(),
  approvedBy: Type.String(),
});

export const approveRejectTransferRequestResponseDTO = Type.Object({
  code: Type.Integer(),
  data: approveRejectTransferRequestResponseItemDTO,
});

export const getTransferRequestTargetParamsDTO = Type.Object({
  coopSourceId: Type.String(),
});

export const getTransferRequestTargetQueryDTO = Type.Object({
  coopName: Type.Optional(Type.String()),
});

export const getTransferRequestTargetResponseItemDTO = Type.Object({
  id: Type.String(),
  coopName: Type.String(),
  farmName: Type.String(),
});

export const getTransferRequestTargetResponseListDTO = Type.Array(
  getTransferRequestTargetResponseItemDTO,
);

export const getTransferRequestTargetResponseDTO = Type.Object({
  code: Type.Integer(),
  data: getTransferRequestTargetResponseListDTO,
});

export const cancelTransferRequestParamsDTO = Type.Object({
  transferRequestId: Type.String(),
});

export const cancelTransferRequestBodyDTO = Type.Object({
  remarks: Type.Optional(Type.String()),
});

export const transferRequestParamsDTO = Type.Object({
  transferRequestId: Type.String(),
});

export const updateTransferRequestTargetResponseDTO = Type.Object({
  code: Type.Integer(),
  data: updateTransferRequestBodyDTO,
});

export type CreateTransferRequestBody = Static<typeof createTransferRequestBodyDTO>;

export type UpdateTransferRequestBody = Static<typeof updateTransferRequestBodyDTO>;

export type UpdateTransferRequestProductBody = Static<typeof updateTransferRequestProductBodyDTO>;

export type CreateTransferRequestResponseItem = Static<typeof createTransferRequestResponseItemDTO>;

export type CreateTransferRequestResponse = Static<typeof createTransferRequestResponseDTO>;

export type UpdateTransferRequestResponseItem = Static<typeof updateTransferRequestResponseItemDTO>;

export type UpdateTransferRequestResponse = Static<typeof updateTransferRequestResponseDTO>;

export type GetTransferRequestItem = Static<typeof getTransferRequestItemDTO>;

export type GetTransferRequestList = Static<typeof getTransferRequestListDTO>;

export type GetTransferRequestQuery = Static<typeof getTransferRequestListQueryDTO>;

export type GetTransferRequestDetailParams = Static<typeof getTransferRequestDetailParamsDTO>;

export type GetTransferRequestDetailResponseItem = Static<
  typeof getTransferRequestDetailResponseItemDTO
>;

export type GetTransferRequestListResponse = Static<typeof getTransferRequestListResponseDTO>;

export type GetTransferRequestDetailResponse = Static<typeof getTransferRequestDetailResponseDTO>;

export type RejectTransferRequestBody = Static<typeof rejectTransferRequestBodyDTO>;

export type ApproveTransferRequestBody = Static<typeof approveTransferRequestBodyDTO>;

export type ApproveRejectTransferRequestParams = Static<
  typeof approveRejectTransferRequestParamsDTO
>;

export type ApproveRejectTransferRequestResponseItem = Static<
  typeof approveRejectTransferRequestResponseItemDTO
>;

export type ApproveRejectTransferRequestResponse = Static<
  typeof approveRejectTransferRequestResponseDTO
>;

export type GetTransferRequestTargetParams = Static<typeof getTransferRequestTargetParamsDTO>;

export type GetTransferRequestTargetQuery = Static<typeof getTransferRequestTargetQueryDTO>;

export type GetTransferRequestTargetResponseItem = Static<
  typeof getTransferRequestTargetResponseItemDTO
>;

export type GetTransferRequestTargetResponseList = Static<
  typeof getTransferRequestTargetResponseListDTO
>;

export type GetTransferRequestTargetResponse = Static<typeof getTransferRequestTargetResponseDTO>;

export type CancelTransferRequestParams = Static<typeof cancelTransferRequestParamsDTO>;

export type CancelTransferRequestBody = Static<typeof cancelTransferRequestBodyDTO>;

export type TransferRequestParams = Static<typeof transferRequestParamsDTO>;

export type UpdateTransferRequestTargetResponseDTO = Static<
  typeof updateTransferRequestTargetResponseDTO
>;
