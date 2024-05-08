import { ACTIONS, ACTION_TYPE, search, TStore } from "./farm.constants";

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
    case ACTION_TYPE.SET_OWNER_DATA:
      return { ...store, ownerData: action.payload };
    case ACTION_TYPE.SET_BRANCH_DATA:
      return { ...store, branchData: action.payload };
    case ACTION_TYPE.SET_PROVINCE_DATA:
      return { ...store, provinceData: action.payload };
    case ACTION_TYPE.SET_CITY_DATA:
      return { ...store, cityData: action.payload };
    case ACTION_TYPE.SET_DISTRICT_DATA:
      return { ...store, districtData: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}
