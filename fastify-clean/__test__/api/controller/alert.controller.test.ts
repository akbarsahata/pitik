import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';

import { Value } from '@sinclair/typebox/value';
import { configureControllerTest, FastifyInstanceWithController } from 'fastify-decorators/testing';
import { AlertController } from '../../../src/api/controller/alert.controller';
import { getAlertResponseDTO } from '../../../src/dto/alert.dto';

describe('Controller: AuthController', () => {
  let instance: FastifyInstanceWithController<AlertController>;

  beforeEach(async () => {
    instance = await configureControllerTest({
      controller: AlertController,
    });
  });
  afterEach(() => jest.restoreAllMocks());

  it('/alerts should reply 200', async () => {
    const controllerInstance = instance.controller;

    const returnValue = Value.Create(getAlertResponseDTO);

    jest.spyOn(controllerInstance, 'get').mockReturnValue(Promise.resolve(returnValue));

    const result = await instance.inject({
      url: '/alerts',
      method: 'GET',
    });

    expect(result.statusCode).not.toEqual(404);
  });
});
