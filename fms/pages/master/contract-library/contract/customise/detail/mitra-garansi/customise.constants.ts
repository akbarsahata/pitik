import { IDropdownItem } from "@type/dropdown.interface";
import {
  TContractMarketInsentivePayload,
  TInsentiveDealsPayload,
  TSapronakPayload,
} from "@type/payload.type";
import { TBranchResponse, TCoopResponse } from "@type/response.type";

export enum ERROR_TYPE {
  NONE = "NONE",
  GENERAL = "GENERAL",
  COOP = "COOP",
  EFFECTIVE_START_DATE = "EFFECTIVE_START_DATE",
  SAVING_PERCENTAGE = "SAVING_PERCENTAGE",
  SAVING_PERCENTAGE_INVALID = "SAVING_PERCENTAGE_INVALID",
  SAVING_MINIMUM_PROFIT = "SAVING_MINIMUM_PROFIT",
  DEDUCTION_DUE_TO_FARMING_CYCLE_LOSS_PERCENTAGE = "DEDUCTION_DUE_TO_FARMING_CYCLE_LOSS_PERCENTAGE",
  DEDUCTION_DUE_TO_FARMING_CYCLE_LOSS_PERCENTAGE_INVALID = "DEDUCTION_DUE_TO_FARMING_CYCLE_LOSS_PERCENTAGE_INVALID",
  DEDUCTION_DUE_TO_FARMING_CYCLE_LOSS_MINIMUM_PROFIT = "DEDUCTION_DUE_TO_FARMING_CYCLE_LOSS_MINIMUM_PROFIT",
  INCENTIVE_PERCENTAGE = "INCENTIVE_PERCENTAGE",
}

export enum ACTION_TYPE {
  SET_ERROR_TYPE = "SET_ERROR_TYPE",
  SET_ERROR_TEXT = "SET_ERROR_TEXT",
  SET_COOP = "SET_COOP",
  SET_COOP_DATA = "SET_COOP_DATA",
  SET_BRANCH = "SET_BRANCH",
  SET_BRANCH_DATA = "SET_BRANCH_DATA",
  SET_EFFECTIVE_START_DATE = "SET_EFFECTIVE_START_DATE",
  SET_SAPRONAK = "SET_SAPRONAK",
  SET_CHICKEN_PRICE = "SET_CHICKEN_PRICE",
  SET_INSENTIVE_DEALS = "SET_INSENTIVE_DEALS",
  SET_SAVING = "SET_SAVING",
  SET_DEDUCTION_DUE_TO_FARMING_CYCLE_LOSS = "SET_DEDUCTION_DUE_TO_FARMING_CYCLE_LOSS",
  SET_CONTRACT_MARKET_INSENTIVE = "SET_CONTRACT_MARKET_INSENTIVE",
  SET_CONFIRMATION_MODAL_VISIBLE = "SET_CONFIRMATION_MODAL_VISIBLE",
}

export type TChickenPricePayload = {
  lowerRange: string;
  upperRange: string;
  price: number;
};

export type TSavingAndDeductionPayload = {
  precentage: number;
  minimumProfit: number;
};

export type TStore = {
  errorType: ERROR_TYPE;
  errorText: string;
  coop: IDropdownItem<TCoopResponse> | null;
  branch: IDropdownItem<TBranchResponse> | null;
  effectiveStartDate: string;
  sapronak: TSapronakPayload[];
  chickenPrice: TChickenPricePayload[];
  insentiveDeals: TInsentiveDealsPayload[];
  saving: TSavingAndDeductionPayload;
  deductionDueToFarmingCycleLoss: TSavingAndDeductionPayload;
  contractMarketInsentive: TContractMarketInsentivePayload;
  confirmationModalVisible: boolean;
  coopData: TCoopResponse[];
  branchData: TBranchResponse[];
};

export const store: TStore = {
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  coop: null,
  branch: null,
  effectiveStartDate: "",
  sapronak: [
    {
      categoryCode: "DOC",
      subcategoryCode: "DOC",
      price: 0,
      uom: "Ekor",
    },
    {
      categoryCode: "DOC",
      subcategoryCode: "DOC+VACCINE",
      price: 0,
      uom: "Ekor",
    },
    {
      categoryCode: "FEED",
      subcategoryCode: "PRESTARTER",
      price: 0,
      uom: "kg",
    },
    {
      categoryCode: "FEED",
      subcategoryCode: "STARTER",
      price: 0,
      uom: "kg",
    },
    {
      categoryCode: "FEED",
      subcategoryCode: "FINISHER",
      price: 0,
      uom: "kg",
    },
    {
      categoryCode: "OVK",
      subcategoryCode: "OVK",
      price: 0,
      uom: "%",
    },
  ],
  chickenPrice: [
    {
      lowerRange: "0",
      upperRange: "0.8",
      price: 0,
    },
    {
      lowerRange: "0.8",
      upperRange: "0.99",
      price: 0,
    },
    {
      lowerRange: "1.00",
      upperRange: "1.09",
      price: 0,
    },
    {
      lowerRange: "1.10",
      upperRange: "1.19",
      price: 0,
    },
    {
      lowerRange: "1.20",
      upperRange: "1.29",
      price: 0,
    },
    {
      lowerRange: "1.30",
      upperRange: "1.39",
      price: 0,
    },
    {
      lowerRange: "1.40",
      upperRange: "1.49",
      price: 0,
    },
    {
      lowerRange: "1.50",
      upperRange: "1.59",
      price: 0,
    },
    {
      lowerRange: "1.60",
      upperRange: "1.69",
      price: 0,
    },
    {
      lowerRange: "1.70",
      upperRange: "1.79",
      price: 0,
    },
    {
      lowerRange: "1.80",
      upperRange: "1.89",
      price: 0,
    },
    {
      lowerRange: "1.90",
      upperRange: "1.99",
      price: 0,
    },
    {
      lowerRange: "2.00",
      upperRange: "2.09",
      price: 0,
    },
    {
      lowerRange: "2.10",
      upperRange: "2.19",
      price: 0,
    },
    {
      lowerRange: "2.20",
      upperRange: "2.29",
      price: 0,
    },
    {
      lowerRange: "2.30",
      upperRange: "2.39",
      price: 0,
    },
    {
      lowerRange: "2.40",
      upperRange: "2.50",
      price: 0,
    },
  ],
  insentiveDeals: [
    {
      lowerIp: "300",
      upperIp: "309",
      price: 0,
    },
    {
      lowerIp: "310",
      upperIp: "319",
      price: 0,
    },
    {
      lowerIp: "320",
      upperIp: "329",
      price: 0,
    },
    {
      lowerIp: "330",
      upperIp: "up",
      price: 0,
    },
  ],
  saving: {
    precentage: 0,
    minimumProfit: 0,
  },
  deductionDueToFarmingCycleLoss: {
    precentage: 0,
    minimumProfit: 0,
  },
  contractMarketInsentive: {
    rangeIp: "",
    insentivePrecentage: null,
  },
  confirmationModalVisible: false,

  coopData: [],
  branchData: [],
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_ERROR_TYPE; payload: typeof store.errorType }
  | { type: ACTION_TYPE.SET_ERROR_TEXT; payload: typeof store.errorText }
  | { type: ACTION_TYPE.SET_COOP; payload: typeof store.coop }
  | { type: ACTION_TYPE.SET_COOP_DATA; payload: typeof store.coopData }
  | { type: ACTION_TYPE.SET_BRANCH; payload: typeof store.branch }
  | { type: ACTION_TYPE.SET_BRANCH_DATA; payload: typeof store.branchData }
  | {
      type: ACTION_TYPE.SET_EFFECTIVE_START_DATE;
      payload: typeof store.effectiveStartDate;
    }
  | { type: ACTION_TYPE.SET_SAPRONAK; payload: typeof store.sapronak }
  | { type: ACTION_TYPE.SET_CHICKEN_PRICE; payload: typeof store.chickenPrice }
  | {
      type: ACTION_TYPE.SET_INSENTIVE_DEALS;
      payload: typeof store.insentiveDeals;
    }
  | { type: ACTION_TYPE.SET_SAVING; payload: typeof store.saving }
  | {
      type: ACTION_TYPE.SET_DEDUCTION_DUE_TO_FARMING_CYCLE_LOSS;
      payload: typeof store.deductionDueToFarmingCycleLoss;
    }
  | {
      type: ACTION_TYPE.SET_CONTRACT_MARKET_INSENTIVE;
      payload: typeof store.contractMarketInsentive;
    }
  | {
      type: ACTION_TYPE.SET_CONFIRMATION_MODAL_VISIBLE;
      payload: typeof store.confirmationModalVisible;
    };
