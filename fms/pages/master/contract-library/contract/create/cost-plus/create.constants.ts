import { IDropdownItem } from "@type/dropdown.interface";
import {
  TContractMarketInsentivePayload,
  TInsentiveDealsPayload,
  TSapronakPayload,
} from "@type/payload.type";
import { TBranchResponse } from "@type/response.type";

export enum ERROR_TYPE {
  NONE = "NONE",
  GENERAL = "GENERAL",
  BRANCH = "BRANCH",
  EFFECTIVE_START_DATE = "EFFECTIVE_START_DATE",
  DOC_DOC = "DOC_DOC",
  DOC_DOCVACCINE = "DOC_DOCVACCINE",
  FEED_PRE_STARTER = "FEED_PRE_STARTER",
  FEED_STARTER = "FEED_STARTER",
  FEED_FINISHER = "FEED_FINISHER",
  OVK_OVK = "OVK_OVK",
  OVK_OVK_INVALID = "OVK_OVK_INVALID",
  BOP_1_AMOUNT = "BOP_1_AMOUNT",
  BOP_1_TERM = "BOP_1_TERM",
  BOP_2_AMOUNT = "BOP_2_AMOUNT",
  BOP_2_TERM = "BOP_2_TERM",
  BOP_3_AMOUNT = "BOP_3_AMOUNT",
  BOP_3_TERM = "BOP_3_TERM",
  PRE_BOP_3_IP = "PRE_BOP_3_IP",
  INSENTIVE_DEAL_IP_1 = "INSENTIVE_DEAL_IP_1",
  INSENTIVE_DEAL_IP_2 = "INSENTIVE_DEAL_IP_2",
  INSENTIVE_DEAL_IP_3 = "INSENTIVE_DEAL_IP_3",
  INSENTIVE_DEAL_IP_4 = "INSENTIVE_DEAL_IP_4",
  INSENTIVE_DEAL_IP_5 = "INSENTIVE_DEAL_IP_5",
  LOSS_DEDUCTION_FROM_PROFIT_INVALID = "LOSS_DEDUCTION_FROM_PROFIT_INVALID",
  INCENTIVE_PERCENTAGE = "INCENTIVE_PERCENTAGE",
}

export enum ACTION_TYPE {
  SET_ERROR_TYPE = "SET_ERROR_TYPE",
  SET_ERROR_TEXT = "SET_ERROR_TEXT",
  SET_BRANCH = "SET_BRANCH",
  SET_BRANCH_DATA = "SET_BRANCH_DATA",
  SET_EFFECTIVE_START_DATE = "SET_EFFECTIVE_START_DATE",
  SET_SAPRONAK = "SET_SAPRONAK",
  SET_MARGIN_COST_PLUS_BOP = "SET_MARGIN_COST_PLUS_BOP",
  SET_INSENTIVE_DEALS = "SET_INSENTIVE_DEALS",
  SET_DEDUCTION_FC_LOSS = "SET_DEDUCTION_FC_LOSS",
  SET_CONTRACT_MARKET_INSENTIVE = "SET_CONTRACT_MARKET_INSENTIVE",
  SET_BOP_TERM_OPTIONS = "SET_BOP_TERM_OPTIONS",
  SET_CONFIRMATION_MODAL_VISIBLE = "SET_CONFIRMATION_MODAL_VISIBLE",
}

export type TMarginCostPlusBop = {
  preConditions: string;
  bop: number;
  amount: number;
  paymentTerm: IDropdownItem<number> | null;
};

export type TDeductionFcLoss = {
  bop: string;
  lossDeductionProfit: number;
  lossDeductionBop: number;
};

export type TStore = {
  errorType: ERROR_TYPE;
  errorText: string;
  branch: IDropdownItem<TBranchResponse> | null;
  effectiveStartDate: string;
  sapronak: TSapronakPayload[];
  marginCostPlusBop: TMarginCostPlusBop[];
  insentiveDeals: TInsentiveDealsPayload[];
  deductionFcLoss: TDeductionFcLoss[];
  contractMarketInsentive: TContractMarketInsentivePayload;
  confirmationModalVisible: boolean;
  bopTermOptions: number[];
  branchData: TBranchResponse[];
};

export const store: TStore = {
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  bopTermOptions: Array.from({ length: 36 }, (_, i) => i).sort((a, b) => a - b),
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
  marginCostPlusBop: [
    {
      preConditions: "0",
      bop: 1,
      amount: 0,
      paymentTerm: null,
    },
    {
      preConditions: "0",
      bop: 2,
      amount: 0,
      paymentTerm: null,
    },
    {
      preConditions: "330",
      bop: 3,
      amount: 0,
      paymentTerm: null,
    },
  ],
  insentiveDeals: [
    {
      lowerIp: "331",
      upperIp: "340",
      price: 0,
    },
    {
      lowerIp: "341",
      upperIp: "360",
      price: 0,
    },
    {
      lowerIp: "361",
      upperIp: "380",
      price: 0,
    },
    {
      lowerIp: "381",
      upperIp: "400",
      price: 0,
    },
    {
      lowerIp: "401",
      upperIp: "up",
      price: 0,
    },
  ],
  deductionFcLoss: [
    {
      bop: "1",
      lossDeductionProfit: 0,
      lossDeductionBop: 0,
    },
    {
      bop: "2",
      lossDeductionProfit: 0,
      lossDeductionBop: 0,
    },
    {
      bop: "3",
      lossDeductionProfit: 0,
      lossDeductionBop: 0,
    },
  ],
  contractMarketInsentive: {
    rangeIp: ">330",
    insentivePrecentage: 20,
  },
  confirmationModalVisible: false,
  branchData: [],
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_ERROR_TYPE; payload: typeof store.errorType }
  | { type: ACTION_TYPE.SET_ERROR_TEXT; payload: typeof store.errorText }
  | { type: ACTION_TYPE.SET_BRANCH; payload: typeof store.branch }
  | { type: ACTION_TYPE.SET_BRANCH_DATA; payload: typeof store.branchData }
  | {
      type: ACTION_TYPE.SET_EFFECTIVE_START_DATE;
      payload: typeof store.effectiveStartDate;
    }
  | { type: ACTION_TYPE.SET_SAPRONAK; payload: typeof store.sapronak }
  | {
      type: ACTION_TYPE.SET_MARGIN_COST_PLUS_BOP;
      payload: typeof store.marginCostPlusBop;
    }
  | {
      type: ACTION_TYPE.SET_INSENTIVE_DEALS;
      payload: typeof store.insentiveDeals;
    }
  | {
      type: ACTION_TYPE.SET_DEDUCTION_FC_LOSS;
      payload: typeof store.deductionFcLoss;
    }
  | {
      type: ACTION_TYPE.SET_CONTRACT_MARKET_INSENTIVE;
      payload: typeof store.contractMarketInsentive;
    }
  | {
      type: ACTION_TYPE.SET_BOP_TERM_OPTIONS;
      payload: typeof store.bopTermOptions;
    }
  | {
      type: ACTION_TYPE.SET_CONFIRMATION_MODAL_VISIBLE;
      payload: typeof store.confirmationModalVisible;
    };
