import { Static, Type } from '@sinclair/typebox';
import { Nullable } from '../libs/utils/typebox';
import { paginationDTO } from './common.dto';

export const coopTypeItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  coopTypeCode: Type.String(),
  coopTypeName: Type.String(),
  status: Type.Boolean(),
});

export const userItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  userCode: Type.Optional(Type.String()),
  fullName: Type.Optional(Type.String()),
});

export const farmItemDTO = Type.Object({
  id: Type.String(),
  farmCode: Type.String(),
  farmName: Type.String(),
  owner: Type.Optional(userItemDTO),
  provinceId: Type.Number(),
  cityId: Type.Number(),
  districtId: Type.Number(),
  provinceName: Type.Optional(Type.String()),
  cityName: Type.Optional(Type.String()),
  districtName: Type.Optional(Type.String()),
  branchId: Type.Optional(Type.String()),
  status: Type.Boolean(),
});

export const coopItemDTO = Type.Object({
  id: Type.String(),
  coopCode: Type.String(),
  coopName: Type.String(),
  farmId: Type.String(),
  coopTypeId: Type.String(),
  coopType: Type.Optional(coopTypeItemDTO),
  chickTypeId: Type.String(),
  mm: Type.Optional(userItemDTO),
  status: Type.Boolean(),
});

export const summaryItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  dailyIssue: Type.Optional(Type.String()),
  summary: Type.Optional(Type.String()),
  day: Type.Optional(Type.Number()),
});

export const dailyPerformanceItemDTO = Type.Object({
  id: Type.String(),
  farmingCycleCode: Type.String(),
  chickInDate: Type.Optional(Type.String()),
  farmingCycleStartDate: Type.String(),
  initialPopulation: Type.Number(),
  initialFeedStock: Type.Optional(Type.Number()),
  chickSupplier: Type.Optional(Type.String()),
  hatchery: Type.Optional(Type.String()),
  cycleStatus: Type.Boolean(),
  farmingStatus: Type.String(),
  age: Type.Number(),
  remarks: Type.String(),
  farm: Type.Optional(farmItemDTO),
  coop: Type.Optional(coopItemDTO),
  userPpl: Type.Optional(userItemDTO),
  summary: Type.Optional(summaryItemDTO),
});

export const getDailyPerformanceQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
  farmingCycleCode: Type.Optional(Type.String()),
  farmingStatus: Type.Optional(Type.String()),
  ownerId: Type.Optional(Type.String()),
  farmId: Type.Optional(Type.String()),
  coopId: Type.Optional(Type.String()),
  summary: Type.Optional(Type.String()),
  branchId: Type.Optional(Type.String()),
  provinceId: Type.Optional(Type.Number()),
  cityId: Type.Optional(Type.Number()),
  districtId: Type.Optional(Type.Number()),
  pplId: Type.Optional(Type.String()),
});

export const getDailyPerformanceResponseItemDTO = Type.Object({
  ...dailyPerformanceItemDTO.properties,
});

export const getDailyPerformanceResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(getDailyPerformanceResponseItemDTO),
});

export const getDailyPerformanceSummaryParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const actualAndStandardDTO = Type.Object({
  actual: Nullable(Type.Number()),
  standard: Nullable(Type.Number()),
});

export const getDailyPerformanceSummaryResponseItemDTO = Type.Object({
  farm: Type.Object({
    owner: Type.String(),
    coop: Type.Object({
      name: Type.String(),
      type: Type.String(),
      contractType: Nullable(Type.String()),
      mm: Nullable(userItemDTO),
      ppl: Nullable(Type.Array(userItemDTO)),
      branch: Nullable(
        Type.Object({
          name: Nullable(Type.String()),
          province: Type.Object({
            name: Type.String(),
          }),
          city: Type.Object({
            name: Type.String(),
          }),
          district: Type.Object({
            name: Type.String(),
          }),
        }),
      ),
    }),
  }),
  doc: Type.Object({
    supplier: Nullable(Type.String()),
    hatchery: Nullable(Type.String()),
    uniformity: Nullable(Type.Number()),
    bw: Nullable(Type.Number()),
    arrivalTime: Nullable(Type.String()),
    recordingTime: Nullable(Type.String()),
    summary: Nullable(Type.String()),
  }),
  feed: Type.Object({
    prestarter: Nullable(Type.String()),
    starter: Nullable(Type.String()),
    finisher: Nullable(Type.String()),
  }),
  issues: Type.Object({
    date: Type.String(),
    infrastructure: Type.Array(Type.String()),
    management: Type.Array(Type.String()),
    farmInput: Type.Array(Type.String()),
    diseases: Type.Array(Type.String()),
    forceMajeure: Type.Array(Type.String()),
    others: Type.Array(Type.String()),
  }),
  performance: Type.Object({
    age: Nullable(Type.Number()),
    population: Type.Object({
      initial: Nullable(Type.Number()),
      current: Nullable(Type.Number()),
    }),
    bw: actualAndStandardDTO,
    mortality: actualAndStandardDTO,
    fcr: actualAndStandardDTO,
    ip: actualAndStandardDTO,
    bwDayEight: Nullable(Type.Number()),
  }),
});

export const getDailyPerformanceSummaryResponseDTO = Type.Object({
  code: Type.Number(),
  data: getDailyPerformanceSummaryResponseItemDTO,
});

export const getDailyPerformanceDetailParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const getDailyPerformanceDetailItemDTO = Type.Object({
  taskTicketId: Type.String(),
  dailyPerformanceId: Nullable(Type.String()),
  date: Type.String(),
  day: Type.Number(),
  status: Type.String(),
  yellowCardImages: Nullable(
    Type.Array(
      Type.Object({
        id: Type.Optional(Type.String()),
        url: Type.String(),
      }),
    ),
  ),
  feed: Nullable(Type.Number()),
  dead: Nullable(Type.Number()),
  culled: Nullable(Type.Number()),
  summary: Nullable(Type.String()),
  bw: actualAndStandardDTO,
  adg: actualAndStandardDTO,
  growth: actualAndStandardDTO,
  mortality: actualAndStandardDTO,
  mortalityCummulative: actualAndStandardDTO,
  population: Type.Object({
    total: Nullable(Type.Number()),
    remaining: Nullable(Type.Number()),
    harvested: Nullable(Type.Number()),
    dailyHarvest: Nullable(Type.Number()),
    dead: Nullable(Type.Number()),
  }),
  feedIntake: actualAndStandardDTO,
  feedConsumption: actualAndStandardDTO,
  fcr: actualAndStandardDTO,
  ip: actualAndStandardDTO,
  issues: Type.Object({
    infrastructure: Type.Array(Type.String()),
    management: Type.Array(Type.String()),
    farmInput: Type.Array(Type.String()),
    diseases: Type.Array(Type.String()),
    forceMajeure: Type.Array(Type.String()),
    others: Nullable(Type.String()),
  }),
  treatment: Type.Array(Type.String()),
});

export const getDailyPerformanceDetailResponseDTO = Type.Object({
  code: Type.Number(),
  data: Type.Array(getDailyPerformanceDetailItemDTO),
});

export const saveDailyPerformanceDetailsParamsDTO = Type.Object({
  farmingCycleId: Type.String(),
});

export const saveDailyPerformanceDetailItemDTO = Type.Object({
  taskTicketId: Type.String(),
  dailyPerformanceId: Nullable(Type.String()),
  bw: Nullable(Type.Number()),
  feed: Nullable(Type.Number()),
  dead: Nullable(Type.Number()),
  culled: Nullable(Type.Number()),
  yellowCardImages: Nullable(
    Type.Array(
      Type.Object({
        id: Type.Optional(Type.String()),
        url: Type.String(),
      }),
    ),
  ),
  summary: Nullable(Type.String()),
  issues: Type.Object({
    infrastructure: Type.Array(Type.String()),
    management: Type.Array(Type.String()),
    farmInput: Type.Array(Type.String()),
    diseases: Type.Array(Type.String()),
    forceMajeure: Type.Array(Type.String()),
    others: Nullable(Type.String()),
  }),
  treatment: Type.Array(Type.String()),
  feedAdditionalInfo: Type.Optional(Type.String()),
});

export const saveDailyPerformanceDetailBodyDTO = Type.Array(saveDailyPerformanceDetailItemDTO);

export type DailyPerformanceSummaryItem = Static<typeof summaryItemDTO>;

export type DailyPerformanceItem = Static<typeof dailyPerformanceItemDTO>;

export type GetDailyPerformanceQuery = Static<typeof getDailyPerformanceQueryDTO>;

export type GetDailyPerformanceResponseItem = Static<typeof getDailyPerformanceResponseItemDTO>;

export type GetDailyPerformanceResponse = Static<typeof getDailyPerformanceResponseDTO>;

export type GetDailyPerformanceSummaryParams = Static<typeof getDailyPerformanceSummaryParamsDTO>;

export type GetDailyPerformanceSummaryResponseItem = Static<
  typeof getDailyPerformanceSummaryResponseItemDTO
>;

export type GetDailyPerformanceSummaryResponse = Static<
  typeof getDailyPerformanceSummaryResponseDTO
>;

export type GetDailyPerformanceDetailParams = Static<typeof getDailyPerformanceDetailParamsDTO>;

export type GetDailyPerformanceDetailItem = Static<typeof getDailyPerformanceDetailItemDTO>;

export type GetDailyPerformanceDetailResponse = Static<typeof getDailyPerformanceDetailResponseDTO>;

export type SaveDailyPerformanceDetailsParams = Static<typeof saveDailyPerformanceDetailsParamsDTO>;

export type SaveDailyPerformanceDetailItem = Static<typeof saveDailyPerformanceDetailItemDTO>;

export type SaveDailyPerformanceDetailBody = Static<typeof saveDailyPerformanceDetailBodyDTO>;
