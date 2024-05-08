import { isEmptyString } from "@services/utils/string";
import { TCoopTypeResponse } from "@type/response.type";
import { Dispatch } from "react";
import { ACTIONS, ACTION_TYPE, ERROR_TYPE, TStore } from "./edit.constants";

export const setCoopTypeInitialData = ({
  dispatch,
  data,
}: {
  dispatch: Dispatch<ACTIONS>;
  data: TCoopTypeResponse;
}) => {
  dispatch({
    type: ACTION_TYPE.SET_COOP_TYPE_CODE,
    payload: data.coopTypeCode,
  });
  dispatch({
    type: ACTION_TYPE.SET_COOP_TYPE_NAME,
    payload: data.coopTypeName,
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
    payload: data.coopTypeName,
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
  if (isEmptyString(state.coopTypeCode)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.COOP_TYPE_CODE,
    });
    return false;
  }

  if (isEmptyString(state.coopTypeName)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.COOP_TYPE_NAME,
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
