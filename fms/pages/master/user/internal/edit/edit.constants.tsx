import { IDropdownItem } from "@type/dropdown.interface";
import { TParentResponse, TRoleResponse } from "@type/response.type";

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

export type TTemp = {
  parentId: string;
};

export enum ACTION_TYPE {
  SET_ERROR_TYPE = "SET_ERROR_TYPE",
  SET_ERROR_TEXT = "SET_ERROR_TEXT",
  SET_USER_CODE = "SET_USER_CODE",
  SET_FULL_NAME = "SET_FULL_NAME",
  SET_EMAIL = "SET_EMAIL",
  SET_PHONE_NUMBER = "SET_PHONE_NUMBER",
  SET_WA_NUMBER = "SET_WA_NUMBER",
  SET_PASSWORD = "SET_PASSWORD",
  SET_CONFIRM_PASSWORD = "SET_CONFIRM_PASSWORD",
  SET_STATUS = "SET_STATUS",
  SET_UPSTREAM_ROLE_DATA = "SET_UPSTREAM_ROLE_DATA",
  SET_DOWNSTREAM_ROLE_DATA = "SET_DOWNSTREAM_ROLE_DATA",
  SET_PARENT_DATA = "SET_PARENT_DATA",
  SET_PARENT = "SET_PARENT",
  SET_UPSTREAM_ROLE = "SET_UPSTREAM_ROLE",
  SET_DOWNSTREAM_ROLE = "SET_DOWNSTREAM_ROLE",
  SET_OLD_NAME = "SET_OLD_NAME",
  SET_TEMP = "SET_TEMP",
}

export type TStore = {
  errorType: ERROR_TYPE;
  errorText: string;
  oldName: string;
  userCode: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  waNumber: string;
  password: string;
  confirmPassword: string;
  status: IDropdownItem<boolean> | null;
  upstreamRoleData: TRoleResponse[];
  downstreamRoleData: TRoleResponse[];
  parentData: TParentResponse[];
  parent: IDropdownItem<TParentResponse> | null;
  upstreamRole: IDropdownItem<TRoleResponse> | null;
  downstreamRole: IDropdownItem<TRoleResponse> | null;
  temp: TTemp;
};

export const store: TStore = {
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  oldName: "",
  userCode: "",
  fullName: "",
  email: "",
  phoneNumber: "",
  waNumber: "",
  password: "",
  confirmPassword: "",
  status: null,
  upstreamRoleData: [],
  downstreamRoleData: [],
  parentData: [],
  parent: null,
  upstreamRole: null,
  downstreamRole: null,
  temp: {
    parentId: "",
  },
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_ERROR_TYPE; payload: typeof store.errorType }
  | { type: ACTION_TYPE.SET_ERROR_TEXT; payload: typeof store.errorText }
  | { type: ACTION_TYPE.SET_USER_CODE; payload: typeof store.userCode }
  | { type: ACTION_TYPE.SET_FULL_NAME; payload: typeof store.fullName }
  | { type: ACTION_TYPE.SET_EMAIL; payload: typeof store.email }
  | { type: ACTION_TYPE.SET_PHONE_NUMBER; payload: typeof store.phoneNumber }
  | { type: ACTION_TYPE.SET_WA_NUMBER; payload: typeof store.waNumber }
  | { type: ACTION_TYPE.SET_PASSWORD; payload: typeof store.password }
  | {
      type: ACTION_TYPE.SET_CONFIRM_PASSWORD;
      payload: typeof store.confirmPassword;
    }
  | { type: ACTION_TYPE.SET_STATUS; payload: typeof store.status }
  | {
      type: ACTION_TYPE.SET_UPSTREAM_ROLE_DATA;
      payload: typeof store.upstreamRoleData;
    }
  | {
      type: ACTION_TYPE.SET_DOWNSTREAM_ROLE_DATA;
      payload: typeof store.downstreamRoleData;
    }
  | { type: ACTION_TYPE.SET_PARENT_DATA; payload: typeof store.parentData }
  | {
      type: ACTION_TYPE.SET_PARENT;
      payload: typeof store.parent;
    }
  | { type: ACTION_TYPE.SET_UPSTREAM_ROLE; payload: typeof store.upstreamRole }
  | {
      type: ACTION_TYPE.SET_DOWNSTREAM_ROLE;
      payload: typeof store.downstreamRole;
    }
  | { type: ACTION_TYPE.SET_OLD_NAME; payload: typeof store.oldName }
  | { type: ACTION_TYPE.SET_TEMP; payload: typeof store.temp };
