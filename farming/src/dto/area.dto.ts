import { Static, Type } from '@sinclair/typebox';

export const areaUpsertBodyDTO = Type.Object({
  code: Type.String(),
  name: Type.String(),
  isActive: Type.Boolean({ default: false }),
});

export const areaItemDTO = Type.Object({
  id: Type.String(),
  seqNo: Type.Number(),
  code: Type.String(),
  name: Type.String(),
  isActive: Type.Boolean(),
});

export const areaListDTO = Type.Array(areaItemDTO);

export const areaListResponseDTO = Type.Object({
  data: areaListDTO,
});

export const areaUpsertResponseDTO = Type.Object({
  data: Type.Object({
    id: Type.String(),
    ...areaUpsertBodyDTO.properties,
  }),
});

export type AreaUpsertBody = Static<typeof areaUpsertBodyDTO>;

export type AreaItem = Static<typeof areaItemDTO>;

export type AreaList = Static<typeof areaListDTO>;

export type AreaListResponse = Static<typeof areaListResponseDTO>;

export type AreaUpsertResponse = Static<typeof areaUpsertResponseDTO>;
