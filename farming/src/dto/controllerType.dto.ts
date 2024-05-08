import { Static, Type } from '@sinclair/typebox';

export const getControllerTypesQueryDTO = Type.Object({
  isActive: Type.Optional(Type.Boolean()),
});

export const controllerTypeItemDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  isActive: Type.Boolean(),
});

export const getControllerTypesResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(controllerTypeItemDTO),
});

export type ControllerTypeItem = Static<typeof controllerTypeItemDTO>;

export type GetControllerTypesQuery = Static<typeof getControllerTypesQueryDTO>;

export type GetControllerTypesResponse = Static<typeof getControllerTypesResponseDTO>;
