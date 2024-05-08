import { ACTIONS, ERROR_TYPE } from "./details.constants";

export const setErrorText = ({
  dispatch,
  error,
}: {
  dispatch: any;
  error: any;
}) => {
  dispatch({
    type: ACTIONS.SET_ERROR_TYPE,
    payload: { data: ERROR_TYPE.GENERAL },
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
