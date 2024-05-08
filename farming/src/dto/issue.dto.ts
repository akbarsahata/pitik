/* eslint-disable no-unused-vars */
import { Static, Type } from '@sinclair/typebox';
import { paginationDTO } from './common.dto';

export enum IssueStatusEnum {
  NEW = 'new',
  SOLVED = 'solved',
}

export const issuePhotoDTO = Type.Object({
  id: Type.Optional(Type.String()),
  url: Type.String({ format: 'uri' }),
});

export const issueItemDTO = Type.Object({
  dayNum: Type.Integer(),
  date: Type.String({ format: 'date-time' }),
  description: Type.String(),
  issueTypeId: Type.String(),
  issueTypeName: Type.String(),
  status: Type.Enum(IssueStatusEnum),
  remarks: Type.Optional(Type.String()),
  photoValue: Type.Array(issuePhotoDTO),
});

export const issueResponseDTO = Type.Object({
  data: Type.Array(issueItemDTO),
  count: Type.Integer(),
});

export const issueQueryDTO = Type.Object({
  ...paginationDTO.properties,
});

export const issueParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const issueTypeItemDTO = Type.Object({
  id: Type.String(),
  text: Type.String(),
});

export const issueTypeResponseDTO = Type.Object({
  data: Type.Array(issueTypeItemDTO),
});

export const createIssueBodyDTO = Type.Object({
  farmingCycleId: Type.String(),
  description: Type.String(),
  issueTypeId: Type.String(),
  photoValue: Type.Array(
    Type.Object({
      id: Type.Optional(Type.String()),
      url: Type.String({ format: 'uri' }),
    }),
  ),
});

export const createIssueResponseDTO = Type.Object({
  data: Type.Object({
    id: Type.String(),
  }),
});

export type IssuePhoto = Static<typeof issuePhotoDTO>;

export type IssueItem = Static<typeof issueItemDTO>;

export type IssueResponse = Static<typeof issueResponseDTO>;

export type IssueQuery = Static<typeof issueQueryDTO>;

export type IssueParams = Static<typeof issueParamsDTO>;

export type IssueTypeItem = Static<typeof issueTypeItemDTO>;

export type IssueTypeResponse = Static<typeof issueTypeResponseDTO>;

export type CreateIssueBody = Static<typeof createIssueBodyDTO>;

export type CreateIssueResponse = Static<typeof createIssueResponseDTO>;
