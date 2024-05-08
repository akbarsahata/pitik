import { Static, Type } from '@sinclair/typebox';

export const getHeaterTypesQueryDTO = Type.Object({
  isActive: Type.Optional(Type.Boolean()),
});

export const heaterTypeItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  isActive: Type.Boolean(),
});

export const getHeaterTypesResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(heaterTypeItemDTO),
});

export type HeaterTypeItem = Static<typeof heaterTypeItemDTO>;

export type GetHeaterTypesQuery = Static<typeof getHeaterTypesQueryDTO>;

export type GetHeaterTypesResponse = Static<typeof getHeaterTypesResponseDTO>;
