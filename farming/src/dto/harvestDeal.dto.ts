import { Static, Type } from '@sinclair/typebox';
import { HarvestDealStatusEnum } from '../datasources/entity/pgsql/HarvestDeal.entity';
import { Nullable } from '../libs/utils/typebox';

export const harvestDealItemDTO = Type.Object({
  id: Type.String({ format: 'uuid' }),
  harvestRequestId: Type.String({ format: 'uuid' }),
  harvestRealizationId: Type.Optional(Type.String()),
  erpCode: Type.String(),
  deliveryOrder: Type.String(),
  datePlanned: Type.String({ format: 'date' }),
  bakulName: Type.String(),
  minWeight: Type.Number({ minimum: 0 }),
  maxWeight: Type.Number({ minimum: 0 }),
  quantity: Type.Number({ minimum: 0 }),
  requestDate: Type.String({ format: 'date' }),
  status: Type.Enum(HarvestDealStatusEnum),
  statusText: Type.Optional(Type.String()),
  truckLicensePlate: Type.Optional(Nullable(Type.String())),
  reason: Type.Optional(Type.String()),
});

export const harvestDealListDTO = Type.Array(harvestDealItemDTO);

export const createHarvestDealBodyDTO = Type.Object({
  harvestRequestCode: Type.String(),
  deliveryOrder: Type.String(),
  datePlanned: Type.String({ format: 'date' }),
  bakulName: Type.String(),
  minWeight: Type.Number({ minimum: 0 }),
  maxWeight: Type.Number({ minimum: 0 }),
  quantity: Type.Number({ minimum: 0 }),
  status: Type.Boolean(),
  nop: Type.Optional(Type.String()),
  reason: Type.Optional(Type.String()),
});

export const getHarvestDealListQueryDTO = Type.Object({
  farmingCycleId: Type.String(),
  status: Type.Optional(Type.Enum(HarvestDealStatusEnum)),
});

export const getHarvestDealListResponseDTO = Type.Object({
  code: Type.Number(),
  data: harvestDealListDTO,
});

export const getHarvestDealDetailResponseDTO = Type.Object({
  code: Type.Number(),
  data: harvestDealItemDTO,
});

export const getHarvestDealDetailParamsDTO = Type.Object({
  harvestDealId: Type.String({ format: 'uuid' }),
});

export const createHarvestDealResponseDTO = Type.Object({
  code: Type.Number(),
});

export const cancelHarvestDealParamsDTO = getHarvestDealDetailParamsDTO;

export const cancelHarvestDealResponseDTO = getHarvestDealDetailResponseDTO;

export type HarvestDealItem = Static<typeof harvestDealItemDTO>;

export type HarvestDealList = Static<typeof harvestDealListDTO>;

export type CreateHarvestDealBody = Static<typeof createHarvestDealBodyDTO>;

export type GetHarvestDealListQuery = Static<typeof getHarvestDealListQueryDTO>;

export type GetHarvestDealListResponse = Static<typeof getHarvestDealListResponseDTO>;

export type GetHarvestDealDetailResponse = Static<typeof getHarvestDealDetailResponseDTO>;

export type GetHarvestDealDetailParams = Static<typeof getHarvestDealDetailParamsDTO>;

export type CreateHarvestDealResponse = Static<typeof createHarvestDealResponseDTO>;

export type CancelHarvestDealParams = Static<typeof cancelHarvestDealParamsDTO>;

export type CancelHarvestDealResponse = Static<typeof cancelHarvestDealResponseDTO>;
