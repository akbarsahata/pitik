import { IDropdownItem } from "@type/dropdown.interface";
import {
  TBuildingResponse,
  TControllerTypeResponse,
  TCoopResponse,
  TDeviceTypeResponse,
  TFarmResponse,
  THeaterInRoomsResponse,
  TRoomResponse,
} from "@type/response.type";

export enum ERROR_TYPE {
  NONE = "NONE",
  GENERAL = "GENERAL",
  MAC = "MAC",
  DEVICE_TYPE = "DEVICE_TYPE",
  DEVICE_ID = "DEVICE_ID",
  IP_CAMERA = "IP_CAMERA",
  COOP = "COOP",
  BUILDING = "BUILDING",
  ROOM = "ROOM",
  COOLING_PAD = "COOLING_PAD",
  LAMP = "LAMP",
  TOTAL_FAN = "TOTAL_FAN",
  CONTROLLER_TYPE = "CONTROLLER_TYPE",
}

export enum ACTION_TYPE {
  SET_ERROR_TYPE = "SET_ERROR_TYPE",
  SET_ERROR_TEXT = "SET_ERROR_TEXT",
  SET_MAC = "SET_MAC",
  SET_COOP_CODE = "SET_COOP_CODE",
  SET_DEVICE_ID = "SET_DEVICE_ID",
  SET_ACTIVE_TAB = "SET_ACTIVE_TAB",
  SET_IS_SENSOR_POSITION_MODAL_VISIBLE = "SET_IS_SENSOR_POSITION_MODAL_VISIBLE",
  SET_SENSORS = "SET_SENSORS",
  SET_FARM = "SET_FARM",
  SET_COOP = "SET_COOP",
  SET_BUILDING = "SET_BUILDING",
  SET_ROOM = "SET_ROOM",
  SET_FARM_DATA = "SET_FARM_DATA",
  SET_COOP_DATA = "SET_COOP_DATA",
  SET_BUILDING_DATA = "SET_BUILDING_DATA",
  SET_ROOM_DATA = "SET_ROOM_DATA",
  SET_DEVICE_TYPE = "SET_DEVICE_TYPE",
  SET_DEVICE_TYPE_DATA = "SET_DEVICE_TYPE_DATA",
  SET_COOLING_PAD = "SET_COOLING_PAD",
  SET_LAMP = "SET_LAMP",
  SET_HEATER_ID = "SET_HEATER_ID",
  SET_HEATER_TYPE_DATA = "SET_HEATER_TYPE_DATA",
  SET_TOTAL_FAN = "SET_TOTAL_FAN",
  SET_CONTROLLER_TYPE = "SET_CONTROLLER_TYPE",
  SET_CONTROLLER_TYPE_DATA = "SET_CONTROLLER_TYPE_DATA",
}

export type TSensorPayload = {
  id: string;
  sensorType: IDropdownItem<string> | null;
  sensorCode: string;
  position: IDropdownItem<string> | null;
  room: IDropdownItem<TRoomResponse> | null;
  ipCamera: string;
};

export const SENSOR_TYPES_OBJECT = {
  XIAOMI_SENSOR: "XIAOMI_SENSOR",
  WIND_SPEED: "WIND_SPEED",
  TEMPERATURE_SENSOR: "TEMPERATURE_SENSOR",
  HUMIDITY_SENSOR: "HUMIDITY_SENSOR",
  CAMERA: "CAMERA",
  AMMONIA: "AMMONIA",
  LIGHT: "LIGHT",
};

export type TStore = {
  errorType: ERROR_TYPE;
  errorText: string;
  mac: string;
  coopCode: string;
  deviceId: string;
  isSensorPositionModalVisible: boolean;
  activeTab: "device" | "sensors";
  sensors: TSensorPayload[];
  farm: IDropdownItem<TFarmResponse> | null;
  coop: IDropdownItem<TCoopResponse> | null;
  building: IDropdownItem<TBuildingResponse> | null;
  room: IDropdownItem<TRoomResponse> | null;
  deviceType: IDropdownItem<TDeviceTypeResponse> | null;
  controllerType: IDropdownItem<TControllerTypeResponse> | null;
  coolingPad: IDropdownItem<boolean> | null;
  lamp: IDropdownItem<boolean> | null;
  heaterId: IDropdownItem<THeaterInRoomsResponse> | null;
  totalFan: IDropdownItem<number> | null;
  farmData: TFarmResponse[];
  coopData: TCoopResponse[];
  buildingData: TBuildingResponse[];
  roomData: TRoomResponse[];
  deviceTypeData: TDeviceTypeResponse[];
  heaterTypeData: THeaterInRoomsResponse[];
  controllerTypeData: TControllerTypeResponse[];
};

export const store: TStore = {
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  mac: "",
  coopCode: "",
  deviceId: "",
  activeTab: "device",
  isSensorPositionModalVisible: false,
  sensors: [],
  farm: null,
  coop: null,
  building: null,
  room: null,
  deviceType: null,
  controllerType: null,
  coolingPad: null,
  lamp: null,
  heaterId: null,
  totalFan: null,
  farmData: [],
  coopData: [],
  buildingData: [],
  roomData: [],
  deviceTypeData: [],
  heaterTypeData: [],
  controllerTypeData: [],
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_ERROR_TYPE; payload: typeof store.errorType }
  | { type: ACTION_TYPE.SET_ERROR_TEXT; payload: typeof store.errorText }
  | { type: ACTION_TYPE.SET_MAC; payload: typeof store.mac }
  | { type: ACTION_TYPE.SET_COOP_CODE; payload: typeof store.coopCode }
  | { type: ACTION_TYPE.SET_DEVICE_ID; payload: typeof store.deviceId }
  | { type: ACTION_TYPE.SET_ACTIVE_TAB; payload: typeof store.activeTab }
  | {
      type: ACTION_TYPE.SET_IS_SENSOR_POSITION_MODAL_VISIBLE;
      payload: typeof store.isSensorPositionModalVisible;
    }
  | { type: ACTION_TYPE.SET_SENSORS; payload: typeof store.sensors }
  | { type: ACTION_TYPE.SET_FARM; payload: typeof store.farm }
  | { type: ACTION_TYPE.SET_COOP; payload: typeof store.coop }
  | { type: ACTION_TYPE.SET_BUILDING; payload: typeof store.building }
  | { type: ACTION_TYPE.SET_ROOM; payload: typeof store.room }
  | { type: ACTION_TYPE.SET_FARM_DATA; payload: typeof store.farmData }
  | { type: ACTION_TYPE.SET_COOP_DATA; payload: typeof store.coopData }
  | { type: ACTION_TYPE.SET_BUILDING_DATA; payload: typeof store.buildingData }
  | { type: ACTION_TYPE.SET_ROOM_DATA; payload: typeof store.roomData }
  | { type: ACTION_TYPE.SET_DEVICE_TYPE; payload: typeof store.deviceType }
  | {
      type: ACTION_TYPE.SET_DEVICE_TYPE_DATA;
      payload: typeof store.deviceTypeData;
    }
  | { type: ACTION_TYPE.SET_COOLING_PAD; payload: typeof store.coolingPad }
  | { type: ACTION_TYPE.SET_LAMP; payload: typeof store.lamp }
  | { type: ACTION_TYPE.SET_HEATER_ID; payload: typeof store.heaterId }
  | {
      type: ACTION_TYPE.SET_HEATER_TYPE_DATA;
      payload: typeof store.heaterTypeData;
    }
  | {
      type: ACTION_TYPE.SET_CONTROLLER_TYPE;
      payload: typeof store.controllerType;
    }
  | {
      type: ACTION_TYPE.SET_CONTROLLER_TYPE_DATA;
      payload: typeof store.controllerTypeData;
    }
  | { type: ACTION_TYPE.SET_TOTAL_FAN; payload: typeof store.totalFan };
