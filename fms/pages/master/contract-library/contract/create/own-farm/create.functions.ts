import { isEmptyString } from "@services/utils/string";
import { Dispatch } from "react";
import {
  ACTIONS,
  ACTION_TYPE,
  ERROR_TYPE,
  TBopDetails,
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

  if (
    getBopDetailValues("1", state).amount <= 0 ||
    isNaN(getBopDetailValues("1", state).amount)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.BOP_1_AMOUNT,
    });
    return false;
  }

  if (
    getBopDetailValues("1", state).paymentTerm === null ||
    getBopDetailValues("1", state).paymentTerm?.value === undefined
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.BOP_1_TERM,
    });
    return false;
  }

  if (
    getBopDetailValues("2", state).amount <= 0 ||
    isNaN(getBopDetailValues("2", state).amount)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.BOP_2_AMOUNT,
    });
    return false;
  }

  if (
    getBopDetailValues("2", state).paymentTerm === null ||
    getBopDetailValues("2", state).paymentTerm?.value === undefined
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.BOP_2_TERM,
    });
    return false;
  }

  const result = state.paymentTerms.map((term) => {
    if (
      term.amount === undefined ||
      term.amount <= 0 ||
      isNaN(term.amount) ||
      term.paymentTerm === null ||
      term.paymentTerm.value === undefined ||
      isNaN(term.paymentTerm.value)
    ) {
      dispatch({
        type: ACTION_TYPE.SET_ERROR_TYPE,
        payload: ERROR_TYPE.GENERAL,
      });
      return false;
    }
  });

  if (result.includes(false)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TEXT,
      payload: `Payment term to the farmers is missing!`,
    });
    return false;
  }

  return true;
};

export const getBopDetailValues = (bop: string, state: TStore): TBopDetails => {
  return state.bopDetails[
    state.bopDetails.findIndex((item) => item.bop === bop)
  ];
};
