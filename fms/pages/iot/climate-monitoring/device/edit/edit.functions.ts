import { DEVICE_TYPE, SENSOR_POSITIONS, SENSOR_TYPES } from "@constants/index";
import { isEmptyString } from "@services/utils/string";
import { TDevicesSensorResponse, TSensorResponse } from "@type/response.type";
import { Dispatch } from "react";
import validator from "validator";
import { TSensorPayload } from "../create/create.constants";
import {
  ACTIONS,
  ACTION_TYPE,
  ERROR_TYPE,
  SENSOR_TYPES_OBJECT,
  TStore,
} from "./edit.constants";

export const setDeviceInitialData = ({
  dispatch,
  data,
  state,
}: {
  dispatch: Dispatch<ACTIONS>;
  data: TDevicesSensorResponse;
  state: TStore;
}) => {
  const deviceType =
    data.deviceType &&
    state.deviceTypeData[
      state.deviceTypeData.findIndex((item) => item.value === data.deviceType)
    ];
  dispatch({
    type: ACTION_TYPE.SET_DEVICE_TYPE,
    payload: deviceType
      ? {
          value: deviceType,
          label: deviceType.text,
        }
      : null,
  });

  const controllerType =
    data.room &&
    data.room.controllerType &&
    state.controllerTypeData[
      state.controllerTypeData.findIndex(
        (item) => item.id === data.room.controllerType.id
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

  const farm =
    data.coop &&
    state.farmData[
      state.farmData.findIndex((item) => item.id === data.coop.farm.id)
    ];
  dispatch({
    type: ACTION_TYPE.SET_FARM,
    payload: farm
      ? {
          value: farm,
          label: `(${farm?.farmCode}) ${farm?.farmName}`,
        }
      : null,
  });

  dispatch({
    type: ACTION_TYPE.SET_TEMP,
    payload: {
      coopId: data.coopId,
      buildingId: data.room && data.room.building.id,
      roomId: data.coop && data.roomId,
      sensors: data.sensors,
      heaterId: data.heaterId,
    },
  });

  dispatch({
    type: ACTION_TYPE.SET_TOTAL_FAN,
    payload:
      !data.totalFan || data.totalFan > 0
        ? {
            value: data.totalFan,
            label: data.totalFan,
          }
        : null,
  });

  dispatch({
    type: ACTION_TYPE.SET_COOLING_PAD,
    payload:
      data.coolingPad !== undefined
        ? {
            value: data.coolingPad,
            label: data.coolingPad ? "Yes" : "No",
          }
        : null,
  });

  dispatch({
    type: ACTION_TYPE.SET_LAMP,
    payload:
      data.lamp !== undefined
        ? {
            value: data.lamp,
            label: data.lamp ? "Yes" : "No",
          }
        : null,
  });

  dispatch({
    type: ACTION_TYPE.SET_OLD_BUILDING_ID,
    payload: data.room && data.room.building.id,
  });

  dispatch({
    type: ACTION_TYPE.SET_OLD_NAME,
    payload: data.mac.toUpperCase(),
  });

  dispatch({
    type: ACTION_TYPE.SET_MAC,
    payload: data.mac,
  });
  dispatch({
    type: ACTION_TYPE.SET_COOP_CODE,
    payload: data.coop && data.coop.coopCode,
  });
  dispatch({
    type: ACTION_TYPE.SET_DEVICE_ID,
    payload: data.deviceId,
  });

  dispatch({
    type: ACTION_TYPE.SET_STATUS,
    payload: {
      value: data.status,
      label: data.status ? "Active" : "Inactive",
    },
  });

  let sensorData: TSensorPayload[] = [];
  data.sensors.map((sensor: TSensorResponse) =>
    sensorData.push({
      id: sensor.id,
      sensorType: sensor.sensorType
        ? {
            label: SENSOR_TYPES[
              SENSOR_TYPES.findIndex((item) => item === sensor.sensorType)
            ].replace(/_/g, " "),
            value:
              SENSOR_TYPES[
                SENSOR_TYPES.findIndex((item) => item === sensor.sensorType)
              ],
          }
        : null,
      sensorCode: sensor.sensorCode,
      position: sensor.position
        ? {
            label:
              SENSOR_POSITIONS[
                SENSOR_POSITIONS.findIndex((item) => item === sensor.position)
              ],
            value:
              SENSOR_POSITIONS[
                SENSOR_POSITIONS.findIndex((item) => item === sensor.position)
              ],
          }
        : null,
      room: null,
      ipCamera: sensor.ipCamera,
    })
  );

  dispatch({
    type: ACTION_TYPE.SET_SENSORS,
    payload: sensorData,
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
      if (isEmptyString(sensor.sensorCode) || sensor.sensorType === null) {
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
