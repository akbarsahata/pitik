import { ACTIONS, ACTION_TYPE, TStore } from "./create.constants";

export function reducer(prevState: TStore, action: ACTIONS): TStore {
  switch (action.type) {
    case ACTION_TYPE.SET_ERROR_TYPE:
      return { ...prevState, errorType: action.payload };
    case ACTION_TYPE.SET_TRIGGER_ERROR_TEXT:
      return { ...prevState, triggerErrorText: action.payload };
    case ACTION_TYPE.SET_ERROR_TEXT:
      return { ...prevState, errorText: action.payload };
    case ACTION_TYPE.SET_TASK_CODE:
      return { ...prevState, taskCode: action.payload };
    case ACTION_TYPE.SET_TASK_NAME:
      return { ...prevState, taskName: action.payload };
    case ACTION_TYPE.SET_HARVEST_ONLY:
      return { ...prevState, harvestOnly: action.payload };
    case ACTION_TYPE.SET_MANUAL_TRIGGER:
      return { ...prevState, manualTrigger: action.payload };
    case ACTION_TYPE.SET_MANUAL_DEADLINE:
      return { ...prevState, manualDeadline: action.payload };
    case ACTION_TYPE.SET_INSTRUCTION:
      return { ...prevState, instruction: action.payload };
    case ACTION_TYPE.SET_REMARKS:
      return { ...prevState, remarks: action.payload };
    case ACTION_TYPE.SET_STATUS:
      return { ...prevState, status: action.payload };
    case ACTION_TYPE.SET_GENERATE_TRIGGER:
      return { ...prevState, generateTrigger: action.payload };
    case ACTION_TYPE.SET_TRIGGERS:
      return { ...prevState, triggers: action.payload };
    case ACTION_TYPE.SET_INSTRUCTIONS:
      return { ...prevState, instructions: action.payload };
    case ACTION_TYPE.SET_REMOVE_ALL_TRIGGERS_MODAL:
      return { ...prevState, removeAllTriggersModal: action.payload };
    case ACTION_TYPE.SET_ADD_INSTRUCTION_MODAL:
      return { ...prevState, addInstructionModal: action.payload };
    case ACTION_TYPE.SET_INPUT_INSTRUCTION:
      return { ...prevState, inputInstruction: action.payload };
    case ACTION_TYPE.SET_VARIABLE_DATA:
      return { ...prevState, variableData: action.payload };
    case ACTION_TYPE.SET_FEEDBRAND_DATA:
      return { ...prevState, feedbrandData: action.payload };
    default:
      throw new Error("Reducer failure!");
  }
}
