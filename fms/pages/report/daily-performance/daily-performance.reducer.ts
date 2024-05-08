import {
  ACTIONS,
  ACTION_TYPE,
  search,
  TStore,
} from "./daily-performance.constants";

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
    case ACTION_TYPE.SET_OWNER_DATA:
      return { ...store, ownerData: action.payload };
    case ACTION_TYPE.SET_PPL_DATA:
      return { ...store, pplData: action.payload };
    case ACTION_TYPE.SET_FARM_DATA:
      return { ...store, farmData: action.payload };
    case ACTION_TYPE.SET_PROVINCE_DATA:
      return { ...store, provinceData: action.payload };
    case ACTION_TYPE.SET_CITY_DATA:
      return { ...store, cityData: action.payload };
    case ACTION_TYPE.SET_DISTRICT_DATA:
      return { ...store, districtData: action.payload };
    case ACTION_TYPE.SET_COOP_DATA:
      return { ...store, coopData: action.payload };
    case ACTION_TYPE.SET_BRANCH_DATA:
      return { ...store, branchData: action.payload };
    case ACTION_TYPE.RESET_SEARCH:
      return {
        ...store,
        search: search,
        inputSearch: search,
        districtData: [],
        cityData: [],
      };
    default:
      throw new Error("Reducer failure!");
  }
}
