import { ACTIONS, TState } from "./details.constants";

export function reducer(
  prevState: TState,
  action: { payload: any; type: string }
) {
  const { data } = action.payload;
  switch (action.type) {
    case ACTIONS.SET_STATUS:
      return { ...prevState, status: data };
    case ACTIONS.SET_ERROR_TYPE:
      return { ...prevState, errorType: data };
    case ACTIONS.SET_ERROR_TEXT:
      return { ...prevState, errorText: data };
    case ACTIONS.SET_DELETED_HARVEST_ITEM:
      return { ...prevState, deletedHarvestItem: data };
    case ACTIONS.SET_DETAILS_DATA:
      return { ...prevState, detailsData: data };
    case ACTIONS.SET_REALIZATIONS_DATA:
      return { ...prevState, realizationsData: data };
    case ACTIONS.SET_IS_DELETE_MODAL_VISIBLE:
      return { ...prevState, isDeleteModalVisible: data };
    default:
      throw new Error("Reducer failure!");
  }
}
