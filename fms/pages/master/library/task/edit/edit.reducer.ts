import { ACTIONS, ACTION_TYPE, TStore } from "./edit.constants";

export function reducer(store: TStore, action: ACTIONS): TStore {
  switch (action.type) {
    case ACTION_TYPE.SET_ERROR_TYPE:
      return { ...store, errorType: action.payload };
    case ACTION_TYPE.SET_TRIGGER_ERROR_TEXT:
      return { ...store, triggerErrorText: action.payload };
    case ACTION_TYPE.SET_ERROR_TEXT:
      return { ...store, errorText: action.payload };
    case ACTION_TYPE.SET_TASK_CODE:
      return { ...store, taskCode: action.payload };
    case ACTION_TYPE.SET_TASK_NAME:
      return { ...store, taskName: action.payload };
    case ACTION_TYPE.SET_HARVEST_ONLY:
      return { ...store, harvestOnly: action.payload };
    case ACTION_TYPE.SET_MANUAL_TRIGGER:
      return { ...store, manualTrigger: action.payload };
    case ACTION_TYPE.SET_MANUAL_DEADLINE:
      return { ...store, manualDeadline: action.payload };
    case ACTION_TYPE.SET_INSTRUCTION:
      return { ...store, instruction: action.payload };
    case ACTION_TYPE.SET_REMARKS:
      return { ...store, remarks: action.payload };
    case ACTION_TYPE.SET_STATUS:
      return { ...store, status: action.payload };
    case ACTION_TYPE.SET_GENERATE_TRIGGER:
      return { ...store, generateTrigger: action.payload };
    case ACTION_TYPE.SET_TRIGGERS:
      return { ...store, triggers: action.payload };
    case ACTION_TYPE.SET_INSTRUCTIONS:
      return { ...store, instructions: action.payload };
    case ACTION_TYPE.SET_REMOVE_ALL_TRIGGERS_MODAL:
      return { ...store, removeAllTriggersModal: action.payload };
    case ACTION_TYPE.SET_ADD_INSTRUCTION_MODAL:
      return { ...store, addInstructionModal: action.payload };
    case ACTION_TYPE.SET_INPUT_INSTRUCTION:
      return { ...store, inputInstruction: action.payload };
    case ACTION_TYPE.SET_VARIABLE_DATA:
      return { ...store, variableData: action.payload };
    case ACTION_TYPE.SET_FEEDBRAND_DATA:
      return { ...store, feedbrandData: action.payload };
    case ACTION_TYPE.SET_OLD_NAME:
      return { ...store, oldName: action.payload };
    default:
      throw new Error("Reducer failure!");
  }
}
