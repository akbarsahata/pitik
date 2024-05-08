import { Static, Type } from '@sinclair/typebox';

export const getDistrictsQueryDTO = Type.Object({
  name: Type.Optional(Type.String()),
  cityId: Type.Optional(Type.Number()),
});

export const districtItemDTO = Type.Object({
  id: Type.Number(),
  districtName: Type.String(),
  cityId: Type.Number(),
});

export const getDistrictsResponseDTO = Type.Object({
  data: Type.Array(districtItemDTO),
});

export type GetDistrictsQuery = Static<typeof getDistrictsQueryDTO>;

export type DistrictItem = Static<typeof districtItemDTO>;

export type GetDistrictsResponse = Static<typeof getDistrictsResponseDTO>;
