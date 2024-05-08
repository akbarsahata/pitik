import { IDropdownItem } from "@type/dropdown.interface";
import {
  TBuildingResponse,
  TBuildingTypeResponse,
  TCoopResponse,
  TFarmResponse,
  TFloorTypeResponse,
  THeaterTypeResponse,
  TRoomTypeResponse,
  TUserResponse,
} from "@type/response.type";

export type THeaterInRoomsBody = {
  id: string;
  heaterType: IDropdownItem<THeaterTypeResponse> | null;
  quantity: number | null;
};

export enum ACTION_TYPE {
  SET_IS_LAST_PAGE = "SET_IS_LAST_PAGE",
  SET_TABLE_PAGE = "SET_TABLE_PAGE",
  SET_IS_ADVANCE_SEARCH_VISIBLE = "SET_IS_ADVANCE_SEARCH_VISIBLE",
  SET_SEARCH = "SET_SEARCH",
  SET_INPUT_SEARCH = "SET_INPUT_SEARCH",
  RESET_SEARCH = "RESET_SEARCH",
  SET_FARM_DATA = "SET_FARM_DATA",
  SET_OWNER_DATA = "SET_OWNER_DATA",
  SET_COOP_DATA = "SET_COOP_DATA",
  SET_BUILDING_DATA = "SET_BUILDING_DATA",
  SET_BUILDING_TYPE_DATA = "SET_BUILDING_TYPE_DATA",
  SET_ROOM_TYPE_DATA = "SET_ROOM_TYPE_DATA",
  SET_FLOOR_TYPE_DATA = "SET_FLOOR_TYPE_DATA",
}

export type TSearch = {
  farm: IDropdownItem<TFarmResponse> | null;
  owner: IDropdownItem<TUserResponse> | null;
  status: IDropdownItem<boolean> | null;
  coop: IDropdownItem<TCoopResponse> | null;
  building: IDropdownItem<TBuildingResponse> | null;
  buildingType: IDropdownItem<TBuildingTypeResponse> | null;
  roomType: IDropdownItem<TRoomTypeResponse> | null;
  floorType: IDropdownItem<TFloorTypeResponse> | null;
};

export const search: TSearch = {
  farm: null,
  owner: null,
  status: null,
  coop: null,
  building: null,
  buildingType: null,
  roomType: null,
  floorType: null,
};

export type TStore = {
  tablePage: number;
  isLastPage: boolean;
  isAdvanceSearchVisible: boolean;
  search: TSearch;
  inputSearch: TSearch;
  farmData: TFarmResponse[];
  ownerData: TUserResponse[];
  coopData: TCoopResponse[];
  buildingData: TBuildingResponse[];
  buildingTypeData: TBuildingTypeResponse[];
  roomTypeData: TRoomTypeResponse[];
  floorTypeData: TFloorTypeResponse[];
};

export const store: TStore = {
  tablePage: 1,
  isLastPage: false,
  isAdvanceSearchVisible: false,
  search: search,
  inputSearch: search,

  farmData: [],
  ownerData: [],
  coopData: [],
  buildingData: [],
  buildingTypeData: [],
  roomTypeData: [],
  floorTypeData: [],
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_IS_LAST_PAGE; payload: typeof store.isLastPage }
  | { type: ACTION_TYPE.SET_TABLE_PAGE; payload: typeof store.tablePage }
  | {
      type: ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE;
      payload: typeof store.isAdvanceSearchVisible;
    }
  | { type: ACTION_TYPE.SET_SEARCH; payload: typeof store.search }
  | { type: ACTION_TYPE.SET_INPUT_SEARCH; payload: typeof store.inputSearch }
  | { type: ACTION_TYPE.RESET_SEARCH; payload: null }
  | { type: ACTION_TYPE.SET_FARM_DATA; payload: typeof store.farmData }
  | { type: ACTION_TYPE.SET_OWNER_DATA; payload: typeof store.ownerData }
  | { type: ACTION_TYPE.SET_COOP_DATA; payload: typeof store.coopData }
  | { type: ACTION_TYPE.SET_BUILDING_DATA; payload: typeof store.buildingData }
  | {
      type: ACTION_TYPE.SET_BUILDING_TYPE_DATA;
      payload: typeof store.buildingTypeData;
    }
  | {
      type: ACTION_TYPE.SET_ROOM_TYPE_DATA;
      payload: typeof store.roomTypeData;
    }
  | {
      type: ACTION_TYPE.SET_FLOOR_TYPE_DATA;
      payload: typeof store.floorTypeData;
    };
