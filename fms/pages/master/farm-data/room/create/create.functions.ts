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
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
}): boolean => {
  if (state.coop === null || isEmptyString(state.coop?.value.id as string)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.COOP,
    });
    return false;
  }

  if (
    state.building === null ||
    isEmptyString(state.building?.value.id as string)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.BUILDING,
    });
    return false;
  }

  if (
    state.roomType === null ||
    isEmptyString(state.roomType?.value.id as string)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.ROOM_TYPE,
    });
    return false;
  }

  if (
    state.floorType === null ||
    isEmptyString(state.floorType?.value.id as string)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.FLOOR_TYPE,
    });
    return false;
  }

  if (state.population === undefined || isNaN(state.population)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.POPULATION,
    });
    return false;
  }

  if (state.coolingPad === null || state.coolingPad?.value === undefined) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.IS_COOLING_PAD_EXIST,
    });
    return false;
  }

  if (
    state.building &&
    (state.building.value?.buildingType?.name === "Close" ||
      state.building.value?.buildingType?.name === "Semi")
  ) {
    if (
      state.inletPosition === null ||
      state.inletPosition?.value === undefined
    ) {
      dispatch({
        type: ACTION_TYPE.SET_ERROR_TYPE,
        payload: ERROR_TYPE.INLET_POSITION,
      });
      return false;
    }
    if (state.inletWidth === undefined || state.inletWidth < 1) {
      dispatch({
        type: ACTION_TYPE.SET_ERROR_TYPE,
        payload: ERROR_TYPE.INLET_WIDTH,
      });
      return false;
    }

    if (state.inletLength === undefined || state.inletLength < 1) {
      dispatch({
        type: ACTION_TYPE.SET_ERROR_TYPE,
        payload: ERROR_TYPE.INLET_LENGTH,
      });
      return false;
    }
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
