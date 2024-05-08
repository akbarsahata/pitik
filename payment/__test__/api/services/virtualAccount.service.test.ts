import { configureServiceTest } from 'fastify-decorators/testing';
import { VirtualAccountStatusProducer } from '../../../src/dao/kafka/producer/virtualAccountStatus.producer';
import { VirtualAccountDAO } from '../../../src/dao/postgresql/virtualAccount.dao';
import { XenditDAO } from '../../../src/dao/xendit/xendit.dao';
import { BANK_CODE } from '../../../src/datasources/entity/postgresql/virtualAccount.entity';
import {
  ERR_CREATE_VIRTUAL_ACCOUNT_FAILED,
  ERR_VIRTUAL_ACCOUNT_EXIST,
} from '../../../src/libs/constants/errors';
import { VirtualAccountService } from '../../../src/services/virtualAccount.service';
import { createExternalId } from '../../../src/libs/utils/helpers';

const VIRTUAL_ACCOUNT = {
  id: '67c52e7e-430d-4a4d-9e7f-3d93c53c9f59',
  partnerId: 'e5f44882-6b4c-43cc-9a5a-4a5b44d9b9c3',
  externalId: createExternalId('e5f44882-6b4c-43cc-9a5a-4a5b44d9b9c3', 'BCA'),
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

const CALLBACK_VIRTUAL_ACCOUNT = {
  id: '67c52e7e-430d-4a4d-9e7f-3d93c53c9f59',
  name: 'John Doe',
  status: 'ACTIVE',
  owner_id: 'e5f44882-6b4c-43cc-9a5a-4a5b44d9b9c3',
  external_id: createExternalId(VIRTUAL_ACCOUNT.externalId, VIRTUAL_ACCOUNT.bankCode),
  merchant_code: '5ad9484a-9e59-4e15-a3e6-36a0be684f65',
  account_number: '1234567890',
  bank_code: 'BCA',
  is_closed: false,
  is_single_use: true,
  expiration_date: '2023-12-31T00:00:00Z',
  created: '2023-07-20T12:34:56Z',
  updated: '2023-07-20T18:45:32Z',
};

describe('Service: VirtualAccountService', () => {
  let service: VirtualAccountService;
  const virtualAccountDAO = {
    getOne: jest.fn(),
    getOneStrict: jest.fn(),
    upsertOne: jest.fn(),
    updateOne: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
  };
  const xenditDAO = {
    createVirtualAccount: jest.fn(),
    validateVAStatus: jest.fn(),
    setExpire: jest.fn(),
  };
  const virtualAccountProducer = { send: jest.fn() };

  beforeEach(async () => {
    service = configureServiceTest({
      service: VirtualAccountService,
      mocks: [
        {
          provide: VirtualAccountDAO,
          useValue: virtualAccountDAO,
        },
        {
          provide: XenditDAO,
          useValue: xenditDAO,
        },
        {
          provide: VirtualAccountStatusProducer,
          useValue: virtualAccountProducer,
        },
      ],
    });
  });

  afterEach(() => jest.restoreAllMocks());

  describe('on create a new virtual account', () => {
    describe('on virtual account number already exists', () => {
      it('should throw ERR_VIRTUAL_ACCOUNT_EXIST error', async () => {
        virtualAccountDAO.getOne.mockReturnValue(VIRTUAL_ACCOUNT);

        try {
          await service.create({
            body: {
              partnerId: 'e5f44882-6b4c-43cc-9a5a-4a5b44d9b9c3',
              bankCode: BANK_CODE.BCA,
              name: 'John Doe',
            },
          });
        } catch (error) {
          expect(error).toStrictEqual(ERR_VIRTUAL_ACCOUNT_EXIST());
        }
      });
    });

    describe('on virtual account failed to be created', () => {
      describe('on no generated virtual account data returned', () => {
        it('should throw ERR_CREATE_VIRTUAL_ACCOUNT_FAILED("Unexpected response from xendit") error', async () => {
          virtualAccountDAO.getOne.mockReturnValue(null);
          xenditDAO.createVirtualAccount.mockReturnValue(null);

          try {
            await service.create({
              body: {
                partnerId: 'e5f44882-6b4c-43cc-9a5a-4a5b44d9b9c3',
                bankCode: BANK_CODE.BCA,
                name: 'John Doe',
              },
            });
          } catch (error) {
            expect(error).toStrictEqual(
              ERR_CREATE_VIRTUAL_ACCOUNT_FAILED('Unexpected response from xendit'),
            );
          }
        });
      });

      describe('on virtual account data returned, but the externalId is not the same as partnerId from payload', () => {
        it('should throw ERR_CREATE_VIRTUAL_ACCOUNT_FAILED("Unexpected externalId") error', async () => {
          virtualAccountDAO.getOne.mockReturnValue(null);
          xenditDAO.createVirtualAccount.mockReturnValue({
            ...VIRTUAL_ACCOUNT,
            externalId: 'something_else',
          });

          try {
            await service.create({
              body: {
                partnerId: 'e5f44882-6b4c-43cc-9a5a-4a5b44d9b9c3',
                bankCode: BANK_CODE.BCA,
                name: 'John Doe',
              },
            });
          } catch (error) {
            expect(error).toStrictEqual(ERR_CREATE_VIRTUAL_ACCOUNT_FAILED('Unexpected externalId'));
          }
        });
      });
    });

    describe('on virtual account successfully created', () => {
      it('should return the data', async () => {
        virtualAccountDAO.getOne.mockReturnValue(null);
        xenditDAO.createVirtualAccount.mockReturnValue(VIRTUAL_ACCOUNT);
        virtualAccountDAO.upsertOne.mockReturnValue(VIRTUAL_ACCOUNT);

        const result = await service.create({
          body: {
            partnerId: 'e5f44882-6b4c-43cc-9a5a-4a5b44d9b9c3',
            bankCode: BANK_CODE.BCA,
            name: 'John Doe',
          },
        });

        expect(result).toStrictEqual({
          ...VIRTUAL_ACCOUNT,
          expirationDate: new Date('2023-12-31T00:00:00Z').toISOString(),
        });
      });
    });

    describe('on general error', () => {
      it('should return the error', async () => {
        virtualAccountDAO.getOne.mockReturnValue(null);
        xenditDAO.createVirtualAccount.mockReturnValue(VIRTUAL_ACCOUNT);
        virtualAccountDAO.upsertOne.mockRejectedValue(new Error('Something wrong!'));

        try {
          await service.create({
            body: {
              partnerId: 'e5f44882-6b4c-43cc-9a5a-4a5b44d9b9c3',
              bankCode: BANK_CODE.BCA,
              name: 'John Doe',
            },
          });
        } catch (error) {
          expect(error).toStrictEqual(Error('Something wrong!'));
        }
      });
    });
  });

  describe('on get virtual account status callback', () => {
    describe('on failed to validate virtual account status on Xendit', () => {
      it('should throw error', async () => {
        xenditDAO.validateVAStatus.mockRejectedValue(new Error('Xendit is giving some problems'));

        try {
          await service.virtualAccountStatusCallback({
            body: CALLBACK_VIRTUAL_ACCOUNT,
          });
        } catch (error) {
          expect(error).toStrictEqual(Error('Xendit is giving some problems'));
        }
      });
    });

    describe('on successfully update virtual account status', () => {
      it('should return virtual account data', async () => {
        xenditDAO.validateVAStatus.mockReturnValue(VIRTUAL_ACCOUNT);
        virtualAccountDAO.updateOne.mockReturnValue(VIRTUAL_ACCOUNT);

        const result = await service.virtualAccountStatusCallback({
          body: CALLBACK_VIRTUAL_ACCOUNT,
        });

        expect(result).toStrictEqual({
          ...VIRTUAL_ACCOUNT,
          expirationDate: new Date('2023-12-31T00:00:00Z').toISOString(),
        });
      });
    });

    describe('on successfully set VA status as expired', () => {
      it('should return virtual account data', async () => {
        xenditDAO.setExpire.mockReturnValue(CALLBACK_VIRTUAL_ACCOUNT);
        virtualAccountDAO.getOneStrict.mockReturnValue(VIRTUAL_ACCOUNT);
        virtualAccountDAO.updateOne.mockReturnValue(VIRTUAL_ACCOUNT);

        expect(
          service.setExpire({
            params: {
              partnerId: VIRTUAL_ACCOUNT.partnerId,
              bankCode: VIRTUAL_ACCOUNT.bankCode as BANK_CODE,
            },
            body: {
              expirationDate: VIRTUAL_ACCOUNT.expirationDate.toISOString(),
            },
          }),
        ).resolves.not.toThrow();
      });
    });

    describe('on general error', () => {
      it('should return its error', async () => {
        xenditDAO.validateVAStatus.mockReturnValue(VIRTUAL_ACCOUNT);
        virtualAccountDAO.updateOne.mockRejectedValue(new Error('Something wrong!'));

        try {
          await service.virtualAccountStatusCallback({
            body: CALLBACK_VIRTUAL_ACCOUNT,
          });
        } catch (error) {
          expect(error).toStrictEqual(Error('Something wrong!'));
        }
      });
    });
  });
});
