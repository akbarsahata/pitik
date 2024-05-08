import {
  ACTION_TYPE,
  ACTIONS,
  emptySearch,
  TStore,
} from "./historical-data.constants";

export function reducer(store: TStore, action: ACTIONS): TStore {
  switch (action.type) {
    case ACTION_TYPE.SET_IS_LAST_PAGE:
      return { ...store, isLastPage: action.payload };
    case ACTION_TYPE.SET_TABLE_PAGE:
      return { ...store, tablePage: action.payload };
    case ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE:
      return { ...store, isAdvanceSearchVisible: action.payload };

    case ACTION_TYPE.SET_IS_EXPORT_BUTTON:
      return { ...store, isExportButton: action.payload };

    case ACTION_TYPE.SET_TABLE_TO_EXPORT:
      return { ...store, tableToExport: action.payload };

    case ACTION_TYPE.SET_SEARCH:
      return { ...store, search: action.payload };
    case ACTION_TYPE.SET_INPUT_SEARCH:
      return { ...store, inputSearch: action.payload };

    case ACTION_TYPE.SET_FARM_DATA:
      return { ...store, farmData: action.payload };
    case ACTION_TYPE.SET_COOP_DATA:
      return { ...store, coopData: action.payload };
    case ACTION_TYPE.SET_BUILDING_DATA:
      return { ...store, buildingData: action.payload };
    case ACTION_TYPE.SET_ROOM_DATA:
      return { ...store, roomData: action.payload };
    case ACTION_TYPE.SET_DEVICE_DATA:
      return { ...store, deviceData: action.payload };
    case ACTION_TYPE.SET_DEVICE_TYPE_DATA:
      return { ...store, deviceTypeData: action.payload };
    case ACTION_TYPE.RESET_SEARCH:
      return { ...store, search: emptySearch, inputSearch: emptySearch };
    default:
      throw new Error("Reducer failure!");
  }
}
