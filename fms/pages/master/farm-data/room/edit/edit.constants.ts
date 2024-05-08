import { IDropdownItem } from "@type/dropdown.interface";
import {
  TBuildingResponse,
  TControllerTypeResponse,
  TCoopResponse,
  TFanResponse,
  TFloorTypeResponse,
  THeaterTypeResponse,
  TRoomTypeResponse,
} from "@type/response.type";
import { THeaterInRoomsBody } from "../room.constants";

export enum ERROR_TYPE {
  NONE = "NONE",
  GENERAL = "GENERAL",
  COOP = "COOP",
  BUILDING = "BUILDING",
  ROOM_TYPE = "ROOM_TYPE",
  FLOOR_TYPE = "FLOOR_TYPE",
  POPULATION = "POPULATION",
  IS_COOLING_PAD_EXIST = "IS_COOLING_PAD_EXIST",
  INLET_POSITION = "INLET_POSITION",
  INLET_WIDTH = "INLET_WIDTH",
  INLET_LENGTH = "INLET_LENGTH",
  STATUS = "STATUS",
  FANS = "FANS",
  HEATER_IN_ROOMS = "HEATER_IN_ROOMS",
}

export enum ACTION_TYPE {
  SET_ERROR_TYPE = "SET_ERROR_TYPE",
  SET_ERROR_TEXT = "SET_ERROR_TEXT",
  SET_OLD_NAME = "SET_OLD_NAME",
  SET_COOP = "SET_COOP",
  SET_BUILDING = "SET_BUILDING",
  SET_ROOM_TYPE = "SET_ROOM_TYPE",
  SET_FLOOR_TYPE = "SET_FLOOR_TYPE",
  SET_POPULATION = "SET_POPULATION",
  SET_COOLING_PAD = "SET_COOLING_PAD",
  SET_INLET_POSITION = "SET_INLET_POSITION",
  SET_INLET_WIDTH = "SET_INLET_WIDTH",
  SET_INLET_LENGTH = "SET_INLET_LENGTH",
  SET_CONTROLLER_TYPE = "SET_CONTROLLER_TYPE",
  SET_FANS = "SET_FANS",
  SET_HEATER_IN_ROOMS = "SET_HEATER_IN_ROOMS",
  SET_STATUS = "SET_STATUS",
  SET_COOP_DATA = "SET_COOP_DATA",
  SET_BUILDING_DATA = "SET_BUILDING_DATA",
  SET_ROOM_TYPE_DATA = "SET_ROOM_TYPE_DATA",
  SET_FLOOR_TYPE_DATA = "SET_FLOOR_TYPE_DATA",
  SET_CONTROLLER_TYPE_DATA = "SET_CONTROLLER_TYPE_DATA",
  SET_HEATER_TYPE_DATA = "SET_HEATER_TYPE_DATA",
  SET_IS_FAN_MODAL_VISIBLE = "SET_IS_FAN_MODAL_VISIBLE",
  SET_INPUT_FAN = "SET_INPUT_FAN",
  SET_IS_HEATER_MODAL_VISIBLE = "SET_IS_HEATER_MODAL_VISIBLE",
  SET_INPUT_HEATER = "SET_INPUT_HEATER",
}

export type TStore = {
  errorType: ERROR_TYPE;
  errorText: string;
  oldName: string;
  coop: IDropdownItem<TCoopResponse> | null;
  building: IDropdownItem<TBuildingResponse> | null;
  roomType: IDropdownItem<TRoomTypeResponse> | null;
  floorType: IDropdownItem<TFloorTypeResponse> | null;
  population: number | undefined;
  coolingPad: IDropdownItem<boolean> | null;
  inletPosition: IDropdownItem<string> | null;
  inletWidth: number | undefined;
  inletLength: number | undefined;
  controllerType: IDropdownItem<TControllerTypeResponse> | null;
  fans: TFanResponse[];
  heaterInRooms: THeaterInRoomsBody[];
  status: IDropdownItem<boolean> | null;
  coopData: TCoopResponse[];
  buildingData: TBuildingResponse[];
  roomTypeData: TRoomTypeResponse[];
  floorTypeData: TFloorTypeResponse[];
  controllerTypeData: TControllerTypeResponse[];
  heaterTypeData: THeaterTypeResponse[];
  isFanModalVisible: boolean;
  inputFan: {
    id: string;
    capacity: number | null;
    size: number | null;
  };
  isHeaterModalVisible: boolean;
  inputHeater: {
    id: string;
    heaterType: IDropdownItem<THeaterTypeResponse> | null;
    quantity: number | null;
  };
};

export const store: TStore = {
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  oldName: "",
  coop: null,
  building: null,
  roomType: null,
  floorType: null,
  population: undefined,
  coolingPad: null,
  inletPosition: null,
  inletWidth: undefined,
  inletLength: undefined,
  controllerType: null,
  fans: [],
  heaterInRooms: [],
  status: null,
  coopData: [],
  buildingData: [],
  roomTypeData: [],
  floorTypeData: [],
  controllerTypeData: [],
  heaterTypeData: [],
  isFanModalVisible: false,
  inputFan: {
    id: "",
    capacity: null,
    size: null,
  },
  isHeaterModalVisible: false,
  inputHeater: {
    id: "",
    heaterType: null,
    quantity: null,
  },
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_ERROR_TYPE; payload: typeof store.errorType }
  | { type: ACTION_TYPE.SET_ERROR_TEXT; payload: typeof store.errorText }
  | { type: ACTION_TYPE.SET_OLD_NAME; payload: typeof store.oldName }
  | { type: ACTION_TYPE.SET_COOP; payload: typeof store.coop }
  | { type: ACTION_TYPE.SET_BUILDING; payload: typeof store.building }
  | { type: ACTION_TYPE.SET_ROOM_TYPE; payload: typeof store.roomType }
  | { type: ACTION_TYPE.SET_FLOOR_TYPE; payload: typeof store.floorType }
  | { type: ACTION_TYPE.SET_POPULATION; payload: typeof store.population }
  | { type: ACTION_TYPE.SET_COOLING_PAD; payload: typeof store.coolingPad }
  | {
      type: ACTION_TYPE.SET_INLET_POSITION;
      payload: typeof store.inletPosition;
    }
  | { type: ACTION_TYPE.SET_INLET_WIDTH; payload: typeof store.inletWidth }
  | { type: ACTION_TYPE.SET_INLET_LENGTH; payload: typeof store.inletLength }
  | {
      type: ACTION_TYPE.SET_CONTROLLER_TYPE;
      payload: typeof store.controllerType;
    }
  | { type: ACTION_TYPE.SET_FANS; payload: typeof store.fans }
  | {
      type: ACTION_TYPE.SET_HEATER_IN_ROOMS;
      payload: typeof store.heaterInRooms;
    }
  | { type: ACTION_TYPE.SET_STATUS; payload: typeof store.status }
  | { type: ACTION_TYPE.SET_COOP_DATA; payload: typeof store.coopData }
  | { type: ACTION_TYPE.SET_BUILDING_DATA; payload: typeof store.buildingData }
  | { type: ACTION_TYPE.SET_ROOM_TYPE_DATA; payload: typeof store.roomTypeData }
  | {
      type: ACTION_TYPE.SET_FLOOR_TYPE_DATA;
      payload: typeof store.floorTypeData;
    }
  | {
      type: ACTION_TYPE.SET_CONTROLLER_TYPE_DATA;
      payload: typeof store.controllerTypeData;
    }
  | {
      type: ACTION_TYPE.SET_HEATER_TYPE_DATA;
      payload: typeof store.heaterTypeData;
    }
  | {
      type: ACTION_TYPE.SET_IS_FAN_MODAL_VISIBLE;
      payload: typeof store.isFanModalVisible;
    }
  | { type: ACTION_TYPE.SET_INPUT_FAN; payload: typeof store.inputFan }
  | {
      type: ACTION_TYPE.SET_IS_HEATER_MODAL_VISIBLE;
      payload: typeof store.isHeaterModalVisible;
    }
  | { type: ACTION_TYPE.SET_INPUT_HEATER; payload: typeof store.inputHeater };
