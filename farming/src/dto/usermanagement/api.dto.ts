import { Static, Type } from '@sinclair/typebox';
import { paginationDTO } from './common.dto';

export const apiItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  groupName: Type.String(),
  name: Type.Optional(Type.String()),
  endpoint: Type.String(),
  method: Type.KeyOf(
    Type.Object({
      POST: Type.String(),
      GET: Type.String(),
      PATCH: Type.String(),
      PUT: Type.String(),
      DELETE: Type.String(),
    }),
  ),
});

export const apiItemOutputDTO = Type.Object({
  id: Type.String(),
  groupName: Type.String(),
  name: Type.String(),
  endpoint: Type.String(),
  method: Type.String(),
  createdDate: Type.String(),
  createdBy: Type.String(),
  modifiedDate: Type.Optional(Type.String()),
  modifiedBy: Type.Optional(Type.String()),
});

export const createApiItemRequestBodyDTO = Type.Object({
  ...apiItemDTO.properties,
});

export const createApiItemResponseDTO = Type.Object({
  ...apiItemOutputDTO.properties,
});

export const createApiResponseDTO = Type.Object({
  code: Type.Number(),
  data: createApiItemResponseDTO,
});

export const getApisQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  name: Type.Optional(Type.String()),
});

export const getApisResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(apiItemOutputDTO),
});

export const getApiParamsDTO = Type.Object({
  apiId: Type.String(),
});

export const getApiByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: apiItemOutputDTO,
});

export const updateApiParamsDTO = Type.Object({
  apiId: Type.String(),
});

export const updateApiBodyDTO = Type.Object({
  ...Type.Partial(apiItemDTO).properties,
});

export const updateApiItemResponseDTO = Type.Object({
  ...apiItemOutputDTO.properties,
  modifiedBy: Type.String(),
  modifiedDate: Type.String(),
});

export const updateApiResponseDTO = Type.Object({
  code: Type.Number(),
  data: updateApiItemResponseDTO,
});

export const deleteApiParamsDTO = Type.Object({
  apiId: Type.String(),
});

export const deleteApiItemResponseDTO = Type.Object({
  id: Type.String(),
  groupName: Type.String(),
  name: Type.String(),
});

export const deleteApiResponseDTO = Type.Object({
  code: Type.Number(),
  data: deleteApiItemResponseDTO,
});

export type CreateApiRequestBody = Static<typeof createApiItemRequestBodyDTO>;

export type CreateApiItemResponse = Static<typeof createApiItemResponseDTO>;

export type CreateApiResponse = Static<typeof createApiResponseDTO>;

export type GetApisQuery = Static<typeof getApisQueryDTO>;

export type GetApiResponse = Static<typeof apiItemOutputDTO>;

export type GetApisResponse = Static<typeof getApisResponseDTO>;

export type GetApiParams = Static<typeof getApiParamsDTO>;

export type GetApiByIdResponse = Static<typeof getApiByIdResponseDTO>;

export type UpdateApiParams = Static<typeof updateApiParamsDTO>;

export type UpdateApiBody = Static<typeof updateApiBodyDTO>;

export type UpdateApiItemResponse = Static<typeof updateApiItemResponseDTO>;

export type UpdateApiResponse = Static<typeof updateApiResponseDTO>;

export type DeleteApiParams = Static<typeof deleteApiParamsDTO>;

export type DeleteApiItemResponse = Static<typeof deleteApiItemResponseDTO>;

export type DeleteApiResponse = Static<typeof deleteApiResponseDTO>;
