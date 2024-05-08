import { Static, Type } from '@sinclair/typebox';

export const ownerERPDTO = Type.Object({
  code: Type.Optional(Type.String()),
  phone: Type.Optional(Type.String()),
  name: Type.Optional(Type.String()),
  email: Type.Optional(Type.String()),
  createdAt: Type.Optional(Type.String()),
  modifiedAt: Type.Optional(Type.String()),
});

export const farmERPDTO = Type.Object({
  name: Type.Optional(Type.String()),
  code: Type.Optional(Type.String()),
  branchCode: Type.Optional(Type.String()),
  street: Type.Optional(Type.String()),
  street2: Type.Optional(Type.String()),
  ownerCode: Type.Optional(Type.String()),
  createdAt: Type.Optional(Type.String()),
  modifiedAt: Type.Optional(Type.String()),
});

export const coopERPDTO = Type.Object({
  code: Type.Optional(Type.String()),
  name: Type.Optional(Type.String()),
  coopType: Type.Optional(Type.String()),
  chickType: Type.Optional(Type.String()),
  lat: Type.Optional(Type.Number()),
  long: Type.Optional(Type.Number()),
  farmCode: Type.Optional(Type.String()),
  createdAt: Type.Optional(Type.String()),
  modifiedAt: Type.Optional(Type.String()),
});

export const farmingCycleERPDTO = Type.Object({
  code: Type.Optional(Type.String()),
  chickInDatePlan: Type.Optional(Type.String()),
  chickInDateApproved: Type.Optional(Type.String()),
  initialPopulation: Type.Optional(Type.Number()),
  pola: Type.Optional(Type.String()),
  owner: Type.Optional(Type.Array(ownerERPDTO)),
  farm: Type.Optional(Type.Array(farmERPDTO)),
  coop: Type.Optional(Type.Array(coopERPDTO)),
});

export type FarmingCycleERPPayload = Static<typeof farmingCycleERPDTO>;
