import {
  ACTIONS,
  emptySearch,
  TState,
} from "./device-offline-tracker.constants";

export function reducer(
  prevState: TState,
  action: { payload: any; type: string }
) {
  const { data } = action.payload;
  switch (action.type) {
    case ACTIONS.SET_IS_LAST_PAGE:
      return { ...prevState, isLastPage: data };
    case ACTIONS.SET_TABLE_PAGE:
      return { ...prevState, tablePage: data };
    case ACTIONS.SET_IS_ADVANCE_SEARCH_VISIBLE:
      return { ...prevState, isAdvanceSearchVisible: data };
    case ACTIONS.SET_SEARCH:
      return { ...prevState, search: data };
    case ACTIONS.SET_TABLE_DATA_INDEX:
      return { ...prevState, tableDataIndex: data };
    case ACTIONS.SET_INPUT_SEARCH:
      return { ...prevState, inputSearch: data };
    case ACTIONS.SET_FARM:
      return { ...prevState, farm: data };
    case ACTIONS.SET_FARM_DATA:
      return { ...prevState, farmData: data };
    case ACTIONS.SET_COOP:
      return { ...prevState, coop: data };
    case ACTIONS.SET_COOP_DATA:
      return { ...prevState, coopData: data };
    case ACTIONS.SET_START_DATE:
      return { ...prevState, startDate: data };
    case ACTIONS.SET_END_DATE:
      return { ...prevState, endDate: data };
    case ACTIONS.RESET_SEARCH:
      return { ...prevState, search: emptySearch, inputSearch: emptySearch };
    default:
      throw new Error("Reducer failure!");
  }
}
