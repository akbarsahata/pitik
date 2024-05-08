import {
  THarvestDetailResponse,
  TRealizationsInFarmingCycleResponse,
} from "@type/response.type";

export const ERROR_TYPE = {
  NONE: "",
  GENERAL: "general",
};

export const initialState: {
  status: string;
  errorType: string;
  errorText: string;
  deletedHarvestItem: string;
  isDeleteModalVisible: boolean;

  detailsData: THarvestDetailResponse[];
  realizationsData: TRealizationsInFarmingCycleResponse[];
} = {
  status: "",
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  deletedHarvestItem: "",
  isDeleteModalVisible: false,

  detailsData: [],
  realizationsData: [],
};

export type TState = typeof initialState;

export const ACTIONS = {
  SET_STATUS: "set-status",
  SET_ERROR_TYPE: "set-error-type",
  SET_ERROR_TEXT: "set-error-text",
  SET_DELETED_HARVEST_ITEM: "set-deleted-harvest-item",

  SET_DETAILS_DATA: "set-details-data",
  SET_REALIZATIONS_DATA: "set-realizations-data",
  SET_IS_DELETE_MODAL_VISIBLE: "set-is-delete-modal-visible",
};
