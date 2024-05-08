import { IDropdownItem } from "@type/dropdown.interface";
import {
  TBranchResponse,
  TContractTypeResponse,
  TCoopTypeResponse,
  TFarmResponse,
  TFileUploadResponse,
  TUserResponse,
} from "@type/response.type";

export enum ACTION_TYPE {
  SET_IS_LAST_PAGE = "SET_IS_LAST_PAGE",
  SET_TABLE_PAGE = "SET_TABLE_PAGE",
  SET_IS_ADVANCE_SEARCH_VISIBLE = "SET_IS_ADVANCE_SEARCH_VISIBLE",
  SET_SEARCH = "SET_SEARCH",
  SET_INPUT_SEARCH = "SET_INPUT_SEARCH",
  RESET_SEARCH = "RESET_SEARCH",
  SET_COOP_TYPE_DATA = "SET_COOP_TYPE_DATA",
  SET_FARM_DATA = "SET_FARM_DATA",
  SET_OWNER_DATA = "SET_OWNER_DATA",
  SET_PHOTO_MODAL_VISIBLE = "SET_PHOTO_MODAL_VISIBLE",
  SET_PHOTO_DATA = "SET_PHOTO_DATA",
  SET_BRANCH_DATA = "SET_BRANCH_DATA",
  SET_CONTRACT_TYPE_DATA = "SET_CONTRACT_TYPE_DATA",
}

export type TSearch = {
  coopCode: string | undefined;
  coopName: string | undefined;
  coopType: IDropdownItem<TCoopTypeResponse> | null;
  farm: IDropdownItem<TFarmResponse> | null;
  owner: IDropdownItem<TUserResponse> | null;
  status: IDropdownItem<boolean> | null;
  contractType: IDropdownItem<TContractTypeResponse> | null;
  branch: IDropdownItem<TBranchResponse> | null;
};

export const search: TSearch = {
  coopCode: "",
  coopName: "",
  coopType: null,
  farm: null,
  owner: null,
  status: null,
  contractType: null,
  branch: null,
};

export type TStore = {
  tablePage: number;
  isLastPage: boolean;
  isAdvanceSearchVisible: boolean;
  search: TSearch;
  inputSearch: TSearch;
  coopTypeData: TCoopTypeResponse[];
  farmData: TFarmResponse[];
  ownerData: TUserResponse[];
  photoModalVisible: boolean;
  photoData: TFileUploadResponse[];
  branchData: TBranchResponse[];
  contractTypeData: TContractTypeResponse[];
};

export const store: TStore = {
  tablePage: 1,
  isLastPage: false,
  isAdvanceSearchVisible: false,
  search: search,
  inputSearch: search,
  coopTypeData: [],
  farmData: [],
  ownerData: [],
  photoModalVisible: false,
  photoData: [],
  branchData: [],
  contractTypeData: [],
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
  | { type: ACTION_TYPE.SET_COOP_TYPE_DATA; payload: typeof store.coopTypeData }
  | { type: ACTION_TYPE.SET_FARM_DATA; payload: typeof store.farmData }
  | { type: ACTION_TYPE.SET_OWNER_DATA; payload: typeof store.ownerData }
  | {
      type: ACTION_TYPE.SET_PHOTO_MODAL_VISIBLE;
      payload: typeof store.photoModalVisible;
    }
  | { type: ACTION_TYPE.SET_PHOTO_DATA; payload: typeof store.photoData }
  | { type: ACTION_TYPE.SET_BRANCH_DATA; payload: typeof store.branchData }
  | {
      type: ACTION_TYPE.SET_CONTRACT_TYPE_DATA;
      payload: typeof store.contractTypeData;
    };
