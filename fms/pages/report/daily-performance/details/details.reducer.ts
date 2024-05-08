import { ACTIONS, ACTION_TYPE, TStore } from "./details.constants";

export function reducer(store: TStore, action: ACTIONS): TStore {
  switch (action.type) {
    case ACTION_TYPE.SET_SUMMARY_DATA:
      return { ...store, summaryData: action.payload };
    case ACTION_TYPE.SET_DETAILS_DATA:
      return { ...store, detailsData: action.payload };
    default:
      throw new Error("Reducer failure!");
  }
}
