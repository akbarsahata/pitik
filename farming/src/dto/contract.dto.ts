/* eslint-disable no-unused-vars */
import { Static, Type } from '@sinclair/typebox';
import { Nullable } from '../libs/utils/typebox';
import { branchItemDTO } from './branch.dto';
import { paginationDTO } from './common.dto';

export enum ContractCostPlusBopType {
  BOP1 = '1',
  BOP2 = '2',
  BOP3 = '3',
}

export enum ContractCostPlusDefaultPaymentTerm {
  DEFAULT_1 = 'D1',
  DEFAULT_2 = 'D14',
  DEFAULT_3 = 'D35',
}

export enum ContractCostPlusBop3DefaultMinIp {
  MIN = 330,
  MAX = 1000,
}

export const contractSapronakInputDTO = Type.Object({
  id: Type.Optional(Type.String()),
  categoryCode: Type.String(),
  subcategoryCode: Type.String(),
  price: Type.Integer(),
  uom: Type.Optional(Type.String()),
  refContractId: Type.Optional(Type.String()),
});

export const contractChickenPriceInputDTO = Type.Object({
  id: Type.Optional(Type.String()),
  lowerRange: Type.String(),
  upperRange: Type.String(),
  price: Type.Integer(),
  uom: Type.Optional(Type.String()),
  refContractId: Type.Optional(Type.String()),
});

export const contractInsentiveDealsInputDTO = Type.Object({
  id: Type.Optional(Type.String()),
  lowerIp: Type.String(),
  upperIp: Type.String(),
  price: Type.Integer(),
  uom: Type.Optional(Type.String()),
  refContractId: Type.Optional(Type.String()),
});

export const contractSavingInputDTO = Type.Object({
  id: Type.Optional(Type.String()),
  precentage: Type.Optional(Type.Integer()),
  minimumProfit: Type.Optional(Type.Integer()),
  uom: Type.Optional(Type.String()),
  refContractId: Type.Optional(Type.String()),
});

export const contractDeductionFcInputDTO = Type.Object({
  id: Type.Optional(Type.String()),
  precentage: Type.Integer(),
  minimumProfit: Type.Integer(),
  uom: Type.Optional(Type.String()),
  refContractId: Type.Optional(Type.String()),
});

export const contractDeductionFcBopInputDTO = Type.Object({
  id: Type.Optional(Type.String()),
  lossDeductionProfit: Type.Optional(Type.Integer()),
  lossDeductionBop: Type.Optional(Type.Integer()),
  uomLoss: Type.Optional(Type.String()),
  uomBop: Type.Optional(Type.String()),
  bop: Type.Optional(Type.String()),
  refContractId: Type.Optional(Type.String()),
});

export const contractMarketInsentiveInputDTO = Type.Object({
  id: Type.Optional(Type.String()),
  rangeIp: Nullable(Type.String()),
  insentivePrecentage: Nullable(Type.Number()),
  refContractId: Type.Optional(Type.String()),
});

export const contractInputDTO = Type.Object({
  code: Type.Optional(Type.String()),
  refContractTypeId: Type.Optional(Type.String()),
  customize: Type.Optional(Type.Boolean()),
  branchId: Type.Optional(Type.String()),
  effectiveStartDate: Type.Optional(Type.String({ format: 'date' })),
  contractTag: Type.Optional(Type.String()),
  refContractParent: Type.Optional(Type.String()),
  coopId: Type.Optional(Type.String()),
});

export const contractInputCustomizeDTO = Type.Object({
  code: Type.Optional(Type.String()),
  refContractTypeId: Type.Optional(Type.String()),
  customize: Type.Optional(Type.Boolean()),
  branchId: Type.Optional(Type.String()),
  effectiveStartDate: Type.Optional(Type.String({ format: 'date' })),
  refContractParent: Type.String(),
});

export const contractOwnFarmInputDTO = Type.Object({
  code: Type.Optional(Type.String()),
  refContractTypeId: Type.Optional(Type.String()),
  customize: Type.Optional(Type.Boolean()),
  coopId: Type.Optional(Type.String()),
  branchId: Type.Optional(Type.String()),
  effectiveStartDate: Type.Optional(Type.String({ format: 'date' })),
  contractTag: Type.Optional(Type.String()),
  refContractParent: Type.Optional(Type.String()),
});

export const contractType = Type.Object({
  id: Type.Optional(Type.String()),
  contractName: Type.Optional(Type.String()),
  status: Type.Optional(Type.String()),
});

export const marginCostPlus = Type.Object({
  dayAfterChickInDate: Type.String({ format: 'date' }),
  price: Type.Integer(),
  minIp: Type.String(),
});

export const bop = Type.Object({
  id: Type.Optional(Type.String()),
  bop: Type.Optional(Type.String()),
  amount: Type.Integer(),
  paymentTerm: Type.Optional(Type.String()),
  preConditions: Type.Integer(),
  refContractId: Type.Optional(Type.String()),
});

export const bop3DTO = Type.Object({
  id: Type.Optional(Type.String()),
  bop: Type.Optional(Type.String()),
  bopParent: Type.Optional(Type.String({ default: ContractCostPlusBopType.BOP3 })),
  amount: Type.Integer(),
  paymentTerm: Type.Optional(
    Type.String({ default: ContractCostPlusDefaultPaymentTerm.DEFAULT_3 }),
  ),
  minIp: Type.Integer(),
  maxIp: Type.Integer(),
  refContractId: Type.Optional(Type.String()),
});

export const paymentTerms = Type.Object({
  id: Type.Optional(Type.String()),
  paymentTerm: Type.Optional(Type.String()),
  amount: Type.Integer(),
  uom: Type.Optional(Type.String()),
  refContractId: Type.Optional(Type.String()),
});

export const contractItemDTO = Type.Object({
  id: Type.Optional(Type.String()),
  seqNo: Type.Optional(Type.Integer()),
  code: Type.Optional(Type.String()),
  refContractTypeId: Type.Optional(Type.String()),
  customize: Type.Optional(Type.Boolean()),
  effectiveStartDate: Type.Optional(Type.String({ format: 'date' })),
  branchId: Type.Optional(Type.String()),
  branch: Type.Optional(branchItemDTO),
  isParent: Type.Optional(Type.Boolean()),
  contractType: Type.Optional(contractType),
  createdBy: Type.Optional(Type.String()),
  createdDate: Type.Optional(Type.String()),
  modifiedBy: Type.Optional(Type.String()),
  modifiedDate: Type.Optional(Type.String()),
});

export const contractQueryDTO = Type.Object({
  id: Type.Optional(Type.String()),
  customize: Type.Optional(Type.Boolean()),
  refContractTypeId: Type.Optional(Type.String()),
  branchId: Type.Optional(Type.String()),
  branchName: Type.Optional(Type.String()),
  effectiveStartDate: Type.Optional(Type.String()),
  ...Type.Partial(paginationDTO).properties,
});

export const getContractItemResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(contractItemDTO),
});

export const getContractByIdParamsDTO = Type.Object({
  id: Type.String(),
});

export const getContractByIdResponseDTO = Type.Object({
  code: Type.Number(),
  data: contractItemDTO,
});

export const postContractResponseDTO = Type.Object({
  code: Type.Number(),
  data: contractItemDTO,
});

export const contractTypeQueryDTO = Type.Object({
  ...Type.Partial(paginationDTO).properties,
});

export const contractUpdateParams = Type.Object({
  id: Type.Optional(Type.String()),
  refContractId: Type.Optional(Type.String()),
});

export const getContractTypeResponseDTO = Type.Object({
  code: Type.Number(),
  count: Type.Number(),
  data: Type.Array(
    Type.Object({
      id: Type.String(),
      contractName: Type.String(),
      status: Type.String(),
    }),
  ),
});

export const getContractDetailParamsDTO = Type.Object({
  branchId: Type.String(),
});

export const contractResponseDTO = Type.Object({
  ...contractItemDTO.properties,
  isParent: Type.Boolean(),
  modifiedBy: Type.String(),
  createdBy: Type.String(),
});

export type ContractChickenPriceInput = Static<typeof contractChickenPriceInputDTO>;

export type ContractMarginCostPlusInput = Static<typeof marginCostPlus>;

export type ContractSapronakInput = Static<typeof contractSapronakInputDTO>;

export type ContractInsentiveDealsInput = Static<typeof contractInsentiveDealsInputDTO>;

export type ContractSavingInput = Static<typeof contractSavingInputDTO>;

export type ContractDeductionFcInput = Static<typeof contractDeductionFcInputDTO>;

export type ContractDeductionFcBopInputDTO = Static<typeof contractDeductionFcBopInputDTO>;

export type ContractMarketInsentiveInput = Static<typeof contractMarketInsentiveInputDTO>;

export type ContractInput = Static<typeof contractInputDTO>;

export type ContractInputCustomize = Static<typeof contractInputCustomizeDTO>;

export type ContractOwnFarmInput = Static<typeof contractOwnFarmInputDTO>;

export type ContractItem = Static<typeof contractItemDTO>;

export type GetContractResponse = Static<typeof getContractItemResponseDTO>;

export type ContractQueryDTO = Static<typeof contractQueryDTO>;

export type ContractParamsDTO = Static<typeof getContractByIdParamsDTO>;

export type PostContractResponse = Static<typeof postContractResponseDTO>;

export type ContractTypeQuery = Static<typeof contractTypeQueryDTO>;

export type ContractBOP = Static<typeof bop>;

export type ContractBOP3 = Static<typeof bop3DTO>;

export type ContractPaymentTerms = Static<typeof paymentTerms>;

export type ContractUpdateParams = Static<typeof contractUpdateParams>;

export type GetContractDetailParamsDTO = Static<typeof getContractDetailParamsDTO>;

export type ContractResponseDTO = Static<typeof contractResponseDTO>;

export type GetContractByIdResponseDTO = Static<typeof getContractByIdResponseDTO>;
