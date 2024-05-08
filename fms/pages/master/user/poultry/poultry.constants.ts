import { USER_TYPE } from "@constants/index";
import { IDropdownItem } from "@type/dropdown.interface";
import { TUserResponse } from "@type/response.type";

export const ROLE_TYPES = [USER_TYPE.KK.full, USER_TYPE.AK.full];

export enum ERROR_TYPE {
  NONE = "NONE",
  GENERAL = "GENERAL",
  USER_TYPE = "USER_TYPE",
  USER_CODE = "USER_CODE",
  FULL_NAME = "FULL_NAME",
  PHONE_NUMBER = "PHONE_NUMBER",
  WA_NUMBER = "WA_NUMBER",
  STATUS = "STATUS",
}

export enum ACTION_TYPE {
  SET_IS_LAST_PAGE = "SET_IS_LAST_PAGE",
  SET_TABLE_PAGE = "SET_TABLE_PAGE",
  SET_IS_ADVANCE_SEARCH_VISIBLE = "SET_IS_ADVANCE_SEARCH_VISIBLE",
  SET_SEARCH = "SET_SEARCH",
  SET_INPUT_SEARCH = "SET_INPUT_SEARCH",
  RESET_SEARCH = "RESET_SEARCH",
  SET_OWNER_DATA = "SET_OWNER_DATA",
}

export type TSearch = {
  fullName: string | undefined;
  userCode: string | undefined;
  email: string | undefined;
  phoneNumber: string | undefined;
  waNumber: string | undefined;
  status: IDropdownItem<boolean> | null;
  userType: IDropdownItem<string> | null;
  owner: IDropdownItem<TUserResponse> | null;
};

export const search: TSearch = {
  fullName: "",
  userCode: "",
  email: "",
  phoneNumber: "",
  waNumber: "",
  status: null,
  userType: null,
  owner: null,
};

export type TStore = {
  tablePage: number;
  isLastPage: boolean;
  isAdvanceSearchVisible: boolean;
  search: TSearch;
  inputSearch: TSearch;
  ownerData: TUserResponse[];
};

export const store: TStore = {
  tablePage: 1,
  isLastPage: false,
  isAdvanceSearchVisible: false,
  search: search,
  inputSearch: search,
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
  | { type: ACTION_TYPE.SET_OWNER_DATA; payload: typeof store.ownerData };
