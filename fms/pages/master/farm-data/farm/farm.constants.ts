import { IDropdownItem } from "@type/dropdown.interface";
import {
  TBranchResponse,
  TCityResponse,
  TDistrictResponse,
  TProvinceResponse,
  TUserResponse,
} from "@type/response.type";

export enum ACTION_TYPE {
  SET_IS_LAST_PAGE = "SET_IS_LAST_PAGE",
  SET_TABLE_PAGE = "SET_TABLE_PAGE",
  SET_IS_ADVANCE_SEARCH_VISIBLE = "SET_IS_ADVANCE_SEARCH_VISIBLE",
  SET_SEARCH = "SET_SEARCH",
  SET_INPUT_SEARCH = "SET_INPUT_SEARCH",
  RESET_SEARCH = "RESET_SEARCH",
  SET_OWNER_DATA = "SET_OWNER_DATA",
  SET_PROVINCE_DATA = "SET_PROVINCE_DATA",
  SET_CITY_DATA = "SET_CITY_DATA",
  SET_DISTRICT_DATA = "SET_DISTRICT_DATA",
  SET_BRANCH_DATA = "SET_BRANCH_DATA",
}

export type TSearch = {
  userOwner: IDropdownItem<TUserResponse> | null;
  farmCode: string | undefined;
  farmName: string | undefined;
  province: IDropdownItem<TProvinceResponse> | null;
  city: IDropdownItem<TCityResponse> | null;
  district: IDropdownItem<TDistrictResponse> | null;
  status: IDropdownItem<boolean> | null;
  branch: IDropdownItem<TBranchResponse> | null;
};

export const search: TSearch = {
  userOwner: null,
  farmCode: "",
  farmName: "",
  branch: null,
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

  ownerData: TUserResponse[];
  provinceData: TProvinceResponse[];
  cityData: TCityResponse[];
  districtData: TDistrictResponse[];
  branchData: TBranchResponse[];
};

export const store: TStore = {
  tablePage: 1,
  isLastPage: false,
  isAdvanceSearchVisible: false,
  search: search,
  inputSearch: search,

  ownerData: [],
  provinceData: [],
  cityData: [],
  districtData: [],
  branchData: [],
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
  | { type: ACTION_TYPE.SET_OWNER_DATA; payload: typeof store.ownerData }
  | { type: ACTION_TYPE.SET_PROVINCE_DATA; payload: typeof store.provinceData }
  | { type: ACTION_TYPE.SET_CITY_DATA; payload: typeof store.cityData }
  | { type: ACTION_TYPE.SET_DISTRICT_DATA; payload: typeof store.districtData }
  | { type: ACTION_TYPE.SET_BRANCH_DATA; payload: typeof store.branchData };
