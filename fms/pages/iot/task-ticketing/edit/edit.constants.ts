import { IDropdownItem } from "@type/dropdown.interface";
import { TIotTicketDeviceStatusResponse } from "@type/response.type";

export type TGetManyIotTicketResponse<T> = {
  code: number;
  count: number;
  deviceStatus: TIotTicketDeviceStatusResponse;
  data: T;
};

export const ERROR_TYPE = {
  NONE: "",
  GENERAL: "general",
  PIC: "pic",
  STATUS: "status",
  NOTES: "notes",
};

export const initialState: {
  errorType: string;
  errorText: string;
  pic: string;
  status: IDropdownItem<string> | null;
  notes: string;

  textCount: number;
} = {
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  pic: "Unassigned",
  status: null,
  notes: "",

  textCount: 0,
};

export type TState = typeof initialState;

export const ACTIONS = {
  SET_ERROR_TYPE: "set-error-type",
  SET_ERROR_TEXT: "set-error-text",
  SET_PIC: "set-pic",
  SET_STATUS: "set-status",
  SET_NOTES: "set-notes",
  SET_TEXT_COUNT: "set-text-count",
};
