import { configureServiceTest } from 'fastify-decorators/testing';
import { VariableDAO } from '../../src/dao/variable.dao';

import { VariableService } from '../../src/services/variable.service';

describe('Service: VariableService', () => {
  let service: VariableService;
  const variableDAO = { getMany: jest.fn() };

  beforeEach(async () => {
    service = configureServiceTest({
      service: VariableService,
      mocks: [
        {
          provide: VariableDAO,
          useValue: variableDAO,
        },
      ],
    });
  });

  afterEach(() => jest.restoreAllMocks());

  it('should return array of Variable', async () => {
    variableDAO.getMany.mockReturnValue([]);

    const result = await service.getMany({});

    expect(result).toHaveLength(0);
  });
});
