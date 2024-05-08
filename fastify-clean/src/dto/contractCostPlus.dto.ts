import { Static, Type } from '@sinclair/typebox';
import {
  bop,
  contractDeductionFcBopInputDTO,
  contractDeductionFcInputDTO,
  contractInputDTO,
  contractInsentiveDealsInputDTO,
  contractMarketInsentiveInputDTO,
  contractSapronakInputDTO,
  contractSavingInputDTO,
} from './contract.dto';

export const deductionDueToFarmingCycleLoss = Type.Object({
  ...contractDeductionFcInputDTO.properties,
});

export const saving = Type.Object({
  ...contractSavingInputDTO.properties,
});

export const contractMarketInsentive = Type.Object({
  ...contractMarketInsentiveInputDTO.properties,
});

export const getcontractCostPlusParamsDTO = Type.Object({
  id: Type.String(),
});

export const responseContractDetailCostPlusDTO = Type.Object({
  id: Type.Optional(Type.String()),
  coopName: Type.Optional(Type.String()),
  startDate: Type.Optional(Type.String()),
  contractType: Type.Optional(Type.String()),
  customize: Type.Optional(Type.Boolean()),
});

export const contractCostPlusDetailResponseDTO = Type.Object({
  code: Type.Integer(),
  data: Type.Array(responseContractDetailCostPlusDTO),
});

export const contractCostPlusInputDTO = Type.Object({
  ...contractInputDTO.properties,
  contractMarketInsentive,
  contractDeductionFcBop: Type.Optional(Type.Array(contractDeductionFcBopInputDTO)),
  sapronak: Type.Optional(Type.Array(contractSapronakInputDTO)),
  bop: Type.Optional(Type.Array(bop)),
  insentiveDeals: Type.Optional(Type.Array(contractInsentiveDealsInputDTO)),
  createdBy: Type.Optional(Type.String()),
  createdDate: Type.Optional(Type.String({ format: 'date' })),
  modifiedBy: Type.Optional(Type.String()),
  modifiedDate: Type.Optional(Type.String({ format: 'date' })),
});

export const contractCostPlusItemDTO = Type.Object({
  ...contractInputDTO.properties,
  contractMarketInsentive: Type.Optional(contractMarketInsentive),
  contractDeductionFcBop: Type.Optional(Type.Array(contractDeductionFcBopInputDTO)),
  sapronak: Type.Optional(Type.Array(contractSapronakInputDTO)),
  bop: Type.Optional(Type.Array(bop)),
  insentiveDeals: Type.Optional(Type.Array(contractInsentiveDealsInputDTO)),
  createdBy: Type.Optional(Type.String()),
  createdDate: Type.Optional(Type.String()),
  modifiedBy: Type.Optional(Type.String()),
  modifiedDate: Type.Optional(Type.String()),
});

export const contractCostPlusUpdateDTO = Type.Object({
  ...contractInputDTO.properties,
  contractMarketInsentive: Type.Optional(contractMarketInsentive),
  contractDeductionFcBop: Type.Optional(Type.Array(contractDeductionFcBopInputDTO)),
  sapronak: Type.Optional(Type.Array(contractSapronakInputDTO)),
  bop: Type.Optional(Type.Array(bop)),
  insentiveDeals: Type.Optional(Type.Array(contractInsentiveDealsInputDTO)),
  createdBy: Type.Optional(Type.String()),
  createdDate: Type.Optional(Type.String({ format: 'date' })),
  modifiedBy: Type.Optional(Type.String()),
  modifiedDate: Type.Optional(Type.String({ format: 'date' })),
});

export const contractCostPlusResponseDTO = Type.Object({
  code: Type.Integer(),
  data: contractCostPlusItemDTO,
});

export const sapronakERPPayload = Type.Object({
  categoryCode: Type.String(),
  subcategoryCode: Type.String(),
  price: Type.Integer(),
});

export const chickenPriceERPPayload = Type.Object({
  lowerRange: Type.String(),
  upperRange: Type.String(),
  price: Type.Integer(),
});

export const incentiveERPPayload = Type.Object({
  lowerIp: Type.String(),
  upperIp: Type.String(),
  price: Type.Integer(),
});

export const contractCostPlusERPPayload = Type.Object({
  contractCode: Type.String(),
  customContract: Type.Boolean(),
  branchCode: Type.String(),
  farmingCycleCode: Type.String(),
  polaCode: Type.String(),
  startDate: Type.String(),
  endDate: Type.String(),
  savingPercent: Type.Integer(),
  minimumProfit: Type.Integer(),
  deductionPercent: Type.Integer(),
  insentifPasarPercent: Type.Integer(),
  insentifPasarMinIP: Type.Integer(),
  sapronak: Type.Array(sapronakERPPayload),
  chickenPrice: Type.Array(chickenPriceERPPayload),
  incentive: Type.Array(incentiveERPPayload),
});

export type ContractCostPlusInput = Static<typeof contractCostPlusInputDTO>;

export type GetContractCostPlusParams = Static<typeof getcontractCostPlusParamsDTO>;

export type ContractCostPlusResponse = Static<typeof contractCostPlusResponseDTO>;

export type ContractCostPlusUpdateDTO = Static<typeof contractCostPlusUpdateDTO>;

export type ContractCostPlusDetailResponseDTO = Static<typeof contractCostPlusDetailResponseDTO>;
