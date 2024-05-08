import { Static, Type } from '@sinclair/typebox';

export const retryVirtualAccountPaymentParams = Type.Object({
  paymentId: Type.String(),
});

export type RetryVirtualAccountPaymentParams = Static<typeof retryVirtualAccountPaymentParams>;
