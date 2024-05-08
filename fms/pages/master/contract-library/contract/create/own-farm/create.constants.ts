import { IDropdownItem } from "@type/dropdown.interface";
import { TBopTermPayload } from "@type/payload.type";
import { TCoopResponse } from "@type/response.type";

export enum ERROR_TYPE {
  NONE = "NONE",
  GENERAL = "GENERAL",
  COOP = "COOP",
  EFFECTIVE_START_DATE = "EFFECTIVE_START_DATE",
  BOP_1_AMOUNT = "BOP_1_AMOUNT",
  BOP_1_TERM = "BOP_1_TERM",
  BOP_2_AMOUNT = "BOP_2_AMOUNT",
  BOP_2_TERM = "BOP_2_TERM",
}

export enum ACTION_TYPE {
  SET_ERROR_TYPE = "SET_ERROR_TYPE",
  SET_ERROR_TEXT = "SET_ERROR_TEXT",
  SET_COOP = "SET_COOP",
  SET_COOP_DATA = "SET_COOP_DATA",
  SET_BOP_TERM_OPTIONS = "SET_BOP_TERM_OPTIONS",
  SET_BOP_DETAILS = "SET_BOP_DETAILS",
  SET_FARMER_TERM_OPTIONS = "SET_FARMER_TERM_OPTIONS",
  SET_PAYMENT_TERMS = "SET_PAYMENT_TERMS",
  SET_EFFECTIVE_START_DATE = "SET_EFFECTIVE_START_DATE",
  SET_CONFIRMATION_MODAL_VISIBLE = "SET_CONFIRMATION_MODAL_VISIBLE",
}

export type TBopDetails = {
  id: string;
  preConditions: string;
  bop: string;
  amount: number;
  paymentTerm: IDropdownItem<number> | null;
};

export type TStore = {
  errorType: ERROR_TYPE;
  errorText: string;
  coop: IDropdownItem<TCoopResponse> | null;
  effectiveStartDate: string;
  bopDetails: TBopDetails[];
  farmerTermOptions: number[];
  bopTermOptions: number[];
  paymentTerms: TBopTermPayload[];
  confirmationModalVisible: boolean;
  coopData: TCoopResponse[];
};

export const store: TStore = {
  errorType: ERROR_TYPE.NONE,
  errorText: "",
  bopTermOptions: Array.from({ length: 41 }, (_, i) => i - 5).sort(
    (a, b) => a - b
  ),
  farmerTermOptions: Array.from({ length: 41 }, (_, i) => i - 5).sort(
    (a, b) => a - b
  ),
  paymentTerms: [
    {
      id: "1",
      amount: 0,
      paymentTerm: null,
    },
  ],
  coop: null,
  effectiveStartDate: "",
  bopDetails: [
    {
      id: "",
      preConditions: "0",
      bop: "1",
      amount: 0,
      paymentTerm: null,
    },
    {
      id: "",
      preConditions: "0",
      bop: "2",
      amount: 0,
      paymentTerm: null,
    },
  ],
  confirmationModalVisible: false,
  coopData: [],
};

export type ACTIONS =
  | { type: ACTION_TYPE.SET_ERROR_TYPE; payload: typeof store.errorType }
  | { type: ACTION_TYPE.SET_ERROR_TEXT; payload: typeof store.errorText }
  | { type: ACTION_TYPE.SET_COOP; payload: typeof store.coop }
  | { type: ACTION_TYPE.SET_COOP_DATA; payload: typeof store.coopData }
  | {
      type: ACTION_TYPE.SET_BOP_TERM_OPTIONS;
      payload: typeof store.bopTermOptions;
    }
  | { type: ACTION_TYPE.SET_BOP_DETAILS; payload: typeof store.bopDetails }
  | {
      type: ACTION_TYPE.SET_FARMER_TERM_OPTIONS;
      payload: typeof store.farmerTermOptions;
    }
  | { type: ACTION_TYPE.SET_PAYMENT_TERMS; payload: typeof store.paymentTerms }
  | {
      type: ACTION_TYPE.SET_EFFECTIVE_START_DATE;
      payload: typeof store.effectiveStartDate;
    }
  | {
      type: ACTION_TYPE.SET_CONFIRMATION_MODAL_VISIBLE;
      payload: typeof store.confirmationModalVisible;
    };
