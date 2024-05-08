import { IDropdownItem } from "@type/dropdown.interface";
import { TRoleResponse } from "@type/response.type";

export enum ERROR_TYPE {
  NONE = "NONE",
  GENERAL = "GENERAL",
  USER_TYPE = "USER_TYPE",
  USER_CODE = "USER_CODE",
  FULL_NAME = "FULL_NAME",
  EMAIL = "EMAIL",
  PHONE_NUMBER = "PHONE_NUMBER",
  WA_NUMBER = "WA_NUMBER",
  PASSWORD = "PASSWORD",
  CONFIRM_PASSWORD = "CONFIRM_PASSWORD",
  STATUS = "STATUS",
  PARENT_ID = "PARENT_ID",
}

export enum ACTION_TYPE {
  SET_IS_LAST_PAGE = "SET_IS_LAST_PAGE",
  SET_TABLE_PAGE = "SET_TABLE_PAGE",
  SET_IS_ADVANCE_SEARCH_VISIBLE = "SET_IS_ADVANCE_SEARCH_VISIBLE",
  SET_SEARCH = "SET_SEARCH",
  SET_INPUT_SEARCH = "SET_INPUT_SEARCH",
  RESET_SEARCH = "RESET_SEARCH",
  SET_ROLE_DATA = "SET_ROLE_DATA",
}

export type TSearch = {
  userType: IDropdownItem<TRoleResponse> | null;
  name: string | undefined;
  userCode: string | undefined;
  email: string | undefined;
  phoneNumber: string | undefined;
  waNumber: string | undefined;
  status: IDropdownItem<boolean> | null;
};

export const search: TSearch = {
  userType: null,
  name: "",
  userCode: "",
  email: "",
  phoneNumber: "",
  waNumber: "",
  status: null,
};

export type TStore = {
  tablePage: number;
  isLastPage: boolean;
  isAdvanceSearchVisible: boolean;
  parentId?: string;
  search: TSearch;
  inputSearch: TSearch;
  roleData: TRoleResponse[];
};

export const store: TStore = {
  tablePage: 1,
  isLastPage: false,
  isAdvanceSearchVisible: false,
  parentId: "",
  search,
  inputSearch: search,
  roleData: [],
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
  | { type: ACTION_TYPE.SET_ROLE_DATA; payload: typeof store.roleData }
  | { type: ACTION_TYPE.RESET_SEARCH; payload: null };
