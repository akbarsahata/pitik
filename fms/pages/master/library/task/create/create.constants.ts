import { IDropdownItem } from "@type/dropdown.interface";
import {
  TFeedBrandResponse,
  TTriggerResponse,
  TVariableResponse,
} from "@type/response.type";

export enum ERROR_TYPE {
  NONE = "NONE",
  GENERAL = "GENERAL",
  TASK_CODE = "TASK_CODE",
  TASK_NAME = "TASK_NAME",
  HARVEST_ONLY = "HARVEST_ONLY",
  MANUAL_TRIGGER = "MANUAL_TRIGGER",
  MANUAL_DEADLINE = "MANUAL_DEADLINE",
  INSTRUCTION = "INSTRUCTION",
  STATUS = "STATUS",
  REMARKS = "REMARKS",
  TRIGGERS = "TRIGGERS",
  INSTRUCTIONS = "INSTRUCTIONS",
  INSTRUCTION_TITLE = "INSTRUCTION_TITLE",
  DATA_REQUIRED = "DATA_REQUIRED",
  HARVEST_QTY = "HARVEST_QTY",
  PHOTO_REQUIRED = "PHOTO_REQUIRED",
  VIDEO_REQUIRED = "VIDEO_REQUIRED",
  NEED_ADDITIONAL_DETAIL = "NEED_ADDITIONAL_DETAIL",
  CHECK_DATA_CORRECTNESS = "CHECK_DATA_CORRECTNESS",
}

export enum ERROR_REQUIRED_INPUT {
  INSTRUCTION_TITLE = "INSTRUCTION_TITLE",
  PHOTO_REQUIRED = "PHOTO_REQUIRED",
  VIDEO_REQUIRED = "VIDEO_REQUIRED",
  NEED_ADDITIONAL_DETAIL = "NEED_ADDITIONAL_DETAIL",
  DATA_REQUIRED = "DATA_REQUIRED",
  NONE = "NONE",
}

export enum ACTION_TYPE {
  SET_ERROR_TYPE = "SET_ERROR_TYPE",
  SET_TRIGGER_ERROR_TEXT = "SET_TRIGGER_ERROR_TEXT",
  SET_ERROR_TEXT = "SET_ERROR_TEXT",
  SET_TASK_CODE = "SET_TASK_CODE",
  SET_TASK_NAME = "SET_TASK_NAME",
  SET_HARVEST_ONLY = "SET_HARVEST_ONLY",
  SET_MANUAL_TRIGGER = "SET_MANUAL_TRIGGER",
  SET_MANUAL_DEADLINE = "SET_MANUAL_DEADLINE",
  SET_INSTRUCTION = "SET_INSTRUCTION",
  SET_INPUT_INSTRUCTION = "SET_INPUT_INSTRUCTION",
  SET_STATUS = "SET_STATUS",
  SET_REMARKS = "SET_REMARKS",
  SET_GENERATE_TRIGGER = "SET_GENERATE_TRIGGER",
  SET_TRIGGERS = "SET_TRIGGERS",
  SET_INSTRUCTIONS = "SET_INSTRUCTIONS",
  SET_REMOVE_ALL_TRIGGERS_MODAL = "SET_REMOVE_ALL_TRIGGERS_MODAL",
  SET_ADD_INSTRUCTION_MODAL = "SET_ADD_INSTRUCTION_MODAL",
  SET_VARIABLE_DATA = "SET_VARIABLE_DATA",
  SET_FEEDBRAND_DATA = "SET_FEEDBRAND_DATA",
}

export type TInstructionData = {
  id?: string;
  instructionTitle: string;
  dataRequired: IDropdownItem<number> | null;
  dataInstruction?: string;
  dataType?: IDropdownItem<string> | null;
  dataOption?: string;
  variable?: IDropdownItem<TVariableResponse> | null;
  feedbrand?: IDropdownItem<TFeedBrandResponse> | null;
  harvestQty: number | undefined;
  dataOperator?: string;
  photoRequired: IDropdownItem<number> | null;
  photoInstruction?: string;
  videoRequired: IDropdownItem<number> | null;
  videoInstruction?: string;
  needAdditionalDetail: IDropdownItem<boolean> | null;
  additionalDetail?: string;
  checkDataCorrectness: IDropdownItem<boolean> | null;
  variableId?: string;
  feedbrandId?: string;
};

export const emptyInstruction: TInstructionData = {
  instructionTitle: "",
  dataRequired: null,
  harvestQty: undefined,
  photoRequired: null,
  videoRequired: null,
  needAdditionalDetail: null,
  checkDataCorrectness: null,
};

export type TStore = {
  errorType: ERROR_TYPE;
  errorText: string;
  triggerErrorText: string;
  taskCode: string;
  taskName: string;
  harvestOnly: IDropdownItem<boolean> | null;
  manualTrigger: IDropdownItem<boolean> | null;
  manualDeadline: number | undefined;
  instruction?: string;
  status: IDropdownItem<boolean> | null;
  remarks?: string;
  generateTrigger: TTriggerResponse;
  triggers: TTriggerResponse[];
  instructions: TInstructionData[];
  inputInstruction: TInstructionData;
  removeAllTriggersModal: boolean;
  addInstructionModal: boolean;
  variableData: TVariableResponse[];
  feedbrandData: TFeedBrandResponse[];
};

export const store: TStore = {
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  triggerErrorText: "",
  taskCode: "",
  taskName: "",
  harvestOnly: null,
  manualTrigger: null,
  manualDeadline: undefined,
  instruction: "",
  status: null,
  remarks: "",
  generateTrigger: {
    id: "",
    day: 0,
    triggerTime: "00:00:00",
    deadline: 0,
  },
  triggers: [],
  instructions: [],
  inputInstruction: emptyInstruction,
  removeAllTriggersModal: false,
  addInstructionModal: false,
  variableData: [],
  feedbrandData: [],
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_ERROR_TYPE; payload: typeof store.errorType }
  | {
      type: ACTION_TYPE.SET_TRIGGER_ERROR_TEXT;
      payload: typeof store.triggerErrorText;
    }
  | { type: ACTION_TYPE.SET_ERROR_TEXT; payload: typeof store.errorText }
  | { type: ACTION_TYPE.SET_TASK_CODE; payload: typeof store.taskCode }
  | { type: ACTION_TYPE.SET_TASK_NAME; payload: typeof store.taskName }
  | { type: ACTION_TYPE.SET_HARVEST_ONLY; payload: typeof store.harvestOnly }
  | {
      type: ACTION_TYPE.SET_MANUAL_TRIGGER;
      payload: typeof store.manualTrigger;
    }
  | {
      type: ACTION_TYPE.SET_MANUAL_DEADLINE;
      payload: typeof store.manualDeadline;
    }
  | { type: ACTION_TYPE.SET_INSTRUCTION; payload: typeof store.instruction }
  | {
      type: ACTION_TYPE.SET_INPUT_INSTRUCTION;
      payload: typeof store.inputInstruction;
    }
  | { type: ACTION_TYPE.SET_STATUS; payload: typeof store.status }
  | { type: ACTION_TYPE.SET_REMARKS; payload: typeof store.remarks }
  | {
      type: ACTION_TYPE.SET_GENERATE_TRIGGER;
      payload: typeof store.generateTrigger;
    }
  | { type: ACTION_TYPE.SET_TRIGGERS; payload: typeof store.triggers }
  | { type: ACTION_TYPE.SET_INSTRUCTIONS; payload: typeof store.instructions }
  | {
      type: ACTION_TYPE.SET_REMOVE_ALL_TRIGGERS_MODAL;
      payload: typeof store.removeAllTriggersModal;
    }
  | {
      type: ACTION_TYPE.SET_ADD_INSTRUCTION_MODAL;
      payload: typeof store.addInstructionModal;
    }
  | { type: ACTION_TYPE.SET_VARIABLE_DATA; payload: typeof store.variableData }
  | {
      type: ACTION_TYPE.SET_FEEDBRAND_DATA;
      payload: typeof store.feedbrandData;
    };
