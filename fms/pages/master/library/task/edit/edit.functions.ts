import {
  isEmptyString,
  randomHexString,
  validateStringTime,
} from "@services/utils/string";
import { TTaskLibraryResponse, TTriggerResponse } from "@type/response.type";
import { Dispatch } from "react";
import {
  ACTIONS,
  ACTION_TYPE,
  ERROR_TYPE,
  TInstructionData,
  TStore,
} from "./edit.constants";

export const generateTriggers = ({
  state,
  dispatch,
}: {
  state: TStore;
  dispatch: Dispatch<ACTIONS>;
}) => {
  if (isNaN(state.generateTrigger.day)) {
    dispatch({
      type: ACTION_TYPE.SET_TRIGGER_ERROR_TEXT,
      payload: "Invalid 'day' input!",
    });
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.TRIGGERS,
    });
    return;
  }

  if (!validateStringTime(state.generateTrigger.triggerTime)) {
    dispatch({
      type: ACTION_TYPE.SET_TRIGGER_ERROR_TEXT,
      payload: "Invalid 'trigger time' input!",
    });
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.TRIGGERS,
    });
    return;
  }

  if (isNaN(state.generateTrigger.deadline)) {
    dispatch({
      type: ACTION_TYPE.SET_TRIGGER_ERROR_TEXT,
      payload: "Invalid 'deadline' input!",
    });
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.TRIGGERS,
    });
    return;
  }

  let newGeneratedTriggers: TTriggerResponse[] = [];
  for (let index = 0; index < state.generateTrigger.day; index++) {
    newGeneratedTriggers.push({
      id: randomHexString(),
      day: index + 1,
      triggerTime: state.generateTrigger.triggerTime,
      deadline: state.generateTrigger.deadline,
    });
  }
  dispatch({
    type: ACTION_TYPE.SET_TRIGGERS,
    payload: newGeneratedTriggers,
  });
};

export const removeAllTriggers = ({
  dispatch,
}: {
  dispatch: Dispatch<ACTIONS>;
}) => {
  dispatch({
    type: ACTION_TYPE.SET_TRIGGERS,
    payload: [],
  });
};

export const addOneNewTrigger = ({
  dispatch,
  state,
}: {
  dispatch: Dispatch<ACTIONS>;
  state: TStore;
}) => {
  const sortedData = state.triggers.sort((a, b) => a.day - b.day);
  const largestElement = sortedData[sortedData.length - 1];

  dispatch({
    type: ACTION_TYPE.SET_TRIGGERS,
    payload: [
      ...state.triggers,
      {
        id: randomHexString(),
        day: largestElement.day + 1,
        triggerTime: state.generateTrigger.triggerTime,
        deadline: state.generateTrigger.deadline,
      },
    ],
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
  if (isEmptyString(state.taskCode)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.TASK_CODE,
    });
    return false;
  }

  if (isEmptyString(state.taskName)) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.TASK_NAME,
    });
    return false;
  }

  if (state.harvestOnly === null || state.harvestOnly?.value === undefined) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.HARVEST_ONLY,
    });
    return false;
  }

  if (
    state.manualTrigger === null ||
    state.manualTrigger?.value === undefined
  ) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.MANUAL_TRIGGER,
    });
    return false;
  }

  if (state.manualDeadline === undefined) {
    dispatch({
      type: ACTION_TYPE.SET_ERROR_TYPE,
      payload: ERROR_TYPE.MANUAL_DEADLINE,
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

  state.triggers.length > 0 &&
    state.triggers.map((item: TTriggerResponse) => {
      if (isNaN(item.day)) {
        dispatch({
          type: ACTION_TYPE.SET_TRIGGER_ERROR_TEXT,
          payload: "Invalid 'day' input!",
        });
        dispatch({
          type: ACTION_TYPE.SET_ERROR_TYPE,
          payload: ERROR_TYPE.TRIGGERS,
        });
        return false;
      }
      if (!validateStringTime(item.triggerTime)) {
        dispatch({
          type: ACTION_TYPE.SET_TRIGGER_ERROR_TEXT,
          payload: "Invalid 'trigger time' input on day #" + item.day,
        });
        dispatch({
          type: ACTION_TYPE.SET_ERROR_TYPE,
          payload: ERROR_TYPE.TRIGGERS,
        });
        return false;
      }
      if (isNaN(item.deadline)) {
        dispatch({
          type: ACTION_TYPE.SET_TRIGGER_ERROR_TEXT,
          payload: "Invalid 'deadline' input on day #" + item.day,
        });
        dispatch({
          type: ACTION_TYPE.SET_ERROR_TYPE,
          payload: ERROR_TYPE.TRIGGERS,
        });
        return false;
      }
    });

  return true;
};

export const setTaskLibraryInitialData = ({
  dispatch,
  data,
}: {
  dispatch: Dispatch<ACTIONS>;
  data: TTaskLibraryResponse;
}) => {
  dispatch({
    type: ACTION_TYPE.SET_TASK_CODE,
    payload: data.taskCode,
  });
  dispatch({
    type: ACTION_TYPE.SET_TASK_NAME,
    payload: data.taskName,
  });
  dispatch({
    type: ACTION_TYPE.SET_HARVEST_ONLY,
    payload: {
      value: data.harvestOnly,
      label: data.harvestOnly ? "Yes" : "No",
    },
  });
  dispatch({
    type: ACTION_TYPE.SET_MANUAL_TRIGGER,
    payload: {
      value: data.manualTrigger,
      label: data.manualTrigger ? "Yes" : "No",
    },
  });
  dispatch({
    type: ACTION_TYPE.SET_MANUAL_DEADLINE,
    payload: data.manualDeadline,
  });
  dispatch({
    type: ACTION_TYPE.SET_INSTRUCTION,
    payload: data.instruction,
  });
  dispatch({
    type: ACTION_TYPE.SET_STATUS,
    payload: {
      value: data.status,
      label: data.status ? "Active" : "Inactive",
    },
  });
  dispatch({
    type: ACTION_TYPE.SET_REMARKS,
    payload: data.remarks,
  });
  dispatch({
    type: ACTION_TYPE.SET_TRIGGERS,
    payload: data.triggers,
  });

  let withIdString: TInstructionData[] = [];
  data.instructions.map((instruction) => {
    withIdString.push({
      ...instruction,
      variable: instruction.variable
        ? {
            value: instruction.variable,
            label: `(${instruction.variable.variableCode}) ${instruction.variable.variableName}`,
          }
        : null,
      feedbrand: instruction.feedbrand
        ? {
            value: instruction.feedbrand,
            label: `(${instruction.feedbrand.feedbrandCode}) ${instruction.feedbrand.feedbrandName}`,
          }
        : null,
      needAdditionalDetail: instruction.needAdditionalDetail
        ? {
            value: instruction.needAdditionalDetail,
            label: instruction.needAdditionalDetail ? "Yes" : "No",
          }
        : null,
      checkDataCorrectness: instruction.checkDataCorrectness
        ? {
            value: instruction.checkDataCorrectness,
            label: instruction.checkDataCorrectness ? "Yes" : "No",
          }
        : null,
      dataRequired: {
        value: instruction.dataRequired || 0,
        label:
          instruction.dataRequired === 0
            ? "Not Required"
            : instruction.dataRequired === 1
            ? "Required"
            : "Optional",
      },
      photoRequired: {
        value: instruction.photoRequired || 0,
        label:
          instruction.photoRequired === 0
            ? "Not Required"
            : instruction.photoRequired === 1
            ? "Required"
            : "Optional",
      },
      videoRequired: {
        value: instruction.videoRequired || 0,
        label:
          instruction.videoRequired === 0
            ? "Not Required"
            : instruction.videoRequired === 1
            ? "Required"
            : "Optional",
      },
      dataType: instruction.dataType
        ? {
            value: instruction.dataType,
            label: instruction.dataType.toUpperCase(),
          }
        : null,
      variableId: instruction.variable ? instruction.variable?.id : undefined,
      feedbrandId: instruction.variable ? instruction.feedbrand?.id : undefined,
    });
  });

  dispatch({
    type: ACTION_TYPE.SET_INSTRUCTIONS,
    payload: withIdString,
  });
  dispatch({
    type: ACTION_TYPE.SET_OLD_NAME,
    payload: data.taskName,
  });
};
