import { IDropdownItem } from "@type/dropdown.interface";
import {
  TBuildingResponse,
  TCoopResponse,
  TDevicesSensorResponse,
  TDeviceTypeResponse,
  TFarmResponse,
  TRoomResponse,
} from "@type/response.type";

//TODO: merge HISTORICAL_SENSOR_TYPES here with SENSOR_TYPES key on utils constants to reduce redundant line of codes and make modular
export const HISTORICAL_SENSOR_TYPES: Record<string, Record<string, string>> = {
  t: { key: "temperature", label: "Temperature (°C)" },
  h: { key: "humidity", label: "Humidity (%)" },
  a: { key: "ammonia", label: "Ammonia (ppm)" },
  l: { key: "lamp", label: "Lamp (lux)" },
  w: { key: "windSpeed", label: "Wind Speed (m/s)" },
  all: { key: "all", label: "All" },
};

export enum ERROR_TYPE {
  NONE = "NONE",
  GENERAL = "GENERAL",
}

export enum ACTION_TYPE {
  SET_IS_LAST_PAGE = "SET_IS_LAST_PAGE",
  SET_TABLE_PAGE = "SET_TABLE_PAGE",
  SET_IS_ADVANCE_SEARCH_VISIBLE = "SET_IS_ADVANCE_SEARCH_VISIBLE",
  SET_IS_EXPORT_BUTTON = "SET_IS_EXPORT_BUTTON",
  SET_TABLE_TO_EXPORT = "SET_TABLE_TO_EXPORT",

  SET_SEARCH = "SET_SEARCH",
  SET_INPUT_SEARCH = "SET_INPUT_SEARCH",
  RESET_SEARCH = "RESET_SEARCH",
  SET_DEVICE = "SET_DEVICE",

  SET_FARM_DATA = "SET_FARM_DATA",
  SET_COOP_DATA = "SET_COOP_DATA",
  SET_BUILDING_DATA = "SET_BUILDING_DATA",
  SET_ROOM_DATA = "SET_ROOM_DATA",
  SET_DEVICE_DATA = "SET_DEVICE_DATA",
  SET_DEVICE_TYPE_DATA = "SET_DEVICE_TYPE_DATA",
}

export type TSearch = {
  farm: IDropdownItem<TFarmResponse> | null;
  coop: IDropdownItem<TCoopResponse> | null;
  building: IDropdownItem<TBuildingResponse> | null;
  room: IDropdownItem<TRoomResponse> | null;
  device: IDropdownItem<TDevicesSensorResponse> | null;
  deviceType: IDropdownItem<TDeviceTypeResponse> | null;
  macAddress: string | undefined;
  startDate: string;
  endDate: string;
  interval: IDropdownItem<number> | null;
};

export type TSensorType = {
  date: string;
  id: string;
  value: number;
}[];

export type TColumn = {
  title: string;
  dataIndex: string;
  key: string;
};

export const emptySearch: TSearch = {
  farm: null,
  coop: null,
  building: null,
  room: null,
  device: null,
  deviceType: {
    value: {
      text: "Smart Monitoring",
      value: "SMART_MONITORING",
    },
    label: "Smart Monitoring",
  },
  macAddress: "",
  startDate: "",
  endDate: "",
  interval: null,
};

export type TStore = {
  tablePage: number;
  isLastPage: boolean;
  isAdvanceSearchVisible: boolean;
  isExportButton: boolean;
  tableToExport: string;
  search: TSearch;
  inputSearch: TSearch;
  farmData: TFarmResponse[];
  coopData: TCoopResponse[];
  buildingData: TBuildingResponse[];
  roomData: TRoomResponse[];
  deviceData: TDevicesSensorResponse[];
  deviceTypeData: TDeviceTypeResponse[];
};

export const store: TStore = {
  tablePage: 1,
  isLastPage: false,
  isAdvanceSearchVisible: false,
  isExportButton: false,
  tableToExport: "",
  search: emptySearch,
  inputSearch: emptySearch,
  farmData: [],
  coopData: [],
  buildingData: [],
  roomData: [],
  deviceData: [],
  deviceTypeData: [],
};

export type ACTIONS =
  | {
      type: ACTION_TYPE.SET_IS_LAST_PAGE;
      payload: typeof store.isLastPage;
    }
  | {
      type: ACTION_TYPE.SET_TABLE_PAGE;
      payload: typeof store.tablePage;
    }
  | {
      type: ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE;
      payload: typeof store.isAdvanceSearchVisible;
    }
  | {
      type: ACTION_TYPE.SET_IS_EXPORT_BUTTON;
      payload: typeof store.isExportButton;
    }
  | {
      type: ACTION_TYPE.SET_TABLE_TO_EXPORT;
      payload: typeof store.tableToExport;
    }
  | {
      type: ACTION_TYPE.SET_SEARCH;
      payload: typeof store.search;
    }
  | {
      type: ACTION_TYPE.SET_INPUT_SEARCH;
      payload: typeof store.inputSearch;
    }
  | {
      type: ACTION_TYPE.RESET_SEARCH;
      payload: null;
    }
  | {
      type: ACTION_TYPE.SET_DEVICE;
      payload: typeof store.search.device;
    }
  | {
      type: ACTION_TYPE.SET_FARM_DATA;
      payload: typeof store.farmData;
    }
  | {
      type: ACTION_TYPE.SET_BUILDING_DATA;
      payload: typeof store.buildingData;
    }
  | {
      type: ACTION_TYPE.SET_COOP_DATA;
      payload: typeof store.coopData;
    }
  | {
      type: ACTION_TYPE.SET_ROOM_DATA;
      payload: typeof store.roomData;
    }
  | {
      type: ACTION_TYPE.SET_DEVICE_DATA;
      payload: typeof store.deviceData;
    }
  | {
      type: ACTION_TYPE.SET_DEVICE_TYPE_DATA;
      payload: typeof store.deviceTypeData;
    };
