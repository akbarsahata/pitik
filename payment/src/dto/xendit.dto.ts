import { Static, Type } from '@sinclair/typebox';
import { Nullable } from '../libs/utils/typebox';

export const virtualAccountItemDTO = Type.Object(
  {
    id: Type.String(),
    owner_id: Type.String(),
    external_id: Type.String(),
    merchant_code: Type.String(),
    account_number: Type.String(),
    bank_code: Type.String(),
    name: Type.String(),
    is_closed: Type.Boolean(),
    expiration_date: Type.String(),
    is_single_use: Type.Boolean(),
    status: Type.String(),
    created: Type.String(),
    updated: Type.String(),
  },
  { additionalProperties: false },
);

export const virtualAccountCallbackResponseDTO = Type.Object({
  status: Type.Number(),
  data: Type.Object({
    message: Type.String(),
  }),
});

export const virtualAccountPaymentItemDTO = Type.Object({
  id: Type.String(),
  amount: Type.Number(),
  country: Type.String(),
  created: Type.String(),
  updated: Type.String(),
  currency: Type.String(),
  owner_id: Type.String(),
  bank_code: Type.String(),
  payment_id: Type.String(),
  external_id: Type.String(),
  merchant_code: Type.String(),
  account_number: Type.String(),
  payment_detail: Type.Object({
    remark: Nullable(Type.String()),
    reference: Type.String(),
  }),
  transaction_timestamp: Type.String(),
  callback_virtual_account_id: Type.String(),
});

export const virtualAccountPaymentCallbackBodyDTO = Type.Partial(virtualAccountPaymentItemDTO);

export const paymentCallbackResponseDTO = Type.Object({
  status: Type.Number(),
  data: Type.Object({
    message: Type.String(),
  }),
});

export type VirtualAccountItem = Static<typeof virtualAccountItemDTO>;

export type VirtualAccountCallbackResponse = Static<typeof virtualAccountCallbackResponseDTO>;

export type VirtualAccountPaymentItem = Static<typeof virtualAccountPaymentItemDTO>;

export type VirtualAccountPaymentCallbackBody = Static<typeof virtualAccountPaymentCallbackBodyDTO>;

export type PaymentCallbackResponse = Static<typeof paymentCallbackResponseDTO>;
