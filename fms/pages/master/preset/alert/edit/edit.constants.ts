import { IDropdownItem } from "@type/dropdown.interface";
import { TAlertResponse, TCoopTypeResponse } from "@type/response.type";

export enum ERROR_TYPE {
  NONE = "NONE",
  GENERAL = "GENERAL",
  ALERT_PRESET_CODE = "ALERT_PRESET_CODE",
  ALERT_PRESET_NAME = "ALERT_PRESET_NAME",
  COOP_TYPE = "COOP_TYPE",
  STATUS = "STATUS",
}

export enum ACTION_TYPE {
  SET_ERROR_TYPE = "SET_ERROR_TYPE",
  SET_ERROR_TEXT = "SET_ERROR_TEXT",
  SET_OLD_NAME = "SET_OLD_NAME",
  SET_ALERT_PRESET_CODE = "SET_ALERT_PRESET_CODE",
  SET_ALERT_PRESET_NAME = "SET_ALERT_PRESET_NAME",
  SET_COOP_TYPE = "SET_COOP_TYPE",
  SET_ALERT_IDS = "SET_ALERT_IDS",
  SET_REMARKS = "SET_REMARKS",
  SET_STATUS = "SET_STATUS",
  SET_COOP_TYPE_DATA = "SET_COOP_TYPE_DATA",
  SET_IS_ALERT_LIST_MODAL_VISIBLE = "SET_IS_ALERT_LIST_MODAL_VISIBLE",
  SET_ALERT_LIST_DATA = "SET_ALERT_LIST_DATA",
  SET_SELECTED_ALERTS = "SET_SELECTED_ALERTS",
  SET_SELECTED_ALERT_DETAILS = "SET_SELECTED_ALERT_DETAILS",
  SET_TABLE_DATA = "SET_TABLE_DATA",
  SET_SEARCH_ALERT_VALUE = "SET_SEARCH_ALERT_VALUE",
  SET_SEARCH_ALERT_RESULT = "SET_SEARCH_ALERT_RESULT",
}

export type TStore = {
  errorType: ERROR_TYPE;
  errorText: string;
  oldName: string;
  alertPresetCode: string;
  alertPresetName: string;
  alertIds: string[];
  remarks: string;
  status: IDropdownItem<boolean> | null;
  coopType: IDropdownItem<TCoopTypeResponse> | null;
  coopTypeData: TCoopTypeResponse[];
  isAlertListModalVisible: boolean;
  alertListData: TAlertResponse[];
  selectedAlerts: string[];
  selectedAlertDetails: TAlertResponse[];
  tableData: TAlertResponse[];
  searchAlertValue: string;
  searchAlertResult: TAlertResponse[];
};

export const store: TStore = {
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  oldName: "",
  alertPresetCode: "",
  alertPresetName: "",
  coopType: null,
  alertIds: [],
  remarks: "",
  status: null,
  coopTypeData: [],
  isAlertListModalVisible: false,
  alertListData: [],
  selectedAlerts: [],
  selectedAlertDetails: [],
  tableData: [],
  searchAlertValue: "",
  searchAlertResult: [],
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_ERROR_TYPE; payload: typeof store.errorType }
  | { type: ACTION_TYPE.SET_ERROR_TEXT; payload: typeof store.errorText }
  | { type: ACTION_TYPE.SET_OLD_NAME; payload: typeof store.oldName }
  | {
      type: ACTION_TYPE.SET_ALERT_PRESET_CODE;
      payload: typeof store.alertPresetCode;
    }
  | {
      type: ACTION_TYPE.SET_ALERT_PRESET_NAME;
      payload: typeof store.alertPresetName;
    }
  | { type: ACTION_TYPE.SET_COOP_TYPE; payload: typeof store.coopType }
  | { type: ACTION_TYPE.SET_ALERT_IDS; payload: typeof store.alertIds }
  | { type: ACTION_TYPE.SET_REMARKS; payload: typeof store.remarks }
  | { type: ACTION_TYPE.SET_STATUS; payload: typeof store.status }
  | { type: ACTION_TYPE.SET_COOP_TYPE_DATA; payload: typeof store.coopTypeData }
  | {
      type: ACTION_TYPE.SET_IS_ALERT_LIST_MODAL_VISIBLE;
      payload: typeof store.isAlertListModalVisible;
    }
  | {
      type: ACTION_TYPE.SET_ALERT_LIST_DATA;
      payload: typeof store.alertListData;
    }
  | {
      type: ACTION_TYPE.SET_SELECTED_ALERTS;
      payload: typeof store.selectedAlerts;
    }
  | {
      type: ACTION_TYPE.SET_SELECTED_ALERT_DETAILS;
      payload: typeof store.selectedAlertDetails;
    }
  | { type: ACTION_TYPE.SET_TABLE_DATA; payload: typeof store.tableData }
  | {
      type: ACTION_TYPE.SET_SEARCH_ALERT_VALUE;
      payload: typeof store.searchAlertValue;
    }
  | {
      type: ACTION_TYPE.SET_SEARCH_ALERT_RESULT;
      payload: typeof store.searchAlertResult;
    };
