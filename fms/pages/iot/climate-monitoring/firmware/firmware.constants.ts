import { IDropdownItem } from "@type/dropdown.interface";
import { TDeviceTypeResponse } from "@type/response.type";

export enum ERROR_TYPE {
  NONE = "NONE",
  GENERAL = "GENERAL",
  VERSION = "VERSION",
  DESCRIPTION = "DESCRIPTION",
  FILE_NAME = "FILE_NAME",
  FILE = "FILE",
  DEVICE_TYPE = "DEVICE_TYPE",
}

export enum ACTION_TYPE {
  SET_ERROR_TYPE = "SET_ERROR_TYPE",
  SET_ERROR_TEXT = "SET_ERROR_TEXT",
  SET_IS_LAST_PAGE = "SET_IS_LAST_PAGE",
  SET_TABLE_PAGE = "SET_TABLE_PAGE",
  SET_IS_ADVANCE_SEARCH_VISIBLE = "SET_IS_ADVANCE_SEARCH_VISIBLE",
  SET_IS_ADD_FIRMWARE_MODAL_VISIBLE = "SET_IS_ADD_FIRMWARE_MODAL_VISIBLE",
  SET_VERSION = "SET_VERSION",
  SET_DESCRIPTION = "SET_DESCRIPTION",
  SET_DEVICE_TYPE_DATA = "SET_DEVICE_TYPE_DATA",
  SET_FILE_NAME = "SET_FILE_NAME",
  SET_FILE = "SET_FILE",
  SET_DEVICE_TYPE = "SET_DEVICE_TYPE",
  SET_SEARCH = "SET_SEARCH",
  SET_INPUT_SEARCH = "SET_INPUT_SEARCH",
  RESET_SEARCH = "RESET_SEARCH",
  SET_IS_DELETE_MODAL_VISIBLE = "SET_IS_DELETE_MODAL_VISIBLE",
  SET_DELETED_FIRMWARE_ID = "SET_DELETED_FIRMWARE_ID",
}

export type TSearch = {
  version: string | undefined;
  description: string | undefined;
  deviceType: IDropdownItem<TDeviceTypeResponse> | null;
};

export const search: TSearch = {
  version: "",
  description: "",
  deviceType: null,
};

export type TStore = {
  errorType: ERROR_TYPE;
  errorText: string;
  tablePage: number;
  isLastPage: boolean;
  isAdvanceSearchVisible: boolean;
  isAddFirmwareModalVisible: boolean;
  version: string | undefined;
  description: string | undefined;
  deviceTypeData: TDeviceTypeResponse[];
  fileName: string | undefined;
  file: any;
  deviceType: IDropdownItem<TDeviceTypeResponse> | null;
  isDeleteModalVisible: boolean;
  deletedFirmwareId: string;
  search: TSearch;
  inputSearch: TSearch;
};

export const store: TStore = {
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  tablePage: 1,
  isLastPage: false,
  isAdvanceSearchVisible: false,
  isAddFirmwareModalVisible: false,
  version: "",
  description: "",
  deviceTypeData: [],
  fileName: "",
  file: null,
  deviceType: null,
  isDeleteModalVisible: false,
  deletedFirmwareId: "",
  search: search,
  inputSearch: search,
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_ERROR_TYPE; payload: typeof store.errorType }
  | { type: ACTION_TYPE.SET_ERROR_TEXT; payload: typeof store.errorText }
  | { type: ACTION_TYPE.SET_IS_LAST_PAGE; payload: typeof store.isLastPage }
  | { type: ACTION_TYPE.SET_TABLE_PAGE; payload: typeof store.tablePage }
  | {
      type: ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE;
      payload: typeof store.isAdvanceSearchVisible;
    }
  | {
      type: ACTION_TYPE.SET_IS_ADD_FIRMWARE_MODAL_VISIBLE;
      payload: typeof store.isAddFirmwareModalVisible;
    }
  | { type: ACTION_TYPE.SET_VERSION; payload: typeof store.version }
  | { type: ACTION_TYPE.SET_DESCRIPTION; payload: typeof store.description }
  | {
      type: ACTION_TYPE.SET_DEVICE_TYPE_DATA;
      payload: typeof store.deviceTypeData;
    }
  | { type: ACTION_TYPE.SET_FILE_NAME; payload: typeof store.fileName }
  | { type: ACTION_TYPE.SET_FILE; payload: typeof store.file }
  | { type: ACTION_TYPE.SET_DEVICE_TYPE; payload: typeof store.deviceType }
  | { type: ACTION_TYPE.SET_SEARCH; payload: typeof store.search }
  | { type: ACTION_TYPE.SET_INPUT_SEARCH; payload: typeof store.inputSearch }
  | { type: ACTION_TYPE.RESET_SEARCH; payload: null }
  | {
      type: ACTION_TYPE.SET_IS_DELETE_MODAL_VISIBLE;
      payload: typeof store.isDeleteModalVisible;
    }
  | {
      type: ACTION_TYPE.SET_DELETED_FIRMWARE_ID;
      payload: typeof store.deletedFirmwareId;
    };
