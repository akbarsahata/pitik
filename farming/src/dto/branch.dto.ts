import { Static, Type } from '@sinclair/typebox';
import { areaItemDTO } from './area.dto';
import { cityItemDTO } from './city.dto';

export const branchUpsertBodyDTO = Type.Object({
  branchCode: Type.String(),
  branchName: Type.String(),
  areaCode: Type.String(),
  areaName: Type.String(),
  isActive: Type.Boolean({ default: false }),
  cityIds: Type.Optional(Type.Array(Type.Number(), { default: [] })),
});

export const branchItemDTO = Type.Object({
  id: Type.String(),
  seqNo: Type.Number(),
  code: Type.String(),
  name: Type.String(),
  areaId: Type.String(),
  isActive: Type.Boolean(),
  area: areaItemDTO,
  cities: Type.Optional(Type.Array(cityItemDTO, { default: [] })),
});

export const branchListDTO = Type.Array(branchItemDTO);

export const branchListResponseDTO = Type.Object({
  data: branchListDTO,
});

export const branchUpsertResponseDTO = Type.Object({
  data: Type.Object({
    id: Type.String(),
    ...branchUpsertBodyDTO.properties,
  }),
});

export type BranchUpsertBody = Static<typeof branchUpsertBodyDTO>;

export type BranchItem = Static<typeof branchItemDTO>;

export type BranchList = Static<typeof branchListDTO>;

export type BranchListResponse = Static<typeof branchListResponseDTO>;

export type BranchUpsertResponse = Static<typeof branchUpsertResponseDTO>;
