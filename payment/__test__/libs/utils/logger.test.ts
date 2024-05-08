import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import { configureServiceTest } from 'fastify-decorators/testing';
import {
  ErrorLog,
  QueryErrorLog,
  QueryLog,
  QuerySlowLog,
  RequestLog,
} from '../../../src/libs/types/logger.d';

import { DBLogger, Logger } from '../../../src/libs/utils/logger';

const REQUEST_LOG: RequestLog | ErrorLog = {
  method: 'GET',
  url: '/',
  user_id: 'id',
  user_token: 'token',
  log_level: 'info',
  ctx: 'request-log',
  request_id: 'id',
};

const QUERY_LOG: QueryLog | QueryErrorLog | QuerySlowLog = {
  log_level: 'info',
  ctx: 'request-log',
  request_id: 'id',
  query: 'query',
  params: ['{"key": "value"}'],
  error: 'error',
  time: 1,
};

describe('Utils: Logger', () => {
  let service: Logger;

  beforeEach(async () => {
    service = configureServiceTest({
      service: Logger,
    });
  });

  afterEach(() => jest.restoreAllMocks());

  describe('on level info', () => {
    it('should process data', async () => {
      const result = service.info('data');

      expect(result).toBeUndefined();
    });
  });

  describe('on level debug', () => {
    it('should process data', async () => {
      const result = service.debug('data');

      expect(result).toBeUndefined();
    });
  });

  describe('on level warn', () => {
    it('should process data', async () => {
      const result = service.warn('data');

      expect(result).toBeUndefined();
    });
  });

  describe('on level logRequest', () => {
    it('should process data', async () => {
      const result = service.logRequest(REQUEST_LOG);

      expect(result).toBeUndefined();
    });
  });

  describe('on level logResponse', () => {
    it('should process data', async () => {
      const result = service.logResponse({
        ...REQUEST_LOG,
        status_code: 200,
        response_time: 1,
        response: 'ok',
      });

      expect(result).toBeUndefined();
    });
  });

  describe('on level logError', () => {
    it('should process data', async () => {
      const result = service.logError(REQUEST_LOG as unknown as ErrorLog);

      expect(result).toBeUndefined();
    });
  });

  describe('on level logQuery', () => {
    it('should process data', async () => {
      const result = service.logQuery(QUERY_LOG);

      expect(result).toBeUndefined();
    });
  });

  describe('on level logQueryError', () => {
    it('should process data', async () => {
      const result = service.logQueryError(QUERY_LOG as QueryErrorLog);

      expect(result).toBeUndefined();
    });
  });

  describe('on level logQuerySlow', () => {
    it('should process data', async () => {
      const result = service.logQuerySlow(QUERY_LOG as QuerySlowLog);

      expect(result).toBeUndefined();
    });
  });

  describe('on parsePayload', () => {
    it('should return data', async () => {
      const result = service.parsePayload('string data');

      expect(result).toBe('string data');
    });
  });
});

describe('Utils: DBLogger', () => {
  let service: DBLogger;

  beforeEach(async () => {
    service = configureServiceTest({
      service: DBLogger,
    });
  });

  afterEach(() => jest.restoreAllMocks());

  describe('on logQuery', () => {
    it('should process data', async () => {
      const result = service.logQuery('data');

      expect(result).toBeUndefined();
    });
  });

  describe('on logQueryError', () => {
    it('should process data', async () => {
      const result = service.logQueryError('error', 'data');

      expect(result).toBeUndefined();
    });
  });

  describe('on logQuerySlow', () => {
    it('should process data', async () => {
      const result = service.logQuerySlow(100, 'data');

      expect(result).toBeUndefined();
    });
  });

  describe('on logSchemaBuild', () => {
    it('should process data', async () => {
      const result = service.logSchemaBuild('data');

      expect(result).toBeUndefined();
    });
  });

  describe('on logMigration', () => {
    it('should process data', async () => {
      const result = service.logMigration('data');

      expect(result).toBeUndefined();
    });
  });

  describe('on log', () => {
    describe('on level log', () => {
      it('should process data', async () => {
        const result = service.log('log', 'data');

        expect(result).toBeUndefined();
      });
    });

    describe('on level info', () => {
      it('should process data', async () => {
        const result = service.log('info', 'data');

        expect(result).toBeUndefined();
      });
    });

    describe('on level warn', () => {
      it('should process data', async () => {
        const result = service.log('warn', 'data');

        expect(result).toBeUndefined();
      });
    });
  });

  describe('on stringifyParams', () => {
    describe('on successfully stringify data', () => {
      it('should process data', async () => {
        const result = service.stringifyParams({ key: 'value' });

        expect(result).toBe('{"key":"value"}');
      });
    });
  });
});
