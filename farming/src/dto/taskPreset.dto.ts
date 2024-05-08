import { Static, Type } from '@sinclair/typebox';
import { paginationDTO } from './common.dto';
import { taskItemDTO } from './task.dto';

export const taskPresetItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  taskPresetCode: Type.String(),
  taskPresetName: Type.String(),
  presetType: Type.Optional(Type.String()),
  status: Type.Boolean(),
  remarks: Type.Optional(Type.String()),
});

export const coopTypeItemDTO = Type.Object({
  id: Type.String(),
  coopTypeCode: Type.String(),
  coopTypeName: Type.String(),
});

export const getTaskPresetQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  coopTypeId: Type.Optional(Type.String()),
  taskPresetCode: Type.Optional(Type.String()),
  taskPresetName: Type.Optional(Type.String()),
  status: Type.Optional(Type.Boolean()),
});

export const getTaskPresetResponseItemDTO = Type.Object({
  ...taskPresetItemDTO.properties,
  coopType: Type.Optional(coopTypeItemDTO),
  modifiedBy: Type.String(),
  modifiedDate: Type.Optional(Type.String()),
});

export const createTaskPresetResponseItemDTO = Type.Object({
  ...taskPresetItemDTO.properties,
  coopType: Type.Optional(coopTypeItemDTO),
  createdBy: Type.String(),
  createdDate: Type.Optional(Type.String()),
});

export const getTaskPresetResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getTaskPresetResponseItemDTO),
});

export const getTaskPresetByIdParamsDTO = Type.Object({
  id: Type.String(),
});

export const getTaskPresetByIdResponseItemDTO = Type.Object({
  ...taskPresetItemDTO.properties,
  coopType: Type.Optional(coopTypeItemDTO),
  coopTypeId: Type.String(),
  modifiedBy: Type.String(),
  modifiedDate: Type.Optional(Type.String()),
  tasks: Type.Array(taskItemDTO),
});

export const getTaskPresetByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: getTaskPresetByIdResponseItemDTO,
});

export const createTaskPresetBodyDTO = Type.Object({
  ...taskPresetItemDTO.properties,
  coopTypeId: Type.String(),
  taskIds: Type.Optional(Type.Array(Type.String())),
});

export const createTaskPresetResponseDTO = Type.Object({
  code: Type.Number(),
  data: createTaskPresetResponseItemDTO,
});

export const updateTaskPresetParamsDTO = Type.Object({
  id: Type.String(),
});

export const updateTaskPresetBodyDTO = Type.Object({
  id: Type.Optional(Type.String()),
  taskPresetCode: Type.String(),
  taskPresetName: Type.String(),
  status: Type.Boolean(),
  remarks: Type.String(),
  coopTypeId: Type.String(),
  taskIds: Type.Array(Type.String()),
});

export const updateTaskPresetResponseDTO = Type.Object({
  code: Type.Number(),
  data: getTaskPresetResponseItemDTO,
});

export type TaskPresetItem = Static<typeof taskPresetItemDTO>;

export type GetTaskPresetQuery = Static<typeof getTaskPresetQueryDTO>;

export type GetTaskPresetResponseItem = Static<typeof getTaskPresetResponseItemDTO>;

export type GetTaskPresetResponse = Static<typeof getTaskPresetResponseDTO>;

export type GetTaskPresetByIdParams = Static<typeof getTaskPresetByIdParamsDTO>;

export type GetTaskPresetByIdResponse = Static<typeof getTaskPresetByIdResponseDTO>;

export type CreateTaskPresetBody = Static<typeof createTaskPresetBodyDTO>;

export type CreateTaskPresetResponse = Static<typeof createTaskPresetResponseDTO>;

export type UpdateTaskPresetParams = Static<typeof updateTaskPresetParamsDTO>;

export type UpdateTaskPresetBody = Static<typeof updateTaskPresetBodyDTO>;

export type UpdateTaskPresetResponse = Static<typeof updateTaskPresetResponseDTO>;
