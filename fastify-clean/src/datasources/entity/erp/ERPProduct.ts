/* eslint-disable camelcase */
export interface ERPProduct {
  id: number;
  category_code: string;
  category_name: string;
  subcategory_code: string;
  subcategory_name: string;
  product_code: string;
  product_name: string;
  uom: string;
  purchase_uom: string;
  purchase_mutiply: string;
}

export interface Sapronak {
  categoryCode: string;
  subcategoryCode: string;
  price: number;
}

export interface ChickenPrice {
  lowerRange: string;
  upperRange: string;
  price: number;
}

export interface Incentive {
  lowerIp: string;
  upperIp: string;
  price: number;
}

export interface Bop {
  bopNo: string;
  dayAfterChickInDate: number;
  price: number;
  minIp: number;
}

export interface ContractMitragaransiPayload {
  contractCode: string;
  areaCode: string;
  code: string;
  coopCode: string;
  state: string;
  customContract: number;
  branchCode: string;
  farmingCycleCode: string;
  polaCode: string;
  startDate: string;
  endDate: string;
  savingPercent: number;
  minimumProfit: number;
  deductionPercent: number;
  insentifPasarPercent: number | null;
  insentifPasarMinIP: number;
  sapronak: Sapronak[];
  chickenPrice: ChickenPrice[];
  incentive: Incentive[];
}

export interface ContractCostPlusPayload {
  contractCode: string;
  areaCode: string;
  code: string;
  coopCode: string;
  state: string;
  customContract: number;
  branchCode: string;
  farmingCycleCode: string;
  polaCode: string;
  startDate: string;
  endDate: string;
  savingPercent: number;
  minimumProfit: number;
  deductionPercent: number;
  insentifPasarPercent: number | null;
  insentifPasarMinIP: number;
  sapronak: Sapronak[];
  chickenPrice: ChickenPrice[];
  incentive: Incentive[];
  bop: Bop[];
}

export interface ContractOwnFarmPayload {
  contractCode: string;
  areaCode: string;
  code: string;
  coopCode: string;
  state: string;
  customContract: number;
  branchCode: string;
  farmingCycleCode: string;
  polaCode: string;
  startDate: string;
  endDate: string;
  savingPercent: number;
  minimumProfit: number;
  deductionPercent: number;
  insentifPasarPercent: number | null;
  insentifPasarMinIP: number;
  bop: Bop[];
}
