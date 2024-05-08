import { IDropdownItem } from "@type/dropdown.interface";
import {
  TChickenStrainResponse,
  TContractTypeResponse,
  TCoopTypeResponse,
  TFarmResponse,
  TParentResponse,
  TRoleResponse,
  TUserResponse,
} from "@type/response.type";

export enum ACTION_TYPE {
  SET_ERROR_TYPE = "SET_ERROR_TYPE",
  SET_ERROR_TEXT = "SET_ERROR_TEXT",
  SET_IS_LOADING = "SET_IS_LOADING",
  SET_COOP_CODE = "SET_COOP_CODE",
  SET_COOP_NAME = "SET_COOP_NAME",
  SET_FARM = "SET_FARM",
  SET_COOP_TYPE = "SET_COOP_TYPE",
  SET_STATUS = "SET_STATUS",
  SET_OWNER = "SET_OWNER",
  SET_LEADER = "SET_LEADER",
  SET_CHICK_TYPE = "SET_CHICK_TYPE",
  SET_CONTRACT_TYPE = "SET_CONTRACT_TYPE",
  SET_WORKERS = "SET_WORKERS",
  SET_NUM_FAN = "SET_NUM_FAN",
  SET_CAPACITY_FAN = "SET_CAPACITY_FAN",
  SET_HEIGHT = "SET_HEIGHT",
  SET_LENGTH_DATA = "SET_LENGTH_DATA",
  SET_WIDTH = "SET_WIDTH",
  SET_MAX_CAPACITY = "SET_MAX_CAPACITY",
  SET_CHICK_IN_DATE = "SET_CHICK_IN_DATE",
  SET_REMARKS = "SET_REMARKS",
  SET_IMAGES = "SET_IMAGES",
  SET_CONTROLLER_TYPE = "SET_CONTROLLER_TYPE",
  SET_INLET_TYPE = "SET_INLET_TYPE",
  SET_HEATER_TYPE = "SET_HEATER_TYPE",
  SET_OTHER_CONTROLLER_TYPE = "SET_OTHER_CONTROLLER_TYPE",
  SET_OTHER_INLET_TYPE = "SET_OTHER_INLET_TYPE",
  SET_OTHER_HEATER_TYPE = "SET_OTHER_HEATER_TYPE",
  SET_SELECTED_IMAGES = "SET_SELECTED_IMAGES",
  SET_OWNER_DATA = "SET_OWNER_DATA",
  SET_FARM_DATA = "SET_FARM_DATA",
  SET_COOP_TYPE_DATA = "SET_COOP_TYPE_DATA",
  SET_CHICK_TYPE_DATA = "SET_CHICK_TYPE_DATA",
  SET_CONTRACT_TYPE_DATA = "SET_CONTRACT_TYPE_DATA",
  SET_LEADER_DATA = "SET_LEADER_DATA",
  SET_WORKER_DATA = "SET_WORKER_DATA",
  SET_ROLE_DATA = "SET_ROLE_DATA",
  SET_PARENT_DATA = "SET_PARENT_DATA",
  SET_PARENT = "SET_PARENT",
  SET_ROLE = "SET_ROLE",
}

export enum ERROR_TYPE {
  NONE = "NONE",
  GENERAL = "GENERAL",
  OWNER = "OWNER",
  COOP_CODE = "COOP_CODE",
  COOP_NAME = "COOP_NAME",
  FARM = "FARM",
  COOP_TYPE = "COOP_TYPE",
  CONTRACT_TYPE = "CONTRACT_TYPE",
  STATUS = "STATUS",
  ROLE = "ROLE",
  PARENT = "PARENT",
}

export type TImage = {
  id?: string;
  filename: string;
};

export type TStore = {
  errorType: ERROR_TYPE;
  errorText: string;
  isLoading: boolean;
  coopCode: string;
  coopName: string;
  farm: IDropdownItem<TFarmResponse> | null;
  coopType: IDropdownItem<TCoopTypeResponse> | null;
  status: IDropdownItem<boolean> | null;
  owner: IDropdownItem<TUserResponse> | null;
  leader: IDropdownItem<TUserResponse> | null;
  chickType: IDropdownItem<TChickenStrainResponse> | null;
  contractType: IDropdownItem<TContractTypeResponse> | null;
  workers: IDropdownItem<TUserResponse>[] | null;
  numFan: number | undefined;
  capacityFan: number | undefined;
  height: number | undefined;
  lengthData: number | undefined;
  width: number | undefined;
  maxCapacity: number | undefined;
  chickInDate: string | undefined;
  remarks: string | undefined;
  images: TImage[];
  controllerType: IDropdownItem<string> | null;
  inletType: IDropdownItem<string> | null;
  heaterType: IDropdownItem<string> | null;
  otherControllerType: string;
  otherInletType: string;
  otherHeaterType: string;
  selectedImages: any[];
  ownerData: TUserResponse[];
  farmData: TFarmResponse[];
  coopTypeData: TCoopTypeResponse[];
  chickTypeData: TChickenStrainResponse[];
  contractTypeData: TContractTypeResponse[];
  leaderData: TUserResponse[];
  workerData: TUserResponse[];
  roleData: TRoleResponse[];
  parentData: TParentResponse[];
  parent: IDropdownItem<TParentResponse> | null;
  role: IDropdownItem<TRoleResponse> | null;
};

export const store: TStore = {
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  isLoading: false,
  coopCode: "",
  coopName: "",
  farm: null,
  coopType: null,
  status: null,
  owner: null,
  leader: null,
  chickType: null,
  contractType: null,
  workers: null,
  numFan: undefined,
  capacityFan: undefined,
  height: undefined,
  lengthData: undefined,
  width: undefined,
  maxCapacity: undefined,
  chickInDate: "",
  remarks: "",
  images: [],
  controllerType: null,
  inletType: null,
  heaterType: null,
  otherControllerType: "",
  otherInletType: "",
  otherHeaterType: "",
  selectedImages: [],
  ownerData: [],
  farmData: [],
  coopTypeData: [],
  chickTypeData: [],
  contractTypeData: [],
  leaderData: [],
  workerData: [],
  roleData: [],
  parentData: [],
  parent: null,
  role: null,
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_ERROR_TYPE; payload: typeof store.errorType }
  | { type: ACTION_TYPE.SET_ERROR_TEXT; payload: typeof store.errorText }
  | { type: ACTION_TYPE.SET_IS_LOADING; payload: typeof store.isLoading }
  | { type: ACTION_TYPE.SET_COOP_CODE; payload: typeof store.coopCode }
  | { type: ACTION_TYPE.SET_COOP_NAME; payload: typeof store.coopName }
  | { type: ACTION_TYPE.SET_FARM; payload: typeof store.farm }
  | { type: ACTION_TYPE.SET_COOP_TYPE; payload: typeof store.coopType }
  | { type: ACTION_TYPE.SET_STATUS; payload: typeof store.status }
  | { type: ACTION_TYPE.SET_OWNER; payload: typeof store.owner }
  | { type: ACTION_TYPE.SET_LEADER; payload: typeof store.leader }
  | { type: ACTION_TYPE.SET_CHICK_TYPE; payload: typeof store.chickType }
  | { type: ACTION_TYPE.SET_CONTRACT_TYPE; payload: typeof store.contractType }
  | { type: ACTION_TYPE.SET_WORKERS; payload: typeof store.workers }
  | { type: ACTION_TYPE.SET_NUM_FAN; payload: typeof store.numFan }
  | { type: ACTION_TYPE.SET_CAPACITY_FAN; payload: typeof store.capacityFan }
  | { type: ACTION_TYPE.SET_HEIGHT; payload: typeof store.height }
  | { type: ACTION_TYPE.SET_LENGTH_DATA; payload: typeof store.lengthData }
  | { type: ACTION_TYPE.SET_WIDTH; payload: typeof store.width }
  | { type: ACTION_TYPE.SET_MAX_CAPACITY; payload: typeof store.maxCapacity }
  | { type: ACTION_TYPE.SET_CHICK_IN_DATE; payload: typeof store.chickInDate }
  | { type: ACTION_TYPE.SET_REMARKS; payload: typeof store.remarks }
  | { type: ACTION_TYPE.SET_IMAGES; payload: typeof store.images }
  | {
      type: ACTION_TYPE.SET_CONTROLLER_TYPE;
      payload: typeof store.controllerType;
    }
  | { type: ACTION_TYPE.SET_INLET_TYPE; payload: typeof store.inletType }
  | { type: ACTION_TYPE.SET_HEATER_TYPE; payload: typeof store.heaterType }
  | {
      type: ACTION_TYPE.SET_OTHER_CONTROLLER_TYPE;
      payload: typeof store.otherControllerType;
    }
  | {
      type: ACTION_TYPE.SET_OTHER_INLET_TYPE;
      payload: typeof store.otherInletType;
    }
  | {
      type: ACTION_TYPE.SET_OTHER_HEATER_TYPE;
      payload: typeof store.otherHeaterType;
    }
  | {
      type: ACTION_TYPE.SET_SELECTED_IMAGES;
      payload: typeof store.selectedImages;
    }
  | { type: ACTION_TYPE.SET_OWNER_DATA; payload: typeof store.ownerData }
  | { type: ACTION_TYPE.SET_FARM_DATA; payload: typeof store.farmData }
  | {
      type: ACTION_TYPE.SET_COOP_TYPE_DATA;
      payload: typeof store.coopTypeData;
    }
  | {
      type: ACTION_TYPE.SET_CHICK_TYPE_DATA;
      payload: typeof store.chickTypeData;
    }
  | {
      type: ACTION_TYPE.SET_CONTRACT_TYPE_DATA;
      payload: typeof store.contractTypeData;
    }
  | { type: ACTION_TYPE.SET_LEADER_DATA; payload: typeof store.leaderData }
  | { type: ACTION_TYPE.SET_WORKER_DATA; payload: typeof store.workerData }
  | { type: ACTION_TYPE.SET_ROLE_DATA; payload: typeof store.roleData }
  | { type: ACTION_TYPE.SET_PARENT_DATA; payload: typeof store.parentData }
  | { type: ACTION_TYPE.SET_PARENT; payload: typeof store.parent }
  | { type: ACTION_TYPE.SET_ROLE; payload: typeof store.role };
