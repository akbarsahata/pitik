import { Static, Type } from '@sinclair/typebox';

export const getFloorTypesQueryDTO = Type.Object({
  isActive: Type.Optional(Type.Boolean()),
});

export const floorTypeItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  isActive: Type.Boolean(),
});

export const getFloorTypesResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(floorTypeItemDTO),
});

export type FloorTypeItem = Static<typeof floorTypeItemDTO>;

export type GetFloorTypesQuery = Static<typeof getFloorTypesQueryDTO>;

export type GetFloorTypesResponse = Static<typeof getFloorTypesResponseDTO>;
