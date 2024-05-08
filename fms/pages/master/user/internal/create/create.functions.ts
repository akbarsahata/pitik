import { USER_TYPE } from "@constants/index";
import { isValidPhone } from "@services/utils/phone";
import { isEmptyString } from "@services/utils/string";
import { Dispatch } from "react";
import isEmail from "validator/lib/isEmail";
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
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
}): boolean => {
  if (
    (state.upstreamRole === null ||
      isEmptyString(state.upstreamRole?.value.name)) &&
    (state.downstreamRole === null ||
      isEmptyString(state.downstreamRole?.value.name))
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.USER_TYPE,
    });
    return false;
  }

  if (state.parent === null || isEmptyString(state.parent?.value.id)) {
    if (
      state.upstreamRole?.value.name === USER_TYPE.GM.full ||
      state.upstreamRole?.value.name === USER_TYPE.AM.full ||
      state.upstreamRole?.value.name === USER_TYPE.MM.full ||
      state.upstreamRole?.value.name === USER_TYPE.PPL.full ||
      state.upstreamRole?.value.name === USER_TYPE.BU.full
    ) {
      dispatch({
        type: ACTION_TYPE.SET_ERROR_TYPE,
        payload: ERROR_TYPE.PARENT_ID,
      });
      return false;
    }
  }

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

  if (!isEmail(state.email)) {
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

  if (isEmptyString(state.password) || state.password.length < 5) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.PASSWORD,
    });
    return false;
  }

  if (state.password !== state.confirmPassword) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CONFIRM_PASSWORD,
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
