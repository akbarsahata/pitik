import { Static, Type } from '@sinclair/typebox';
import { paginationDTO } from './common.dto';

export const repopulationItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  approvedAmount: Type.Number(),
  repopulateDate: Type.String(),
  repopulateDay: Type.Optional(Type.Number()),
  repopulateReason: Type.String(),
  createdDate: Type.Optional(Type.String()),
  createdBy: Type.Optional(Type.String()),
  modifiedDate: Type.Optional(Type.String()),
  modifiedBy: Type.Optional(Type.String()),
});

export const repopulationFarmingCycle = Type.Object({
  ...Type.Partial(repopulationItemDTO).properties,
  newFarmingCycleStartDate: Type.Optional(Type.String()),
  newInitialPopulation: Type.Optional(Type.Number()),
  initialPopulation: Type.Optional(Type.Number()),
});

export const getRepopulationsQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  ...Type.Partial(repopulationItemDTO).properties,
});

export const getRepopulationsResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(repopulationFarmingCycle),
});

export const createRepopulationBodyDTO = Type.Object({
  ...repopulationItemDTO.properties,
});

export const repopulationParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const repopulationItemResponseDTO = Type.Object({
  code: Type.Number(),
  data: repopulationItemDTO,
});

export type GetRepopulationsQuery = Static<typeof getRepopulationsQueryDTO>;

export type GetRepopulationsResponse = Static<typeof getRepopulationsResponseDTO>;

export type CreateRepopulationBody = Static<typeof createRepopulationBodyDTO>;

export type RepopulationItem = Static<typeof repopulationItemDTO>;

export type RepopulationFarmingCycle = Static<typeof repopulationFarmingCycle>;

export type RepopulationParams = Static<typeof repopulationParamsDTO>;

export type RepopulationItemResponse = Static<typeof repopulationItemResponseDTO>;
