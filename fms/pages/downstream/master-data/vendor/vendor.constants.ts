import { IDropdownItem } from "@type/dropdown.interface";
import {
  TCityResponse,
  TDistrictResponse,
  TProvinceResponse,
} from "@type/response.type";

export enum ERROR_TYPE {
  NONE = "NONE",
  GENERAL = "GENERAl",
}

export enum ACTION_TYPE {
  SET_IS_LAST_PAGE = "SET_IS_LAST_PAGE",
  SET_TABLE_PAGE = "SET_TABLE_PAGE",
  SET_IS_ADVANCE_SEARCH_VISIBLE = "SET_IS_ADVANCE_SEARCH_VISIBLE",
  SET_SEARCH = "SET_SEARCH",
  SET_INPUT_SEARCH = "SET_INPUT_SEARCH",
  RESET_SEARCH = "RESET_SEARCH",
  SET_PROVINCE_DATA = "SET_PROVINCE_DATA",
  SET_CITY_DATA = "SET_CITY_DATA",
  SET_DISTRICT_DATA = "SET_DISTRICT_DATA",
}

export type TSearch = {
  vendorName: string | undefined;
  province: IDropdownItem<TProvinceResponse> | null;
  city: IDropdownItem<TCityResponse> | null;
  district: IDropdownItem<TDistrictResponse> | null;
  status: IDropdownItem<boolean> | null;
};

export const search: TSearch = {
  vendorName: "",
  province: null,
  city: null,
  district: null,
  status: null,
};

export type TStore = {
  tablePage: number;
  isLastPage: boolean;
  isAdvanceSearchVisible: boolean;
  search: TSearch;
  inputSearch: TSearch;

  provinceData: TProvinceResponse[];
  cityData: TCityResponse[];
  districtData: TDistrictResponse[];
};

export const store: TStore = {
  tablePage: 1,
  isLastPage: false,
  isAdvanceSearchVisible: false,
  search: search,
  inputSearch: search,

  provinceData: [],
  cityData: [],
  districtData: [],
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_IS_LAST_PAGE; payload: typeof store.isLastPage }
  | { type: ACTION_TYPE.SET_TABLE_PAGE; payload: typeof store.tablePage }
  | {
      type: ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE;
      payload: typeof store.isAdvanceSearchVisible;
    }
  | { type: ACTION_TYPE.SET_SEARCH; payload: typeof store.search }
  | { type: ACTION_TYPE.SET_INPUT_SEARCH; payload: typeof store.inputSearch }
  | { type: ACTION_TYPE.RESET_SEARCH; payload: null }
  | { type: ACTION_TYPE.SET_PROVINCE_DATA; payload: typeof store.provinceData }
  | { type: ACTION_TYPE.SET_CITY_DATA; payload: typeof store.cityData }
  | { type: ACTION_TYPE.SET_DISTRICT_DATA; payload: typeof store.districtData };
