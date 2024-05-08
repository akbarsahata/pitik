import { ACTIONS, ACTION_TYPE, TStore } from "./edit.constants";

export function reducer(store: TStore, action: ACTIONS): TStore {
  switch (action.type) {
    case ACTION_TYPE.SET_ERROR_TYPE:
      return { ...store, errorType: action.payload };
    case ACTION_TYPE.SET_ERROR_TEXT:
      return { ...store, errorText: action.payload };
    case ACTION_TYPE.SET_OLD_NAME:
      return { ...store, oldName: action.payload };
    case ACTION_TYPE.SET_ALERT_PRESET_CODE:
      return { ...store, alertPresetCode: action.payload };
    case ACTION_TYPE.SET_ALERT_PRESET_NAME:
      return { ...store, alertPresetName: action.payload };
    case ACTION_TYPE.SET_COOP_TYPE:
      return { ...store, coopType: action.payload };
    case ACTION_TYPE.SET_REMARKS:
      return { ...store, remarks: action.payload };
    case ACTION_TYPE.SET_STATUS:
      return { ...store, status: action.payload };
    case ACTION_TYPE.SET_COOP_TYPE_DATA:
      return { ...store, coopTypeData: action.payload };
    case ACTION_TYPE.SET_ALERT_IDS:
      return { ...store, alertIds: action.payload };
    case ACTION_TYPE.SET_IS_ALERT_LIST_MODAL_VISIBLE:
      return { ...store, isAlertListModalVisible: action.payload };
    case ACTION_TYPE.SET_ALERT_LIST_DATA:
      return { ...store, alertListData: action.payload };
    case ACTION_TYPE.SET_SELECTED_ALERTS:
      return { ...store, selectedAlerts: action.payload };
    case ACTION_TYPE.SET_SELECTED_ALERT_DETAILS:
      return { ...store, selectedAlertDetails: action.payload };
    case ACTION_TYPE.SET_TABLE_DATA:
      return { ...store, tableData: action.payload };
    case ACTION_TYPE.SET_SEARCH_ALERT_VALUE:
      return { ...store, searchAlertValue: action.payload };
    case ACTION_TYPE.SET_SEARCH_ALERT_RESULT:
      return { ...store, searchAlertResult: action.payload };
    default:
      throw new Error("Reducer failure!");
  }
}
