import { REALIZATION_STATUS } from "@constants/index";
import { IDropdownItem } from "@type/dropdown.interface";
import { TCoopResponse, THarvestDetailResponse } from "@type/response.type";

export type TWeighingDataPayload = {
  id?: string;
  quantity: number;
  tonnage: number;
};

const emptyDetailHarvestData: THarvestDetailResponse = {
  id: "",
  farmingCycleCode: "",
  initialPopulation: 0,
  status: "NEW",
  farm: {
    id: "",
    name: "",
    branch: {
      id: "",
      name: "",
    },
  },
  coop: {
    id: "",
    name: "",
  },
  members: [
    {
      id: "",
      name: "",
      userType: "owner",
    },
  ],
  harvest: {
    count: 0,
    latestHarvestDate: "",
    total: {
      quantity: null,
      tonnage: null,
    },
  },
};

export const ERROR_TYPE = {
  NONE: "",
  GENERAL: "general",
  DATE: "date",
  TRUCK_LICENSE_PLATE: "truckLicensePlate",
  DRIVER_NAME: "driver",
  WEIGHING_NUMBER: "weighingNumber",
  HARVEST_BASKET_NAME: "harvestBasketName",
  DELIVERY_ORDER: "deliveryOrder",
  STATUS: "status",
  USER_TYPE: "userType",
  COOP: "coop",
};

export const initialState: {
  errorType: string;
  errorText: string;
  isConfirmationModalVisible: boolean;
  saveAsFinal: boolean;

  farmingCycleId: string;
  date: string;
  truckLicensePlate: string;
  driver: string;
  weighingNumber: string;
  harvestBasketName: string;
  deliveryOrder: string;
  total: {
    quantity: number;
    tonnage: number;
  };
  status: string;

  records: TWeighingDataPayload[];
  coopData: TCoopResponse[];
  detailHarvestData: THarvestDetailResponse;

  coop: IDropdownItem<TCoopResponse> | null;
} = {
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  isConfirmationModalVisible: false,
  saveAsFinal: false,

  farmingCycleId: "",
  date: "",
  truckLicensePlate: "",
  driver: "",
  weighingNumber: "",
  harvestBasketName: "",
  deliveryOrder: "",
  total: {
    quantity: 0,
    tonnage: 0,
  },
  status:
    REALIZATION_STATUS.DRAFT ||
    REALIZATION_STATUS.FINAL ||
    REALIZATION_STATUS.DELETED,

  records: [],
  coopData: [],
  detailHarvestData: emptyDetailHarvestData,

  coop: null,
};

export type TState = typeof initialState;

export const ACTIONS = {
  SET_ERROR_TYPE: "set-error-type",
  SET_ERROR_TEXT: "set-error-text",
  SET_IS_CONFIRMATION_MODAL_VISIBLE: "set-is-confirmation-modal-visible",
  SET_SAVE_AS_FINAL: "set-save-as-final",

  SET_DATE: "set-date",
  SET_TRUCK_LICENSE_PLATE: "set-truck-license-plate",
  SET_DRIVER: "set-driver",
  SET_WEIGHING_NUMBER: "set-weighing-number",
  SET_HARVEST_BASKET_NAME: "set-harvest-basket-name",
  SET_DELIVERY_ORDER: "set-delivery-order",
  SET_TOTAL: "set-total",
  SET_STATUS: "set-status",

  SET_WEIGHING_DATA: "set-weighing-data",
  SET_COOP_DATA: "set-coop-data",
  SET_DETAIL_HARVEST_DATA: "set-detail-harvest-data",

  SET_COOP: "set-coop",
  SET_FARMING_CYCLE_ID: "set-farming-cycle-id",
};
