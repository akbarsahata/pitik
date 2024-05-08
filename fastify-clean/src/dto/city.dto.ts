import { Static, Type } from '@sinclair/typebox';

export const getCitiesQueryDTO = Type.Object({
  name: Type.Optional(Type.String()),
  provinceId: Type.Optional(Type.Number()),
});

export const cityItemDTO = Type.Object({
  id: Type.Number(),
  provinceId: Type.Number(),
  cityName: Type.String(),
});

export const getCitiesResponseDTO = Type.Object({
  data: Type.Array(cityItemDTO),
});

export type GetCitiesQuery = Static<typeof getCitiesQueryDTO>;

export type CityItem = Static<typeof cityItemDTO>;

export type GetCitiesResponse = Static<typeof getCitiesResponseDTO>;
