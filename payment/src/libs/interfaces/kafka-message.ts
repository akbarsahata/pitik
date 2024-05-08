import { VirtualAccount } from '../../datasources/entity/postgresql/virtualAccount.entity';

export interface VirtualAccountStatusMessage
  extends Pick<
    VirtualAccount,
    'id' | 'partnerId' | 'bankCode' | 'name' | 'accountNumber' | 'expirationDate' | 'status'
  > {}

export interface PaymentStatusMessage
  extends Pick<VirtualAccount, 'partnerId' | 'accountNumber' | 'bankCode'> {
  amount: number;
  paymentId: string;
  notes: string;
  paymentTime: Date;
}
