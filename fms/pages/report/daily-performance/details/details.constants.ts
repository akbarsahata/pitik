import {
  TDailyPerformanceDetailsResponse,
  TDailyPerformanceSummaryResponse,
} from "@type/response.type";

export enum ACTION_TYPE {
  SET_SUMMARY_DATA = "SET_SUMMARY_DATA",
  SET_DETAILS_DATA = "SET_DETAILS_DATA",
}

export const summary: TDailyPerformanceSummaryResponse = {
  farm: {
    owner: "",
    coop: {
      name: "",
      type: "",
      contractType: "",
      mm: {
        id: "",
        userCode: "",
        fullName: "",
      },
      ppl: [],
      branch: {
        name: "",
        province: {
          name: "",
        },
        city: {
          name: "",
        },
        district: {
          name: "",
        },
      },
    },
  },
  doc: {
    supplier: "",
    hatchery: "",
    uniformity: null,
    bw: null,
    arrivalTime: "",
    recordingTime: "",
    summary: "",
  },
  feed: {
    prestarter: "",
    starter: "",
    finisher: "",
  },
  issues: {
    date: "",
    infrastructure: [],
    management: [],
    farmInput: [],
    diseases: [],
    forceMajeure: [],
    others: [],
  },
  performance: {
    age: null,
    population: {
      initial: null,
      current: null,
    },
    bw: {
      actual: null,
      standard: null,
    },
    mortality: {
      actual: null,
      standard: null,
    },
    fcr: {
      actual: null,
      standard: null,
    },
    ip: {
      actual: null,
      standard: null,
    },
    bwDayEight: null,
  },
};

export const details: TDailyPerformanceDetailsResponse = {
  taskTicketId: "",
  dailyPerformanceId: "",
  id: "",
  date: "",
  day: undefined,
  status: "",
  yellowCardImages: null,
  feed: null,
  ovk: null,
  dead: null,
  culled: null,
  summary: "",
  bw: {
    actual: null,
    standard: null,
  },
  adg: {
    actual: null,
    standard: null,
  },
  growth: {
    actual: null,
    standard: null,
  },
  mortality: {
    actual: null,
    standard: null,
  },
  mortalityCummulative: {
    actual: null,
    standard: null,
  },
  population: {
    total: null,
    remaining: null,
    harvested: null,
    dailyHarvest: null,
    dead: null,
  },
  feedIntake: {
    actual: null,
    standard: null,
  },
  feedConsumption: {
    actual: null,
    standard: null,
  },
  fcr: {
    actual: null,
    standard: null,
  },
  ip: {
    actual: null,
    standard: null,
  },
  issues: {
    infrastructure: [],
    management: [],
    farmInput: [],
    diseases: [],
    forceMajeure: [],
    others: "",
  },
  treatment: [],
};

export type TStore = {
  summaryData: TDailyPerformanceSummaryResponse;
  detailsData: TDailyPerformanceDetailsResponse[];
};

export const store: TStore = {
  summaryData: summary,
  detailsData: [],
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_SUMMARY_DATA; payload: typeof store.summaryData }
  | { type: ACTION_TYPE.SET_DETAILS_DATA; payload: typeof store.detailsData };
