import { Static, Type } from '@sinclair/typebox';
import {
  BANK_CODE,
  VIRTUAL_ACCOUNT_STATUS,
} from '../datasources/entity/postgresql/virtualAccount.entity';

export const virtualAccountItem = Type.Object({
  id: Type.String(),
  partnerId: Type.String(),
  merchantCode: Type.String(),
  accountNumber: Type.String(),
  bankCode: Type.Enum(BANK_CODE),
  name: Type.String(),
  isClosed: Type.Boolean(),
  isSingleUse: Type.Boolean(),
  expirationDate: Type.String(),
  status: Type.Enum(VIRTUAL_ACCOUNT_STATUS),
});

export const createVirtualAccountBody = Type.Object(
  {
    ...Type.Pick(virtualAccountItem, ['partnerId', 'bankCode', 'name']).properties,
  },
  { additionalProperties: false },
);

export const getVirtualAccountResponse = Type.Object({
  code: Type.Number(),
  data: virtualAccountItem,
});

export const setExpireParamsDTO = Type.Object({
  partnerId: Type.String(),
  bankCode: Type.Enum(BANK_CODE),
});

export const setExpireBodyDTO = Type.Object({
  expirationDate: Type.String({ default: new Date().toISOString() }),
});

export type VirtualAccountItem = Static<typeof virtualAccountItem>;

export type CreateVirtualAccountBody = Static<typeof createVirtualAccountBody>;

export type GetVirtualAccountResponse = Static<typeof getVirtualAccountResponse>;

export type SetExpireParams = Static<typeof setExpireParamsDTO>;

export type SetExpireBody = Static<typeof setExpireBodyDTO>;
