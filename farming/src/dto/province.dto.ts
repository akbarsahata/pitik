import { Static, Type } from '@sinclair/typebox';

export const getProvincesQueryDTO = Type.Object({
  name: Type.Optional(Type.String()),
});

export const provinceItemDTO = Type.Object({
  id: Type.Number(),
  provinceName: Type.String(),
});

export const getProvincesResponseDTO = Type.Object({
  data: Type.Array(provinceItemDTO),
});

export type GetProvincesQuery = Static<typeof getProvincesQueryDTO>;

export type ProvinceItem = Static<typeof provinceItemDTO>;

export type GetProvinceResponse = Static<typeof getProvincesResponseDTO>;
