import { Static, Type } from '@sinclair/typebox';
import { alertItemDTO } from './alert.dto';
import { paginationDTO } from './common.dto';

export const alertPresetItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  alertPresetCode: Type.String(),
  alertPresetName: Type.String(),
  presetType: Type.Optional(Type.String()),
  status: Type.Boolean(),
  remarks: Type.Optional(Type.String()),
});

export const coopTypeItemDTO = Type.Object({
  id: Type.String(),
  coopTypeCode: Type.String(),
  coopTypeName: Type.String(),
});

export const chickTypeItemDTO = Type.Object({
  id: Type.String(),
  chickTypeCode: Type.String(),
  chickTypeName: Type.String(),
});

export const getAlertPresetQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  coopTypeId: Type.Optional(Type.String()),
  chickTypeId: Type.Optional(Type.String()),
  alertPresetCode: Type.Optional(Type.String()),
  alertPresetName: Type.Optional(Type.String()),
  status: Type.Optional(Type.Boolean()),
});

export const getAlertPresetResponseItemDTO = Type.Object({
  ...alertPresetItemDTO.properties,
  coopType: Type.Optional(coopTypeItemDTO),
  chickType: Type.Optional(chickTypeItemDTO),
  modifiedBy: Type.Optional(Type.String()),
  modifiedDate: Type.Optional(Type.String()),
  createdBy: Type.Optional(Type.String()),
  createdDate: Type.Optional(Type.String()),
});

export const getAlertPresetResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getAlertPresetResponseItemDTO),
});

export const getAlertPresetByIdResponseItemDTO = Type.Object({
  ...getAlertPresetResponseItemDTO.properties,
  coopType: Type.Optional(coopTypeItemDTO),
  coopTypeId: Type.String(),
  modifiedBy: Type.String(),
  modifiedDate: Type.Optional(Type.String()),
  alerts: Type.Array(alertItemDTO),
});

export const getAlertPresetByIdParamsDTO = Type.Object({
  id: Type.String(),
});

export const getAlertPresetByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: getAlertPresetByIdResponseItemDTO,
});

export const createAlertPresetResponseItemDTO = Type.Object({
  ...alertPresetItemDTO.properties,
  coopType: Type.Optional(coopTypeItemDTO),
  chickType: Type.Optional(chickTypeItemDTO),
  createdBy: Type.Optional(Type.String()),
  createdDate: Type.Optional(Type.String()),
});

export const createAlertPresetBodyDTO = Type.Object({
  ...alertPresetItemDTO.properties,
  coopTypeId: Type.String(),
  chickTypeId: Type.Optional(Type.String()),
  alertIds: Type.Optional(Type.Array(Type.String())),
});

export const createAlertPresetResponseDTO = Type.Object({
  code: Type.Number(),
  data: createAlertPresetResponseItemDTO,
});

export const updateAlertPresetParamsDTO = Type.Object({
  id: Type.String(),
});

export const updateAlertPresetBodyDTO = Type.Object({
  id: Type.Optional(Type.String()),
  alertPresetCode: Type.String(),
  alertPresetName: Type.String(),
  status: Type.Boolean(),
  remarks: Type.String(),
  coopTypeId: Type.String(),
  chickTypeId: Type.Optional(Type.String()),
  alertIds: Type.Array(Type.String()),
});

export const updateAlertPresetResponseDTO = Type.Object({
  code: Type.Number(),
  data: getAlertPresetResponseItemDTO,
});

export type AlertPresetItem = Static<typeof alertPresetItemDTO>;

export type GetAlertPresetQuery = Static<typeof getAlertPresetQueryDTO>;

export type GetAlertPresetResponseItem = Static<typeof getAlertPresetResponseItemDTO>;

export type CreateAlertPresetResponseItem = Static<typeof createAlertPresetResponseItemDTO>;

export type GetAlertPresetResponse = Static<typeof getAlertPresetResponseDTO>;

export type GetAlertPresetByIdResponseItem = Static<typeof getAlertPresetByIdResponseItemDTO>;

export type GetAlertPresetByIdParams = Static<typeof getAlertPresetByIdParamsDTO>;

export type GetAlertPresetByIdResponse = Static<typeof getAlertPresetByIdResponseDTO>;

export type CreateAlertPresetBody = Static<typeof createAlertPresetBodyDTO>;

export type CreateAlertPresetResponse = Static<typeof createAlertPresetResponseDTO>;

export type UpdateAlertPresetParams = Static<typeof updateAlertPresetParamsDTO>;

export type UpdateAlertPresetBody = Static<typeof updateAlertPresetBodyDTO>;

export type UpdateAlertPresetResponse = Static<typeof updateAlertPresetResponseDTO>;
