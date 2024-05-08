import { configureServiceTest } from 'fastify-decorators/testing';
import HealthService from '../../../src/services/health.service';

describe('Service: HealthService', () => {
  let service: HealthService;

  beforeEach(async () => {
    service = configureServiceTest({
      service: HealthService,
    });
  });

  afterEach(() => jest.restoreAllMocks());

  it('should return health status', async () => {
    const result = service.getHealthInfo();

    expect(result).toBeTruthy();
  });
});
