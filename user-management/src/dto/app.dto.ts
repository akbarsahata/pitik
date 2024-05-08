import { Static, Type } from '@sinclair/typebox';
import { paginationDTO } from './common.dto';

export const appItemDTO = Type.Object({
  name: Type.String(),
  url: Type.Optional(Type.String()),
  logo: Type.Optional(Type.String()),
  key: Type.Optional(Type.String()),
  about: Type.Optional(Type.String()),
});

export const appItemOutputDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  url: Type.Optional(Type.String()),
  logo: Type.Optional(Type.String()),
  key: Type.Optional(Type.String()),
  about: Type.Optional(Type.String()),
  createdDate: Type.String(),
  createdBy: Type.String(),
  modifiedDate: Type.Optional(Type.String()),
  modifiedBy: Type.Optional(Type.String()),
});

export const createAppItemRequestBodyDTO = Type.Object({
  ...appItemDTO.properties,
});

export const createAppItemResponseDTO = Type.Object({
  ...appItemOutputDTO.properties,
  createdBy: Type.Optional(Type.String()),
  createdDate: Type.Optional(Type.String()),
});

export const createAppResponseDTO = Type.Object({
  code: Type.Number(),
  data: createAppItemResponseDTO,
});

export const getAppsQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  name: Type.Optional(Type.String()),
});

export const getAppsResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(appItemOutputDTO),
});

export const getAppParamsDTO = Type.Object({
  appId: Type.String(),
});

export const getAppByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: appItemOutputDTO,
});

export const updateAppParamsDTO = Type.Object({
  appId: Type.String(),
});

export const updateAppBodyDTO = Type.Object({
  ...Type.Partial(appItemDTO).properties,
});

export const updateAppItemResponseDTO = Type.Object({
  ...appItemOutputDTO.properties,
  modifiedBy: Type.String(),
  modifiedDate: Type.String(),
});

export const updateAppResponseDTO = Type.Object({
  code: Type.Number(),
  data: updateAppItemResponseDTO,
});

export const deleteAppParamsDTO = Type.Object({
  appId: Type.String(),
});

export const deleteAppItemResponseDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export const deleteAppResponseDTO = Type.Object({
  code: Type.Number(),
  data: deleteAppItemResponseDTO,
});

export type CreateAppRequestBody = Static<typeof createAppItemRequestBodyDTO>;

export type CreateAppItemResponse = Static<typeof createAppItemResponseDTO>;

export type CreateAppResponse = Static<typeof createAppResponseDTO>;

export type GetAppsQuery = Static<typeof getAppsQueryDTO>;

export type GetAppResponse = Static<typeof appItemOutputDTO>;

export type GetAppsResponse = Static<typeof getAppsResponseDTO>;

export type GetAppParams = Static<typeof getAppParamsDTO>;

export type GetAppByIdResponse = Static<typeof getAppByIdResponseDTO>;

export type UpdateAppParams = Static<typeof updateAppParamsDTO>;

export type UpdateAppBody = Static<typeof updateAppBodyDTO>;

export type UpdateAppItemResponse = Static<typeof updateAppItemResponseDTO>;

export type UpdateAppResponse = Static<typeof updateAppResponseDTO>;

export type DeleteAppParams = Static<typeof deleteAppParamsDTO>;

export type DeleteAppItemResponse = Static<typeof deleteAppItemResponseDTO>;

export type DeleteAppResponse = Static<typeof deleteAppResponseDTO>;
