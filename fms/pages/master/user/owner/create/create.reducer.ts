import { ACTIONS, ACTION_TYPE, TStore } from "./create.constants";

export function reducer(store: TStore, action: ACTIONS): TStore {
  switch (action.type) {
    case ACTION_TYPE.SET_ERROR_TYPE:
      return { ...store, errorType: action.payload };
    case ACTION_TYPE.SET_ERROR_TEXT:
      return { ...store, errorText: action.payload };
    case ACTION_TYPE.SET_USER_CODE:
      return { ...store, userCode: action.payload };
    case ACTION_TYPE.SET_FULL_NAME:
      return { ...store, fullName: action.payload };
    case ACTION_TYPE.SET_EMAIL:
      return { ...store, email: action.payload };
    case ACTION_TYPE.SET_PHONE_NUMBER:
      return { ...store, phoneNumber: action.payload };
    case ACTION_TYPE.SET_WA_NUMBER:
      return { ...store, waNumber: action.payload };
    case ACTION_TYPE.SET_PASSWORD:
      return { ...store, password: action.payload };
    case ACTION_TYPE.SET_CONFIRM_PASSWORD:
      return { ...store, confirmPassword: action.payload };
    case ACTION_TYPE.SET_STATUS:
      return { ...store, status: action.payload };
    case ACTION_TYPE.SET_ROLE:
      return { ...store, role: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}
