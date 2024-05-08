import { ACTIONS, ACTION_TYPE, TStore, search } from "./vendor.constants";

export function reducer(prevState: TStore, action: ACTIONS): TStore {
  switch (action.type) {
    case ACTION_TYPE.SET_IS_LAST_PAGE:
      return { ...prevState, isLastPage: action.payload };
    case ACTION_TYPE.SET_TABLE_PAGE:
      return { ...prevState, tablePage: action.payload };
    case ACTION_TYPE.SET_IS_ADVANCE_SEARCH_VISIBLE:
      return { ...prevState, isAdvanceSearchVisible: action.payload };
    case ACTION_TYPE.SET_SEARCH:
      return { ...prevState, search: action.payload };
    case ACTION_TYPE.SET_INPUT_SEARCH:
      return { ...prevState, inputSearch: action.payload };
    case ACTION_TYPE.RESET_SEARCH:
      return { ...prevState, search: search, inputSearch: search };
    case ACTION_TYPE.SET_PROVINCE_DATA:
      return { ...prevState, provinceData: action.payload };
    case ACTION_TYPE.SET_CITY_DATA:
      return { ...prevState, cityData: action.payload };
    case ACTION_TYPE.SET_DISTRICT_DATA:
      return { ...prevState, districtData: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}
