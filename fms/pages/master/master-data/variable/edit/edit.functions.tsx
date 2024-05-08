import { isEmptyString } from "@services/utils/string";
import { TVariableResponse } from "@type/response.type";
import { Dispatch } from "react";
import { ACTIONS, ACTION_TYPE, ERROR_TYPE, TStore } from "./edit.constants";

export const setVariableInitialData = ({
  dispatch,
  data,
}: {
  dispatch: Dispatch<ACTIONS>;
  data: TVariableResponse;
}) => {
  dispatch({
    type: ACTION_TYPE.SET_VARIABLE_CODE,
    payload: data.variableCode,
  });
  dispatch({
    type: ACTION_TYPE.SET_VARIABLE_NAME,
    payload: data.variableName,
  });
  dispatch({
    type: ACTION_TYPE.SET_VARIABLE_UOM,
    payload: data.variableUOM,
  });
  dispatch({
    type: ACTION_TYPE.SET_VARIABLE_TYPE,
    payload: data.variableType,
  });
  dispatch({
    type: ACTION_TYPE.SET_DIGIT_COMA,
    payload: data.digitComa,
  });
  dispatch({
    type: ACTION_TYPE.SET_REMARKS,
    payload: data.remarks,
  });
  dispatch({
    type: ACTION_TYPE.SET_STATUS,
    payload: { label: data.status ? "Active" : "Inactive", value: data.status },
  });
  dispatch({
    type: ACTION_TYPE.SET_OLD_NAME,
    payload: data.variableName,
  });
};

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
  if (isEmptyString(state.variableCode)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.VARIABLE_CODE,
    });
    return false;
  }

  if (isEmptyString(state.variableName)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.VARIABLE_NAME,
    });
    return false;
  }

  if (isEmptyString(state.variableUOM)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.VARIABLE_UOM,
    });
    return false;
  }

  if (state.status === null || state.status?.value === undefined) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.STATUS,
    });
    return false;
  }

  return true;
};
