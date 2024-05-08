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

export interface Bop3 {
  bopNo: string;
  price: number;
  minIp: number;
  maxIp: number;
}

export interface ContractMitragaransiPayload {
  active: boolean;
  contractCode: string;
  areaCode: string;
  code?: string;
  coopCode?: string;
  state: string;
  customContract: number;
  branchCode: string;
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
  active: boolean;
  contractCode: string;
  areaCode: string;
  customContract: boolean;
  branchCode: string;
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
  bop3: Bop3[];
  code?: string;
  coopCode?: string;
}

export interface ContractOwnFarmPayload {
  active: boolean;
  contractCode: string;
  areaCode: string;
  code: string;
  coopCode: string;
  state: string;
  customContract: boolean;
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

export interface CreateAdjustmentDetailItem {
  subcategoryCode: string;
  productCode: string;
  quantity: number;
}

export interface CreateAdjustmentPayload {
  farmingCycleCode: string;
  dateAdjustment: string;
  detailAdjustmment: CreateAdjustmentDetailItem[];
}

export interface ErpHarvestRequestCreate {
  farmingCycleCode: string;
  coopCode: string;
  requester: string;
  approver: string;
  datePlanned: string;
  rangeMin: number;
  rangeMax: number;
  quantity: number;
  reason: string;
}

export interface ErpHarvestRealizationCreate {
  farmingCycleCode: string;
  coopCode: string;
  datePlanned: string;
  rangeMin: number;
  rangeMax: number;
  quantity: number;
  tonnage: number;
  deliveryOrder: string;
  requester: string;
}

export interface DetailConsumption {
  subcategoryCode: string;
  productCode: string;
  quantity: number;
}

export interface ErpDailyMonitoringUpsertPayload {
  isAdjustment: boolean;
  farmingCycleCode: string;
  coopCode: string;
  date: string;
  bw: number;
  mortality: number;
  culling: number;
  detailConsumption: DetailConsumption[];
}

export interface ErpDailyMonitoringUpserted {
  id: number;
  coopCopde: string;
  date: string;
  mortality: number;
  culling: number;
  feedTypeCode: string;
  feedQuantity: number;
  secondDailyMonitoring: boolean;
  bw: number;
}

export interface ErpDailyMonitoringCreated {
  id: number;
  dailyMonitoringCode: string;
  coopCopde: string;
  date: string;
  mortality: number;
  culling: number;
  feedTypeCode: string;
  feedQuantity: number;
  secondDailyMonitoring: boolean;
  bw: number;
}

export interface ErpTransferRequestDetailItem {
  categoryCode: string;
  subcategoryCode: string;
  productCode: string;
  quantity: number;
}

export interface ErpTransferRequestCreate {
  transferRequestId: string;
  coopCodeSource: string;
  coopCodeTarget: string;
  branchCodeSource: string;
  branchCodeTarget: string;
  requestedBy: string;
  approvedBy: string;
  logistic: string;
  details: ErpTransferRequestDetailItem[];
}

export interface ErpHarvestDealCancelled {
  date: string;
  deliveryOrder: string;
  reason: string;
  cancelBy: string;
}
