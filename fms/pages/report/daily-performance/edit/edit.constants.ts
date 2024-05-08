import {
  TDailyPerformanceDetailsResponse,
  TDailyPerformanceImageResponse,
  TDailyPerformanceSummaryResponse,
  TFeedBrandResponse,
} from "@type/response.type";
import { summary } from "../details/details.constants";
import { IDropdownItem } from "@type/dropdown.interface";
import { randomHexString } from "@services/utils/string";

export enum ERROR_TYPE {
  NONE = "NONE",
  GENERAL = "GENERAL",
}

export enum ACTION_TYPE {
  SET_ERROR_TYPE = "SET_ERROR_TYPE",
  SET_ERROR_TEXT = "SET_ERROR_TEXT",
  SET_SUMMARY_DATA = "SET_SUMMARY_DATA",
  SET_DETAILS_DATA = "SET_DETAILS_DATA",
  SET_IS_MODAL_VISIBLE = "SET_IS_MODAL_VISIBLE",
  SET_IS_MODAL_FOR_FEED = "SET_IS_MODAL_FOR_FEED",
  SET_IS_MODAL_FOR_OVK = "SET_IS_MODAL_FOR_OVK",
  SET_FEEDBRAND_DATA = "SET_FEEDBRAND_DATA",
  SET_MODAL_DATA = "SET_MODAL_DATA",
}

export type TFeedDataPayload = {
  id?: string;
  feedBrand: IDropdownItem<TFeedBrandResponse> | null;
  totalConsumption: number | null;
};

export type TDailyPerformancePayload = {
  taskTicketId: string;
  dailyPerformanceId: string;
  bw: number | undefined;
  feed: number | undefined;
  dead: number | undefined;
  culled: number | undefined;
  yellowCardImages: TDailyPerformanceImageResponse[] | undefined;
  summary: string | undefined;
  issues: {
    infrastructure: string[];
    management: string[];
    farmInput: string[];
    diseases: string[];
    forceMajeure: string[];
    others: string | null;
  };
  treatment: string[] | undefined;
};

export type TProblemOther = {
  key: string;
  value: string;
};

export type TStore = {
  errorType: ERROR_TYPE;
  errorText: string;
  summaryData: TDailyPerformanceSummaryResponse;
  detailsData: TDailyPerformanceDetailsResponse[];
  isModalVisible: boolean;
  isModalForFeed: boolean;
  isModalForOvk: boolean;
  feedBrandData: TFeedBrandResponse[];
  records: TFeedDataPayload[];
};

export const store: TStore = {
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  summaryData: summary,
  detailsData: [],
  isModalVisible: false,
  isModalForFeed: false,
  isModalForOvk: false,
  feedBrandData: [],
  records: [
    {
      id: randomHexString(),
      feedBrand: null,
      totalConsumption: null,
    },
  ],
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_ERROR_TYPE; payload: typeof store.errorType }
  | { type: ACTION_TYPE.SET_ERROR_TEXT; payload: typeof store.errorText }
  | { type: ACTION_TYPE.SET_SUMMARY_DATA; payload: typeof store.summaryData }
  | { type: ACTION_TYPE.SET_DETAILS_DATA; payload: typeof store.detailsData }
  | {
      type: ACTION_TYPE.SET_IS_MODAL_VISIBLE;
      payload: typeof store.isModalVisible;
    }
  | {
      type: ACTION_TYPE.SET_IS_MODAL_FOR_FEED;
      payload: typeof store.isModalForFeed;
    }
  | {
      type: ACTION_TYPE.SET_IS_MODAL_FOR_OVK;
      payload: typeof store.isModalForOvk;
    }
  | {
      type: ACTION_TYPE.SET_FEEDBRAND_DATA;
      payload: typeof store.feedBrandData;
    }
  | {
      type: ACTION_TYPE.SET_MODAL_DATA;
      payload: typeof store.records;
    };
