import { isEmptyString } from "@services/utils/string";
import { Dispatch } from "react";
import { ACTIONS, ACTION_TYPE, ERROR_TYPE, TStore } from "./create.constants";

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
  isOtherChickSupplierVisible,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
  isOtherChickSupplierVisible: boolean;
}): boolean => {
  if (state.coop === null || isEmptyString(state.coop?.value.id)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.COOP,
    });
    return false;
  }

  if (state.ppls === null || state.ppls?.length === 0) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.PPLS,
    });
    return false;
  }

  if (
    state.docInBW !== undefined &&
    (state.docInBW < 0 || state.docInBW > 100)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.DOC_IN_BW,
    });
    return false;
  }

  if (
    state.docInUniformity !== undefined &&
    (state.docInUniformity < 0 || state.docInUniformity > 100)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.DOC_IN_UNIFORMITY,
    });
    return false;
  }

  if (isEmptyString(state.farmStartDate as string)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.FARM_START_DATE,
    });
    return false;
  }

  if (state.chickType === null || isEmptyString(state.chickType?.value.id)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CHICK_TYPE,
    });
    return false;
  }

  if (
    state.initialPopulation === undefined ||
    state.initialPopulation < 1000 ||
    isNaN(state.initialPopulation)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.INITIAL_POPULATION,
    });
    return false;
  }

  if (
    isOtherChickSupplierVisible &&
    isEmptyString(state.otherChickSupplierType as string)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.OTHER_CHICK_SUPPLIER_TYPE,
    });
    return false;
  }

  if (
    state.chickSupplierType === null ||
    isEmptyString(state.chickSupplierType?.value)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CHICK_SUPPLIER_TYPE,
    });
    return false;
  }

  if (isEmptyString(state.hatchery as string)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.HATCHERY,
    });
    return false;
  }

  return true;
};
