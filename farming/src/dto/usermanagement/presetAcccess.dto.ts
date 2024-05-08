import { Static, Type } from '@sinclair/typebox';
import { paginationDTO } from './common.dto';

export const presetAccessItemDTO = Type.Object({
  presetName: Type.String(),
  presetType: Type.KeyOf(
    Type.Object({
      ROLE: Type.String(),
      PRIVILEGE: Type.String(),
    }),
  ),
  presetAccessD: Type.Array(
    Type.Object({
      apiId: Type.String(),
    }),
  ),
});

export const presetAccessItemOutputDTO = Type.Object({
  id: Type.String(),
  ...Type.Partial(presetAccessItemDTO).properties,
  createdDate: Type.String(),
  createdBy: Type.String(),
  modifiedDate: Type.Optional(Type.String()),
  modifiedBy: Type.Optional(Type.String()),
});

export const createPresetAccessItemRequestBodyDTO = Type.Object({
  ...presetAccessItemDTO.properties,
});

export const createPresetAccessItemResponseDTO = Type.Object({
  ...presetAccessItemDTO.properties,
  presetAccessD: Type.Optional(
    Type.Array(
      Type.Object({
        presetId: Type.Optional(Type.String()),
        apiId: Type.String(),
      }),
    ),
  ),
  createdBy: Type.Optional(Type.String()),
  createdDate: Type.Optional(Type.String()),
});

export const createPresetAccessResponseDTO = Type.Object({
  code: Type.Number(),
  data: createPresetAccessItemResponseDTO,
});

export const getPresetAccesssQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  presetName: Type.Optional(Type.String()),
  presetType: Type.Optional(
    Type.KeyOf(
      Type.Object({
        ROLE: Type.String(),
        PRIVILEGE: Type.String(),
      }),
    ),
  ),
});

export const getPresetAccesssResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(presetAccessItemOutputDTO),
});

export const getPresetAccessParamsDTO = Type.Object({
  presetAccessId: Type.String(),
});

export const getPresetAccessByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: presetAccessItemOutputDTO,
});

export const updatePresetAccessParamsDTO = Type.Object({
  presetAccessId: Type.String(),
});

export const updatePresetAccessBodyDTO = Type.Object({
  ...Type.Partial(presetAccessItemDTO).properties,
});

export const updatePresetAccessItemResponseDTO = Type.Object({
  ...presetAccessItemOutputDTO.properties,
  modifiedBy: Type.String(),
  modifiedDate: Type.String(),
});

export const updatePresetAccessResponseDTO = Type.Object({
  code: Type.Number(),
  data: updatePresetAccessItemResponseDTO,
});

export const deletePresetAccessParamsDTO = Type.Object({
  presetAccessId: Type.String(),
});

export const deletePresetAccessResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.String(),
});

export const applyPresetAccessParamsDTO = Type.Object({
  presetAccessId: Type.String(),
});

export const applyPresetAccessBodyDTO = Type.Object({
  presetType: Type.String(),
  roleId: Type.Optional(Type.String()),
  userId: Type.Optional(Type.String()),
  expirationDate: Type.Optional(Type.String()),
});

export const applyPresetAccessItemResponseDTO = Type.Object({
  success: Type.Boolean(),
  message: Type.String(),
});

export const applyPresetAccessResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    message: Type.String(),
  }),
});

export type CreatePresetAccessRequestBody = Static<typeof createPresetAccessItemRequestBodyDTO>;

export type CreatePresetAccessItemResponse = Static<typeof createPresetAccessItemResponseDTO>;

export type CreatePresetAccessResponse = Static<typeof createPresetAccessResponseDTO>;

export type GetPresetAccesssQuery = Static<typeof getPresetAccesssQueryDTO>;

export type GetPresetAccessResponse = Static<typeof presetAccessItemOutputDTO>;

export type GetPresetAccesssResponse = Static<typeof getPresetAccesssResponseDTO>;

export type GetPresetAccessParams = Static<typeof getPresetAccessParamsDTO>;

export type GetPresetAccessByIdResponse = Static<typeof getPresetAccessByIdResponseDTO>;

export type UpdatePresetAccessParams = Static<typeof updatePresetAccessParamsDTO>;

export type UpdatePresetAccessBody = Static<typeof updatePresetAccessBodyDTO>;

export type UpdatePresetAccessItemResponse = Static<typeof updatePresetAccessItemResponseDTO>;

export type UpdatePresetAccessResponse = Static<typeof updatePresetAccessResponseDTO>;

export type DeletePresetAccessParams = Static<typeof deletePresetAccessParamsDTO>;

export type DeletePresetAccessResponse = Static<typeof deletePresetAccessResponseDTO>;

export type ApplyPresetAccessRequestParams = Static<typeof applyPresetAccessParamsDTO>;

export type ApplyPresetAccessRequestBody = Static<typeof applyPresetAccessBodyDTO>;

export type ApplyPresetAccessItemResponse = Static<typeof applyPresetAccessItemResponseDTO>;

export type ApplyPresetAccessResponse = Static<typeof applyPresetAccessResponseDTO>;
