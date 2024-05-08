import { isEmptyString } from "@services/utils/string";
import { TTaskPresetResponse } from "@type/response.type";
import { Dispatch } from "react";
import { ACTIONS, ACTION_TYPE, ERROR_TYPE, TStore } from "./edit.constants";

export const setTaskPresetInitialData = ({
  dispatch,
  data,
}: {
  dispatch: Dispatch<ACTIONS>;
  data: TTaskPresetResponse;
}) => {
  dispatch({
    type: ACTION_TYPE.SET_TASK_PRESET_CODE,
    payload: data.taskPresetCode,
  });
  dispatch({
    type: ACTION_TYPE.SET_TASK_PRESET_NAME,
    payload: data.taskPresetName,
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
  data.tasks.map((item) => {
    idList.push(item.id);
  });
  dispatch({
    type: ACTION_TYPE.SET_TASK_IDS,
    payload: idList,
  });
  dispatch({
    type: ACTION_TYPE.SET_SELECTED_TASKS,
    payload: idList,
  });
  dispatch({
    type: ACTION_TYPE.SET_SELECTED_TASK_DETAILS,
    payload: data.tasks,
  });
  dispatch({
    type: ACTION_TYPE.SET_TABLE_DATA,
    payload: data.tasks,
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
    payload: data.taskPresetName,
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
  if (isEmptyString(state.taskPresetCode)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.TASK_PRESET_CODE,
    });
    return false;
  }

  if (isEmptyString(state.taskPresetName)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.TASK_PRESET_NAME,
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
