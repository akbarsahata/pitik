import { ACTIONS, ACTION_TYPE, TStore } from "./create.constants";

export function reducer(store: TStore, action: ACTIONS): TStore {
  switch (action.type) {
    case ACTION_TYPE.SET_ERROR_TYPE:
      return { ...store, errorType: action.payload };
    case ACTION_TYPE.SET_ERROR_TEXT:
      return { ...store, errorText: action.payload };
    case ACTION_TYPE.SET_MAC:
      return { ...store, mac: action.payload };
    case ACTION_TYPE.SET_COOP_CODE:
      return { ...store, coopCode: action.payload };
    case ACTION_TYPE.SET_DEVICE_ID:
      return { ...store, deviceId: action.payload };
    case ACTION_TYPE.SET_ACTIVE_TAB:
      return { ...store, activeTab: action.payload };
    case ACTION_TYPE.SET_IS_SENSOR_POSITION_MODAL_VISIBLE:
      return { ...store, isSensorPositionModalVisible: action.payload };
    case ACTION_TYPE.SET_SENSORS:
      return { ...store, sensors: action.payload };
    case ACTION_TYPE.SET_FARM:
      return { ...store, farm: action.payload };
    case ACTION_TYPE.SET_COOP:
      return { ...store, coop: action.payload };
    case ACTION_TYPE.SET_BUILDING:
      return { ...store, building: action.payload };
    case ACTION_TYPE.SET_ROOM:
      return { ...store, room: action.payload };
    case ACTION_TYPE.SET_DEVICE_TYPE:
      return { ...store, deviceType: action.payload };
    case ACTION_TYPE.SET_DEVICE_TYPE_DATA:
      return { ...store, deviceTypeData: action.payload };
    case ACTION_TYPE.SET_FARM_DATA:
      return { ...store, farmData: action.payload };
    case ACTION_TYPE.SET_COOP_DATA:
      return { ...store, coopData: action.payload };
    case ACTION_TYPE.SET_BUILDING_DATA:
      return { ...store, buildingData: action.payload };
    case ACTION_TYPE.SET_ROOM_DATA:
      return { ...store, roomData: action.payload };
    case ACTION_TYPE.SET_COOLING_PAD:
      return { ...store, coolingPad: action.payload };
    case ACTION_TYPE.SET_LAMP:
      return { ...store, lamp: action.payload };
    case ACTION_TYPE.SET_HEATER_ID:
      return { ...store, heaterId: action.payload };
    case ACTION_TYPE.SET_CONTROLLER_TYPE:
      return { ...store, controllerType: action.payload };
    case ACTION_TYPE.SET_CONTROLLER_TYPE_DATA:
      return { ...store, controllerTypeData: action.payload };
    case ACTION_TYPE.SET_HEATER_TYPE_DATA:
      return { ...store, heaterTypeData: action.payload };
    case ACTION_TYPE.SET_CONTROLLER_TYPE:
      return { ...store, controllerType: action.payload };
    case ACTION_TYPE.SET_CONTROLLER_TYPE_DATA:
      return { ...store, controllerTypeData: action.payload };
    case ACTION_TYPE.SET_TOTAL_FAN:
      return { ...store, totalFan: action.payload };
    default:
      throw new Error("Reducer failure!");
  }
}
