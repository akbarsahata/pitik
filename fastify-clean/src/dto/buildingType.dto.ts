import { Static, Type } from '@sinclair/typebox';

export const getBuildingTypesQueryDTO = Type.Object({
  isActive: Type.Optional(Type.Boolean()),
});

export const buildingTypeItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  isActive: Type.Boolean(),
});

export const getBuildingTypesResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(buildingTypeItemDTO),
});

export type BuildingTypeItem = Static<typeof buildingTypeItemDTO>;

export type GetBuildingTypesQuery = Static<typeof getBuildingTypesQueryDTO>;

export type GetBuildingTypesResponse = Static<typeof getBuildingTypesResponseDTO>;
