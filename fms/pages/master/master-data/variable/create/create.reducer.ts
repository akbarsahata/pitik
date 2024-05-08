import { ACTIONS, ACTION_TYPE, TStore } from "./create.constants";

export function reducer(store: TStore, action: ACTIONS): TStore {
  switch (action.type) {
    case ACTION_TYPE.SET_ERROR_TYPE:
      return { ...store, errorType: action.payload };
    case ACTION_TYPE.SET_ERROR_TEXT:
      return { ...store, errorText: action.payload };
    case ACTION_TYPE.SET_VARIABLE_CODE:
      return { ...store, variableCode: action.payload };
    case ACTION_TYPE.SET_VARIABLE_NAME:
      return { ...store, variableName: action.payload };
    case ACTION_TYPE.SET_VARIABLE_UOM:
      return { ...store, variableUOM: action.payload };
    case ACTION_TYPE.SET_VARIABLE_TYPE:
      return { ...store, variableType: action.payload };
    case ACTION_TYPE.SET_DIGIT_COMA:
      return { ...store, digitComa: action.payload };
    case ACTION_TYPE.SET_REMARKS:
      return { ...store, remarks: action.payload };
    case ACTION_TYPE.SET_STATUS:
      return { ...store, status: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}
