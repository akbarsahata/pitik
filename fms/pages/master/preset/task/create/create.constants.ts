import { IDropdownItem } from "@type/dropdown.interface";
import { TCoopTypeResponse, TTaskResponse } from "@type/response.type";

export enum ERROR_TYPE {
  NONE = "NONE",
  GENERAL = "GENERAL",
  TASK_PRESET_CODE = "TASK_PRESET_CODE",
  TASK_PRESET_NAME = "TASK_PRESET_NAME",
  COOP_TYPE = "COOP_TYPE",
  STATUS = "STATUS",
}

export enum ACTION_TYPE {
  SET_ERROR_TYPE = "SET_ERROR_TYPE",
  SET_ERROR_TEXT = "SET_ERROR_TEXT",
  SET_TASK_PRESET_CODE = "SET_TASK_PRESET_CODE",
  SET_TASK_PRESET_NAME = "SET_TASK_PRESET_NAME",
  SET_COOP_TYPE = "SET_COOP_TYPE",
  SET_TASK_IDS = "SET_TASK_IDS",
  SET_REMARKS = "SET_REMARKS",
  SET_STATUS = "SET_STATUS",
  SET_COOP_TYPE_DATA = "SET_COOP_TYPE_DATA",
  SET_SELECTED_COOP_TYPE_DATA = "SET_SELECTED_COOP_TYPE_DATA",
  SET_IS_TASK_LIST_MODAL_VISIBLE = "SET_IS_TASK_LIST_MODAL_VISIBLE",
  SET_TASK_LIST_DATA = "SET_TASK_LIST_DATA",
  SET_SELECTED_TASKS = "SET_SELECTED_TASKS",
  SET_SELECTED_TASK_DETAILS = "SET_SELECTED_TASK_DETAILS",
  SET_TABLE_DATA = "SET_TABLE_DATA",
  SET_SEARCH_TASK_VALUE = "SET_SEARCH_TASK_VALUE",
  SET_SEARCH_TASK_RESULT = "SET_SEARCH_TASK_RESULT",
}

export type TStore = {
  errorType: ERROR_TYPE;
  errorText: string;
  taskPresetCode: string;
  taskPresetName: string;
  taskIds: string[];
  remarks: string;
  status: IDropdownItem<boolean> | null;
  coopType: IDropdownItem<TCoopTypeResponse> | null;
  coopTypeData: TCoopTypeResponse[];
  selectedCoopTypeData: TCoopTypeResponse[];
  isTaskListModalVisible: boolean;
  taskListData: TTaskResponse[];
  selectedTasks: string[];
  selectedTaskDetails: TTaskResponse[];
  tableData: TTaskResponse[];
  searchTaskValue: string;
  searchTaskResult: TTaskResponse[];
};

export const store: TStore = {
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  taskPresetCode: "",
  taskPresetName: "",
  coopType: null,
  taskIds: [],
  remarks: "",
  status: null,
  coopTypeData: [],
  selectedCoopTypeData: [],
  isTaskListModalVisible: false,
  taskListData: [],
  selectedTasks: [],
  selectedTaskDetails: [],
  tableData: [],
  searchTaskValue: "",
  searchTaskResult: [],
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_ERROR_TYPE; payload: typeof store.errorType }
  | { type: ACTION_TYPE.SET_ERROR_TEXT; payload: typeof store.errorText }
  | {
      type: ACTION_TYPE.SET_TASK_PRESET_CODE;
      payload: typeof store.taskPresetCode;
    }
  | {
      type: ACTION_TYPE.SET_TASK_PRESET_NAME;
      payload: typeof store.taskPresetName;
    }
  | { type: ACTION_TYPE.SET_COOP_TYPE; payload: typeof store.coopType }
  | { type: ACTION_TYPE.SET_TASK_IDS; payload: typeof store.taskIds }
  | { type: ACTION_TYPE.SET_REMARKS; payload: typeof store.remarks }
  | { type: ACTION_TYPE.SET_STATUS; payload: typeof store.status }
  | { type: ACTION_TYPE.SET_COOP_TYPE_DATA; payload: typeof store.coopTypeData }
  | {
      type: ACTION_TYPE.SET_SELECTED_COOP_TYPE_DATA;
      payload: typeof store.selectedCoopTypeData;
    }
  | {
      type: ACTION_TYPE.SET_IS_TASK_LIST_MODAL_VISIBLE;
      payload: typeof store.isTaskListModalVisible;
    }
  | { type: ACTION_TYPE.SET_TASK_LIST_DATA; payload: typeof store.taskListData }
  | {
      type: ACTION_TYPE.SET_SELECTED_TASKS;
      payload: typeof store.selectedTasks;
    }
  | {
      type: ACTION_TYPE.SET_SELECTED_TASK_DETAILS;
      payload: typeof store.selectedTaskDetails;
    }
  | { type: ACTION_TYPE.SET_TABLE_DATA; payload: typeof store.tableData }
  | {
      type: ACTION_TYPE.SET_SEARCH_TASK_VALUE;
      payload: typeof store.searchTaskValue;
    }
  | {
      type: ACTION_TYPE.SET_SEARCH_TASK_RESULT;
      payload: typeof store.searchTaskResult;
    };
