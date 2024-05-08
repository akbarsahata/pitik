import { ACTIONS, ACTION_TYPE, TStore } from "./create.constants";

export function reducer(store: TStore, action: ACTIONS): TStore {
  switch (action.type) {
    case ACTION_TYPE.SET_ERROR_TYPE:
      return { ...store, errorType: action.payload };
    case ACTION_TYPE.SET_ERROR_TEXT:
      return { ...store, errorText: action.payload };
    case ACTION_TYPE.SET_COOP_TYPE_DATA:
      return { ...store, coopTypeData: action.payload };
    case ACTION_TYPE.SET_CHICK_TYPE_DATA:
      return { ...store, chickTypeData: action.payload };
    case ACTION_TYPE.SET_VARIABLE_DATA:
      return { ...store, variableData: action.payload };
    case ACTION_TYPE.SET_GENERATE_TARGETS:
      return { ...store, generateTargets: action.payload };
    case ACTION_TYPE.SET_REMOVE_ALL_TARGETS_MODAL_VISIBLE:
      return { ...store, removeAllTargetsModalVisible: action.payload };
    case ACTION_TYPE.SET_TARGET_CODE:
      return { ...store, targetCode: action.payload };
    case ACTION_TYPE.SET_TARGET_NAME:
      return { ...store, targetName: action.payload };
    case ACTION_TYPE.SET_STATUS:
      return { ...store, status: action.payload };
    case ACTION_TYPE.SET_TARGET_DAYS_COUNT:
      return { ...store, targetDaysCount: action.payload };
    case ACTION_TYPE.SET_REMARKS:
      return { ...store, remarks: action.payload };
    case ACTION_TYPE.SET_COOP_TYPE:
      return { ...store, coopType: action.payload };
    case ACTION_TYPE.SET_CHICK_TYPE:
      return { ...store, chickType: action.payload };
    case ACTION_TYPE.SET_VARIABLE:
      return { ...store, variable: action.payload };
    case ACTION_TYPE.SET_TARGETS:
      return { ...store, targets: action.payload };
    default:
      throw new Error("Reducer failure!");
  }
}
