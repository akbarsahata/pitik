import { configureServiceTest } from 'fastify-decorators/testing';
import VirtualAcc from 'xendit-node/src/va/va';
import { XenditDAO } from '../../../src/dao/xendit/xendit.dao';
import { RedisConnection } from '../../../src/datasources/connection/redis.connection';
import { SecretManagerConnection } from '../../../src/datasources/connection/secretmanager.connection';
import { XenditLog } from '../../../src/datasources/entity/postgresql/xenditLog';

describe('DAO: XenditDAO', () => {
  let dao: XenditDAO;
  const redisConnection = { connection: { status: jest.fn() } };
  const xenditLog = { createOne: jest.fn() };
  const secretManagerConnection = { xendit: { secretKey: jest.fn() } };
  const virtualAcc = { getVAPayment: jest.fn() };

  beforeEach(async () => {
    dao = configureServiceTest({
      service: XenditDAO,
      mocks: [
        {
          provide: VirtualAcc,
          useValue: virtualAcc,
        },
        {
          provide: RedisConnection,
          useValue: redisConnection,
        },
        {
          provide: XenditLog,
          useValue: xenditLog,
        },
        {
          provide: SecretManagerConnection,
          useValue: secretManagerConnection,
        },
      ],
    });
    redisConnection.connection.status.mockReturnValue('ok');
    secretManagerConnection.xendit.secretKey.mockReturnValue('key');

    dao.init();

    await new Promise(process.nextTick);
  });

  afterEach(() => jest.restoreAllMocks());

  describe('on validateVAPayment', () => {
    describe('on error validate payment', () => {
      it('should return the error', async () => {
        try {
          await dao.validateVAPayment('123');
        } catch (error) {
          expect(error === undefined).toBe(false);
        }
      });
    });
  });

  describe('on validateVAStatus', () => {
    describe('on error validate virtual account status', () => {
      it('should return the error', async () => {
        try {
          await dao.validateVAStatus('123');
        } catch (error) {
          expect(error === undefined).toBe(false);
        }
      });
    });
  });
});
