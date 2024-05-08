import { IDropdownItem } from "@type/dropdown.interface";
import {
  TBuildingTypeResponse,
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
  SET_FARM_DATA = "SET_FARM_DATA",
  SET_BUILDING_TYPE_DATA = "SET_BUILDING_TYPE_DATA",
  SET_OWNER_DATA = "SET_OWNER_DATA",
}

export type TSearch = {
  buildingName: string | undefined;
  status: IDropdownItem<boolean> | null;
  buildingType: IDropdownItem<TBuildingTypeResponse> | null;
  farm: IDropdownItem<TFarmResponse> | null;
  owner: IDropdownItem<TUserResponse> | null;
};

export const search: TSearch = {
  buildingName: "",
  status: null,
  buildingType: null,
  farm: null,
  owner: null,
};

export type TStore = {
  tablePage: number;
  isLastPage: boolean;
  isAdvanceSearchVisible: boolean;
  search: TSearch;
  inputSearch: TSearch;
  farmData: TFarmResponse[];
  buildingTypeData: TBuildingTypeResponse[];
  ownerData: TUserResponse[];
};

export const store: TStore = {
  tablePage: 1,
  isLastPage: false,
  isAdvanceSearchVisible: false,
  search: search,
  inputSearch: search,
  farmData: [],
  buildingTypeData: [],
  ownerData: [],
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
  | { type: ACTION_TYPE.SET_FARM_DATA; payload: typeof store.farmData }
  | {
      type: ACTION_TYPE.SET_BUILDING_TYPE_DATA;
      payload: typeof store.buildingTypeData;
    }
  | { type: ACTION_TYPE.SET_OWNER_DATA; payload: typeof store.ownerData };
