import { IDropdownItem } from "./dropdown.interface";

export type TBopTermPayload = {
  id: string;
  amount: number;
  paymentTerm: IDropdownItem<number> | null;
};

export type TSapronakPayload = {
  categoryCode: string;
  subcategoryCode: string;
  price: number;
  uom: string;
};

export type TInsentiveDealsPayload = {
  lowerIp: string;
  upperIp: string;
  price: number;
};

export type TContractMarketInsentivePayload = {
  rangeIp: string;
  insentivePrecentage: number | null;
};
