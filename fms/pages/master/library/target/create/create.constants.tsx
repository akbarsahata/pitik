import { IDropdownItem } from "@type/dropdown.interface";
import {
  TChickenStrainResponse,
  TCoopTypeResponse,
  TTargetDayResponse,
  TVariableResponse,
} from "@type/response.type";

export enum ERROR_TYPE {
  NONE = "NONE",
  GENERAL = "GENERAL",
  TARGET_CODE = "TARGET_CODE",
  TARGET_NAME = "TARGET_NAME",
  COOP_TYPE = "COOP_TYPE",
  CHICK_TYPE = "CHICK_TYPE",
  VARIABLE = "VARIABLE",
  REMARKS = "REMARKS",
  STATUS = "STATUS",
}

export enum ACTION_TYPE {
  SET_ERROR_TYPE = "SET_ERROR_TYPE",
  SET_ERROR_TEXT = "SET_ERROR_TEXT",
  SET_COOP_TYPE_DATA = "SET_COOP_TYPE_DATA",
  SET_CHICK_TYPE_DATA = "SET_CHICK_TYPE_DATA",
  SET_VARIABLE_DATA = "SET_VARIABLE_DATA",
  SET_GENERATE_TARGETS = "SET_GENERATE_TARGETS",
  SET_REMOVE_ALL_TARGETS_MODAL_VISIBLE = "SET_REMOVE_ALL_TARGETS_MODAL_VISIBLE",
  SET_TARGET_CODE = "SET_TARGET_CODE",
  SET_TARGET_NAME = "SET_TARGET_NAME",
  SET_STATUS = "SET_STATUS",
  SET_TARGET_DAYS_COUNT = "SET_TARGET_DAYS_COUNT",
  SET_REMARKS = "SET_REMARKS",
  SET_COOP_TYPE = "SET_COOP_TYPE",
  SET_CHICK_TYPE = "SET_CHICK_TYPE",
  SET_VARIABLE = "SET_VARIABLE",
  SET_TARGETS = "SET_TARGETS",
}

export type TStore = {
  errorType: ERROR_TYPE;
  errorText: string;
  coopTypeData: TCoopTypeResponse[];
  chickTypeData: TChickenStrainResponse[];
  variableData: TVariableResponse[];
  removeAllTargetsModalVisible: boolean;
  generateTargets: TTargetDayResponse;
  targetCode: string;
  targetName: string;
  status: IDropdownItem<boolean> | null;
  targetDaysCount: number | undefined;
  remarks: string;
  coopType: IDropdownItem<TCoopTypeResponse> | null;
  chickType: IDropdownItem<TChickenStrainResponse> | null;
  variable: IDropdownItem<TVariableResponse> | null;
  targets: TTargetDayResponse[];
};

export const store: TStore = {
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  coopTypeData: [],
  chickTypeData: [],
  variableData: [],
  removeAllTargetsModalVisible: false,
  generateTargets: {
    id: "",
    day: 0,
    minValue: 0,
    maxValue: 0,
  },
  targetCode: "",
  targetName: "",
  status: null,
  targetDaysCount: undefined,
  remarks: "",
  coopType: null,
  chickType: null,
  variable: null,
  targets: [],
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_ERROR_TYPE; payload: typeof store.errorType }
  | { type: ACTION_TYPE.SET_ERROR_TEXT; payload: typeof store.errorText }
  | { type: ACTION_TYPE.SET_COOP_TYPE_DATA; payload: typeof store.coopTypeData }
  | {
      type: ACTION_TYPE.SET_CHICK_TYPE_DATA;
      payload: typeof store.chickTypeData;
    }
  | { type: ACTION_TYPE.SET_VARIABLE_DATA; payload: typeof store.variableData }
  | {
      type: ACTION_TYPE.SET_GENERATE_TARGETS;
      payload: typeof store.generateTargets;
    }
  | {
      type: ACTION_TYPE.SET_REMOVE_ALL_TARGETS_MODAL_VISIBLE;
      payload: typeof store.removeAllTargetsModalVisible;
    }
  | { type: ACTION_TYPE.SET_TARGET_CODE; payload: typeof store.targetCode }
  | { type: ACTION_TYPE.SET_TARGET_NAME; payload: typeof store.targetName }
  | { type: ACTION_TYPE.SET_STATUS; payload: typeof store.status }
  | {
      type: ACTION_TYPE.SET_TARGET_DAYS_COUNT;
      payload: typeof store.targetDaysCount;
    }
  | { type: ACTION_TYPE.SET_REMARKS; payload: typeof store.remarks }
  | { type: ACTION_TYPE.SET_COOP_TYPE; payload: typeof store.coopType }
  | { type: ACTION_TYPE.SET_CHICK_TYPE; payload: typeof store.chickType }
  | { type: ACTION_TYPE.SET_VARIABLE; payload: typeof store.variable }
  | { type: ACTION_TYPE.SET_TARGETS; payload: typeof store.targets };
