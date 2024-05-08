import { ACTIONS, ACTION_TYPE, TStore } from "./detail.constants";

export function reducer(store: TStore, action: ACTIONS): TStore {
  switch (action.type) {
    case ACTION_TYPE.SET_ERROR_TYPE:
      return { ...store, errorType: action.payload };
    case ACTION_TYPE.SET_ERROR_TEXT:
      return { ...store, errorText: action.payload };
    case ACTION_TYPE.SET_COOP:
      return { ...store, coop: action.payload };
    case ACTION_TYPE.SET_BOP_TERM_OPTIONS:
      return { ...store, bopTermOptions: action.payload };
    case ACTION_TYPE.SET_FARMER_TERM_OPTIONS:
      return { ...store, farmerTermOptions: action.payload };
    case ACTION_TYPE.SET_EFFECTIVE_START_DATE:
      return { ...store, effectiveStartDate: action.payload };
    case ACTION_TYPE.SET_BOP_DETAILS:
      return { ...store, bopDetails: action.payload };
    case ACTION_TYPE.SET_PAYMENT_TERMS:
      return { ...store, paymentTerms: action.payload };
    case ACTION_TYPE.SET_COOP_DATA:
      return { ...store, coopData: action.payload };
    case ACTION_TYPE.SET_CONFIRMATION_MODAL_VISIBLE:
      return { ...store, confirmationModalVisible: action.payload };
    default:
      throw new Error("Reducer failure!");
  }
}
