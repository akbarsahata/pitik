import { ACTIONS, ACTION_TYPE, TStore } from "./edit.constants";

export function reducer(store: TStore, action: ACTIONS) {
  switch (action.type) {
    case ACTION_TYPE.SET_ERROR_TYPE:
      return { ...store, errorType: action.payload };
    case ACTION_TYPE.SET_ERROR_TEXT:
      return { ...store, errorText: action.payload };
    case ACTION_TYPE.SET_OLD_NAME:
      return { ...store, oldName: action.payload };
    case ACTION_TYPE.SET_COOP_TYPE_CODE:
      return { ...store, coopTypeCode: action.payload };
    case ACTION_TYPE.SET_COOP_TYPE_NAME:
      return { ...store, coopTypeName: action.payload };
    case ACTION_TYPE.SET_REMARKS:
      return { ...store, remarks: action.payload };
    case ACTION_TYPE.SET_STATUS:
      return { ...store, status: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}
