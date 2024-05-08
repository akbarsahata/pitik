import { IDropdownItem } from "@type/dropdown.interface";
import {
  TChickenStrainResponse,
  TCoopTypeResponse,
  TVariableResponse,
} from "@type/response.type";

export enum ACTION_TYPE {
  SET_IS_LAST_PAGE = "SET_IS_LAST_PAGE",
  SET_TABLE_PAGE = "SET_TABLE_PAGE",
  SET_IS_ADVANCE_SEARCH_VISIBLE = "SET_IS_ADVANCE_SEARCH_VISIBLE",
  SET_COOP_TYPE_DATA = "SET_COOP_TYPE_DATA",
  SET_CHICK_TYPE_DATA = "SET_CHICK_TYPE_DATA",
  SET_VARIABLE_DATA = "SET_VARIABLE_DATA",
  SET_SEARCH = "SET_SEARCH",
  SET_INPUT_SEARCH = "SET_INPUT_SEARCH",
  RESET_SEARCH = "RESET_SEARCH",
}

export type TSearch = {
  targetCode: string | undefined;
  targetName: string | undefined;
  coopType: IDropdownItem<TCoopTypeResponse> | null;
  chickType: IDropdownItem<TChickenStrainResponse> | null;
  variable: IDropdownItem<TVariableResponse> | null;
  status: IDropdownItem<boolean> | null;
};

export const search: TSearch = {
  targetCode: "",
  targetName: "",
  coopType: null,
  chickType: null,
  variable: null,
  status: null,
};

export type TStore = {
  tablePage: number;
  isLastPage: boolean;
  isAdvanceSearchVisible: boolean;
  coopTypeData: TCoopTypeResponse[];
  chickTypeData: TChickenStrainResponse[];
  variableData: TVariableResponse[];
  search: TSearch;
  inputSearch: TSearch;
};

export const store: TStore = {
  tablePage: 1,
  isLastPage: false,
  isAdvanceSearchVisible: false,
  coopTypeData: [],
  chickTypeData: [],
  variableData: [],
  search: search,
  inputSearch: search,
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_IS_LAST_PAGE; payload: typeof store.isLastPage }
  | { type: ACTION_TYPE.SET_TABLE_PAGE; payload: typeof store.tablePage }
  | {
      type: ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE;
      payload: typeof store.isAdvanceSearchVisible;
    }
  | { type: ACTION_TYPE.SET_COOP_TYPE_DATA; payload: typeof store.coopTypeData }
  | {
      type: ACTION_TYPE.SET_CHICK_TYPE_DATA;
      payload: typeof store.chickTypeData;
    }
  | { type: ACTION_TYPE.SET_VARIABLE_DATA; payload: typeof store.variableData }
  | { type: ACTION_TYPE.SET_SEARCH; payload: typeof store.search }
  | { type: ACTION_TYPE.SET_INPUT_SEARCH; payload: typeof store.inputSearch }
  | { type: ACTION_TYPE.RESET_SEARCH; payload: null };
