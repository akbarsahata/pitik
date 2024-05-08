import { IDropdownItem } from "@type/dropdown.interface";

export enum ERROR_TYPE {
  NONE = "NONE",
  GENERAL = "GENERAL",
  COOP_TYPE_CODE = "COOP_TYPE_CODE",
  COOP_TYPE_NAME = "COOP_TYPE_NAME",
  STATUS = "STATUS",
}

export enum ACTION_TYPE {
  SET_ERROR_TYPE = "SET_ERROR_TYPE",
  SET_ERROR_TEXT = "SET_ERROR_TEXT",
  SET_OLD_NAME = "SET_OLD_NAME",
  SET_COOP_TYPE_CODE = "SET_COOP_TYPE_CODE",
  SET_COOP_TYPE_NAME = "SET_COOP_TYPE_NAME",
  SET_REMARKS = "SET_REMARKS",
  SET_STATUS = "SET_STATUS",
}

export type TStore = {
  errorType: ERROR_TYPE;
  errorText: string;
  oldName: string;
  coopTypeCode: string;
  coopTypeName: string;
  remarks: string;
  status: IDropdownItem<boolean> | null;
};

export const store: TStore = {
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  oldName: "",
  coopTypeCode: "",
  coopTypeName: "",
  remarks: "",
  status: null,
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_ERROR_TYPE; payload: typeof store.errorType }
  | { type: ACTION_TYPE.SET_ERROR_TEXT; payload: typeof store.errorText }
  | { type: ACTION_TYPE.SET_OLD_NAME; payload: typeof store.oldName }
  | {
      type: ACTION_TYPE.SET_COOP_TYPE_CODE;
      payload: typeof store.coopTypeCode;
    }
  | {
      type: ACTION_TYPE.SET_COOP_TYPE_NAME;
      payload: typeof store.coopTypeName;
    }
  | { type: ACTION_TYPE.SET_REMARKS; payload: typeof store.remarks }
  | { type: ACTION_TYPE.SET_STATUS; payload: typeof store.status };
