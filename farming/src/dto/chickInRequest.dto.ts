import { Static, Type } from '@sinclair/typebox';
import { Nullable } from '../libs/utils/typebox';
import {
  createTransferRequestBodyDTO,
  getTransferRequestDetailResponseItemDTO,
} from './transferRequest.dto';

export const chickInRequestProductDTO = Type.Object({
  categoryCode: Type.String(),
  categoryName: Type.String(),
  subcategoryCode: Type.String(),
  subcategoryName: Type.String(),
  productCode: Type.String(),
  productName: Type.String(),
  quantity: Type.Integer({ minimum: 1 }),
  purchaseUom: Type.String(),
});

export const chickInRequestProductResponseItemDTO = Type.Object({
  id: Type.String(),
  ...chickInRequestProductDTO.properties,
});

export const chickInRequestProductResponseListDTO = Type.Array(
  chickInRequestProductResponseItemDTO,
);

export const chickInRequestWithMergedLogisticInfoBodyDTO = Type.Object({
  mergedLogistic: Type.Optional(Type.Boolean()),
  mergedCoopId: Type.Optional(Type.String()),
});

export const upsertChickInRequestBodyDTO = Type.Object(
  {
    chickInDate: Type.String({ format: 'date' }),
    coopId: Type.String(),
    initialPopulation: Type.Number({ minimum: 1 }),
    doc: chickInRequestProductDTO,
    notes: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

export const chickInRequestItemDTO = Type.Object({
  ...upsertChickInRequestBodyDTO.properties,
  farmId: Type.String(),
  userOwnerId: Type.String(),
  farmingCycleId: Type.String(),
  internalOvkTransferRequest: Type.Optional(
    Nullable(
      Type.Object({
        ...createTransferRequestBodyDTO.properties,
        id: Type.String(),
      }),
    ),
  ),
});

export const upsertChickInRequestResponseItemDTO = Type.Object({
  id: Type.String(),
  ...chickInRequestItemDTO.properties,
});

export const approveChickInRequestBodyDTO = Type.Object({
  chickInDate: Type.Optional(Type.String({ format: 'date' })),
});

export const approveChickInRequestParamsDTO = Type.Object({
  chickInReqId: Type.String(),
});

export const rejectChickInRequestBodyDTO = Type.Object({
  remarks: Type.String(),
});

export const rejectChickInRequestParamsDTO = Type.Object({
  ...approveChickInRequestParamsDTO.properties,
});

export const approveChickInRequestResponseItemDTO = Type.Object({
  id: Type.String(),
  chickInDate: Type.String({ format: 'date' }),
  approvedDate: Type.String({ format: 'date' }),
  initialPopulation: Type.Integer(),
  isApproved: Nullable(Type.Boolean({ default: false })),
});

export const approveChickInRequestResponseDTO = Type.Object({
  code: Type.Integer(),
  data: approveChickInRequestResponseItemDTO,
});

export const rejectChickInRequestResponseItemDTO = Type.Object({
  ...approveChickInRequestResponseItemDTO.properties,
});

export const rejectChickInRequestResponseDTO = Type.Object({
  code: Type.Integer(),
  data: rejectChickInRequestResponseItemDTO,
});

export const upsertChickInRequestResponseDTO = Type.Object({
  code: Type.Number(),
  data: upsertChickInRequestResponseItemDTO,
});

export const chickInRequestWithMergedLogisticInfoResponseDTO = Type.Object({
  mergedLogistic: Type.Optional(Type.Boolean()),
  mergedLogisticCoopName: Nullable(Type.String()),
  mergedLogisticFarmingCycleDays: Nullable(Type.Number()),
});

export const getChickInRequestDetailResponseItemDTO = Type.Object({
  id: Type.String(),
  chickInDate: Type.String({ format: 'date' }),
  initialPopulation: Type.Number({ minimum: 0 }),
  coopId: Type.String(),
  doc: chickInRequestProductResponseItemDTO,
  pakan: Type.Optional(chickInRequestProductResponseListDTO),
  ovk: Type.Optional(chickInRequestProductResponseListDTO),
  previousOvk: Type.Optional(chickInRequestProductResponseListDTO),
  notes: Type.Optional(Type.String()),
  ...Type.Partial(chickInRequestWithMergedLogisticInfoResponseDTO).properties,
  internalOvkTransferRequest: Type.Optional(Nullable(getTransferRequestDetailResponseItemDTO)),
});

export const getChickInRequestDetailResponseDTO = Type.Object({
  code: Type.Integer(),
  data: getChickInRequestDetailResponseItemDTO,
});

export const getChickInRequestDetailParamsDTO = Type.Object({
  chickInReqId: Type.String(),
});

export const updateChickInRequestParamsDTO = Type.Object({
  chickInReqId: Type.String(),
});

export const updateChickInRequestBodyDTO = Type.Object({
  ...upsertChickInRequestBodyDTO.properties,
  internalOvkTransferRequest: Type.Optional(
    Nullable(
      Type.Object({
        ...createTransferRequestBodyDTO.properties,
        id: Type.String(),
      }),
    ),
  ),
});

export const updateChickInRequestResponseItemDTO = Type.Object({
  id: Type.String(),
  ...chickInRequestItemDTO.properties,
});

export const updateChickInRequestResponseDTO = Type.Object({
  code: Type.Integer(),
  data: updateChickInRequestResponseItemDTO,
});

export type ChickInRequestProduct = Static<typeof chickInRequestProductDTO>;

export type ChickInRequestProductResponseItem = Static<typeof chickInRequestProductResponseItemDTO>;

export type ChickInRequestProductResponseList = Static<typeof chickInRequestProductResponseListDTO>;

export type upsertChickInRequestBody = Static<typeof upsertChickInRequestBodyDTO>;

export type ChickInRequestItem = Static<typeof chickInRequestItemDTO>;

export type upsertChickInRequestResponseItem = Static<typeof upsertChickInRequestResponseItemDTO>;

export type UpsertChickInRequestResponse = Static<typeof upsertChickInRequestResponseDTO>;

export type ApproveChickInRequestParams = Static<typeof approveChickInRequestParamsDTO>;

export type ApproveChickInRequestBody = Static<typeof approveChickInRequestBodyDTO>;

export type ApproveChickInRequestResponseItem = Static<typeof approveChickInRequestResponseItemDTO>;

export type ApproveChickInRequestResponse = Static<typeof approveChickInRequestResponseDTO>;

export type RejectChickInRequestParams = Static<typeof rejectChickInRequestParamsDTO>;

export type RejectChickInRequestBody = Static<typeof rejectChickInRequestBodyDTO>;

export type RejectChickInRequestResponseItem = Static<typeof rejectChickInRequestResponseItemDTO>;

export type RejectChickInRequestResponse = Static<typeof rejectChickInRequestResponseDTO>;

export type GetChickInRequestDetailResponseItem = Static<
  typeof getChickInRequestDetailResponseItemDTO
>;

export type GetChickInRequestDetailResponse = Static<typeof getChickInRequestDetailResponseDTO>;

export type GetChickInRequestDetailParams = Static<typeof getChickInRequestDetailParamsDTO>;

export type UpdateChickInRequestParams = Static<typeof updateChickInRequestParamsDTO>;

export type UpdateChickInRequestBody = Static<typeof updateChickInRequestBodyDTO>;

export type UpdateChickInRequestResponseItem = Static<typeof updateChickInRequestResponseItemDTO>;

export type UpdateChickInRequestResponse = Static<typeof updateChickInRequestResponseDTO>;
