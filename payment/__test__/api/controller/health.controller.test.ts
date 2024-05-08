import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';

import { Value } from '@sinclair/typebox/value';
import { configureControllerTest, FastifyInstanceWithController } from 'fastify-decorators/testing';
import { HealthController } from '../../../src/api/controller/health.controller';
import { healthResponseDTO } from '../../../src/dto/health.dto';

describe('Controller: HealthController', () => {
  let instance: FastifyInstanceWithController<HealthController>;

  beforeEach(async () => {
    instance = await configureControllerTest({
      controller: HealthController,
    });
  });
  afterEach(() => jest.restoreAllMocks());

  it('should return status 200', async () => {
    const controllerInstance = instance.controller;

    const returnValue = Value.Create(healthResponseDTO);

    jest.spyOn(controllerInstance, 'getHealthInfo').mockReturnValue(Promise.resolve(returnValue));

    const result = await instance.inject({
      url: '/health',
      method: 'GET',
    });

    expect(result.statusCode).toEqual(200);
  });
});
