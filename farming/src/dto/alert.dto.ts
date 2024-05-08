import { Static, Type } from '@sinclair/typebox';
import { paginationDTO } from './common.dto';

export const alertItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  alertCode: Type.String(),
  alertName: Type.String(),
  alertDescription: Type.Optional(Type.String()),
  eligibleManual: Type.Boolean(),
  status: Type.Boolean(),
  remarks: Type.Optional(Type.String()),
});

export const getAlertQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  alertCode: Type.Optional(Type.String()),
  alertName: Type.Optional(Type.String()),
  eligibleManual: Type.Optional(Type.Boolean()),
  status: Type.Optional(Type.Boolean()),
});

export const getAlertResponseItemDTO = Type.Object({
  ...alertItemDTO.properties,
  modifiedBy: Type.String(),
  modifiedDate: Type.Optional(Type.String()),
});

export const getAlertResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getAlertResponseItemDTO),
});

export const getAlertByIdParamsDTO = Type.Object({
  id: Type.String(),
});

export const getAlertByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: getAlertResponseItemDTO,
});

export const alertSummaryItemDTO = Type.Object({
  id: Type.String(),
  title: Type.String(),
  timestamp: Type.String({ format: 'date-time' }),
});

export const alertSummaryResponseDTO = Type.Object({
  data: Type.Array(alertSummaryItemDTO),
  count: Type.Integer(),
});

export const alertSummaryQueryDTO = Type.Object({
  ...paginationDTO.properties,
});

export const alertSummaryParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const alertTaskItemDTO = Type.Object({
  id: Type.String(),
  instruction: Type.String(),
});

export const alertDetailDTO = Type.Object({
  id: Type.String(),
  title: Type.String(),
  description: Type.String(),
  timestamp: Type.String({ format: 'date-time' }),
  addToTask: Type.Boolean(),
  tasks: Type.Array(alertTaskItemDTO),
});

export const alertDetailResponseDTO = Type.Object({
  data: alertDetailDTO,
});

export const alertDetailParamsDTO = Type.Object({
  id: Type.String(),
});

export const alertToTaskBodyDTO = Type.Object({
  ...alertDetailDTO.properties,
  addToTask: Type.Optional(Type.Boolean()),
});

export const alertToTaskParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const alertToTaskDTO = Type.Object({
  tasks: Type.Array(
    Type.Object({
      id: Type.String(),
    }),
  ),
});

export const alertToTaskResponseDTO = Type.Object({
  data: alertToTaskDTO,
});

export type AlertItem = Static<typeof alertItemDTO>;

export type GetAlertQuery = Static<typeof getAlertQueryDTO>;

export type GetAlertResponseItem = Static<typeof getAlertResponseItemDTO>;

export type GetAlertResponse = Static<typeof getAlertResponseDTO>;

export type GetAlertByIdParams = Static<typeof getAlertByIdParamsDTO>;

export type GetAlertByIdResponse = Static<typeof getAlertByIdResponseDTO>;

export type AlertSummaryItem = Static<typeof alertSummaryItemDTO>;

export type AlertSummaryResponse = Static<typeof alertSummaryResponseDTO>;

export type AlertSummaryQuery = Static<typeof alertSummaryQueryDTO>;

export type AlertSummaryParams = Static<typeof alertSummaryParamsDTO>;

export type AlertTaskItem = Static<typeof alertTaskItemDTO>;

export type AlertDetail = Static<typeof alertDetailDTO>;

export type AlertDetailResponse = Static<typeof alertDetailResponseDTO>;

export type AlertDetailParams = Static<typeof alertDetailParamsDTO>;

export type AlertToTaskBody = Static<typeof alertToTaskBodyDTO>;

export type AlertToTaskParams = Static<typeof alertToTaskParamsDTO>;

export type AlertToTask = Static<typeof alertToTaskDTO>;

export type AlertToTaskResponse = Static<typeof alertToTaskResponseDTO>;
