import { Static, Type } from '@sinclair/typebox';
import { paginationDTO } from './common.dto';

export const feedbrandItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  feedbrandCode: Type.String(),
  feedbrandName: Type.String(),
  status: Type.Boolean(),
  remarks: Type.Optional(Type.String()),
});

export const getFeedbrandQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  feedbrandCode: Type.Optional(Type.String()),
  feedbrandName: Type.Optional(Type.String()),
  status: Type.Optional(Type.Boolean()),
});

export const getFeedbrandResponseItemDTO = Type.Object({
  ...feedbrandItemDTO.properties,
  modifiedBy: Type.String(),
  modifiedDate: Type.Optional(Type.String()),
});

export const getFeedbrandResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getFeedbrandResponseItemDTO),
});

export type FeedbrandItem = Static<typeof feedbrandItemDTO>;

export type GetFeedbrandQuery = Static<typeof getFeedbrandQueryDTO>;

export type GetFeedbrandResponseItem = Static<typeof getFeedbrandResponseItemDTO>;

export type GetFeedbrandResponse = Static<typeof getFeedbrandResponseDTO>;
