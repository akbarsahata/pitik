import { ACTIONS, ACTION_TYPE, TStore } from "./create.constants";

export function reducer(store: TStore, action: ACTIONS): TStore {
  switch (action.type) {
    case ACTION_TYPE.SET_ERROR_TYPE:
      return { ...store, errorType: action.payload };
    case ACTION_TYPE.SET_ERROR_TEXT:
      return { ...store, errorText: action.payload };
    case ACTION_TYPE.SET_BRANCH:
      return { ...store, branch: action.payload };
    case ACTION_TYPE.SET_BRANCH_DATA:
      return { ...store, branchData: action.payload };
    case ACTION_TYPE.SET_EFFECTIVE_START_DATE:
      return { ...store, effectiveStartDate: action.payload };
    case ACTION_TYPE.SET_SAPRONAK:
      return { ...store, sapronak: action.payload };
    case ACTION_TYPE.SET_BOP_TERM_OPTIONS:
      return { ...store, bopTermOptions: action.payload };
    case ACTION_TYPE.SET_MARGIN_COST_PLUS_BOP:
      return { ...store, marginCostPlusBop: action.payload };
    case ACTION_TYPE.SET_INSENTIVE_DEALS:
      return { ...store, insentiveDeals: action.payload };
    case ACTION_TYPE.SET_DEDUCTION_FC_LOSS:
      return { ...store, deductionFcLoss: action.payload };
    case ACTION_TYPE.SET_CONTRACT_MARKET_INSENTIVE:
      return { ...store, contractMarketInsentive: action.payload };
    case ACTION_TYPE.SET_CONFIRMATION_MODAL_VISIBLE:
      return { ...store, confirmationModalVisible: action.payload };
    default:
      throw new Error("Reducer failure!");
  }
}
