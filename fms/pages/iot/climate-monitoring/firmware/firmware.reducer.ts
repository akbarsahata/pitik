import { ACTIONS, ACTION_TYPE, search, TStore } from "./firmware.constants";

export function reducer(store: TStore, action: ACTIONS): TStore {
  switch (action.type) {
    case ACTION_TYPE.SET_ERROR_TYPE:
      return { ...store, errorType: action.payload };
    case ACTION_TYPE.SET_ERROR_TEXT:
      return { ...store, errorText: action.payload };
    case ACTION_TYPE.SET_IS_LAST_PAGE:
      return { ...store, isLastPage: action.payload };
    case ACTION_TYPE.SET_TABLE_PAGE:
      return { ...store, tablePage: action.payload };
    case ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE:
      return { ...store, isAdvanceSearchVisible: action.payload };
    case ACTION_TYPE.SET_IS_ADD_FIRMWARE_MODAL_VISIBLE:
      return { ...store, isAddFirmwareModalVisible: action.payload };
    case ACTION_TYPE.SET_VERSION:
      return { ...store, version: action.payload };
    case ACTION_TYPE.SET_DESCRIPTION:
      return { ...store, description: action.payload };
    case ACTION_TYPE.SET_DEVICE_TYPE_DATA:
      return { ...store, deviceTypeData: action.payload };
    case ACTION_TYPE.SET_FILE_NAME:
      return { ...store, fileName: action.payload };
    case ACTION_TYPE.SET_FILE:
      return { ...store, file: action.payload };
    case ACTION_TYPE.SET_DEVICE_TYPE:
      return { ...store, deviceType: action.payload };
    case ACTION_TYPE.SET_SEARCH:
      return { ...store, search: action.payload };
    case ACTION_TYPE.SET_INPUT_SEARCH:
      return { ...store, inputSearch: action.payload };
    case ACTION_TYPE.RESET_SEARCH:
      return { ...store, search: search, inputSearch: search };
    case ACTION_TYPE.SET_IS_DELETE_MODAL_VISIBLE:
      return { ...store, isDeleteModalVisible: action.payload };
    case ACTION_TYPE.SET_DELETED_FIRMWARE_ID:
      return { ...store, deletedFirmwareId: action.payload };
    default:
      throw new Error("Reducer failure!");
  }
}
