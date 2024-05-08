import { ACTIONS, emptySearch, TState } from "./task-ticketing.constants";

export function reducer(
  prevState: TState,
  action: { payload: any; type: string }
) {
  const { data } = action.payload;
  switch (action.type) {
    case ACTIONS.SET_ERROR_TYPE:
      return { ...prevState, errorType: data };
    case ACTIONS.SET_ERROR_TEXT:
      return { ...prevState, errorText: data };
    case ACTIONS.SET_IS_ADVANCE_SEARCH_VISIBLE:
      return { ...prevState, isAdvanceSearchVisible: data };
    case ACTIONS.SET_RESET_ALL_TABLE_PAGE:
      return {
        ...prevState,
        tablePageAll: { tablePage: 1, isLastPage: false },
        tablePageOpen: { tablePage: 1, isLastPage: false },
        tablePageOnMaintenance: { tablePage: 1, isLastPage: false },
        tablePageResolved: { tablePage: 1, isLastPage: false },
        tablePageOthers: { tablePage: 1, isLastPage: false },
      };
    case ACTIONS.SET_ACTIVE_TAB:
      return { ...prevState, activeTab: data };
    case ACTIONS.SET_TABLE_PAGE_ALL:
      return { ...prevState, tablePageAll: data };
    case ACTIONS.SET_TABLE_PAGE_OPEN:
      return { ...prevState, tablePageOpen: data };
    case ACTIONS.SET_TABLE_PAGE_ON_MAINTENANCE:
      return { ...prevState, tablePageOnMaintenance: data };
    case ACTIONS.SET_TABLE_PAGE_RESOLVED:
      return { ...prevState, tablePageResolved: data };
    case ACTIONS.SET_TABLE_PAGE_OTHERS:
      return { ...prevState, tablePageOthers: data };
    case ACTIONS.SET_SEARCH:
      return { ...prevState, search: data };
    case ACTIONS.SET_INPUT_SEARCH:
      return { ...prevState, inputSearch: data };
    case ACTIONS.RESET_SEARCH:
      return { ...prevState, search: emptySearch, inputSearch: emptySearch };
    case ACTIONS.SET_FARM_DATA:
      return { ...prevState, farmData: data };
    case ACTIONS.SET_COOP_DATA:
      return { ...prevState, coopData: data };
    case ACTIONS.SET_DEVICE_DATA:
      return { ...prevState, deviceData: data };
    case ACTIONS.SET_BRANCH_DATA:
      return { ...prevState, branchData: data };
    case ACTIONS.SET_PIC_DATA:
      return { ...prevState, picData: data };
    case ACTIONS.SET_DEVICE_STATUS:
      return { ...prevState, deviceStatus: data };
    case ACTIONS.SET_TABLE_DATA:
      return { ...prevState, tableData: data };
    default:
      throw new Error("Reducer failure!");
  }
}
