import { Static, Type } from '@sinclair/typebox';
import { benchmarkedDTO, paginationDTO, targettedDTO } from './common.dto';

export const performanceProjectionGraphDTO = Type.Object({
  current: benchmarkedDTO,
  projected: benchmarkedDTO,
});

export const performanceHistoryItemDTO = Type.Object({
  day: Type.Number(),
  date: Type.String({ format: 'date' }),
  estimatedPopulation: Type.Number(),
  fcr: Type.Number(),
  abw: Type.Number(),
  mortality: Type.Number(),
  feedConsumption: Type.Number(),
});

export const performanceHistoryDTO = Type.Object({
  data: Type.Array(performanceHistoryItemDTO),
  count: Type.Number(),
});

export const performanceActualDTO = Type.Object({
  data: Type.Object({
    date: Type.String({ format: 'date' }),
    abw: targettedDTO,
    mortality: targettedDTO,
    feedConsumption: targettedDTO,
    cycle: Type.Object({
      fcr: Type.Number(),
      mortality: Type.Number(),
      ipProjection: Type.Number(),
    }),
  }),
});

export const performanceProjectionTopGraphDTO = Type.Object({
  topGraph: performanceProjectionGraphDTO,
});

export const performanceProjectionDTO = Type.Object({
  data: Type.Object({
    weight: performanceProjectionTopGraphDTO,
    fcr: performanceProjectionTopGraphDTO,
    mortality: performanceProjectionTopGraphDTO,
  }),
});

export const performanceQueryDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const performanceHistoryQueryDTO = Type.Object({
  farmingCycleId: Type.String(),
  ...paginationDTO.properties,
});

export type PerformanceProjectionGraph = Static<typeof performanceProjectionGraphDTO>;

export type PerformanceProjectionTopGraph = Static<typeof performanceProjectionTopGraphDTO>;

export type PerformanceActual = Static<typeof performanceActualDTO>;

export type PerformanceHistoryItem = Static<typeof performanceHistoryItemDTO>;

export type PerformanceHistory = Static<typeof performanceHistoryDTO>;

export type PerformanceProjection = Static<typeof performanceProjectionDTO>;

export type PerformanceQuery = Static<typeof performanceQueryDTO>;

export type PerformanceHistoryQuery = Static<typeof performanceHistoryQueryDTO>;
