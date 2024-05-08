import { IDropdownItem } from "@type/dropdown.interface";
import {
  TBranchResponse,
  TCoopResponse,
  TFarmResponse,
  TUserResponse,
} from "@type/response.type";

export type TSearch = {
  farmingCycleCode: string | undefined;
  status: IDropdownItem<string> | null;
  farm: IDropdownItem<TFarmResponse> | null;
  coop: IDropdownItem<TCoopResponse> | null;
  branch: IDropdownItem<TBranchResponse> | null;
  owner: IDropdownItem<TUserResponse> | null;
};

export const emptySearch: TSearch = {
  farmingCycleCode: "",
  status: null,
  farm: null,
  coop: null,
  branch: null,
  owner: null,
};

export const initialState: {
  tablePage: number;
  isLastPage: boolean;
  isAdvanceSearchVisible: boolean;
  search: TSearch;
  inputSearch: TSearch;
  farmData: TFarmResponse[];
  coopData: TCoopResponse[];
  branchData: TBranchResponse[];
  ownerData: TUserResponse[];
} = {
  tablePage: 1,
  isLastPage: false,
  isAdvanceSearchVisible: false,
  search: emptySearch,
  inputSearch: emptySearch,
  farmData: [],
  coopData: [],
  branchData: [],
  ownerData: [],
};

export type TState = typeof initialState;

export const ACTIONS = {
  SET_IS_LAST_PAGE: "set-is-last-page",
  SET_TABLE_PAGE: "set-table-page",
  SET_IS_ADVANCE_SEARCH_VISIBLE: "set-is-advance-search-visible",
  SET_SEARCH: "set-search",
  SET_INPUT_SEARCH: "set-input-search",
  RESET_SEARCH: "reset-search",
  SET_FARM_DATA: "set-farm-data",
  SET_COOP_DATA: "set-coop-data",
  SET_BRANCH_DATA: "set-branch-data",
  SET_OWNER_DATA: "set-owner-data",
};
