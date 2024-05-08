import { IDropdownItem } from "@type/dropdown.interface";

export enum ERROR_TYPE {
  NONE = "NONE",
  GENERAL = "GENERAL",
  VARIABLE_CODE = "VARIABLE_CODE",
  VARIABLE_NAME = "VARIABLE_NAME",
  VARIABLE_UOM = "VARIABLE_UOM",
  VARIABLE_TYPE = "VARIABLE_TYPE",
  DIGIT_COMA = "DIGIT_COMA",
  STATUS = "STATUS",
}

export enum ACTION_TYPE {
  SET_ERROR_TYPE = "SET_ERROR_TYPE",
  SET_ERROR_TEXT = "SET_ERROR_TEXT",
  SET_VARIABLE_CODE = "SET_VARIABLE_CODE",
  SET_VARIABLE_NAME = "SET_VARIABLE_NAME",
  SET_VARIABLE_UOM = "SET_VARIABLE_UOM",
  SET_VARIABLE_TYPE = "SET_VARIABLE_TYPE",
  SET_DIGIT_COMA = "SET_DIGIT_COMA",
  SET_REMARKS = "SET_REMARKS",
  SET_STATUS = "SET_STATUS",
}

export type TStore = {
  errorType: ERROR_TYPE;
  errorText: string;
  variableCode: string;
  variableName: string;
  variableUOM: string;
  variableType: string;
  digitComa: number;
  remarks: string;
  status: IDropdownItem<boolean> | null;
};

export const store: TStore = {
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  variableCode: "",
  variableName: "",
  variableUOM: "",
  variableType: "simple",
  digitComa: 0,
  remarks: "",
  status: null,
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_ERROR_TYPE; payload: typeof store.errorType }
  | { type: ACTION_TYPE.SET_ERROR_TEXT; payload: typeof store.errorText }
  | { type: ACTION_TYPE.SET_VARIABLE_CODE; payload: typeof store.variableCode }
  | { type: ACTION_TYPE.SET_VARIABLE_NAME; payload: typeof store.variableName }
  | { type: ACTION_TYPE.SET_VARIABLE_UOM; payload: typeof store.variableUOM }
  | { type: ACTION_TYPE.SET_VARIABLE_TYPE; payload: typeof store.variableType }
  | { type: ACTION_TYPE.SET_DIGIT_COMA; payload: typeof store.digitComa }
  | { type: ACTION_TYPE.SET_REMARKS; payload: typeof store.remarks }
  | { type: ACTION_TYPE.SET_STATUS; payload: typeof store.status };
