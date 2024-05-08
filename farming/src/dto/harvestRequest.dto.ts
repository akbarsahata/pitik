import { Static, Type } from '@sinclair/typebox';

export const harvestReqSmartScaleWeighingAdditionalInfo = Type.Object({
  quantityLeftOver: Type.Number(),
  addressName: Type.String(),
  coopName: Type.String(),
  branchName: Type.String(),
  branchCode: Type.String(),
});

export const harvestRequestInputDTO = Type.Object({
  datePlanned: Type.String(),
  harvestRequests: Type.Array(
    Type.Object({
      farmingCycleId: Type.String(),
      erpCode: Type.Optional(Type.String()),
      reason: Type.String(),
      minWeight: Type.Number(),
      maxWeight: Type.Number(),
      quantity: Type.Integer(),
      isApproved: Type.Optional(Type.Boolean()),
      approvedBy: Type.Optional(Type.String()),
      approvalRemarks: Type.Optional(Type.String()),
      approvedDate: Type.Optional(Type.String()),
      requestReferralId: Type.Optional(Type.String()),
    }),
  ),
});

export const harvestRequestUpdateDTO = Type.Object({
  id: Type.Optional(Type.String()),
  farmingCycleId: Type.String(),
  erpCode: Type.Optional(Type.String()),
  reason: Type.String(),
  datePlanned: Type.String(),
  minWeight: Type.Number(),
  maxWeight: Type.Number(),
  quantity: Type.Integer(),
  isApproved: Type.Optional(Type.Boolean()),
  approvedBy: Type.Optional(Type.String()),
  approvedDate: Type.Optional(Type.String()),
  approvalRemarks: Type.Optional(Type.String()),
  requestReferralId: Type.Optional(Type.String()),
});

export const harvestRequestUpdateParamsDTO = Type.Object({
  harvestRequestId: Type.String({ format: 'uuid' }),
});

export const harvestRequestItemDTO = Type.Object({
  id: Type.String(),
  seqNo: Type.Number(),
  farmingCycleId: Type.String(),
  erpCode: Type.Optional(Type.String()),
  datePlanned: Type.String(),
  reason: Type.String(),
  minWeight: Type.Number(),
  maxWeight: Type.Number(),
  quantity: Type.Integer(),
  isApproved: Type.Optional(Type.Boolean()),
  approvedBy: Type.Optional(Type.String()),
  approvedDate: Type.Optional(Type.String()),
  approvalRemarks: Type.Optional(Type.String()),
  status: Type.Integer(),
  statusText: Type.String(),
  requestReferralId: Type.Optional(Type.String()),
  ...Type.Partial(harvestReqSmartScaleWeighingAdditionalInfo).properties,
});

export const harvestRequestListDTO = Type.Array(harvestRequestItemDTO);

export const harvestRequestQueryStringDTO = Type.Object({
  farmingCycleId: Type.String(),
  isApproved: Type.Optional(Type.Boolean()),
});

export const harvestRequestListResponseDTO = Type.Object({
  code: Type.Number(),
  data: harvestRequestListDTO,
});

export const harvestRequestDetailResponseDTO = Type.Object({
  code: Type.Number(),
  data: harvestRequestItemDTO,
});

export const harvestRequestDetailParamsDTO = Type.Object({
  harvestRequestId: Type.String({ format: 'uuid' }),
});

export const harvestRequestInputResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(
    Type.Object({
      ...harvestRequestItemDTO.properties,
    }),
  ),
});

export const harvestRequestUpdateResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    ...harvestRequestItemDTO.properties,
  }),
});

export const approveRejectHarvestRequestBodyDTO = Type.Object({
  approvalRemarks: Type.Optional(Type.String()),
});

export const approveRejectHarvestRequestParamsDTO = Type.Object({
  harvestRequestId: Type.String({ format: 'uuid' }),
});

export const approveRejectHarvestRequestResponseItemDTO = Type.Object({
  id: Type.String(),
  isApproved: Type.Boolean(),
  approvedBy: Type.String(),
  approvalRemarks: Type.String(),
});

export const approveRejectHarvestRequestResponseDTO = Type.Object({
  data: approveRejectHarvestRequestResponseItemDTO,
});

export type HarvestRequestInput = Static<typeof harvestRequestInputDTO>;

export type HarvestRequestInputResponse = Static<typeof harvestRequestInputResponseDTO>;

export type HarvestRequestUpdate = Static<typeof harvestRequestUpdateDTO>;

export type HarvestRequestUpdateParams = Static<typeof harvestRequestUpdateParamsDTO>;

export type HarvestRequestUpdateResponse = Static<typeof harvestRequestUpdateResponseDTO>;

export type HarvestRequestItem = Static<typeof harvestRequestItemDTO>;

export type HarvestRequestList = Static<typeof harvestRequestListDTO>;

export type HarvestRequestListResponse = Static<typeof harvestRequestListResponseDTO>;

export type HarvestRequestQueryString = Static<typeof harvestRequestQueryStringDTO>;

export type HarvestRequestDetailResponse = Static<typeof harvestRequestDetailResponseDTO>;

export type HarvestRequestDetailParams = Static<typeof harvestRequestDetailParamsDTO>;

export type ApproveRejectHarvestRequestBody = Static<typeof approveRejectHarvestRequestBodyDTO>;

export type ApproveRejectHarvestRequestParams = Static<typeof approveRejectHarvestRequestParamsDTO>;

export type ApproveRejectHarvestRequestResponseItem = Static<
  typeof approveRejectHarvestRequestResponseItemDTO
>;

export type ApproveRejectHarvestRequestResponse = Static<
  typeof approveRejectHarvestRequestResponseDTO
>;
