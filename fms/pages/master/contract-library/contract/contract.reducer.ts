import { ACTIONS, ACTION_TYPE, search, TStore } from "./contract.constants";

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
    case ACTION_TYPE.SET_CONTRACT_TYPE_DATA:
      return { ...store, contractTypeData: action.payload };
    case ACTION_TYPE.SET_BRANCH_DATA:
      return { ...store, branchData: action.payload };
    case ACTION_TYPE.SET_EFFECTIVE_START_DATE:
      return { ...store, effectiveStartDate: action.payload };
    default:
      throw new Error("Reducer failure!");
  }
}
