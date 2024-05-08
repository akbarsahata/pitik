import { isEmptyString, randomHexString } from "@services/utils/string";
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
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
}): boolean => {
  if (isEmptyString(state.targetCode)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.TARGET_CODE,
    });
    return false;
  }

  if (isEmptyString(state.targetName)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.TARGET_NAME,
    });
    return false;
  }

  if (state.coopType === null || isEmptyString(state.coopType?.value.id)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.COOP_TYPE,
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

  if (state.chickType === null || isEmptyString(state.chickType?.value.id)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.CHICK_TYPE,
    });
    return false;
  }

  if (state.variable === null || isEmptyString(state.variable?.value.id)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.VARIABLE,
    });
    return false;
  }

  return true;
};

export const addOneNewTarget = ({
  dispatch,
  state,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
}) => {
  const sortedData = state.targets.sort((a, b) => a.day - b.day);
  const largestElement = sortedData[sortedData.length - 1];

  dispatch({
    type: ACTION_TYPE.SET_TARGETS,
    payload: [
      ...state.targets,
      {
        id: randomHexString(),
        day: largestElement.day + 1,
        minValue: state.generateTargets.minValue,
        maxValue: state.generateTargets.maxValue,
      },
    ],
  });
};

export const generateNewTargets = ({
  dispatch,
  state,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
}) => {
  let newGeneratedTargets: {
    id: string;
    day: number;
    minValue: number;
    maxValue: number;
  }[] = [];
  for (let index = 0; index < state.generateTargets.day; index++) {
    newGeneratedTargets.push({
      id: randomHexString(),
      day: index + 1,
      minValue: state.generateTargets.minValue,
      maxValue: state.generateTargets.maxValue,
    });
  }
  dispatch({
    type: ACTION_TYPE.SET_TARGETS,
    payload: newGeneratedTargets,
  });
};
