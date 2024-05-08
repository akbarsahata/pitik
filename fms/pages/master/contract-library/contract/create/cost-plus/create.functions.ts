import { isEmptyString } from "@services/utils/string";
import { TInsentiveDealsPayload, TSapronakPayload } from "@type/payload.type";
import { Dispatch } from "react";
import {
  ACTIONS,
  ACTION_TYPE,
  ERROR_TYPE,
  TDeductionFcLoss,
  TMarginCostPlusBop,
  TStore,
} from "./create.constants";

export const setErrorText = ({
  dispatch,
  error,
}: {
  dispatch: Dispatch<ACTIONS>;
  error: any;
}) => {
  dispatch({
    type: ACTION_TYPE.SET_ERROR_TYPE,
    payload: ERROR_TYPE.GENERAL,
  });
  dispatch({
    type: ACTION_TYPE.SET_ERROR_TEXT,
    payload: `(${error.response.data.code || "500"}) ${
      error.response.data.data?.error?.message ||
      error.response.data.error?.message ||
      error.response.data?.message ||
      "Failed to perform request"
    }`,
  });
};

export const checkRequired = ({
  dispatch,
  state,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
}): boolean => {
  if (state.branch === null || isEmptyString(state.branch?.value.id)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.BRANCH,
    });
    return false;
  }

  if (isEmptyString(state.effectiveStartDate)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.EFFECTIVE_START_DATE,
    });
    return false;
  }

  if (
    getSapronakValues("DOC", "DOC", state).price === undefined ||
    getSapronakValues("DOC", "DOC", state).price <= 0 ||
    isNaN(getSapronakValues("DOC", "DOC", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.DOC_DOC,
    });
    return false;
  }

  if (
    getSapronakValues("DOC", "DOC+VACCINE", state).price === undefined ||
    getSapronakValues("DOC", "DOC+VACCINE", state).price <= 0 ||
    isNaN(getSapronakValues("DOC", "DOC+VACCINE", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.DOC_DOCVACCINE,
    });
    return false;
  }

  if (
    getSapronakValues("FEED", "PRESTARTER", state).price === undefined ||
    getSapronakValues("FEED", "PRESTARTER", state).price <= 0 ||
    isNaN(getSapronakValues("FEED", "PRESTARTER", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.FEED_PRE_STARTER,
    });
    return false;
  }

  if (
    getSapronakValues("FEED", "STARTER", state).price === undefined ||
    getSapronakValues("FEED", "STARTER", state).price <= 0 ||
    isNaN(getSapronakValues("FEED", "STARTER", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.FEED_STARTER,
    });
    return false;
  }

  if (
    getSapronakValues("FEED", "FINISHER", state).price === undefined ||
    getSapronakValues("FEED", "FINISHER", state).price <= 0 ||
    isNaN(getSapronakValues("FEED", "FINISHER", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.FEED_FINISHER,
    });
    return false;
  }

  if (
    getSapronakValues("OVK", "OVK", state).price === undefined ||
    isNaN(getSapronakValues("OVK", "OVK", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.OVK_OVK,
    });
    return false;
  } else if (
    getSapronakValues("OVK", "OVK", state).price <= 0 ||
    getSapronakValues("OVK", "OVK", state).price > 100
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.OVK_OVK_INVALID,
    });
    return false;
  }

  if (
    getMarginCostBopValues(1, state).amount <= 0 ||
    isNaN(getMarginCostBopValues(1, state).amount)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.BOP_1_AMOUNT,
    });
    return false;
  }

  if (
    getMarginCostBopValues(1, state).paymentTerm === null ||
    getMarginCostBopValues(1, state).paymentTerm?.value === undefined
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.BOP_1_TERM,
    });
    return false;
  }

  if (
    getMarginCostBopValues(2, state).amount <= 0 ||
    isNaN(getMarginCostBopValues(2, state).amount)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.BOP_2_AMOUNT,
    });
    return false;
  }

  if (
    getMarginCostBopValues(2, state).paymentTerm === null ||
    getMarginCostBopValues(2, state).paymentTerm?.value === undefined
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.BOP_2_TERM,
    });
    return false;
  }

  if (
    getMarginCostBopValues(3, state).amount <= 0 ||
    isNaN(getMarginCostBopValues(3, state).amount)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.BOP_3_AMOUNT,
    });
    return false;
  }

  if (
    getMarginCostBopValues(3, state).paymentTerm === null ||
    getMarginCostBopValues(3, state).paymentTerm?.value === undefined
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.BOP_3_TERM,
    });
    return false;
  }

  if (
    getMarginCostBopValues(3, state).preConditions <= "0" ||
    isEmptyString(getMarginCostBopValues(3, state).preConditions)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.PRE_BOP_3_IP,
    });
    return false;
  }

  if (
    getIncentiveValues("331", "340", state).price === undefined ||
    getIncentiveValues("331", "340", state).price <= 0 ||
    isNaN(getIncentiveValues("331", "340", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.INSENTIVE_DEAL_IP_1,
    });
    return false;
  }

  if (
    getIncentiveValues("341", "360", state).price === undefined ||
    getIncentiveValues("341", "360", state).price <= 0 ||
    isNaN(getIncentiveValues("341", "360", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.INSENTIVE_DEAL_IP_2,
    });
    return false;
  }

  if (
    getIncentiveValues("361", "380", state).price === undefined ||
    getIncentiveValues("361", "380", state).price <= 0 ||
    isNaN(getIncentiveValues("361", "380", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.INSENTIVE_DEAL_IP_3,
    });
    return false;
  }

  if (
    getIncentiveValues("381", "400", state).price === undefined ||
    getIncentiveValues("381", "400", state).price <= 0 ||
    isNaN(getIncentiveValues("381", "400", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.INSENTIVE_DEAL_IP_4,
    });
    return false;
  }

  if (
    getIncentiveValues("401", "up", state).price === undefined ||
    getIncentiveValues("401", "up", state).price <= 0 ||
    isNaN(getIncentiveValues("401", "up", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.INSENTIVE_DEAL_IP_5,
    });
    return false;
  }
  if (getDeductionFcLossValues("3", state).lossDeductionProfit > 100) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.LOSS_DEDUCTION_FROM_PROFIT_INVALID,
    });
    return false;
  }
  if (state.contractMarketInsentive.insentivePrecentage) {
    if (
      state.contractMarketInsentive.insentivePrecentage <= 0 ||
      state.contractMarketInsentive.insentivePrecentage > 100 ||
      isNaN(state.contractMarketInsentive.insentivePrecentage)
    ) {
      dispatch({
        type: ACTION_TYPE.SET_ERROR_TYPE,
        payload: ERROR_TYPE.INCENTIVE_PERCENTAGE,
      });
      return false;
    }
  }

  return true;
};

export const getSapronakValues = (
  category: string,
  subCategory: string,
  state: TStore
): TSapronakPayload => {
  return state.sapronak[
    state.sapronak.findIndex(
      (item: TSapronakPayload) =>
        item.categoryCode === category && item.subcategoryCode === subCategory
    )
  ];
};

export const getMarginCostBopValues = (
  bop: number,
  state: TStore
): TMarginCostPlusBop => {
  return state.marginCostPlusBop[
    state.marginCostPlusBop.findIndex(
      (item: TMarginCostPlusBop) => item.bop === bop
    )
  ];
};

export const getIncentiveValues = (
  lowerIp: string,
  upperIp: string,
  state: TStore
): TInsentiveDealsPayload => {
  return state.insentiveDeals[
    state.insentiveDeals.findIndex(
      (item: TInsentiveDealsPayload) =>
        item.lowerIp === lowerIp && item.upperIp === upperIp
    )
  ];
};

export const getDeductionFcLossValues = (
  id: string,
  state: TStore
): TDeductionFcLoss => {
  return state.deductionFcLoss[
    state.deductionFcLoss.findIndex((item: TDeductionFcLoss) => item.bop === id)
  ];
};
