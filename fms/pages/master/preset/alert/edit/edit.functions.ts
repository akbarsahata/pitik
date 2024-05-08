import { isEmptyString } from "@services/utils/string";
import { TAlertPresetResponse } from "@type/response.type";
import { Dispatch } from "react";
import { ACTIONS, ACTION_TYPE, ERROR_TYPE, TStore } from "./edit.constants";

export const setAlertPresetInitialData = ({
  dispatch,
  data,
}: {
  dispatch: Dispatch<ACTIONS>;
  data: TAlertPresetResponse;
}) => {
  dispatch({
    type: ACTION_TYPE.SET_ALERT_PRESET_CODE,
    payload: data.alertPresetCode,
  });
  dispatch({
    type: ACTION_TYPE.SET_ALERT_PRESET_NAME,
    payload: data.alertPresetName,
  });
  dispatch({
    type: ACTION_TYPE.SET_COOP_TYPE,
    payload: data.coopType
      ? {
          value: data.coopType,
          label: `(${data.coopType.coopTypeCode}) ${data.coopType.coopTypeName}`,
        }
      : null,
  });
  let idList: string[] = [];
  data.alerts.map((item) => {
    idList.push(item.id);
  });
  dispatch({
    type: ACTION_TYPE.SET_ALERT_IDS,
    payload: idList,
  });
  dispatch({
    type: ACTION_TYPE.SET_SELECTED_ALERTS,
    payload: idList,
  });
  dispatch({
    type: ACTION_TYPE.SET_SELECTED_ALERT_DETAILS,
    payload: data.alerts,
  });
  dispatch({
    type: ACTION_TYPE.SET_TABLE_DATA,
    payload: data.alerts,
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
    payload: data.alertPresetName,
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
  if (isEmptyString(state.alertPresetCode)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.ALERT_PRESET_CODE,
    });
    return false;
  }

  if (isEmptyString(state.alertPresetName)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.ALERT_PRESET_NAME,
    });
    return false;
  }

  if (state.coopType === null || state.coopType?.value.id === undefined) {
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

  return true;
};
