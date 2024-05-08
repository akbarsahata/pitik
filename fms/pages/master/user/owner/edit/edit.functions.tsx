import { isValidPhone } from "@services/utils/phone";
import { isEmptyString } from "@services/utils/string";
import { TUserResponse } from "@type/response.type";
import { Dispatch } from "react";
import isEmail from "validator/lib/isEmail";
import { ACTIONS, ACTION_TYPE, ERROR_TYPE, TStore } from "./edit.constants";

export const setUserInitialData = ({
  dispatch,
  data,
}: {
  dispatch: Dispatch<ACTIONS>;
  data: TUserResponse;
}) => {
  dispatch({
    type: ACTION_TYPE.SET_USER_CODE,
    payload: data.userCode,
  });
  dispatch({
    type: ACTION_TYPE.SET_FULL_NAME,
    payload: data.fullName,
  });
  dispatch({
    type: ACTION_TYPE.SET_EMAIL,
    payload: data.email,
  });
  dispatch({
    type: ACTION_TYPE.SET_PHONE_NUMBER,
    payload: data.phoneNumber,
  });
  dispatch({
    type: ACTION_TYPE.SET_WA_NUMBER,
    payload: data.waNumber,
  });
  dispatch({
    type: ACTION_TYPE.SET_STATUS,
    payload: { label: data.status ? "Active" : "Inactive", value: data.status },
  });
  dispatch({
    type: ACTION_TYPE.SET_OLD_NAME,
    payload: data.fullName,
  });
  dispatch({
    type: ACTION_TYPE.SET_PASSWORD,
    payload: "",
  });
  dispatch({
    type: ACTION_TYPE.SET_CONFIRM_PASSWORD,
    payload: "",
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
  if (isEmptyString(state.userCode)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.USER_CODE,
    });
    return false;
  }

  if (isEmptyString(state.fullName)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.FULL_NAME,
    });
    return false;
  }

  if (!isEmptyString(state.email) && !isEmail(state.email)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.EMAIL,
    });
    return false;
  }

  if (!isValidPhone(state.phoneNumber)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.PHONE_NUMBER,
    });
    return false;
  }

  if (!isValidPhone(state.waNumber)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.WA_NUMBER,
    });
    return false;
  }

  if (!isEmptyString(state.password)) {
    if (state.password.length < 5) {
      dispatch({
        type: ACTION_TYPE.SET_ERROR_TYPE,
        payload: ERROR_TYPE.PASSWORD,
      });
      return false;
    }
  }

  if (state.password !== state.confirmPassword) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CONFIRM_PASSWORD,
    });
    return false;
  }

  if (state.status === null || state.status.value === undefined) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.STATUS,
    });
    return false;
  }

  return true;
};
