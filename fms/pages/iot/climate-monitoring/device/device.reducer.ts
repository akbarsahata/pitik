import { ACTIONS, ACTION_TYPE, TStore, search } from "./device.constants";

export function reducer(store: TStore, action: ACTIONS): TStore {
  switch (action.type) {
    case ACTION_TYPE.SET_IS_LAST_PAGE:
      return { ...store, isLastPage: action.payload };
    case ACTION_TYPE.SET_TABLE_PAGE:
      return { ...store, tablePage: action.payload };
    case ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE:
      return { ...store, isAdvanceSearchVisible: action.payload };
    case ACTION_TYPE.SET_SEARCH:
      return { ...store, search: action.payload };
    case ACTION_TYPE.SET_INPUT_SEARCH:
      return { ...store, inputSearch: action.payload };
    case ACTION_TYPE.SET_FARM_DATA:
      return { ...store, farmData: action.payload };
    case ACTION_TYPE.SET_COOP_DATA:
      return { ...store, coopData: action.payload };
    case ACTION_TYPE.SET_DEVICE_TYPE_DATA:
      return { ...store, deviceTypeData: action.payload };
    case ACTION_TYPE.RESET_SEARCH:
      return { ...store, search: search, inputSearch: search };
    case ACTION_TYPE.SET_ERROR_TYPE:
      return { ...store, errorType: action.payload };
    case ACTION_TYPE.SET_ERROR_TEXT:
      return { ...store, errorText: action.payload };
    case ACTION_TYPE.SET_IS_DELETE_MODAL_VISIBLE:
      return { ...store, isDeleteModalVisible: action.payload };
    case ACTION_TYPE.SET_IS_CONFIRM_R0_MODAL_VISIBLE:
      return { ...store, isConfirmR0ModalVisible: action.payload };
    case ACTION_TYPE.SET_TRIGGER_R0:
      return { ...store, triggerR0: action.payload };
    case ACTION_TYPE.SET_SELECTED_ROW_KEYS:
      return { ...store, selectedRowKeys: action.payload };
    case ACTION_TYPE.SET_SELECTED_DEVICES:
      return { ...store, selectedDevices: action.payload };
    case ACTION_TYPE.SET_IS_ASSIGN_OTA_MODAL_VISIBLE:
      return { ...store, isAssignOtaModalVisible: action.payload };
    case ACTION_TYPE.SET_FIRMWARE_DATA:
      return { ...store, firmwareData: action.payload };
    case ACTION_TYPE.SET_FIRMWARE:
      return { ...store, firmware: action.payload };
    case ACTION_TYPE.SET_DELETED_DEVICE_ID:
      return { ...store, deletedDeviceId: action.payload };
    default:
      throw new Error("Reducer failure!");
  }
}
