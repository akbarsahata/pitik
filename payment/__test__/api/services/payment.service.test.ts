import { configureServiceTest } from 'fastify-decorators/testing';
import { PaymentStatusProducer } from '../../../src/dao/kafka/producer/paymentStatus.producer';
import { VirtualAccountDAO } from '../../../src/dao/postgresql/virtualAccount.dao';
import { VirtualAccountPaymentDAO } from '../../../src/dao/postgresql/virtualAccountPayment';
import { XenditDAO } from '../../../src/dao/xendit/xendit.dao';
import { ERR_UNEXPECTED_ACCOUNT_NUMBER } from '../../../src/libs/constants/errors';
import { PaymentService } from '../../../src/services/payment.service';

const CALLBACK_PAYMENT = {
  id: 'c6a14993-aa96-44e7-8770-a89c43488c26',
  amount: 10000,
  country: 'ID',
  created: '2023-07-20T12:34:56Z',
  updated: '2023-07-20T13:45:30Z',
  currency: 'IDR',
  bank_code: 'BCA',
  payment_id: 'c6a14993-aa96-44e7-8770-a89c43488c26',
  owner_id: 'e5f44882-6b4c-43cc-9a5a-4a5b44d9b9c3',
  external_id: 'e5f44882-6b4c-43cc-9a5a-4a5b44d9b9c3',
  merchant_code: '123',
  account_number: '4567890',
  payment_detail: {
    remark: 'Payment received',
    reference: 'INV-12345',
  },
  transaction_timestamp: '2023-07-20T13:45:30Z',
  callback_virtual_account_id: '67c52e7e-430d-4a4d-9e7f-3d93c53c9f59',
};

const PAYMENT = {
  id: 'c6a14993-aa96-44e7-8770-a89c43488c26',
  amount: 10000,
  country: 'ID',
  created: '2023-07-20T12:34:56Z',
  updated: '2023-07-20T13:45:30Z',
  currency: 'IDR',
  bank_code: 'BCA',
  payment_id: 'c6a14993-aa96-44e7-8770-a89c43488c26',
  owner_id: 'e5f44882-6b4c-43cc-9a5a-4a5b44d9b9c3',
  external_id: 'e5f44882-6b4c-43cc-9a5a-4a5b44d9b9c3',
  merchant_code: '123',
  account_number: '4567890',
  payment_detail: {
    remark: 'Payment received',
    reference: 'INV-12345',
  },
  transaction_timestamp: '2023-07-20T13:45:30Z',
  callback_virtual_account_id: '67c52e7e-430d-4a4d-9e7f-3d93c53c9f59',
};

const VIRTUAL_ACCOUNT = {
  id: '67c52e7e-430d-4a4d-9e7f-3d93c53c9f59',
  partnerId: 'e5f44882-6b4c-43cc-9a5a-4a5b44d9b9c3',
  externalId: 'e5f44882-6b4c-43cc-9a5a-4a5b44d9b9c3',
  merchantCode: '5ad9484a-9e59-4e15-a3e6-36a0be684f65',
  accountNumber: '1234567890',
  bankCode: 'BCA',
  name: 'John Doe',
  isClosed: false,
  isSingleUse: true,
  expirationDate: new Date('2023-12-31T00:00:00Z'),
  status: 'ACTIVE',
  createdDate: '2023-07-20T10:30:00Z',
  modifiedDate: '2023-07-20T15:45:00Z',
};

describe('Service: PaymentService', () => {
  let service: PaymentService;
  const virtualAccountPaymentDAO = {
    getOne: jest.fn(),
    createOne: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
  };
  const virtualAccountDAO = {
    getOneStrict: jest.fn(),
  };
  const xenditDAO = { validateVAPayment: jest.fn() };
  const paymentStatusProducer = { send: jest.fn() };

  beforeEach(async () => {
    service = configureServiceTest({
      service: PaymentService,
      mocks: [
        {
          provide: VirtualAccountDAO,
          useValue: virtualAccountDAO,
        },
        {
          provide: VirtualAccountPaymentDAO,
          useValue: virtualAccountPaymentDAO,
        },
        {
          provide: XenditDAO,
          useValue: xenditDAO,
        },
        {
          provide: PaymentStatusProducer,
          useValue: paymentStatusProducer,
        },
      ],
    });
  });

  afterEach(() => jest.restoreAllMocks());

  describe('on callback from virtual account payment', () => {
    describe('on failed to validate payment status on Xendit', () => {
      it('should throw error', async () => {
        xenditDAO.validateVAPayment.mockRejectedValue(new Error('Xendit is giving some problems'));

        try {
          await service.virtualAccountPaymentCallback({
            body: CALLBACK_PAYMENT,
          });
        } catch (error) {
          expect(error).toStrictEqual(Error('Xendit is giving some problems'));
        }
      });
    });

    describe('on payment already exists', () => {
      it('should return nothing', async () => {
        xenditDAO.validateVAPayment.mockReturnValue(PAYMENT);
        virtualAccountPaymentDAO.getOne.mockReturnValue(PAYMENT);

        const result = await service.virtualAccountPaymentCallback({
          body: CALLBACK_PAYMENT,
        });

        expect(result).toBeUndefined();
      });
    });

    describe('on payment virtual account number mismatch', () => {
      it('should throw error ERR_UNEXPECTED_ACCOUNT_NUMBER("Account number mismatch")', async () => {
        xenditDAO.validateVAPayment.mockReturnValue(PAYMENT);
        virtualAccountPaymentDAO.getOne.mockReturnValue(undefined);
        virtualAccountDAO.getOneStrict.mockReturnValue({
          ...VIRTUAL_ACCOUNT,
          accountNumber: 'something_else',
        });

        try {
          await service.virtualAccountPaymentCallback({
            body: CALLBACK_PAYMENT,
          });
        } catch (error) {
          expect(error).toStrictEqual(ERR_UNEXPECTED_ACCOUNT_NUMBER('Account number mismatch'));
        }
      });
    });

    describe('on payment virtual account callback success', () => {
      it('should returns nothing', async () => {
        xenditDAO.validateVAPayment.mockReturnValue(PAYMENT);
        virtualAccountPaymentDAO.getOne.mockReturnValue(undefined);
        virtualAccountDAO.getOneStrict.mockReturnValue(VIRTUAL_ACCOUNT);

        const result = await service.virtualAccountPaymentCallback({
          body: CALLBACK_PAYMENT,
        });

        expect(result).toBeUndefined();
      });
    });

    describe('on unhandled error', () => {
      it('should throw the error', async () => {
        xenditDAO.validateVAPayment.mockReturnValue(PAYMENT);
        virtualAccountPaymentDAO.getOne.mockReturnValue(undefined);
        virtualAccountPaymentDAO.createOne.mockRejectedValue(new Error('Something wrong'));
        virtualAccountDAO.getOneStrict.mockReturnValue(VIRTUAL_ACCOUNT);

        try {
          await service.virtualAccountPaymentCallback({
            body: CALLBACK_PAYMENT,
          });
        } catch (error) {
          expect(error).toStrictEqual(Error('Something wrong'));
        }
      });
    });
  });
});
