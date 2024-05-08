import { Static, Type } from '@sinclair/typebox';
import { getTaskQueryDTO, taskItemDTO } from './task.dto';

export const taskTriggerDItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  day: Type.Number(),
  triggerTime: Type.String({ format: 'time' }),
  deadline: Type.Number(),
});

export const variableItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  variableCode: Type.Optional(Type.String()),
  variableName: Type.Optional(Type.String()),
  variableUOM: Type.Optional(Type.String()),
  variableType: Type.Optional(Type.String()),
  variableFormula: Type.Optional(Type.String()),
  digitComa: Type.Optional(Type.Number()),
  status: Type.Optional(Type.Boolean()),
  remarks: Type.Optional(Type.String()),
});

export const feedbrandItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  feedbrandCode: Type.Optional(Type.String()),
  feedbrandName: Type.Optional(Type.String()),
  status: Type.Optional(Type.Boolean()),
  remarks: Type.Optional(Type.String()),
});

export const taskFormDItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  instructionTitle: Type.Optional(Type.String()),
  dataRequired: Type.Optional(Type.Number()),
  dataInstruction: Type.Optional(Type.String()),
  dataType: Type.Optional(Type.String()),
  dataOption: Type.Optional(Type.String()),
  variable: Type.Optional(variableItemDTO),
  feedbrand: Type.Optional(feedbrandItemDTO),
  harvestQty: Type.Optional(Type.Number()),
  dataOperator: Type.Optional(Type.String()),
  photoRequired: Type.Optional(Type.Number()),
  photoInstruction: Type.Optional(Type.String()),
  videoRequired: Type.Optional(Type.Number()),
  videoInstruction: Type.Optional(Type.String()),
  needAdditionalDetail: Type.Optional(Type.Boolean()),
  additionalDetail: Type.Optional(Type.String()),
  checkDataCorrectness: Type.Optional(Type.Boolean()),
});

export const taskLibraryItemDTO = Type.Object({
  ...taskItemDTO.properties,
  triggers: Type.Optional(Type.Array(taskTriggerDItemDTO)),
  instructions: Type.Optional(Type.Array(Type.Optional(taskFormDItemDTO))),
});

export const getTaskLibraryQueryDTO = Type.Object({
  ...getTaskQueryDTO.properties,
});

export const getTaskLibraryResponseItemDTO = Type.Object({
  ...taskLibraryItemDTO.properties,
  modifiedBy: Type.String(),
  modifiedDate: Type.Optional(Type.String()),
});

export const getTaskLibraryResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getTaskLibraryResponseItemDTO),
});

export const getTaskLibraryByIdParamsDTO = Type.Object({
  id: Type.String(),
});

export const getTaskLibraryByIdResponseItemDTO = Type.Object({
  ...getTaskLibraryResponseItemDTO.properties,
});

export const getTaskLibraryByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: getTaskLibraryByIdResponseItemDTO,
});

export const createTaskLibraryResponseItemDTO = Type.Object({
  ...taskLibraryItemDTO.properties,
  createdBy: Type.String(),
  createdDate: Type.Optional(Type.String()),
});

export const createTaskFormDItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  instructionTitle: Type.String(),
  dataRequired: Type.Number(),
  dataInstruction: Type.Optional(Type.String()),
  dataType: Type.Optional(
    Type.KeyOf(
      Type.Object({
        text: Type.String(),
        numeric: Type.String(),
        option: Type.String(),
      }),
    ),
  ),
  dataOption: Type.Optional(Type.String()),
  variableId: Type.Optional(Type.String()),
  feedbrandId: Type.Optional(Type.String()),
  harvestQty: Type.Optional(Type.Number()),
  dataOperator: Type.Optional(Type.String()),
  photoRequired: Type.Number(),
  photoInstruction: Type.Optional(Type.String()),
  videoRequired: Type.Number(),
  videoInstruction: Type.Optional(Type.String()),
  needAdditionalDetail: Type.Optional(Type.Boolean()),
  additionalDetail: Type.Optional(Type.String()),
  checkDataCorrectness: Type.Optional(Type.Boolean()),
});

export const createTaskLibraryBodyDTO = Type.Object({
  ...taskItemDTO.properties,
  triggers: Type.Array(taskTriggerDItemDTO),
  instructions: Type.Array(createTaskFormDItemDTO),
});

export const createTaskLibraryResponseDTO = Type.Object({
  code: Type.Number(),
  data: createTaskLibraryResponseItemDTO,
});

export const updateTaskLibraryParamsDTO = Type.Object({
  id: Type.String(),
});

export const updateTaskLibraryBodyDTO = Type.Object({
  ...taskItemDTO.properties,
  triggers: Type.Array(taskTriggerDItemDTO),
  instructions: Type.Array(createTaskFormDItemDTO),
});

export const updateTaskLibraryResponseDTO = Type.Object({
  code: Type.Number(),
  data: getTaskLibraryResponseItemDTO,
});

export type TaskLibraryItem = Static<typeof taskLibraryItemDTO>;

export type GetTaskLibraryQuery = Static<typeof getTaskLibraryQueryDTO>;

export type TaskFormDItem = Static<typeof taskFormDItemDTO>;

export type GetTaskLibraryResponseItem = Static<typeof getTaskLibraryResponseItemDTO>;

export type GetTaskLibraryResponse = Static<typeof getTaskLibraryResponseDTO>;

export type GetTaskLibraryByIdParams = Static<typeof getTaskLibraryByIdParamsDTO>;

export type GetTaskLibraryByIdResponseItem = Static<typeof getTaskLibraryByIdResponseItemDTO>;

export type GetTaskLibraryByIdResponse = Static<typeof getTaskLibraryByIdResponseDTO>;

export type CreateTaskFormDItem = Static<typeof createTaskFormDItemDTO>;

export type CreateTaskLibraryBody = Static<typeof createTaskLibraryBodyDTO>;

export type CreateTaskLibraryResponse = Static<typeof createTaskLibraryResponseDTO>;

export type UpdateTaskLibraryParams = Static<typeof updateTaskLibraryParamsDTO>;

export type UpdateTaskLibraryBody = Static<typeof updateTaskLibraryBodyDTO>;

export type UpdateTaskLibraryResponse = Static<typeof updateTaskLibraryResponseDTO>;
