import { IDropdownItem } from "@type/dropdown.interface";
import {
  TCoopResponse,
  TDevicesSensorResponse,
  TDeviceTypeResponse,
  TFarmResponse,
  TFirmwareSensorResponse,
} from "@type/response.type";
import { Key } from "react";

export enum ERROR_TYPE {
  NONE = "NONE",
  GENERAL = "GENERAL",
}

export enum ACTION_TYPE {
  SET_IS_LAST_PAGE = "SET_IS_LAST_PAGE",
  SET_TABLE_PAGE = "SET_TABLE_PAGE",
  SET_IS_ADVANCE_SEARCH_VISIBLE = "SET_IS_ADVANCE_SEARCH_VISIBLE",
  SET_SEARCH = "SET_SEARCH",
  SET_INPUT_SEARCH = "SET_INPUT_SEARCH",
  RESET_SEARCH = "RESET_SEARCH",
  SET_COOP_DATA = "SET_COOP_DATA",
  SET_FARM_DATA = "SET_FARM_DATA",
  SET_DEVICE_TYPE_DATA = "SET_DEVICE_TYPE_DATA",
  SET_ERROR_TYPE = "SET_ERROR_TYPE",
  SET_ERROR_TEXT = "SET_ERROR_TEXT",
  SET_IS_DELETE_MODAL_VISIBLE = "SET_IS_DELETE_MODAL_VISIBLE",
  SET_IS_CONFIRM_R0_MODAL_VISIBLE = "SET_IS_CONFIRM_R0_MODAL_VISIBLE",
  SET_TRIGGER_R0 = "SET_TRIGGER_R0",
  SET_SELECTED_ROW_KEYS = "SET_SELECTED_ROW_KEYS",
  SET_SELECTED_DEVICES = "SET_SELECTED_DEVICES",
  SET_IS_ASSIGN_OTA_MODAL_VISIBLE = "SET_IS_ASSIGN_OTA_MODAL_VISIBLE",
  SET_FIRMWARE_DATA = "SET_FIRMWARE_DATA",
  SET_FIRMWARE = "SET_FIRMWARE",
  SET_DELETED_DEVICE_ID = "SET_DELETED_DEVICE_ID",
}

export type TSearch = {
  coop: IDropdownItem<TCoopResponse> | null;
  farm: IDropdownItem<TFarmResponse> | null;
  deviceType: IDropdownItem<TDeviceTypeResponse> | null;
  deviceId: string | undefined;
  phoneNumber: string | undefined;
  macAddress: string | undefined;
};

export const search: TSearch = {
  coop: null,
  farm: null,
  deviceType: null,
  deviceId: "",
  phoneNumber: "",
  macAddress: "",
};

export type TStore = {
  tablePage: number;
  isLastPage: boolean;
  isAdvanceSearchVisible: boolean;
  search: TSearch;
  inputSearch: TSearch;
  farmData: TFarmResponse[];
  coopData: TCoopResponse[];
  deviceData: TDevicesSensorResponse[];
  deviceTypeData: TDeviceTypeResponse[];
  errorType: ERROR_TYPE;
  errorText: string;
  deletedDeviceId: string;
  isDeleteModalVisible: boolean;
  triggerR0: string;
  isConfirmR0ModalVisible: boolean;
  selectedRowKeys: Key[];
  selectedDevices: TDevicesSensorResponse[];
  isAssignOtaModalVisible: boolean;
  firmwareData: TFirmwareSensorResponse[];
  firmware: IDropdownItem<TFirmwareSensorResponse> | null;
};

export const store: TStore = {
  tablePage: 1,
  isLastPage: false,
  isAdvanceSearchVisible: false,
  search: search,
  inputSearch: search,
  farmData: [],
  coopData: [],
  deviceData: [],
  deviceTypeData: [],
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  deletedDeviceId: "",
  isDeleteModalVisible: false,
  triggerR0: "",
  isConfirmR0ModalVisible: false,
  selectedRowKeys: [],
  selectedDevices: [],
  isAssignOtaModalVisible: false,
  firmwareData: [],
  firmware: null,
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
  | { type: ACTION_TYPE.SET_COOP_DATA; payload: typeof store.coopData }
  | { type: ACTION_TYPE.SET_FARM_DATA; payload: typeof store.farmData }
  | {
      type: ACTION_TYPE.SET_DEVICE_TYPE_DATA;
      payload: typeof store.deviceTypeData;
    }
  | { type: ACTION_TYPE.SET_ERROR_TYPE; payload: typeof store.errorType }
  | { type: ACTION_TYPE.SET_ERROR_TEXT; payload: typeof store.errorText }
  | {
      type: ACTION_TYPE.SET_IS_DELETE_MODAL_VISIBLE;
      payload: typeof store.isDeleteModalVisible;
    }
  | {
      type: ACTION_TYPE.SET_IS_CONFIRM_R0_MODAL_VISIBLE;
      payload: typeof store.isConfirmR0ModalVisible;
    }
  | {
      type: ACTION_TYPE.SET_TRIGGER_R0;
      payload: typeof store.triggerR0;
    }
  | {
      type: ACTION_TYPE.SET_SELECTED_ROW_KEYS;
      payload: typeof store.selectedRowKeys;
    }
  | {
      type: ACTION_TYPE.SET_SELECTED_DEVICES;
      payload: typeof store.selectedDevices;
    }
  | {
      type: ACTION_TYPE.SET_IS_ASSIGN_OTA_MODAL_VISIBLE;
      payload: typeof store.isAssignOtaModalVisible;
    }
  | { type: ACTION_TYPE.SET_FIRMWARE_DATA; payload: typeof store.firmwareData }
  | { type: ACTION_TYPE.SET_FIRMWARE; payload: typeof store.firmware }
  | {
      type: ACTION_TYPE.SET_DELETED_DEVICE_ID;
      payload: typeof store.deletedDeviceId;
    };
