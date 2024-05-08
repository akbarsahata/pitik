import { ACTIONS, ACTION_TYPE, TStore } from "./edit.constants";

export function reducer(store: TStore, action: ACTIONS): TStore {
  switch (action.type) {
    case ACTION_TYPE.SET_ERROR_TYPE:
      return { ...store, errorType: action.payload };
    case ACTION_TYPE.SET_ERROR_TEXT:
      return { ...store, errorText: action.payload };
    case ACTION_TYPE.SET_OLD_NAME:
      return { ...store, oldName: action.payload };
    case ACTION_TYPE.SET_TASK_PRESET_CODE:
      return { ...store, taskPresetCode: action.payload };
    case ACTION_TYPE.SET_TASK_PRESET_NAME:
      return { ...store, taskPresetName: action.payload };
    case ACTION_TYPE.SET_COOP_TYPE:
      return { ...store, coopType: action.payload };
    case ACTION_TYPE.SET_REMARKS:
      return { ...store, remarks: action.payload };
    case ACTION_TYPE.SET_STATUS:
      return { ...store, status: action.payload };
    case ACTION_TYPE.SET_COOP_TYPE_DATA:
      return { ...store, coopTypeData: action.payload };
    case ACTION_TYPE.SET_TASK_IDS:
      return { ...store, taskIds: action.payload };
    case ACTION_TYPE.SET_SELECTED_COOP_TYPE_DATA:
      return { ...store, selectedCoopTypeData: action.payload };
    case ACTION_TYPE.SET_IS_TASK_LIST_MODAL_VISIBLE:
      return { ...store, isTaskListModalVisible: action.payload };
    case ACTION_TYPE.SET_TASK_LIST_DATA:
      return { ...store, taskListData: action.payload };
    case ACTION_TYPE.SET_SELECTED_TASKS:
      return { ...store, selectedTasks: action.payload };
    case ACTION_TYPE.SET_SELECTED_TASK_DETAILS:
      return { ...store, selectedTaskDetails: action.payload };
    case ACTION_TYPE.SET_TABLE_DATA:
      return { ...store, tableData: action.payload };
    case ACTION_TYPE.SET_SEARCH_TASK_VALUE:
      return { ...store, searchTaskValue: action.payload };
    case ACTION_TYPE.SET_SEARCH_TASK_RESULT:
      return { ...store, searchTaskResult: action.payload };
    default:
      throw new Error("Reducer failure!");
  }
}
