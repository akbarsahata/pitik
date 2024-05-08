/* eslint-disable no-unused-vars */
import { Static, Type } from '@sinclair/typebox';
import { OperatorTypeEnum } from './farmingCycle.dto';

enum ActionTypeEnum {
  approve = 'approve',
  reject = 'reject',
}

export const selfRegisterOwnerBodyDTO = Type.Object({
  fullName: Type.String(),
  email: Type.String(),
  phoneNumber: Type.String(),
  businessYear: Type.Number(),
  coopType: Type.Number(),
  coopCapacity: Type.Number(),
  coopLocation: Type.String(),
  address: Type.String(),
  district: Type.String(),
  region: Type.String(),
  province: Type.String(),
});

export const selfRegisterOwnerItemResponseDTO = Type.Object({
  id: Type.String(),
  approved: Type.Optional(Type.Boolean()),
  ...Type.Partial(selfRegisterOwnerBodyDTO).properties,
  coopType: Type.String(),
  createdBy: Type.String(),
  createdDate: Type.String(),
});

export const selfRegisterOwnerResponseDTO = Type.Object({
  code: Type.Number(),
  data: selfRegisterOwnerItemResponseDTO,
});

export const selfRegisterOwnerActionParamsDTO = Type.Object({
  registerId: Type.String(),
  action: Type.Enum(ActionTypeEnum),
});

export const selfRegisterOwnerActionBodyDTO = Type.Object({
  userCode: Type.String(),
});

export const selfRegisterOwnerActionResponseDTO = Type.Object({
  code: Type.Number(),
  data: selfRegisterOwnerItemResponseDTO,
});

export const selfRegisCoopOperatorDTO = Type.Object({
  id: Type.String(),
  farmingCycleId: Type.String(),
  userCode: Type.String(),
  userType: Type.String(),
  phoneNumber: Type.String(),
  fullName: Type.String(),
  role: Type.Enum(OperatorTypeEnum),
  ownerId: Type.String(),
});

export const selfRegisCoopOperatorResponseDTO = Type.Object({
  data: selfRegisCoopOperatorDTO,
});

export const selfRegisCoopOperatorBodyDTO = Type.Object({
  farmingCycleId: Type.String(),
  phoneNumber: Type.String(),
  fullName: Type.String(),
  role: Type.Enum(OperatorTypeEnum),
  password: Type.String({ minLength: 5 }),
});

export type SelfRegisterOwnerBody = Static<typeof selfRegisterOwnerBodyDTO>;

export type SelfRegisterOwnerItemResponse = Static<typeof selfRegisterOwnerItemResponseDTO>;

export type SelfRegisterOwnerResponse = Static<typeof selfRegisterOwnerResponseDTO>;

export type SelfRegisterOwnerActionParams = Static<typeof selfRegisterOwnerActionParamsDTO>;

export type SelfRegisterOwnerActionBody = Static<typeof selfRegisterOwnerActionBodyDTO>;

export type SelfRegisCoopOperator = Static<typeof selfRegisCoopOperatorDTO>;

export type SelfRegisCoopOperatorResponse = Static<typeof selfRegisCoopOperatorResponseDTO>;

export type SelfRegisCoopOperatorBody = Static<typeof selfRegisCoopOperatorBodyDTO>;
