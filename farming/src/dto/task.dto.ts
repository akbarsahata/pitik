/* eslint-disable no-unused-vars */
import { Static, Type } from '@sinclair/typebox';
import { paginationDTO } from './common.dto';

export enum TaskSourceEnum {
  TASK = 'task',
  ALERT = 'alert',
  HARVEST = 'harvest',
}

export enum DataRequiredEnum {
  NOT_REQUIRED,
  REQUIRED,
  OPTIONAL,
}

export enum DataTypeEnum {
  noType = '',
  text = 'text',
  numeric = 'numeric',
  option = 'option',
}

export enum VerificationStatusEnum {
  NO_STATUS = '',
  VERIFYING = 'verifying',
  VERIFIED = 'verified',
}

export const taskItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  taskCode: Type.String(),
  taskName: Type.String(),
  harvestOnly: Type.Boolean(),
  manualTrigger: Type.Boolean(),
  manualDeadline: Type.Number(),
  instruction: Type.Optional(Type.String()),
  status: Type.Boolean(),
  remarks: Type.Optional(Type.String()),
});

export const getTaskQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  taskCode: Type.Optional(Type.String()),
  taskName: Type.Optional(Type.String()),
  harvestOnly: Type.Optional(Type.Boolean()),
  manualTrigger: Type.Optional(Type.Boolean()),
  manualDeadline: Type.Optional(Type.Number()),
  status: Type.Optional(Type.Boolean()),
});

export const getTaskResponseItemDTO = Type.Object({
  ...taskItemDTO.properties,
  modifiedBy: Type.String(),
  modifiedDate: Type.Optional(Type.String()),
});

export const getTaskResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getTaskResponseItemDTO),
});

export const getTaskByIdParamsDTO = Type.Object({
  id: Type.String(),
});

export const getTaskByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: getTaskResponseItemDTO,
});

export const taskSummaryItemDTO = Type.Object({
  id: Type.String(),
  title: Type.String(),
  instruction: Type.Optional(Type.String()),
  source: Type.Enum(TaskSourceEnum),
  date: Type.String({ format: 'date-time' }),
  verificationStatus: Type.String(), // Type.Enum(VerificationStatusEnum),
  potentialPoints: Type.Integer(),
  earnedPoints: Type.Integer(),
  isDailyReport: Type.Boolean({ default: false }),
});

export const taskSummaryResponseDTO = Type.Object({
  data: Type.Array(taskSummaryItemDTO),
  count: Type.Integer(),
});

export const taskSummaryQueryDTO = Type.Object({
  ...paginationDTO.properties,
});

export const taskSummaryParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const taskDetailParamsDTO = Type.Object({
  id: Type.String(),
});

export const taskMediaDTO = Type.Object({
  id: Type.Optional(Type.String()),
  url: Type.String({ format: 'uri' }),
});

export const taskThresholdDTO = Type.Object({
  min: Type.Optional(Type.Number()),
  max: Type.Optional(Type.Number()),
  strict: Type.Optional(Type.Boolean()),
});

export const taskFormItemDTO = Type.Object({
  id: Type.String(),
  title: Type.String(),
  additionalDetail: Type.String(),
  dataInstruction: Type.String(),
  dataRequired: Type.Enum(DataRequiredEnum),
  dataType: Type.KeyOf(
    Type.Object({
      '': Type.String(),
      text: Type.String(),
      numeric: Type.String(),
      option: Type.String(),
    }),
  ),
  dataOption: Type.Optional(Type.Array(Type.String())),
  dataValue: Type.String(),
  dataUOM: Type.String(),
  photoInstruction: Type.String(),
  photoRequired: Type.Enum(DataRequiredEnum),
  photoValue: Type.Array(taskMediaDTO),
  videoInstruction: Type.String(),
  videoRequired: Type.Enum(DataRequiredEnum),
  videoValue: Type.Array(taskMediaDTO),
  threshold: taskThresholdDTO,
});

export const taskDetailDTO = Type.Object({
  id: Type.String(),
  name: Type.String(),
  ticketCode: Type.String(),
  isExecuted: Type.Boolean(),
  instruction: Type.String(),
  potentialPoints: Type.Integer(),
  earnedPoints: Type.Integer(),
  needVerification: Type.Boolean(),
  isDailyReport: Type.Boolean({ default: false }),
  farmingCycleId: Type.Optional(Type.String()),
  detail: Type.Array(taskFormItemDTO),
});

export const taskDetailBodyDTO = Type.Object({
  ...taskDetailDTO.properties,
  ticketCode: Type.Optional(Type.String()),
  isExecuted: Type.Optional(Type.Boolean()),
  instruction: Type.Optional(Type.String()),
  potentialPoints: Type.Optional(Type.Integer()),
  earnedPoints: Type.Optional(Type.Integer()),
  needVerification: Type.Optional(Type.Boolean()),
});

export const taskDetailResponseDTO = Type.Object({
  data: taskDetailDTO,
});

export const getStatisticsParamDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const getStatisticsResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Object({
    late: Type.Number(),
    done: Type.Number(),
  }),
});

export type TaskItem = Static<typeof taskItemDTO>;

export type GetTaskQuery = Static<typeof getTaskQueryDTO>;

export type GetTaskResponseItem = Static<typeof getTaskResponseItemDTO>;

export type GetTaskResponse = Static<typeof getTaskResponseDTO>;

export type GetTaskByIdParams = Static<typeof getTaskByIdParamsDTO>;

export type GetTaskByIdResponse = Static<typeof getTaskByIdResponseDTO>;

export type TaskSummaryItem = Static<typeof taskSummaryItemDTO>;

export type TaskSummaryResponse = Static<typeof taskSummaryResponseDTO>;

export type TaskSummaryQuery = Static<typeof taskSummaryQueryDTO>;

export type TaskSummaryParams = Static<typeof taskSummaryParamsDTO>;

export type TaskDetailParams = Static<typeof taskDetailParamsDTO>;

export type TaskMedia = Static<typeof taskMediaDTO>;

export type TaskThreshold = Static<typeof taskThresholdDTO>;

export type TaskFormItem = Static<typeof taskFormItemDTO>;

export type TaskDetail = Static<typeof taskDetailDTO>;

export type TaskDetailBody = Static<typeof taskDetailBodyDTO>;

export type TaskDetailResponse = Static<typeof taskDetailResponseDTO>;

export type GetStatisticsParam = Static<typeof getStatisticsParamDTO>;

export type GetStatisticsResponse = Static<typeof getStatisticsResponseDTO>;
