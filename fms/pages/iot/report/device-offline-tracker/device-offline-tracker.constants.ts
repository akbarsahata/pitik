import { IDropdownItem } from "@type/dropdown.interface";
import { TCoopResponse, TFarmResponse } from "@type/response.type";

export const ERROR_TYPE = {
  NONE: "",
  GENERAL: "general",
  CATEGORY: "category",
  FARM: "farm",
  DEVICE: "device",
  START_DATE: "startDate",
  END_DATE: "endDate",
  INTERVAL: "interval",
};

export type TSearch = {
  startDate: string;
  endDate: string;
  coop: IDropdownItem<TCoopResponse> | null;
  farm: IDropdownItem<TFarmResponse> | null;
};

export const emptySearch: TSearch = {
  startDate: "",
  endDate: "",
  coop: null,
  farm: null,
};

export const initialState: {
  errorType: string;
  tablePage: number;
  isLastPage: boolean;
  isAdvanceSearchVisible: boolean;
  startDate: string;
  endDate: string;
  tableDataIndex: number;

  search: TSearch;
  inputSearch: TSearch;

  farm: IDropdownItem<TFarmResponse> | null;
  coop: IDropdownItem<TCoopResponse> | null;

  farmData: TFarmResponse[];
  coopData: TCoopResponse[];
} = {
  errorType: ERROR_TYPE.NONE,
  tablePage: 1,
  isLastPage: false,
  isAdvanceSearchVisible: false,
  startDate: "",
  endDate: "",
  tableDataIndex: 0,

  search: emptySearch,
  inputSearch: emptySearch,

  farm: null,
  coop: null,

  farmData: [],
  coopData: [],
};

export type TState = typeof initialState;

export const ACTIONS = {
  SET_ERROR_TYPE: "set-error-type",
  SET_IS_LAST_PAGE: "set-is-last-page",
  SET_TABLE_PAGE: "set-table-page",
  SET_IS_ADVANCE_SEARCH_VISIBLE: "set-is-advance-search-visible",
  SET_START_DATE: "set-start-date",
  SET_END_DATE: "set-end-date",
  SET_TABLE_DATA_INDEX: "set-table-data-index",

  SET_SEARCH: "set-search",
  SET_INPUT_SEARCH: "set-input-search",
  RESET_SEARCH: "reset-search",

  SET_FARM: "set-farm",
  SET_COOP: "set-coop",

  SET_FARM_DATA: "set-farm-data",
  SET_COOP_DATA: "set-coop-data",
};
