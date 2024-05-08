import { TDevicesSensorResponse } from "@type/response.type";

export enum ACTION_TYPE {
  SET_DEVICE_DATA = "SET_DEVICE_DATA",
  SET_IS_DEVICE_MODAL_VISIBLE = "SET_IS_DEVICE_MODAL_VISIBLE",
  SET_FILTERED_DEVICE_DATA = "SET_FILTERED_DEVICE_DATA",
  SET_MODAL_TITLE = "SET_MODAL_TITLE",
}

export type TStore = {
  deviceData: TDevicesSensorResponse[];
  isDeviceModalVisible: boolean;
  filteredDeviceData: TDevicesSensorResponse[];
  modalTitle: string;
};

export const store: TStore = {
  deviceData: [],
  isDeviceModalVisible: false,
  filteredDeviceData: [],
  modalTitle: "",
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_DEVICE_DATA; payload: typeof store.deviceData }
  | {
      type: ACTION_TYPE.SET_IS_DEVICE_MODAL_VISIBLE;
      payload: typeof store.isDeviceModalVisible;
    }
  | {
      type: ACTION_TYPE.SET_FILTERED_DEVICE_DATA;
      payload: typeof store.filteredDeviceData;
    }
  | { type: ACTION_TYPE.SET_MODAL_TITLE; payload: typeof store.modalTitle };
