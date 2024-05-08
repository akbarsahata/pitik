import { USER_TYPE } from "@constants/index";
import { IDropdownItem } from "@type/dropdown.interface";
import { TRoleResponse, TUserResponse } from "@type/response.type";

export const ROLE_TYPES = [USER_TYPE.KK.full, USER_TYPE.AK.full];

export enum ERROR_TYPE {
  NONE = "NONE",
  GENERAL = "GENERAL",
  OWNER = "OWNER",
  USER_TYPE = "USER_TYPE",
  USER_CODE = "USER_CODE",
  FULL_NAME = "FULL_NAME",
  EMAIL = "EMAIL",
  PHONE_NUMBER = "PHONE_NUMBER",
  WA_NUMBER = "WA_NUMBER",
  STATUS = "STATUS",
  PASSWORD = "PASSWORD",
  CONFIRM_PASSWORD = "CONFIRM_PASSWORD",
}

export enum ACTION_TYPE {
  SET_ERROR_TYPE = "SET_ERROR_TYPE",
  SET_ERROR_TEXT = "SET_ERROR_TEXT",
  SET_OWNER = "SET_OWNER",
  SET_OWNER_DATA = "SET_OWNER_DATA",
  SET_USER_TYPE = "SET_USER_TYPE",
  SET_USER_CODE = "SET_USER_CODE",
  SET_FULL_NAME = "SET_FULL_NAME",
  SET_EMAIL = "SET_EMAIL",
  SET_PHONE_NUMBER = "SET_PHONE_NUMBER",
  SET_WA_NUMBER = "SET_WA_NUMBER",
  SET_PASSWORD = "SET_PASSWORD",
  SET_CONFIRM_PASSWORD = "SET_CONFIRM_PASSWORD",
  SET_STATUS = "SET_STATUS",
  SET_ROLE = "SET_ROLE",
  SET_ROLE_DATA = "SET_ROLE_DATA",
}

export type TStore = {
  errorType: ERROR_TYPE;
  errorText: string;
  owner: IDropdownItem<TUserResponse> | null;
  ownerData: TUserResponse[];
  userType: IDropdownItem<TRoleResponse> | null;
  userCode: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  waNumber: string;
  password: string;
  confirmPassword: string;
  status: IDropdownItem<boolean> | null;
  roleData: TRoleResponse[];
  role: IDropdownItem<TRoleResponse> | null;
};

export const store: TStore = {
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  owner: null,
  ownerData: [],
  userType: null,
  userCode: "",
  fullName: "",
  email: "",
  phoneNumber: "",
  waNumber: "",
  password: "",
  confirmPassword: "",
  status: null,
  roleData: [],
  role: null,
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_ERROR_TYPE; payload: typeof store.errorType }
  | { type: ACTION_TYPE.SET_ERROR_TEXT; payload: typeof store.errorText }
  | { type: ACTION_TYPE.SET_OWNER; payload: typeof store.owner }
  | { type: ACTION_TYPE.SET_OWNER_DATA; payload: typeof store.ownerData }
  | { type: ACTION_TYPE.SET_USER_TYPE; payload: typeof store.userType }
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
  | { type: ACTION_TYPE.SET_ROLE; payload: typeof store.role }
  | { type: ACTION_TYPE.SET_ROLE_DATA; payload: typeof store.roleData };
