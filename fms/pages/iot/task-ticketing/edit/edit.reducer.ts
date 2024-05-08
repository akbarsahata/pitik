import { ACTIONS, TState } from "./edit.constants";

export function reducer(
  prevState: TState,
  action: { payload: any; type: string }
) {
  const { data } = action.payload;
  switch (action.type) {
    case ACTIONS.SET_ERROR_TYPE:
      return { ...prevState, errorType: data };
    case ACTIONS.SET_ERROR_TEXT:
      return { ...prevState, errorText: data };
    case ACTIONS.SET_PIC:
      return { ...prevState, pic: data };
    case ACTIONS.SET_STATUS:
      return { ...prevState, status: data };
    case ACTIONS.SET_NOTES:
      return { ...prevState, notes: data };
    case ACTIONS.SET_TEXT_COUNT:
      return { ...prevState, textCount: data };
    default:
      throw new Error("Reducer failure!");
  }
}
