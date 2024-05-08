import { IDropdownItem } from "@type/dropdown.interface";
import {
  TBranchResponse,
  TChickenStrainResponse,
  TCoopResponse,
  TCoopTypeResponse,
  TFarmResponse,
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
  SET_FARM_DATA = "SET_FARM_DATA",
  SET_COOP_DATA = "SET_COOP_DATA",
  SET_BRANCH_DATA = "SET_BRANCH_DATA",
  SET_COOP_TYPE_DATA = "SET_COOP_TYPE_DATA",
  SET_CHICK_TYPE_DATA = "SET_CHICK_TYPE_DATA",
}

export type TSearch = {
  farmingCycleCode: string | undefined;
  owner: IDropdownItem<TUserResponse> | null;
  farm: IDropdownItem<TFarmResponse> | null;
  coop: IDropdownItem<TCoopResponse> | null;
  farmingStatus: IDropdownItem<string> | null;
  coopType: IDropdownItem<TCoopTypeResponse> | null;
  chickType: IDropdownItem<TChickenStrainResponse> | null;
  contract: IDropdownItem<string> | null;
  branch: IDropdownItem<TBranchResponse> | null;
};

export const search: TSearch = {
  farmingCycleCode: "",
  owner: null,
  farm: null,
  coop: null,
  farmingStatus: null,
  coopType: null,
  chickType: null,
  contract: null,
  branch: null,
};

export type TStore = {
  tablePage: number;
  isLastPage: boolean;
  isAdvanceSearchVisible: boolean;
  search: TSearch;
  inputSearch: TSearch;
  ownerData: TUserResponse[];
  farmData: TFarmResponse[];
  coopData: TCoopResponse[];
  coopTypeData: TCoopTypeResponse[];
  chickTypeData: TChickenStrainResponse[];
  branchData: TBranchResponse[];
};

export const store: TStore = {
  tablePage: 1,
  isLastPage: false,
  isAdvanceSearchVisible: false,
  search: search,
  inputSearch: search,
  ownerData: [],
  farmData: [],
  coopData: [],
  coopTypeData: [],
  chickTypeData: [],
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
  | { type: ACTION_TYPE.SET_FARM_DATA; payload: typeof store.farmData }
  | { type: ACTION_TYPE.SET_COOP_DATA; payload: typeof store.coopData }
  | { type: ACTION_TYPE.SET_BRANCH_DATA; payload: typeof store.branchData }
  | { type: ACTION_TYPE.SET_COOP_TYPE_DATA; payload: typeof store.coopTypeData }
  | {
      type: ACTION_TYPE.SET_CHICK_TYPE_DATA;
      payload: typeof store.chickTypeData;
    };
