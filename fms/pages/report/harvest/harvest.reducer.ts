import { ACTIONS, emptySearch, TState } from "./harvest.constants";

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
    case ACTIONS.SET_INPUT_SEARCH:
      return { ...prevState, inputSearch: data };
    case ACTIONS.SET_FARM_DATA:
      return { ...prevState, farmData: data };
    case ACTIONS.SET_COOP_DATA:
      return { ...prevState, coopData: data };
    case ACTIONS.SET_BRANCH_DATA:
      return { ...prevState, branchData: data };
    case ACTIONS.SET_OWNER_DATA:
      return { ...prevState, ownerData: data };
    case ACTIONS.RESET_SEARCH:
      return { ...prevState, search: emptySearch, inputSearch: emptySearch };
    default:
      throw new Error("Reducer failure!");
  }
}
