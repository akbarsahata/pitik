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
} from "./customise.constants";

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
  const coop =
    state.coopData[state.coopData.findIndex((item) => item.id === data.coopId)];
  dispatch({
    type: ACTION_TYPE.SET_COOP,
    payload: coop
      ? { label: `(${coop.coopCode}) ${coop.coopName}`, value: coop }
      : null,
  });
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
  if (state.coop === null || isEmptyString(state.coop?.value.id)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.COOP,
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
  if (state.saving.precentage > 100) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.SAVING_PERCENTAGE_INVALID,
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
