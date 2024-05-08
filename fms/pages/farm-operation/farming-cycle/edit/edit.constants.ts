import { IDropdownItem } from "@type/dropdown.interface";
import {
  TBranchResponse,
  TChickenStrainResponse,
  TContractResponse,
  TCoopResponse,
  TFarmingCycleRepopulateResponse,
  TUserResponse,
} from "@type/response.type";

export enum ERROR_TYPE {
  NONE = "NONE",
  GENERAL = "GENERAL",
  COOP = "COOP",
  CHICK_TYPE = "CHICK_TYPE",
  PPLS = "PPLS",
  FARM_START_DATE = "FARM_START_DATE",
  CHICK_SUPPLIER_TYPE = "CHICK_SUPPLIER_TYPE",
  OTHER_CHICK_SUPPLIER_TYPE = "OTHER_CHICK_SUPPLIER_TYPE",
  PPL_TYPE = "PPL_TYPE",
  HATCHERY = "HATCHERY",
  INITIAL_POPULATION = "INITIAL_POPULATION",
  CLOSED_DATE = "CLOSED_DATE",
  REPOPULATE_REASON = "REPOPULATE_REASON",
  OTHER_REPOPULATE_REASON = "OTHER_REPOPULATE_REASON",
  APPROVED_AMOUNT = "APPROVED_AMOUNT",
  REPOPULATE_DATE = "REPOPULATE_DATE",
  DOC_IN_BW = "DOC_IN_BW",
  DOC_IN_UNIFORMITY = "DOC_IN_UNIFORMITY",
}

export enum ACTION_TYPE {
  SET_ERROR_TYPE = "SET_ERROR_TYPE",
  SET_ERROR_TEXT = "SET_ERROR_TEXT",
  SET_OLD_NAME = "SET_OLD_NAME",
  SET_OLD_FARM_START_DATE = "SET_OLD_FARM_START_DATE",
  SET_INITIAL_WORKER_IDS = "SET_INITIAL_WORKER_IDS",
  SET_COOP = "SET_COOP",
  SET_OWNER_ID = "SET_OWNER_ID",
  SET_CHICK_TYPE = "SET_CHICK_TYPE",
  SET_CONTRACT = "SET_CONTRACT",
  SET_BRANCH = "SET_BRANCH",
  SET_CHICK_SUPPLIER_TYPE = "SET_CHICK_SUPPLIER_TYPE",
  SET_OTHER_CHICK_SUPPLIER_TYPE = "SET_OTHER_CHICK_SUPPLIER_TYPE",
  SET_FARM_START_DATE = "SET_FARM_START_DATE",
  SET_REMARKS = "SET_REMARKS",
  SET_HATCHERY = "SET_HATCHERY",
  SET_INITIAL_POPULATION = "SET_INITIAL_POPULATION",
  SET_DOC_IN_BW = "SET_DOC_IN_BW",
  SET_DOC_IN_UNIFORMITY = "SET_DOC_IN_UNIFORMITY",
  SET_IS_OTHER_CHICK_SUPPLIER_VISIBLE = "SET_IS_OTHER_CHICK_SUPPLIER_VISIBLE",
  SET_IS_CLOSE_FARMING_CYCLE_MODAL_VISIBLE = "SET_IS_CLOSE_FARMING_CYCLE_MODAL_VISIBLE",
  SET_IS_REPOPULATION_MODAL_VISIBLE = "SET_IS_REPOPULATION_MODAL_VISIBLE",
  SET_FARMING_STATUS = "SET_FARMING_STATUS",
  SET_CLOSED_DATE = "SET_CLOSED_DATE",
  SET_LEADER = "SET_LEADER",
  SET_WORKERS = "SET_WORKERS",
  SET_PPLS = "SET_PPLS",
  SET_CHICK_TYPE_DATA = "SET_CHICK_TYPE_DATA",
  SET_COOP_DATA = "SET_COOP_DATA",
  SET_LEADER_DATA = "SET_LEADER_DATA",
  SET_WORKER_DATA = "SET_WORKER_DATA",
  SET_PPL_DATA = "SET_PPL_DATA",
  SET_REPOPULATE_REASON = "SET_REPOPULATE_REASON",
  SET_OTHER_REPOPULATE_REASON = "SET_OTHER_REPOPULATE_REASON",
  SET_APPROVED_AMOUNT = "SET_APPROVED_AMOUNT",
  SET_REPOPULATE_DATE = "SET_REPOPULATE_DATE",
  SET_REPOPULATE_DATA = "SET_REPOPULATE_DATA",
  SET_IS_CONFIRMATION_MODAL_VISIBLE = "SET_IS_CONFIRMATION_MODAL_VISIBLE",
  SET_IS_WANT_TO_REPOPULATE = "SET_IS_WANT_TO_REPOPULATE",
  SET_TEMP = "SET_TEMP",
}

export type TTemp = {
  leaderId: string;
};

export type TStore = {
  errorType: ERROR_TYPE;
  errorText: string;
  oldName: string;
  oldFarmStartDate: string | undefined;
  coop: IDropdownItem<TCoopResponse> | null;
  ownerId: string;
  initialWorkerIds: string[];
  chickType: IDropdownItem<TChickenStrainResponse> | null;
  contract: IDropdownItem<TContractResponse> | null;
  branch: IDropdownItem<TBranchResponse> | null;
  chickSupplierType: IDropdownItem<string> | null;
  otherChickSupplierType: string | undefined;
  farmStartDate: string | undefined;
  remarks?: string;
  hatchery: string | undefined;
  initialPopulation: number | undefined;
  docInBW: number | undefined;
  docInUniformity: number | undefined;
  isOtherChickSupplierVisible: boolean;
  isCloseFarmingCycleModalVisible: boolean;
  farmingStatus: string | undefined;
  closedDate: string | undefined;
  isRepopulationModalVisible: boolean;
  repopulateReason: IDropdownItem<string> | null;
  otherRepopulateReason: string | undefined;
  approvedAmount: number | undefined;
  repopulateDate: IDropdownItem<string> | null;
  isConfirmationModalVisible: boolean;
  isWantToRepopulate: boolean;
  temp: TTemp;
  leader: IDropdownItem<TUserResponse> | null;
  workers: IDropdownItem<TUserResponse>[] | null;
  ppls: IDropdownItem<TUserResponse>[] | null;
  repopulateData: TFarmingCycleRepopulateResponse[];
  chickTypeData: TChickenStrainResponse[];
  coopData: TCoopResponse[];
  leaderData: TUserResponse[];
  workerData: TUserResponse[];
  pplData: TUserResponse[];
};

export const store: TStore = {
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  oldName: "",
  oldFarmStartDate: "",
  coop: null,
  ownerId: "",
  initialWorkerIds: [],
  remarks: "",
  chickType: null,
  farmStartDate: "",
  contract: null,
  branch: null,
  chickSupplierType: null,
  otherChickSupplierType: "",
  isOtherChickSupplierVisible: false,
  isCloseFarmingCycleModalVisible: false,
  ppls: null,
  hatchery: "",
  initialPopulation: 0,
  docInBW: 0,
  docInUniformity: 0,
  farmingStatus: undefined,
  closedDate: undefined,
  isRepopulationModalVisible: false,
  repopulateReason: null,
  otherRepopulateReason: "",
  approvedAmount: undefined,
  repopulateDate: null,
  isConfirmationModalVisible: false,
  isWantToRepopulate: false,
  temp: {
    leaderId: "",
  },
  leader: null,
  workers: null,
  chickTypeData: [],
  coopData: [],
  leaderData: [],
  workerData: [],
  pplData: [],
  repopulateData: [],
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_ERROR_TYPE; payload: typeof store.errorType }
  | { type: ACTION_TYPE.SET_ERROR_TEXT; payload: typeof store.errorText }
  | { type: ACTION_TYPE.SET_OLD_NAME; payload: typeof store.oldName }
  | {
      type: ACTION_TYPE.SET_OLD_FARM_START_DATE;
      payload: typeof store.oldFarmStartDate;
    }
  | {
      type: ACTION_TYPE.SET_INITIAL_WORKER_IDS;
      payload: typeof store.initialWorkerIds;
    }
  | { type: ACTION_TYPE.SET_COOP; payload: typeof store.coop }
  | { type: ACTION_TYPE.SET_OWNER_ID; payload: typeof store.ownerId }
  | { type: ACTION_TYPE.SET_CHICK_TYPE; payload: typeof store.chickType }
  | { type: ACTION_TYPE.SET_CONTRACT; payload: typeof store.contract }
  | { type: ACTION_TYPE.SET_BRANCH; payload: typeof store.branch }
  | {
      type: ACTION_TYPE.SET_CHICK_SUPPLIER_TYPE;
      payload: typeof store.chickSupplierType;
    }
  | {
      type: ACTION_TYPE.SET_OTHER_CHICK_SUPPLIER_TYPE;
      payload: typeof store.otherChickSupplierType;
    }
  | {
      type: ACTION_TYPE.SET_FARM_START_DATE;
      payload: typeof store.farmStartDate;
    }
  | { type: ACTION_TYPE.SET_REMARKS; payload: typeof store.remarks }
  | { type: ACTION_TYPE.SET_HATCHERY; payload: typeof store.hatchery }
  | {
      type: ACTION_TYPE.SET_INITIAL_POPULATION;
      payload: typeof store.initialPopulation;
    }
  | { type: ACTION_TYPE.SET_DOC_IN_BW; payload: typeof store.docInBW }
  | {
      type: ACTION_TYPE.SET_DOC_IN_UNIFORMITY;
      payload: typeof store.docInUniformity;
    }
  | {
      type: ACTION_TYPE.SET_IS_OTHER_CHICK_SUPPLIER_VISIBLE;
      payload: typeof store.isOtherChickSupplierVisible;
    }
  | {
      type: ACTION_TYPE.SET_IS_CLOSE_FARMING_CYCLE_MODAL_VISIBLE;
      payload: typeof store.isCloseFarmingCycleModalVisible;
    }
  | {
      type: ACTION_TYPE.SET_IS_REPOPULATION_MODAL_VISIBLE;
      payload: typeof store.isRepopulationModalVisible;
    }
  | {
      type: ACTION_TYPE.SET_FARMING_STATUS;
      payload: typeof store.farmingStatus;
    }
  | { type: ACTION_TYPE.SET_CLOSED_DATE; payload: typeof store.closedDate }
  | { type: ACTION_TYPE.SET_LEADER; payload: typeof store.leader }
  | { type: ACTION_TYPE.SET_WORKERS; payload: typeof store.workers }
  | { type: ACTION_TYPE.SET_PPLS; payload: typeof store.ppls }
  | {
      type: ACTION_TYPE.SET_CHICK_TYPE_DATA;
      payload: typeof store.chickTypeData;
    }
  | { type: ACTION_TYPE.SET_COOP_DATA; payload: typeof store.coopData }
  | { type: ACTION_TYPE.SET_LEADER_DATA; payload: typeof store.leaderData }
  | { type: ACTION_TYPE.SET_WORKER_DATA; payload: typeof store.workerData }
  | { type: ACTION_TYPE.SET_PPL_DATA; payload: typeof store.pplData }
  | {
      type: ACTION_TYPE.SET_REPOPULATE_REASON;
      payload: typeof store.repopulateReason;
    }
  | {
      type: ACTION_TYPE.SET_OTHER_REPOPULATE_REASON;
      payload: typeof store.otherRepopulateReason;
    }
  | {
      type: ACTION_TYPE.SET_APPROVED_AMOUNT;
      payload: typeof store.approvedAmount;
    }
  | {
      type: ACTION_TYPE.SET_REPOPULATE_DATE;
      payload: typeof store.repopulateDate;
    }
  | {
      type: ACTION_TYPE.SET_REPOPULATE_DATA;
      payload: typeof store.repopulateData;
    }
  | {
      type: ACTION_TYPE.SET_IS_CONFIRMATION_MODAL_VISIBLE;
      payload: typeof store.isConfirmationModalVisible;
    }
  | {
      type: ACTION_TYPE.SET_IS_WANT_TO_REPOPULATE;
      payload: typeof store.isWantToRepopulate;
    }
  | { type: ACTION_TYPE.SET_TEMP; payload: typeof store.temp };
