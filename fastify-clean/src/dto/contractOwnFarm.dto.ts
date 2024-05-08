import { Static, Type } from '@sinclair/typebox';
import { bop, contractOwnFarmInputDTO, paymentTerms } from './contract.dto';

export const contractOwnFarmPayloadDTO = Type.Object({
  ...contractOwnFarmInputDTO.properties,
  bop: Type.Optional(Type.Array(bop)),
  paymentTerms: Type.Optional(Type.Array(paymentTerms)),
  createdBy: Type.Optional(Type.String()),
  createdDate: Type.Optional(Type.String({ format: 'date' })),
  modifiedBy: Type.Optional(Type.String()),
  modifiedDate: Type.Optional(Type.String({ format: 'date' })),
});

export const contractOwnFarmItemDTO = Type.Object({
  ...contractOwnFarmInputDTO.properties,
  bop: Type.Optional(Type.Array(bop)),
  paymentTerms: Type.Optional(Type.Array(paymentTerms)),
  createdBy: Type.Optional(Type.String()),
  createdDate: Type.Optional(Type.String({ format: 'date' })),
  modifiedBy: Type.Optional(Type.String()),
  modifiedDate: Type.Optional(Type.String({ format: 'date' })),
});

export const getcontractOwnFarmParamsDTO = Type.Object({
  id: Type.String(),
});

export const getcontractDetailOwnFarmParamsDTO = Type.Object({
  branchId: Type.String(),
});

export const contractOwnFarmResponseDTO = Type.Object({
  code: Type.Integer(),
  data: contractOwnFarmItemDTO,
});

export const responseContractDetailOwnFarmDTO = Type.Object({
  id: Type.Optional(Type.String()),
  coopName: Type.Optional(Type.String()),
  startDate: Type.Optional(Type.String()),
  contractType: Type.Optional(Type.String()),
  customize: Type.Optional(Type.Boolean()),
});

export const responseContractDetailOwnFarm = Type.Object({
  code: Type.Integer(),
  data: Type.Array(responseContractDetailOwnFarmDTO),
});

export type GetcontractOwnFarmParams = Static<typeof getcontractOwnFarmParamsDTO>;

export type ContractOwnFarmInput = Static<typeof contractOwnFarmPayloadDTO>;

export type GetContractMitraGaransiParams = Static<typeof getcontractOwnFarmParamsDTO>;

export type ContractOwnFarmResponse = Static<typeof contractOwnFarmResponseDTO>;

export type ContractOwnFarmResponseDTO = Static<typeof contractOwnFarmResponseDTO>;

export type GetcontractDetailOwnFarmParamsDTO = Static<typeof getcontractDetailOwnFarmParamsDTO>;

export type ContractOwnFarmResponseDetail = Static<typeof responseContractDetailOwnFarm>;
