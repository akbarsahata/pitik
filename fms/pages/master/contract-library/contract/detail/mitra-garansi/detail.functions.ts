import { isEmptyString } from "@services/utils/string";
import { TInsentiveDealsPayload, TSapronakPayload } from "@type/payload.type";
import { TContractResponse } from "@type/response.type";
import { Dispatch } from "react";
import {
  ACTIONS,
  ACTION_TYPE,
  ERROR_TYPE,
  TChickenPricePayload,
  TStore,
} from "./detail.constants";

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

export const setMitraGaransiInitialData = ({
  dispatch,
  data,
  state,
}: {
  dispatch: Dispatch<ACTIONS>;
  data: TContractResponse;
  state: TStore;
}) => {
  const branch =
    state.branchData[
      state.branchData.findIndex((item) => item.id === data.branchId)
    ];
  dispatch({
    type: ACTION_TYPE.SET_BRANCH,
    payload: branch
      ? { label: `(${branch.code}) ${branch.name}`, value: branch }
      : null,
  });
  dispatch({
    type: ACTION_TYPE.SET_EFFECTIVE_START_DATE,
    payload: data.effectiveStartDate,
  });
  dispatch({
    type: ACTION_TYPE.SET_SAPRONAK,
    payload: data.sapronak,
  });
  dispatch({
    type: ACTION_TYPE.SET_CHICKEN_PRICE,
    payload: data.chickenPrice,
  });
  dispatch({
    type: ACTION_TYPE.SET_INSENTIVE_DEALS,
    payload: data.insentiveDeals,
  });
  dispatch({
    type: ACTION_TYPE.SET_CONTRACT_MARKET_INSENTIVE,
    payload: data.contractMarketInsentive,
  });
  dispatch({
    type: ACTION_TYPE.SET_DEDUCTION_DUE_TO_FARMING_CYCLE_LOSS,
    payload: data.deductionDueToFarmingCycleLoss,
  });
  dispatch({
    type: ACTION_TYPE.SET_SAVING,
    payload: data.saving,
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
    getChickenPriceValues("0", "0.8", state).price === undefined ||
    getChickenPriceValues("0", "0.8", state).price <= 0 ||
    isNaN(getChickenPriceValues("0", "0.8", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CHICKEN_PRICE_BW_1,
    });
    return false;
  }

  if (
    getChickenPriceValues("0.8", "0.99", state).price === undefined ||
    getChickenPriceValues("0.8", "0.99", state).price <= 0 ||
    isNaN(getChickenPriceValues("0.8", "0.99", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CHICKEN_PRICE_BW_2,
    });
    return false;
  }

  if (
    getChickenPriceValues("1.00", "1.09", state).price === undefined ||
    getChickenPriceValues("1.00", "1.09", state).price <= 0 ||
    isNaN(getChickenPriceValues("1.00", "1.09", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CHICKEN_PRICE_BW_3,
    });
    return false;
  }

  if (
    getChickenPriceValues("1.10", "1.19", state).price === undefined ||
    getChickenPriceValues("1.10", "1.19", state).price <= 0 ||
    isNaN(getChickenPriceValues("1.10", "1.19", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CHICKEN_PRICE_BW_4,
    });
    return false;
  }

  if (
    getChickenPriceValues("1.20", "1.29", state).price === undefined ||
    getChickenPriceValues("1.20", "1.29", state).price <= 0 ||
    isNaN(getChickenPriceValues("1.20", "1.29", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CHICKEN_PRICE_BW_5,
    });
    return false;
  }

  if (
    getChickenPriceValues("1.30", "1.39", state).price === undefined ||
    getChickenPriceValues("1.30", "1.39", state).price <= 0 ||
    isNaN(getChickenPriceValues("1.30", "1.39", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CHICKEN_PRICE_BW_6,
    });
    return false;
  }

  if (
    getChickenPriceValues("1.40", "1.49", state).price === undefined ||
    getChickenPriceValues("1.40", "1.49", state).price <= 0 ||
    isNaN(getChickenPriceValues("1.40", "1.49", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CHICKEN_PRICE_BW_7,
    });
    return false;
  }

  if (
    getChickenPriceValues("1.50", "1.59", state).price === undefined ||
    getChickenPriceValues("1.50", "1.59", state).price <= 0 ||
    isNaN(getChickenPriceValues("1.50", "1.59", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CHICKEN_PRICE_BW_8,
    });
    return false;
  }

  if (
    getChickenPriceValues("1.60", "1.69", state).price === undefined ||
    getChickenPriceValues("1.60", "1.69", state).price <= 0 ||
    isNaN(getChickenPriceValues("1.60", "1.69", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CHICKEN_PRICE_BW_9,
    });
    return false;
  }

  if (
    getChickenPriceValues("1.70", "1.79", state).price === undefined ||
    getChickenPriceValues("1.70", "1.79", state).price <= 0 ||
    isNaN(getChickenPriceValues("1.70", "1.79", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CHICKEN_PRICE_BW_10,
    });
    return false;
  }

  if (
    getChickenPriceValues("1.80", "1.89", state).price === undefined ||
    getChickenPriceValues("1.80", "1.89", state).price <= 0 ||
    isNaN(getChickenPriceValues("1.80", "1.89", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CHICKEN_PRICE_BW_11,
    });
    return false;
  }

  if (
    getChickenPriceValues("1.90", "1.99", state).price === undefined ||
    getChickenPriceValues("1.90", "1.99", state).price <= 0 ||
    isNaN(getChickenPriceValues("1.90", "1.99", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CHICKEN_PRICE_BW_12,
    });
    return false;
  }

  if (
    getChickenPriceValues("2.00", "2.09", state).price === undefined ||
    getChickenPriceValues("2.00", "2.09", state).price <= 0 ||
    isNaN(getChickenPriceValues("2.00", "2.09", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CHICKEN_PRICE_BW_13,
    });
    return false;
  }

  if (
    getChickenPriceValues("2.10", "2.19", state).price === undefined ||
    getChickenPriceValues("2.10", "2.19", state).price <= 0 ||
    isNaN(getChickenPriceValues("2.10", "2.19", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CHICKEN_PRICE_BW_14,
    });
    return false;
  }

  if (
    getChickenPriceValues("2.20", "2.29", state).price === undefined ||
    getChickenPriceValues("2.20", "2.29", state).price <= 0 ||
    isNaN(getChickenPriceValues("2.20", "2.29", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CHICKEN_PRICE_BW_15,
    });
    return false;
  }

  if (
    getChickenPriceValues("2.30", "2.39", state).price === undefined ||
    getChickenPriceValues("2.30", "2.39", state).price <= 0 ||
    isNaN(getChickenPriceValues("2.30", "2.39", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CHICKEN_PRICE_BW_16,
    });
    return false;
  }

  if (
    getChickenPriceValues("2.40", "2.50", state).price === undefined ||
    getChickenPriceValues("2.40", "2.50", state).price <= 0 ||
    isNaN(getChickenPriceValues("2.40", "2.50", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CHICKEN_PRICE_BW_17,
    });
    return false;
  }

  if (
    getInsentiveDealValues("300", "309", state).price === undefined ||
    getInsentiveDealValues("300", "309", state).price <= 0 ||
    isNaN(getInsentiveDealValues("300", "309", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.INSENTIVE_DEAL_IP_1,
    });
    return false;
  }

  if (
    getInsentiveDealValues("310", "319", state).price === undefined ||
    getInsentiveDealValues("310", "319", state).price <= 0 ||
    isNaN(getInsentiveDealValues("310", "319", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.INSENTIVE_DEAL_IP_2,
    });
    return false;
  }

  if (
    getInsentiveDealValues("320", "329", state).price === undefined ||
    getInsentiveDealValues("320", "329", state).price <= 0 ||
    isNaN(getInsentiveDealValues("320", "329", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.INSENTIVE_DEAL_IP_3,
    });
    return false;
  }

  if (
    getInsentiveDealValues("330", "up", state).price === undefined ||
    getInsentiveDealValues("330", "up", state).price <= 0 ||
    isNaN(getInsentiveDealValues("330", "up", state).price)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.INSENTIVE_DEAL_IP_4,
    });
    return false;
  }

  if (state.saving.precentage === undefined || isNaN(state.saving.precentage)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.SAVING_PERCENTAGE,
    });
    return false;
  } else if (state.saving.precentage <= 0 || state.saving.precentage > 100) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.SAVING_PERCENTAGE_INVALID,
    });
    return false;
  }

  if (
    state.saving.minimumProfit === undefined ||
    state.saving.minimumProfit <= 0 ||
    isNaN(state.saving.minimumProfit)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.SAVING_MINIMUM_PROFIT,
    });
    return false;
  }

  if (
    state.deductionDueToFarmingCycleLoss.precentage === undefined ||
    isNaN(state.deductionDueToFarmingCycleLoss.precentage)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.DEDUCTION_DUE_TO_FARMING_CYCLE_LOSS_PERCENTAGE,
    });
    return false;
  } else if (
    state.deductionDueToFarmingCycleLoss.precentage <= 0 ||
    state.deductionDueToFarmingCycleLoss.precentage > 100
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload:
        ERROR_TYPE.DEDUCTION_DUE_TO_FARMING_CYCLE_LOSS_PERCENTAGE_INVALID,
    });
    return false;
  }

  if (
    state.deductionDueToFarmingCycleLoss.minimumProfit === undefined ||
    state.deductionDueToFarmingCycleLoss.minimumProfit <= 0 ||
    isNaN(state.deductionDueToFarmingCycleLoss.minimumProfit)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.DEDUCTION_DUE_TO_FARMING_CYCLE_LOSS_MINIMUM_PROFIT,
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

export const getChickenPriceValues = (
  lowerRange: string,
  upperRange: string,
  state: TStore
): TChickenPricePayload => {
  return state.chickenPrice[
    state.chickenPrice.findIndex(
      (item: TChickenPricePayload) =>
        item.lowerRange === lowerRange && item.upperRange === upperRange
    )
  ];
};

export const getInsentiveDealValues = (
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
