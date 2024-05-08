import { isEmptyString } from "@services/utils/string";
import { TBuildingResponse } from "@type/response.type";
import { Dispatch } from "react";
import { ACTIONS, ACTION_TYPE, ERROR_TYPE, TStore } from "./edit.constants";

export const setBuildingInitialData = ({
  dispatch,
  data,
  state,
}: {
  dispatch: Dispatch<ACTIONS>;
  data: TBuildingResponse;
  state: TStore;
}) => {
  const farm =
    state.farmData[state.farmData.findIndex((item) => item.id === data.farmId)];

  dispatch({
    type: ACTION_TYPE.SET_FARM,
    payload: farm
      ? {
          value: farm,
          label: `(${farm?.farmCode}) ${farm?.farmName}`,
        }
      : null,
  });
  const buildingType =
    state.buildingTypeData[
      state.buildingTypeData.findIndex(
        (item) => item.id === data.buildingTypeId
      )
    ];
  dispatch({
    type: ACTION_TYPE.SET_BUILDING_TYPE,
    payload: buildingType
      ? {
          value: buildingType,
          label: buildingType.name,
        }
      : null,
  });
  dispatch({
    type: ACTION_TYPE.SET_OLD_NAME,
    payload: data.name,
  });
  dispatch({
    type: ACTION_TYPE.SET_BUILDING_NAME,
    payload: data.name,
  });
  dispatch({
    type: ACTION_TYPE.SET_HEIGHT,
    payload: data.height,
  });
  dispatch({
    type: ACTION_TYPE.SET_LENGTH_DATA,
    payload: data.length,
  });
  dispatch({
    type: ACTION_TYPE.SET_WIDTH,
    payload: data.width,
  });
  dispatch({
    type: ACTION_TYPE.SET_STATUS,
    payload: {
      label: data.isActive ? "Active" : "Inactive",
      value: data.isActive,
    },
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
  if (state.farm === null || state.farm?.value.id === undefined) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.FARM,
    });
    return false;
  }

  if (isEmptyString(state.buildingName)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.BUILDING_NAME,
    });
    return false;
  }

  if (
    state.buildingType === null ||
    state.buildingType?.value.name === undefined
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.BUILDING_TYPE,
    });
    return false;
  }

  if (state.height === undefined || state.height < 1 || isNaN(state.height)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.HEIGHT,
    });
    return false;
  }

  if (
    state.lengthData === undefined ||
    state.lengthData < 1 ||
    isNaN(state.lengthData)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.LENGTH_DATA,
    });
    return false;
  }

  if (state.width === undefined || state.width < 1 || isNaN(state.width)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.WIDTH,
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
