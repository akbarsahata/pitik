/* eslint-disable no-unused-vars */
import { Static, Type } from '@sinclair/typebox';

export const weighingSummaryDTO = Type.Object({
  id: Type.String(),
  day: Type.Integer(),
  currentPopulation: Type.Integer(),
  totalCount: Type.Integer(),
  countPopulationPercentage: Type.Number(),
  avgWeight: Type.Number(),
  date: Type.String({ format: 'date-time' }),
});

export const smartScaleWeighingDDTO = Type.Object({
  id: Type.String(),
  section: Type.Integer(),
  totalCount: Type.Integer(),
  totalWeight: Type.Number(),
});

export const weighingListResponseDTO = Type.Object({
  data: Type.Array(weighingSummaryDTO),
  count: Type.Integer(),
});

export const weighingDetailResponseDTO = Type.Object({
  data: Type.Object({
    id: Type.String(),
    day: Type.Integer(),
    currentPopulation: Type.Integer(),
    totalCount: Type.Integer(),
    countPopulationPercentage: Type.Number(),
    avgWeight: Type.Number(),
    date: Type.String({ format: 'date-time' }),
    details: Type.Array(smartScaleWeighingDDTO),
  }),
});

export const weighingListParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const weighingDetailParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
  date: Type.String({ format: 'date' }),
});

export const weighingBodyDTO = Type.Object({
  date: Type.String(),
  details: Type.Array(
    Type.Object({
      section: Type.Integer(),
      totalCount: Type.Integer(),
      totalWeight: Type.Number(),
    }),
  ),
});

export const createWeighingBodyDTO = Type.Object({
  data: Type.Array(weighingBodyDTO),
});

export const createWeighingResponseDTO = Type.Object({
  data: Type.Array(Type.String()),
});

export type WeighingListResponse = Static<typeof weighingListResponseDTO>;

export type WeighingDetailResponse = Static<typeof weighingDetailResponseDTO>;

export type WeighingListParams = Static<typeof weighingListParamsDTO>;

export type WeighingDetailParams = Static<typeof weighingDetailParamsDTO>;

export type WeighingSummary = Static<typeof weighingSummaryDTO>;

export type WeighingBody = Static<typeof weighingBodyDTO>;

export type CreateWeighingBody = Static<typeof createWeighingBodyDTO>;

export type CreateWeighingResponse = Static<typeof createWeighingResponseDTO>;
