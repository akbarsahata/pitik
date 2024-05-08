import { IDropdownItem } from "@type/dropdown.interface";
import { TBuildingTypeResponse, TFarmResponse } from "@type/response.type";

export enum ERROR_TYPE {
  NONE = "NONE",
  GENERAL = "GENERAL",
  FARM = "FARM",
  BUILDING_NAME = "BUILDING_NAME",
  BUILDING_TYPE = "BUILDING_TYPE",
  LENGTH_DATA = "LENGTH_DATA",
  WIDTH = "WIDTH",
  HEIGHT = "HEIGHT",
  STATUS = "STATUS",
}

export enum ACTION_TYPE {
  SET_ERROR_TYPE = "SET_ERROR_TYPE",
  SET_ERROR_TEXT = "SET_ERROR_TEXT",
  SET_OLD_NAME = "SET_OLD_NAME",
  SET_FARM = "SET_FARM",
  SET_BUILDING_NAME = "SET_BUILDING_NAME",
  SET_BUILDING_TYPE = "SET_BUILDING_TYPE",
  SET_LENGTH_DATA = "SET_LENGTH_DATA",
  SET_WIDTH = "SET_WIDTH",
  SET_HEIGHT = "SET_HEIGHT",
  SET_STATUS = "SET_STATUS",
  SET_FARM_DATA = "SET_FARM_DATA",
  SET_BUILDING_TYPE_DATA = "SET_BUILDING_TYPE_DATA",
}

export type TStore = {
  errorType: ERROR_TYPE;
  errorText: string;
  oldName: string;
  farm: IDropdownItem<TFarmResponse> | null;
  buildingName: string;
  buildingType: IDropdownItem<TBuildingTypeResponse> | null;
  lengthData: number | undefined;
  width: number | undefined;
  height: number | undefined;
  status: IDropdownItem<boolean> | null;
  farmData: TFarmResponse[];
  buildingTypeData: TBuildingTypeResponse[];
};

export const store: TStore = {
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  oldName: "",
  farm: null,
  buildingName: "",
  buildingType: null,
  lengthData: undefined,
  width: undefined,
  height: undefined,
  status: null,
  farmData: [],
  buildingTypeData: [],
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_ERROR_TYPE; payload: typeof store.errorType }
  | { type: ACTION_TYPE.SET_ERROR_TEXT; payload: typeof store.errorText }
  | { type: ACTION_TYPE.SET_OLD_NAME; payload: typeof store.oldName }
  | { type: ACTION_TYPE.SET_FARM; payload: typeof store.farm }
  | { type: ACTION_TYPE.SET_BUILDING_NAME; payload: typeof store.buildingName }
  | { type: ACTION_TYPE.SET_BUILDING_TYPE; payload: typeof store.buildingType }
  | { type: ACTION_TYPE.SET_LENGTH_DATA; payload: typeof store.lengthData }
  | { type: ACTION_TYPE.SET_WIDTH; payload: typeof store.width }
  | { type: ACTION_TYPE.SET_HEIGHT; payload: typeof store.height }
  | { type: ACTION_TYPE.SET_STATUS; payload: typeof store.status }
  | { type: ACTION_TYPE.SET_FARM_DATA; payload: typeof store.farmData }
  | {
      type: ACTION_TYPE.SET_BUILDING_TYPE_DATA;
      payload: typeof store.buildingTypeData;
    };
