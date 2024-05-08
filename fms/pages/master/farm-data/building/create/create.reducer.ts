import { ACTIONS, ACTION_TYPE, TStore } from "./create.constants";

export function reducer(store: TStore, action: ACTIONS): TStore {
  switch (action.type) {
    case ACTION_TYPE.SET_ERROR_TYPE:
      return { ...store, errorType: action.payload };
    case ACTION_TYPE.SET_ERROR_TEXT:
      return { ...store, errorText: action.payload };
    case ACTION_TYPE.SET_FARM:
      return { ...store, farm: action.payload };
    case ACTION_TYPE.SET_BUILDING_NAME:
      return { ...store, buildingName: action.payload };
    case ACTION_TYPE.SET_BUILDING_TYPE:
      return { ...store, buildingType: action.payload };
    case ACTION_TYPE.SET_LENGTH_DATA:
      return { ...store, lengthData: action.payload };
    case ACTION_TYPE.SET_WIDTH:
      return { ...store, width: action.payload };
    case ACTION_TYPE.SET_HEIGHT:
      return { ...store, height: action.payload };
    case ACTION_TYPE.SET_STATUS:
      return { ...store, status: action.payload };
    case ACTION_TYPE.SET_FARM_DATA:
      return { ...store, farmData: action.payload };
    case ACTION_TYPE.SET_BUILDING_TYPE_DATA:
      return { ...store, buildingTypeData: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}
