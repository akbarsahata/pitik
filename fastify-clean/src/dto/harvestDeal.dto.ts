import { Static, Type } from '@sinclair/typebox';

export const harvestDealItemDTO = Type.Object({
  id: Type.String({ format: 'uuid' }),
  harvestRequestId: Type.String({ format: 'uuid' }),
  erpCode: Type.String(),
  deliveryOrder: Type.String(),
  datePlanned: Type.String({ format: 'date' }),
  bakulName: Type.String(),
  minWeight: Type.Number({ minimum: 0 }),
  maxWeight: Type.Number({ minimum: 0 }),
  quantity: Type.Number({ minimum: 0 }),
  requestDate: Type.String({ format: 'date' }),
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
});

export const getHarvestDealListQueryDTO = Type.Object({
  farmingCycleId: Type.String(),
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

export type HarvestDealItem = Static<typeof harvestDealItemDTO>;

export type HarvestDealList = Static<typeof harvestDealListDTO>;

export type CreateHarvestDealBody = Static<typeof createHarvestDealBodyDTO>;

export type GetHarvestDealListQuery = Static<typeof getHarvestDealListQueryDTO>;

export type GetHarvestDealListResponse = Static<typeof getHarvestDealListResponseDTO>;

export type GetHarvestDealDetailResponse = Static<typeof getHarvestDealDetailResponseDTO>;

export type GetHarvestDealDetailParams = Static<typeof getHarvestDealDetailParamsDTO>;

export type CreateHarvestDealResponse = Static<typeof createHarvestDealResponseDTO>;
