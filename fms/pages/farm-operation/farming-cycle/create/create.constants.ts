import { IDropdownItem } from "@type/dropdown.interface";
import {
  TBranchResponse,
  TChickenStrainResponse,
  TContractResponse,
  TCoopResponse,
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
  DOC_IN_BW = "DOC_IN_BW",
  DOC_IN_UNIFORMITY = "DOC_IN_UNIFORMITY",
}

export enum ACTION_TYPE {
  SET_ERROR_TYPE = "SET_ERROR_TYPE",
  SET_ERROR_TEXT = "SET_ERROR_TEXT",
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
  SET_IS_OTHER_CHICK_SUPPLIER_VISIBLE = "SET_IS_OTHER_CHICK_SUPPLIER_VISIBLE",
  SET_LEADER = "SET_LEADER",
  SET_WORKERS = "SET_WORKERS",
  SET_PPLS = "SET_PPLS",
  SET_CHICK_TYPE_DATA = "SET_CHICK_TYPE_DATA",
  SET_COOP_DATA = "SET_COOP_DATA",
  SET_LEADER_DATA = "SET_LEADER_DATA",
  SET_WORKER_DATA = "SET_WORKER_DATA",
  SET_PPL_DATA = "SET_PPL_DATA",
  SET_DOC_IN_BW = "SET_DOC_IN_BW",
  SET_DOC_IN_UNIFORMITY = "SET_DOC_IN_UNIFORMITY",
}

export type TStore = {
  errorType: ERROR_TYPE;
  errorText: string;
  coop: IDropdownItem<TCoopResponse> | null;
  ownerId: string;
  chickType: IDropdownItem<TChickenStrainResponse> | null;
  contract: IDropdownItem<TContractResponse> | null;
  branch: IDropdownItem<TBranchResponse> | null;
  chickSupplierType: IDropdownItem<string> | null;
  otherChickSupplierType: string | undefined;
  farmStartDate: string | undefined;
  remarks?: string;
  hatchery: string | undefined;
  initialPopulation: number | undefined;
  isOtherChickSupplierVisible: boolean;
  docInBW: number | undefined;
  docInUniformity: number | undefined;
  leader: IDropdownItem<TUserResponse> | null;
  workers: IDropdownItem<TUserResponse>[] | null;
  ppls: IDropdownItem<TUserResponse>[] | null;
  chickTypeData: TChickenStrainResponse[];
  coopData: TCoopResponse[];
  leaderData: TUserResponse[];
  workerData: TUserResponse[];
  pplData: TUserResponse[];
};

export const store: TStore = {
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  coop: null,
  ownerId: "",
  remarks: "",
  chickType: null,
  farmStartDate: "",
  contract: null,
  branch: null,
  chickSupplierType: null,
  otherChickSupplierType: "",
  isOtherChickSupplierVisible: false,
  ppls: null,
  hatchery: "",
  initialPopulation: 0,
  docInBW: 0,
  docInUniformity: 0,
  leader: null,
  workers: null,
  chickTypeData: [],
  coopData: [],
  leaderData: [],
  workerData: [],
  pplData: [],
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_ERROR_TYPE; payload: typeof store.errorType }
  | { type: ACTION_TYPE.SET_ERROR_TEXT; payload: typeof store.errorText }
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
  | {
      type: ACTION_TYPE.SET_IS_OTHER_CHICK_SUPPLIER_VISIBLE;
      payload: typeof store.isOtherChickSupplierVisible;
    }
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
  | { type: ACTION_TYPE.SET_DOC_IN_BW; payload: typeof store.docInBW }
  | {
      type: ACTION_TYPE.SET_DOC_IN_UNIFORMITY;
      payload: typeof store.docInUniformity;
    };
