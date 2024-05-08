import { DEVICE_TYPE } from "@constants/index";
import {
  isEmptyString,
  isValidMacAddress,
  isValidSensorCode,
} from "@services/utils/string";
import { Dispatch } from "react";
import validator from "validator";
import {
  ACTIONS,
  ACTION_TYPE,
  ERROR_TYPE,
  SENSOR_TYPES_OBJECT,
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
  if (
    state.farm !== null &&
    (state.coop === null || state.coop?.value.id === undefined)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ACTIVE_TAB,
      payload: "device",
    });
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.COOP,
    });
    return false;
  }

  if (
    state.farm !== null &&
    (state.building === null || state.building?.value.id === undefined)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ACTIVE_TAB,
      payload: "device",
    });
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.BUILDING,
    });
    return false;
  }

  if (
    state.farm !== null &&
    (state.room === null || state.room?.value.id === undefined)
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ACTIVE_TAB,
      payload: "device",
    });
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.ROOM,
    });
    return false;
  }

  if (state.deviceType === null || state.deviceType === undefined) {
    dispatch({
      type: ACTION_TYPE.SET_ACTIVE_TAB,
      payload: "device",
    });
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.DEVICE_TYPE,
    });
    return false;
  }

  if (!isValidMacAddress(state.mac)) {
    dispatch({
      type: ACTION_TYPE.SET_ACTIVE_TAB,
      payload: "device",
    });
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.MAC,
    });
    return false;
  }

  if (
    state.deviceType &&
    state.deviceType.value.value === DEVICE_TYPE.SMART_CONTROLLER
  ) {
    if (isEmptyString(state.deviceId)) {
      dispatch({
        type: ACTION_TYPE.SET_ACTIVE_TAB,
        payload: "device",
      });
      dispatch({
        type: ACTION_TYPE.SET_ERROR_TYPE,
        payload: ERROR_TYPE.DEVICE_ID,
      });
      return false;
    }
  }

  if (
    state.deviceType &&
    state.deviceType.value.value === DEVICE_TYPE.SMART_CONVENTRON
  ) {
    if (state.room) {
      if (state.controllerType === null || state.controllerType === undefined) {
        dispatch({
          type: ACTION_TYPE.SET_ACTIVE_TAB,
          payload: "device",
        });
        dispatch({
          type: ACTION_TYPE.SET_ERROR_TYPE,
          payload: ERROR_TYPE.CONTROLLER_TYPE,
        });
        return false;
      }
    }
    if (state.totalFan === null || state.totalFan === undefined) {
      dispatch({
        type: ACTION_TYPE.SET_ERROR_TYPE,
        payload: ERROR_TYPE.TOTAL_FAN,
      });
      return false;
    }

    if (state.coolingPad === null || state.coolingPad === undefined) {
      dispatch({
        type: ACTION_TYPE.SET_ERROR_TYPE,
        payload: ERROR_TYPE.COOLING_PAD,
      });
      return false;
    }

    if (state.lamp === null || state.lamp === undefined) {
      dispatch({
        type: ACTION_TYPE.SET_ERROR_TYPE,
        payload: ERROR_TYPE.LAMP,
      });
      return false;
    }
  }

  if (
    state.deviceType &&
    state.deviceType.value.value === DEVICE_TYPE.SMART_CONTROLLER
  ) {
    if (state.totalFan === null || state.totalFan === undefined) {
      dispatch({
        type: ACTION_TYPE.SET_ERROR_TYPE,
        payload: ERROR_TYPE.TOTAL_FAN,
      });
      return false;
    }

    if (state.coolingPad === null || state.coolingPad === undefined) {
      dispatch({
        type: ACTION_TYPE.SET_ERROR_TYPE,
        payload: ERROR_TYPE.COOLING_PAD,
      });
      return false;
    }

    if (state.lamp === null || state.lamp === undefined) {
      dispatch({
        type: ACTION_TYPE.SET_ERROR_TYPE,
        payload: ERROR_TYPE.LAMP,
      });
      return false;
    }
  }

  if (state.sensors.length > 0) {
    const result = state.sensors.map((sensor) => {
      if (sensor.sensorType?.value === SENSOR_TYPES_OBJECT.CAMERA) {
        if (!validator.isIP(sensor.ipCamera)) {
          dispatch({
            type: ACTION_TYPE.SET_ERROR_TYPE,
            payload: ERROR_TYPE.GENERAL,
          });
          return false;
        }
      }
      if (
        isEmptyString(sensor.sensorCode) ||
        sensor.sensorType === null ||
        !isValidSensorCode(sensor.sensorCode, sensor.sensorType.value)
      ) {
        dispatch({
          type: ACTION_TYPE.SET_ACTIVE_TAB,
          payload: "sensors",
        });
        dispatch({
          type: ACTION_TYPE.SET_ERROR_TYPE,
          payload: ERROR_TYPE.GENERAL,
        });
        return false;
      }
      if (state.room !== null) {
        if (sensor.room === null) {
          dispatch({
            type: ACTION_TYPE.SET_ACTIVE_TAB,
            payload: "sensors",
          });
          dispatch({
            type: ACTION_TYPE.SET_ERROR_TYPE,
            payload: ERROR_TYPE.GENERAL,
          });
          return false;
        }
      }
    });

    if (result.includes(false)) {
      const index = result.indexOf(false);
      dispatch({
        type: ACTION_TYPE.SET_ERROR_TEXT,
        payload: `Sensor's data in sensor ${index + 1} is missing!`,
      });
      return false;
    }
  }

  return true;
};
