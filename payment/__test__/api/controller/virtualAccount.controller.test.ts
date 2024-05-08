/* eslint-disable no-loop-func */
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';

import { Value } from '@sinclair/typebox/value';
import { InjectOptions } from 'fastify';
import { configureControllerTest, FastifyInstanceWithController } from 'fastify-decorators/testing';
import { VirtualAccountController } from '../../../src/api/controller/virtualAccount.controller';
import { VirtualAccountStatusProducer } from '../../../src/dao/kafka/producer/virtualAccountStatus.producer';
import { VirtualAccountDAO } from '../../../src/dao/postgresql/virtualAccount.dao';
import { XenditDAO } from '../../../src/dao/xendit/xendit.dao';
import { getVirtualAccountResponse } from '../../../src/dto/virtualAccount.dto';

describe('Controller: VirtualAccount', () => {
  let instance: FastifyInstanceWithController<VirtualAccountController>;
  const virtualAccountDAO = { getOne: jest.fn(), upsertOne: jest.fn() };
  const xenditDAO = { createVirtualAccount: jest.fn() };
  const virtualAccountProducer = { send: jest.fn() };

  beforeEach(async () => {
    instance = await configureControllerTest({
      controller: VirtualAccountController,
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

  const apis = [
    {
      api: 'on POST /virtual-accounts',
      testCases: [
        {
          description: 'on complete payload body',
          cases: [
            {
              injected: {
                url: '/virtual-accounts',
                method: 'POST',
                body: {
                  partnerId: 'b3887674-aafc-4962-bcbf-c639094ccfe9',
                  bankCode: 'BCA',
                  name: 'Test',
                },
              },
              expected: 200,
            },
          ],
        },
        {
          description: 'on missing all payload body',
          cases: [
            {
              injected: {
                url: '/virtual-accounts',
                method: 'POST',
              },
              expected: 400,
            },
          ],
        },
        {
          description: 'on missing some of the payload body',
          cases: [
            {
              injected: {
                url: '/virtual-accounts',
                method: 'POST',
                body: {
                  bankCode: 'BCA',
                  name: 'Test',
                },
              },
              expected: 400,
            },
          ],
        },
      ],
    },
  ];

  for (let i = 0; i < apis.length; i += 1) {
    const api = apis[i];

    describe(api.api, () => {
      for (let j = 0; j < api.testCases.length; j += 1) {
        const testCase = api.testCases[j];
        describe(testCase.description, () => {
          for (let k = 0; k < testCase.cases.length; k += 1) {
            const { injected, expected } = testCase.cases[k];
            it(`should return status ${expected}`, async () => {
              const controllerInstance = instance.controller;

              const returnValue = Value.Create(getVirtualAccountResponse);

              jest
                .spyOn(controllerInstance, 'create')
                .mockReturnValue(Promise.resolve(returnValue));

              const result = await instance.inject(injected as InjectOptions);

              expect(result.statusCode).toEqual(expected);
            });
          }
        });
      }
    });
  }
});
