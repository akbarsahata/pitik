import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';

import {
  createExternalId,
  dayDifference,
  extractPartnerId,
  rateLimiter,
} from '../../../src/libs/utils/helpers';

describe('Utils: Helpers', () => {
  describe('on dayDifference()', () => {
    it('should return day difference between two dates', async () => {
      const start = new Date('2020-07-24');
      const end = new Date('2023-07-23');
      const result = dayDifference(start, end);

      expect(result).toEqual(1089);
    });
  });
});

describe('createExternalId', () => {
  it('should create the external ID with partnerId and bankCode', () => {
    const partnerId = '123';
    const bankCode = '456';
    const externalId = createExternalId(partnerId, bankCode);
    expect(externalId).toBe('123--456');
  });

  it('should handle empty partnerId and bankCode', () => {
    const partnerId = '';
    const bankCode = '';
    const externalId = createExternalId(partnerId, bankCode);
    expect(externalId).toBe('--');
  });
});

describe('extractPartnerId', () => {
  it('should extract the partnerId from the external ID', () => {
    const externalId = '123--456';
    const partnerId = extractPartnerId(externalId);
    expect(partnerId).toBe('123');
  });

  it('should handle empty external ID', () => {
    const externalId = '';
    const partnerId = extractPartnerId(externalId);
    expect(partnerId).toBe('');
  });

  it('should handle external ID without "--"', () => {
    const externalId = '123';
    const partnerId = extractPartnerId(externalId);
    expect(partnerId).toBe('123');
  });
});

describe('rateLimiter', () => {
  it('should throw error when rate limit exceeded', async () => {
    const identifier = 'test-identifier';
    const expire = 1;
    await rateLimiter(identifier, expire);
    try {
      jest
        .fn()
        .mockName('getInstanceByToken')
        .mockImplementationOnce(() => ({
          connection: {
            incr: jest.fn().mockImplementationOnce(() => 2),
            setex: jest.fn(),
          },
        }));
      await rateLimiter(identifier, expire);
    } catch (error) {
      expect(error).toStrictEqual(Error('rate limit exceeded'));
    }

    jest.clearAllMocks();
  });
});
