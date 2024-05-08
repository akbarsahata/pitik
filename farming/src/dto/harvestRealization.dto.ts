import { Static, Type } from '@sinclair/typebox';
import { RealizationStatusEnum } from '../datasources/entity/pgsql/HarvestRealization.entity';
import { Nullable } from '../libs/utils/typebox';

export const harvestRealizationWithWeighingInputDTO = Type.Object({
  weighingNumber: Type.String(),
  witnessName: Type.String(),
  receiverName: Type.String(),
  weigherName: Type.String(),
  totalWeighedChicken: Type.Optional(Type.Number()),
  totalWeighedTonnage: Type.Optional(Type.Number()),
  averageChickenWeighed: Type.Optional(Type.Number()),
  harvestRequestDate: Type.Optional(Type.String()),
  harvestRequestQuantity: Type.Optional(Type.Number()),
  reason: Type.Optional(Type.String()),
  isReweighing: Type.Optional(Type.Boolean({ default: false })),
  isRegenerateDoc: Type.Optional(Type.Boolean({ default: false })),
  addressName: Type.Optional(Type.String()),
  coopName: Type.Optional(Type.String()),
  branchName: Type.Optional(Type.String()),
});

export const harvestRealizationWithWeighingDetailsDTO = Type.Object({
  date: Type.String(),
  page: Type.Number(),
});

export const harvestWeighingDDTO = Type.Object({
  section: Type.Integer(),
  totalCount: Type.Integer(),
  totalWeight: Type.Number(),
});

export const harvestRecordInputDTO = Type.Object({
  weighingNumber: Type.Optional(Type.String()),
  tonnage: Type.Number(),
  quantity: Type.Integer(),
  averageWeight: Type.Number(),
  image: Type.Optional(Type.String()),
  details: Type.Optional(Nullable(Type.Array(harvestWeighingDDTO))),
  ...Type.Partial(harvestRealizationWithWeighingDetailsDTO).properties,
});

export const additionalRequestInputDTO = Type.Object({
  coopId: Type.String(),
  farmingCycleId: Type.String(),
  coopName: Type.Optional(Type.String()),
  quantity: Type.Integer(),
});

export const harvestRealizationInputDTO = Type.Object({
  farmingCycleId: Type.String(),
  harvestDealId: Type.String(),
  harvestDate: Type.String({ format: 'date' }),
  weighingTime: Nullable(Type.String({ format: 'time' })),
  truckDepartingTime: Nullable(Type.String()),
  driver: Type.String(),
  truckLicensePlate: Type.String(),
  records: Type.Array(harvestRecordInputDTO, { minItems: 1 }),
  additionalRequests: Type.Array(additionalRequestInputDTO),
  status: Type.Optional(Type.Union([Type.Null(), Type.Enum(RealizationStatusEnum)])),
  ...Type.Partial(harvestRealizationWithWeighingInputDTO).properties,
});

export const harvestRealizationDealInputDTO = Type.Object({
  farmingCycleId: Type.String(),
  harvestRequestId: Type.String(),
  deliveryOrder: Type.String(),
  bakulName: Type.String(),
  harvestDate: Type.String({ format: 'date' }),
  minWeight: Type.Number(),
  maxWeight: Type.Number(),
  weighingTime: Type.String({ format: 'time' }),
  truckDepartingTime: Nullable(Type.String()),
  driver: Type.String(),
  truckLicensePlate: Type.String(),
  records: Type.Array(harvestRecordInputDTO, { minItems: 1 }),
  additionalRequests: Type.Array(additionalRequestInputDTO),
  status: Type.Optional(Type.Union([Type.Null(), Type.Enum(RealizationStatusEnum)])),
  ...Type.Partial(harvestRealizationWithWeighingInputDTO).properties,
});

export const harvestRealizationUpdateDTO = Type.Object({
  id: Type.Optional(Type.String()),
  farmingCycleId: Type.String(),
  harvestDealId: Type.String(),
  harvestDate: Type.String({ format: 'date' }),
  weighingTime: Type.String({ format: 'time' }),
  truckDepartingTime: Nullable(Type.String()),
  driver: Type.String(),
  truckLicensePlate: Type.String(),
  records: Type.Array(harvestRecordInputDTO, { minItems: 1 }),
  additionalRequests: Type.Array(additionalRequestInputDTO),
  status: Type.Optional(Type.Union([Type.Null(), Type.Enum(RealizationStatusEnum)])),
  ...Type.Partial(harvestRealizationWithWeighingInputDTO).properties,
});

export const harvestRealizationDealUpdateDTO = Type.Object({
  id: Type.Optional(Type.String()),
  farmingCycleId: Type.String(),
  deliveryOrder: Type.String(),
  bakulName: Type.String(),
  harvestDate: Type.String({ format: 'date' }),
  minWeight: Type.Number(),
  maxWeight: Type.Number(),
  weighingTime: Type.String({ format: 'time' }),
  truckDepartingTime: Nullable(Type.String()),
  driver: Type.String(),
  truckLicensePlate: Type.String(),
  records: Type.Array(harvestRecordInputDTO, { minItems: 1 }),
  additionalRequests: Type.Array(additionalRequestInputDTO),
  status: Type.Optional(Type.Union([Type.Null(), Type.Enum(RealizationStatusEnum)])),
  ...Type.Partial(harvestRealizationWithWeighingInputDTO).properties,
});

export const harvestRealizationUpdateParamsDTO = Type.Object({
  harvestRealizationId: Type.String({ format: 'uuid' }),
});

export const harvestRecordItemDTO = Type.Object({
  id: Type.String(),
  weighingNumber: Type.String(),
  tonnage: Type.Number(),
  quantity: Type.Number(),
  averageWeight: Type.Number(),
  image: Type.Optional(Type.String({ format: 'uri' })),
  details: Type.Optional(Type.Array(harvestWeighingDDTO)),
  ...Type.Partial(harvestRealizationWithWeighingDetailsDTO).properties,
});

export const harvestRealizationItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  seqNo: Type.Number(),
  erpCode: Type.Optional(Type.String()),
  farmingCycleId: Type.String(),
  harvestDealId: Type.String(),
  harvestRequestId: Type.String(),
  bakulName: Type.String(),
  deliveryOrder: Type.String(),
  tonnage: Type.Number(),
  quantity: Type.Integer(),
  minWeight: Type.Number(),
  maxWeight: Type.Number(),
  harvestDate: Type.String({ format: 'date' }),
  weighingTime: Type.String(),
  truckDepartingTime: Nullable(Type.String()),
  driver: Type.String(),
  truckLicensePlate: Type.String(),
  records: Type.Array(harvestRecordItemDTO),
  additionalRequests: Type.Array(additionalRequestInputDTO),
  status: Type.Integer(),
  statusText: Type.KeyOf(
    Type.Object({
      Terealisasi: Type.String(),
      Selesai: Type.String(),
    }),
  ),
  smartScaleWeighingId: Type.Optional(Nullable(Type.String())),
  ...Type.Partial(harvestRealizationWithWeighingInputDTO).properties,
});

export const harvestRealizationListDTO = Type.Array(harvestRealizationItemDTO);

export const harvestRealizationListParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
  isUseSmartScale: Type.Optional(Type.Boolean({ default: false })),
});

export const harvestRealizationListResponseDTO = Type.Object({
  code: Type.Number(),
  data: harvestRealizationListDTO,
});

export const harvestRealizationDetailDTO = Type.Object({
  ...harvestRealizationItemDTO.properties,
  records: Type.Array(harvestRecordItemDTO),
  createdBy: Type.Optional(Type.String()),
  createdDate: Type.Optional(Type.String()),
});

export const harvestRealizationDetailResponseDTO = Type.Object({
  code: Type.Number(),
  data: harvestRealizationDetailDTO,
});

export const harvestRealizationDetailParamsDTO = Type.Object({
  harvestRealizationId: Type.String({ format: 'uuid' }),
});

export const harvestRealizationInputResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    ...harvestRealizationItemDTO.properties,
  }),
});

export const harvestRealizationUpdateResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    ...harvestRealizationItemDTO.properties,
  }),
});

export type HarvestRealizationInput = Static<typeof harvestRealizationInputDTO>;

export type HarvestRealizationDealInput = Static<typeof harvestRealizationDealInputDTO>;

export type HarvestRealizationInputResponse = Static<typeof harvestRealizationInputResponseDTO>;

export type HarvestRecordInput = Static<typeof harvestRecordInputDTO>;

export type AdditionalRequestInput = Static<typeof additionalRequestInputDTO>;

export type HarvestRealizationUpdate = Static<typeof harvestRealizationUpdateDTO>;

export type HarvestRealizationDealUpdate = Static<typeof harvestRealizationDealUpdateDTO>;

export type HarvestRealizationUpdateParams = Static<typeof harvestRealizationUpdateParamsDTO>;

export type HarvestRealizationUpdateResponse = Static<typeof harvestRealizationUpdateResponseDTO>;

export type HarvestRealizationItem = Static<typeof harvestRealizationItemDTO>;

export type HarvestRecordItem = Static<typeof harvestRecordItemDTO>;

export type HarvestRealizationList = Static<typeof harvestRealizationListDTO>;

export type HarvestRealizationDetail = Static<typeof harvestRealizationDetailDTO>;

export type HarvestRealizationListResponse = Static<typeof harvestRealizationListResponseDTO>;

export type HarvestRealizationListParams = Static<typeof harvestRealizationListParamsDTO>;

export type HarvestRealizationDetailResponse = Static<typeof harvestRealizationDetailResponseDTO>;

export type HarvestRealizationDetailParams = Static<typeof harvestRealizationDetailParamsDTO>;
