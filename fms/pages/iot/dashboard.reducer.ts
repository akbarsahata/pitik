import { ACTIONS, ACTION_TYPE, TStore } from "./dashboard.constants";

export function reducer(store: TStore, action: ACTIONS): TStore {
  switch (action.type) {
    case ACTION_TYPE.SET_DEVICE_DATA:
      return { ...store, deviceData: action.payload };
    case ACTION_TYPE.SET_IS_DEVICE_MODAL_VISIBLE:
      return { ...store, isDeviceModalVisible: action.payload };
    case ACTION_TYPE.SET_FILTERED_DEVICE_DATA:
      return { ...store, filteredDeviceData: action.payload };
    case ACTION_TYPE.SET_MODAL_TITLE:
      return { ...store, modalTitle: action.payload };
    default:
      throw new Error("Reducer failure!");
  }
}
