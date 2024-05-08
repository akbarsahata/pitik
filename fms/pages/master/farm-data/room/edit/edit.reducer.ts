import { ACTIONS, ACTION_TYPE, TStore } from "./edit.constants";

export function reducer(store: TStore, action: ACTIONS): TStore {
  switch (action.type) {
    case ACTION_TYPE.SET_ERROR_TYPE:
      return { ...store, errorType: action.payload };
    case ACTION_TYPE.SET_ERROR_TEXT:
      return { ...store, errorText: action.payload };
    case ACTION_TYPE.SET_OLD_NAME:
      return { ...store, oldName: action.payload };
    case ACTION_TYPE.SET_COOP:
      return { ...store, coop: action.payload };
    case ACTION_TYPE.SET_BUILDING:
      return { ...store, building: action.payload };
    case ACTION_TYPE.SET_ROOM_TYPE:
      return { ...store, roomType: action.payload };
    case ACTION_TYPE.SET_FLOOR_TYPE:
      return { ...store, floorType: action.payload };
    case ACTION_TYPE.SET_POPULATION:
      return { ...store, population: action.payload };
    case ACTION_TYPE.SET_COOLING_PAD:
      return { ...store, coolingPad: action.payload };
    case ACTION_TYPE.SET_INLET_POSITION:
      return { ...store, inletPosition: action.payload };
    case ACTION_TYPE.SET_INLET_WIDTH:
      return { ...store, inletWidth: action.payload };
    case ACTION_TYPE.SET_INLET_LENGTH:
      return { ...store, inletLength: action.payload };
    case ACTION_TYPE.SET_CONTROLLER_TYPE:
      return { ...store, controllerType: action.payload };
    case ACTION_TYPE.SET_FANS:
      return { ...store, fans: action.payload };
    case ACTION_TYPE.SET_HEATER_IN_ROOMS:
      return { ...store, heaterInRooms: action.payload };
    case ACTION_TYPE.SET_STATUS:
      return { ...store, status: action.payload };
    case ACTION_TYPE.SET_COOP_DATA:
      return { ...store, coopData: action.payload };
    case ACTION_TYPE.SET_BUILDING_DATA:
      return { ...store, buildingData: action.payload };
    case ACTION_TYPE.SET_ROOM_TYPE_DATA:
      return { ...store, roomTypeData: action.payload };
    case ACTION_TYPE.SET_FLOOR_TYPE_DATA:
      return { ...store, floorTypeData: action.payload };
    case ACTION_TYPE.SET_CONTROLLER_TYPE_DATA:
      return { ...store, controllerTypeData: action.payload };
    case ACTION_TYPE.SET_HEATER_TYPE_DATA:
      return { ...store, heaterTypeData: action.payload };
    case ACTION_TYPE.SET_IS_FAN_MODAL_VISIBLE:
      return { ...store, isFanModalVisible: action.payload };
    case ACTION_TYPE.SET_INPUT_FAN:
      return { ...store, inputFan: action.payload };
    case ACTION_TYPE.SET_IS_HEATER_MODAL_VISIBLE:
      return { ...store, isHeaterModalVisible: action.payload };
    case ACTION_TYPE.SET_INPUT_HEATER:
      return { ...store, inputHeater: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}
