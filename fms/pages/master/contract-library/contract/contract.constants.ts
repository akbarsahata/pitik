import { IDropdownItem } from "@type/dropdown.interface";
import { TBranchResponse, TContractTypeResponse } from "@type/response.type";

export enum ACTION_TYPE {
  SET_IS_LAST_PAGE = "SET_IS_LAST_PAGE",
  SET_TABLE_PAGE = "SET_TABLE_PAGE",
  SET_IS_ADVANCE_SEARCH_VISIBLE = "SET_IS_ADVANCE_SEARCH_VISIBLE",
  SET_SEARCH = "SET_SEARCH",
  SET_INPUT_SEARCH = "SET_INPUT_SEARCH",
  RESET_SEARCH = "RESET_SEARCH",
  SET_CONTRACT_TYPE_DATA = "SET_CONTRACT_TYPE_DATA",
  SET_BRANCH_DATA = "SET_BRANCH_DATA",
  SET_EFFECTIVE_START_DATE = "SET_EFFECTIVE_START_DATE",
}

export type TSearch = {
  contractType: IDropdownItem<TContractTypeResponse> | null;
  customize: IDropdownItem<boolean> | null;
  branch: IDropdownItem<TBranchResponse> | null;
  effectiveStartDate: string | undefined;
};

export const search: TSearch = {
  contractType: null,
  customize: null,
  branch: null,
  effectiveStartDate: "",
};

export type TStore = {
  tablePage: number;
  isLastPage: boolean;
  isAdvanceSearchVisible: boolean;
  search: TSearch;
  inputSearch: TSearch;
  contractTypeData: TContractTypeResponse[];
  branchData: TBranchResponse[];
  effectiveStartDate: string | undefined;
};

export const store: TStore = {
  tablePage: 1,
  isLastPage: false,
  isAdvanceSearchVisible: false,
  search: search,
  inputSearch: search,
  contractTypeData: [],
  branchData: [],
  effectiveStartDate: "",
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
  | {
      type: ACTION_TYPE.SET_CONTRACT_TYPE_DATA;
      payload: typeof store.contractTypeData;
    }
  | { type: ACTION_TYPE.SET_BRANCH_DATA; payload: typeof store.branchData }
  | {
      type: ACTION_TYPE.SET_EFFECTIVE_START_DATE;
      payload: typeof store.effectiveStartDate;
    };
