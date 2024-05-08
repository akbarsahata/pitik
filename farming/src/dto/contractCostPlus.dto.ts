import { Static, Type } from '@sinclair/typebox';
import { Nullable } from '../libs/utils/typebox';
import {
  bop,
  bop3DTO,
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
  bop3: Type.Optional(Type.Array(bop3DTO)),
  insentiveDeals: Type.Optional(Type.Array(contractInsentiveDealsInputDTO)),
  createdBy: Type.Optional(Type.String()),
  createdDate: Type.Optional(Type.String({ format: 'date' })),
  modifiedBy: Type.Optional(Type.String()),
  modifiedDate: Type.Optional(Type.String({ format: 'date' })),
});

export const contractCostPlusItemDTO = Type.Object({
  ...contractInputDTO.properties,
  coopId: Type.Optional(Nullable(Type.String())),
  refContractParent: Type.Optional(Nullable(Type.String())),
  contractMarketInsentive: Type.Optional(Nullable(contractMarketInsentive)),
  contractDeductionFcBop: Type.Optional(Nullable(Type.Array(contractDeductionFcBopInputDTO))),
  sapronak: Type.Optional(Nullable(Type.Array(contractSapronakInputDTO))),
  bop: Type.Optional(Nullable(Type.Array(bop))),
  bop3: Type.Optional(Type.Array(bop3DTO)),
  insentiveDeals: Type.Optional(Nullable(Type.Array(contractInsentiveDealsInputDTO))),
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
  bop3: Type.Optional(Type.Array(bop3DTO)),
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

export type ContractCostPlusInput = Static<typeof contractCostPlusInputDTO>;

export type GetContractCostPlusParams = Static<typeof getcontractCostPlusParamsDTO>;

export type ContractCostPlusResponse = Static<typeof contractCostPlusResponseDTO>;

export type ContractCostPlusUpdateDTO = Static<typeof contractCostPlusUpdateDTO>;

export type ContractCostPlusDetailResponseDTO = Static<typeof contractCostPlusDetailResponseDTO>;
