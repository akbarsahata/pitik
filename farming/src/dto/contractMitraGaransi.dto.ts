import { Static, Type } from '@sinclair/typebox';
import { Nullable } from '../libs/utils/typebox';
import {
  contractChickenPriceInputDTO,
  contractDeductionFcInputDTO,
  contractInputCustomizeDTO,
  contractInputDTO,
  contractInsentiveDealsInputDTO,
  contractMarketInsentiveInputDTO,
  contractSapronakInputDTO,
  contractSavingInputDTO,
  getContractDetailParamsDTO,
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

export const getcontractMitraGaransiParamsDTO = Type.Object({
  id: Type.String(),
});

export const responseContractDetailMGParamsDTO = Type.Object({
  id: Type.Optional(Type.String()),
  coopName: Type.Optional(Type.String()),
  startDate: Type.Optional(Type.String()),
  contractType: Type.Optional(Type.String()),
  customize: Type.Optional(Type.Boolean()),
});

export const contractMitraGaransiInputDTO = Type.Object({
  ...contractInputDTO.properties,
  contractMarketInsentive: Type.Optional(contractMarketInsentive),
  deductionDueToFarmingCycleLoss: Type.Optional(deductionDueToFarmingCycleLoss),
  saving,
  sapronak: Type.Optional(Type.Array(contractSapronakInputDTO)),
  chickenPrice: Type.Optional(Type.Array(contractChickenPriceInputDTO)),
  insentiveDeals: Type.Optional(Type.Array(contractInsentiveDealsInputDTO)),
  createdBy: Type.Optional(Type.String()),
  createdDate: Type.Optional(Type.String({ format: 'date' })),
  modifiedBy: Type.Optional(Type.String()),
  modifiedDate: Type.Optional(Type.String({ format: 'date' })),
});

export const contractMitraGaransiItemDTO = Type.Object({
  ...contractInputDTO.properties,
  coopId: Type.Optional(Nullable(Type.String())),
  refContractParent: Type.Optional(Nullable(Type.String())),
  contractMarketInsentive: Type.Optional(Nullable(contractMarketInsentive)),
  deductionDueToFarmingCycleLoss: Type.Optional(Nullable(deductionDueToFarmingCycleLoss)),
  saving: Type.Optional(Nullable(saving)),
  sapronak: Type.Optional(Nullable(Type.Array(contractSapronakInputDTO))),
  chickenPrice: Type.Optional(Nullable(Type.Array(contractChickenPriceInputDTO))),
  insentiveDeals: Type.Optional(Nullable(Type.Array(contractInsentiveDealsInputDTO))),
  createdBy: Type.Optional(Type.String()),
  createdDate: Type.Optional(Type.String()),
  modifiedBy: Type.Optional(Type.String()),
  modifiedDate: Type.Optional(Type.String()),
});

export const contractMitraGaransiCustomizeInputDTO = Type.Object({
  ...contractInputCustomizeDTO.properties,
  contractMarketInsentive: Type.Optional(contractMarketInsentive),
  deductionDueToFarmingCycleLoss: Type.Optional(deductionDueToFarmingCycleLoss),
  saving,
  sapronak: Type.Optional(Type.Array(contractSapronakInputDTO)),
  chickenPrice: Type.Optional(Type.Array(contractChickenPriceInputDTO)),
  insentiveDeals: Type.Optional(Type.Array(contractInsentiveDealsInputDTO)),
  createdBy: Type.Optional(Type.String()),
  createdDate: Type.Optional(Type.String({ format: 'date' })),
  modifiedBy: Type.Optional(Type.String()),
  modifiedDate: Type.Optional(Type.String({ format: 'date' })),
});

export const contractMitraGaransiResponseDTO = Type.Object({
  code: Type.Integer(),
  data: contractMitraGaransiItemDTO,
});

export const contractMitraGaransiDetailResponseDTO = Type.Object({
  code: Type.Integer(),
  data: Type.Array(responseContractDetailMGParamsDTO),
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

export const contractMitragaransiERPPayload = Type.Object({
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

export type ContractMitraGaransiInput = Static<typeof contractMitraGaransiInputDTO>;

export type ContractMitraGaransiCustomizeInputDTO = Static<
  typeof contractMitraGaransiCustomizeInputDTO
>;

export type GetContractMitraGaransiParams = Static<typeof getcontractMitraGaransiParamsDTO>;

export type ContractMitraGaransiResponse = Static<typeof contractMitraGaransiResponseDTO>;

export type GetcontractDetailMGParams = Static<typeof getContractDetailParamsDTO>;

export type ResponseContractDetailMGParams = Static<typeof responseContractDetailMGParamsDTO>;
