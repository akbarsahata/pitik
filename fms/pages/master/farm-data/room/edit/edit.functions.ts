import { isEmptyString, randomHexString } from "@services/utils/string";
import { TFanResponse, TRoomResponse } from "@type/response.type";
import { Dispatch } from "react";
import { THeaterInRoomsBody } from "../room.constants";
import { ACTIONS, ACTION_TYPE, ERROR_TYPE, TStore } from "./edit.constants";

export const setRoomInitialData = ({
  dispatch,
  data,
  state,
}: {
  dispatch: Dispatch<ACTIONS>;
  data: TRoomResponse;
  state: TStore;
}) => {
  const heaterList: THeaterInRoomsBody[] = [];
  data.heaterInRooms.length &&
    data.heaterInRooms.map((heater) =>
      heaterList.push({
        id: randomHexString(),
        quantity: heater.quantity,
        heaterType: {
          value: heater.heaterType,
          label: heater.heaterType.name,
        },
      })
    );
  dispatch({
    type: ACTION_TYPE.SET_HEATER_IN_ROOMS,
    payload: heaterList,
  });

  const fanList: TFanResponse[] = [];
  data.fans.length &&
    data.fans.map((fan) =>
      fanList.push({
        id: randomHexString(),
        size: fan.size,
        capacity: fan.capacity,
      })
    );
  dispatch({
    type: ACTION_TYPE.SET_FANS,
    payload: fanList,
  });
  const coop =
    state.coopData[state.coopData.findIndex((item) => item.id === data.coopId)];
  dispatch({
    type: ACTION_TYPE.SET_COOP,
    payload: data.coop
      ? {
          value: data.coop,
          label: `(${coop?.coopCode}) ${coop?.coopName}`,
        }
      : null,
  });

  const building =
    state.buildingData[
      state.buildingData.findIndex((item) => item.id === data.buildingId)
    ];
  dispatch({
    type: ACTION_TYPE.SET_BUILDING,
    payload: building
      ? {
          value: building,
          label: `(${building.buildingType.name}) ${building.name}`,
        }
      : null,
  });

  const roomType =
    state.roomTypeData[
      state.roomTypeData.findIndex((item) => item.id === data.roomTypeId)
    ];
  dispatch({
    type: ACTION_TYPE.SET_ROOM_TYPE,
    payload: roomType
      ? {
          value: roomType,
          label: roomType.name,
        }
      : null,
  });

  const floorType =
    state.floorTypeData[
      state.floorTypeData.findIndex((item) => item.id === data.floorTypeId)
    ];
  dispatch({
    type: ACTION_TYPE.SET_FLOOR_TYPE,
    payload: floorType
      ? {
          value: floorType,
          label: floorType.name,
        }
      : null,
  });

  const controllerType =
    state.controllerTypeData[
      state.controllerTypeData.findIndex(
        (item) => item.id === data.controllerTypeId
      )
    ];
  dispatch({
    type: ACTION_TYPE.SET_CONTROLLER_TYPE,
    payload: controllerType
      ? {
          value: controllerType,
          label: controllerType.name,
        }
      : null,
  });

  dispatch({
    type: ACTION_TYPE.SET_COOLING_PAD,
    payload: {
      label: data.isCoolingPadExist ? "Exist" : "Not Exist",
      value: data.isCoolingPadExist,
    },
  });

  dispatch({
    type: ACTION_TYPE.SET_INLET_POSITION,
    payload: data.inletPosition
      ? {
          value: data.inletPosition,
          label:
            data.inletPosition === "LETTER_U" ? "LETTER U" : data.inletPosition,
        }
      : null,
  });

  dispatch({
    type: ACTION_TYPE.SET_STATUS,
    payload: {
      label: data.isActive ? "Active" : "Inactive",
      value: data.isActive,
    },
  });

  dispatch({
    type: ACTION_TYPE.SET_OLD_NAME,
    payload: data.building.name + " - " + data.roomType.name,
  });
  dispatch({
    type: ACTION_TYPE.SET_POPULATION,
    payload: data.population,
  });

  dispatch({
    type: ACTION_TYPE.SET_INLET_WIDTH,
    payload: data.inletWidth,
  });

  dispatch({
    type: ACTION_TYPE.SET_INLET_LENGTH,
    payload: data.inletLength,
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
