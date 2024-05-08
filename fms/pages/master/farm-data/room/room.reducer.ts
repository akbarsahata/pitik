import { ACTIONS, ACTION_TYPE, search, TStore } from "./room.constants";

export function reducer(store: TStore, action: ACTIONS): TStore {
  switch (action.type) {
    case ACTION_TYPE.SET_IS_LAST_PAGE:
      return { ...store, isLastPage: action.payload };
    case ACTION_TYPE.SET_TABLE_PAGE:
      return { ...store, tablePage: action.payload };
    case ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE:
      return { ...store, isAdvanceSearchVisible: action.payload };
    case ACTION_TYPE.SET_SEARCH:
      return { ...store, search: action.payload };
    case ACTION_TYPE.SET_INPUT_SEARCH:
      return { ...store, inputSearch: action.payload };
    case ACTION_TYPE.RESET_SEARCH:
      return { ...store, search: search, inputSearch: search };
    case ACTION_TYPE.SET_FARM_DATA:
      return { ...store, farmData: action.payload };
    case ACTION_TYPE.SET_OWNER_DATA:
      return { ...store, ownerData: action.payload };
    case ACTION_TYPE.SET_COOP_DATA:
      return { ...store, coopData: action.payload };
    case ACTION_TYPE.SET_BUILDING_DATA:
      return { ...store, buildingData: action.payload };
    case ACTION_TYPE.SET_BUILDING_TYPE_DATA:
      return { ...store, buildingTypeData: action.payload };
    case ACTION_TYPE.SET_ROOM_TYPE_DATA:
      return { ...store, roomTypeData: action.payload };
    case ACTION_TYPE.SET_FLOOR_TYPE_DATA:
      return { ...store, floorTypeData: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}