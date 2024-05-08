import { isEmptyString } from "@services/utils/string";
import { TIotTicketDetailsResponse } from "@type/response.type";
import { getCookie } from "cookies-next";
import { TICKET_STATUS } from "../task-ticketing.constants";
import { ACTIONS, ERROR_TYPE, TState } from "./edit.constants";

export const setTaskTicketingInitialData = ({
  dispatch,
  data,
}: {
  dispatch: any;
  data: TIotTicketDetailsResponse;
}) => {
  dispatch({
    type: ACTIONS.SET_NOTES,
    payload: { data: data.notes },
  });
  dispatch({
    type: ACTIONS.SET_PIC,
    payload: { data: data.pic ? data.pic : "Unassigned" },
  });
  dispatch({
    type: ACTIONS.SET_TEXT_COUNT,
    payload: { data: data.notes?.length || 0 },
  });
  dispatch({
    type: ACTIONS.SET_STATUS,
    payload: {
      data: data.status ? { label: data.status, value: data.status } : null,
    },
  });
};

export const setErrorText = ({
  dispatch,
  error,
}: {
  dispatch: any;
  error: any;
}) => {
  dispatch({
    type: ACTIONS.SET_ERROR_TYPE,
    payload: { data: "general" },
  });
  dispatch({
    type: ACTIONS.SET_ERROR_TEXT,
    payload: {
      data: `(${error.response.data.code || "500"}) ${
        error.response.data.data?.error?.message ||
        error.response.data.error?.message ||
        error.response.data?.message ||
        "Failed to perform request"
      }`,
    },
  });
};

export const checkRequired = ({
  dispatch,
  state,
}: {
  dispatch: any;
  state: TState;
}) => {
  if (state.pic === "Unassigned" || state.pic === undefined) {
    dispatch({
      type: ACTIONS.SET_ERROR_TYPE,
      payload: { data: ERROR_TYPE.PIC },
    });
    return false;
  }
  if (
    state.status === null ||
    state.status.value === TICKET_STATUS.OPEN ||
    state.status.value === TICKET_STATUS.RESOLVED
  ) {
    dispatch({
      type: ACTIONS.SET_ERROR_TYPE,
      payload: { data: ERROR_TYPE.STATUS },
    });
    return false;
  }
  if (isEmptyString(state.notes)) {
    dispatch({
      type: ACTIONS.SET_ERROR_TYPE,
      payload: { data: ERROR_TYPE.NOTES },
    });
    return false;
  }
  return true;
};

export const assignPerson = ({
  dispatch,
  state,
}: {
  dispatch: any;
  state: TState;
}) => {
  const userLoginName = getCookie("name");
  dispatch({
    type: ACTIONS.SET_PIC,
    payload: { data: userLoginName },
  });
  dispatch({
    type: ACTIONS.SET_ERROR_TYPE,
    payload: { data: ERROR_TYPE.NONE },
  });
  return true;
};
