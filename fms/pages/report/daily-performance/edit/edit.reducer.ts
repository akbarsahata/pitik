import { ACTIONS, ACTION_TYPE, TStore } from "./edit.constants";

export function reducer(store: TStore, action: ACTIONS): TStore {
  switch (action.type) {
    case ACTION_TYPE.SET_ERROR_TYPE:
      return { ...store, errorType: action.payload };
    case ACTION_TYPE.SET_ERROR_TEXT:
      return { ...store, errorText: action.payload };
    case ACTION_TYPE.SET_SUMMARY_DATA:
      return { ...store, summaryData: action.payload };
    case ACTION_TYPE.SET_DETAILS_DATA:
      return { ...store, detailsData: action.payload };
    case ACTION_TYPE.SET_IS_MODAL_VISIBLE:
      return { ...store, isModalVisible: action.payload };
    case ACTION_TYPE.SET_IS_MODAL_FOR_FEED:
      return { ...store, isModalForFeed: action.payload };
    case ACTION_TYPE.SET_IS_MODAL_FOR_OVK:
      return { ...store, isModalForOvk: action.payload };
    case ACTION_TYPE.SET_FEEDBRAND_DATA:
      return { ...store, feedBrandData: action.payload };
    case ACTION_TYPE.SET_MODAL_DATA:
      return { ...store, records: action.payload };
    default:
      throw new Error("Reducer failure!");
  }
}
