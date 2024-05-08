import { IDropdownItem } from "@type/dropdown.interface";
import {
  TBranchResponse,
  TCoopResponse,
  TDevicesSensorResponse,
  TFarmResponse,
  TIotTicketDataResponse,
  TIotTicketDeviceStatusResponse,
  TUserResponse,
} from "@type/response.type";

export type TGetManyIotTicketResponse<T> = {
  code: number;
  count: number;
  deviceStatus: TIotTicketDeviceStatusResponse;
  data: T;
};

export enum TICKET_STATUS {
  ALL = "ALL",
  OPEN = "OPEN",
  ON_MAINTENANCE = "ON_MAINTENANCE",
  RESOLVED = "RESOLVED",
  OTHERS = "OTHERS",
}

export const ERROR_TYPE = {
  NONE: "",
  GENERAL: "general",
};

export type TSearch = {
  macAddress: string | undefined;
  deviceId: string | undefined;
  farm: IDropdownItem<TFarmResponse> | null;
  coop: IDropdownItem<TCoopResponse> | null;
  branch: IDropdownItem<TBranchResponse> | null;
  incident: string | undefined;
  pic: IDropdownItem<TUserResponse> | null;
};

export const emptySearch: TSearch = {
  macAddress: "",
  deviceId: "",
  farm: null,
  coop: null,
  branch: null,
  incident: "",
  pic: null,
};

export type TTablePageAll = {
  tablePage: number;
  isLastPage: boolean;
};

export type TTablePageOpen = {
  tablePage: number;
  isLastPage: boolean;
};

export type TTablePageOnMaintenance = {
  tablePage: number;
  isLastPage: boolean;
};

export type TTablePageAResolved = {
  tablePage: number;
  isLastPage: boolean;
};

export type TTablePageOthers = {
  tablePage: number;
  isLastPage: boolean;
};

export const tablePageAll: TTablePageAll = {
  tablePage: 1,
  isLastPage: false,
};

export const tablePageOpen: TTablePageOpen = {
  tablePage: 1,
  isLastPage: false,
};

export const tablePageOnMaintenance: TTablePageOnMaintenance = {
  tablePage: 1,
  isLastPage: false,
};

export const tablePageResolved: TTablePageAResolved = {
  tablePage: 1,
  isLastPage: false,
};

export const tablePageOthers: TTablePageOthers = {
  tablePage: 1,
  isLastPage: false,
};

export const initialState: {
  errorType: string;
  errorText: string;
  isAdvanceSearchVisible: boolean;
  activeTab: string;
  tablePageAll: TTablePageAll;
  tablePageOpen: TTablePageOpen;
  tablePageOnMaintenance: TTablePageOnMaintenance;
  tablePageResolved: TTablePageAResolved;
  tablePageOthers: TTablePageOthers;
  search: TSearch;
  inputSearch: TSearch;
  farmData: TFarmResponse[];
  coopData: TCoopResponse[];
  deviceData: TDevicesSensorResponse[];
  branchData: TBranchResponse[];
  picData: TUserResponse[];
  tableData: TIotTicketDataResponse[];
  deviceStatus: {
    open: number;
    onMaintenance: number;
    resolved: number;
    others: number;
  };
} = {
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  isAdvanceSearchVisible: false,
  activeTab: TICKET_STATUS.OPEN,
  tablePageAll: tablePageAll,
  tablePageOpen: tablePageOpen,
  tablePageOnMaintenance: tablePageOnMaintenance,
  tablePageResolved: tablePageResolved,
  tablePageOthers: tablePageOthers,
  search: emptySearch,
  inputSearch: emptySearch,
  farmData: [],
  coopData: [],
  deviceData: [],
  branchData: [],
  picData: [],
  tableData: [],
  deviceStatus: {
    open: 0,
    onMaintenance: 0,
    resolved: 0,
    others: 0,
  },
};

export type TState = typeof initialState;

export const ACTIONS = {
  SET_ERROR_TYPE: "set-error-type",
  SET_ERROR_TEXT: "set-error-text",
  SET_IS_ADVANCE_SEARCH_VISIBLE: "set-is-advance-search-visible",
  SET_RESET_ALL_TABLE_PAGE: "set-reset-all-table-page",
  SET_ACTIVE_TAB: "set-active-tab",
  SET_TABLE_PAGE_ALL: "set-table-page-all",
  SET_TABLE_PAGE_OPEN: "set-table-page-open",
  SET_TABLE_PAGE_ON_MAINTENANCE: "set-table-page-on-maintenance",
  SET_TABLE_PAGE_RESOLVED: "set-table-page-resolved",
  SET_TABLE_PAGE_OTHERS: "set-table-page-others",
  SET_SEARCH: "set-search",
  SET_INPUT_SEARCH: "set-input-search",
  RESET_SEARCH: "reset-search",
  SET_COOP_DATA: "set-coop-data",
  SET_FARM_DATA: "set-farm-data",
  SET_DEVICE_DATA: "set-device-data",
  SET_BRANCH_DATA: "set-branch-data",
  SET_PIC_DATA: "set-pic-data",
  SET_TABLE_DATA: "set-table-data",
  SET_DEVICE_STATUS: "set-device-status",
};
