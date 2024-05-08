/* eslint-disable no-loop-func */
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';

import { Value } from '@sinclair/typebox/value';
import { InjectOptions } from 'fastify';
import { configureControllerTest, FastifyInstanceWithController } from 'fastify-decorators/testing';
import { ExternalController } from '../../../src/api/controller/external.controller';
import { PaymentStatusProducer } from '../../../src/dao/kafka/producer/paymentStatus.producer';
import { VirtualAccountDAO } from '../../../src/dao/postgresql/virtualAccount.dao';
import { XenditDAO } from '../../../src/dao/xendit/xendit.dao';
import {
  paymentCallbackResponseDTO,
  virtualAccountCallbackResponseDTO,
} from '../../../src/dto/xendit.dto';
import { VirtualAccountStatusProducer } from '../../../src/dao/kafka/producer/virtualAccountStatus.producer';

describe('Controller: ExternalController', () => {
  let instance: FastifyInstanceWithController<ExternalController>;
  const virtualAccountDAO = { updateOne: jest.fn() };
  const xenditDAO = { validateVAStatus: jest.fn() };
  const paymentStatusProducer = { send: jest.fn() };
  const virtualAccountProducer = { send: jest.fn() };

  beforeEach(async () => {
    instance = await configureControllerTest({
      controller: ExternalController,
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
          provide: PaymentStatusProducer,
          useValue: paymentStatusProducer,
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
      api: 'on POST /external/xendit/virtual-account/status-callback',
      returnValue: Value.Create(virtualAccountCallbackResponseDTO),
      spyInstance: 'virtualAccountStatusCallback',
      testCases: [
        {
          description: 'on complete payload body',
          cases: [
            {
              injected: {
                url: '/external/xendit/virtual-account/status-callback',
                method: 'POST',
                body: {
                  id: '299ae40b-f563-4e00-b30d-6fefafe9b282',
                  name: 'tes 124',
                  status: 'ACTIVE',
                  country: 'ID',
                  created: '2023-07-05T04:55:51.751824Z',
                  updated: '2023-07-05T04:55:51.751824Z',
                  currency: 'IDR',
                  owner_id: '6299e699451d07568bcc512d',
                  bank_code: 'BCA',
                  is_closed: false,
                  external_id: '124',
                  is_single_use: false,
                  merchant_code: '10766',
                  account_number: '107669999603019',
                  expiration_date: '2054-07-05T04:55:51.751824Z',
                },
              },
              expected: 200,
            },
          ],
        },
        {
          description: 'on all payload body is missing',
          cases: [
            {
              injected: {
                url: '/external/xendit/virtual-account/status-callback',
                method: 'POST',
              },
              expected: 400,
            },
          ],
        },
        {
          description: 'on some payload body is missing',
          cases: [
            {
              injected: {
                url: '/external/xendit/virtual-account/status-callback',
                method: 'POST',
                body: {
                  id: '299ae40b-f563-4e00-b30d-6fefafe9b282',
                  name: 'tes 124',
                  status: 'ACTIVE',
                  country: 'ID',
                  created: '2023-07-05T04:55:51.751824Z',
                  updated: '2023-07-05T04:55:51.751824Z',
                  currency: 'IDR',
                  owner_id: '6299e699451d07568bcc512d',
                  bank_code: 'BCA',
                },
              },
              expected: 400,
            },
          ],
        },
      ],
    },
    {
      api: 'on POST /external/xendit/payment/status-callback',
      returnValue: Value.Create(paymentCallbackResponseDTO),
      spyInstance: 'virtualAccountPaymentCallback',
      testCases: [
        {
          description: 'on complete payload body',
          cases: [
            {
              injected: {
                url: '/external/xendit/virtual-account/payment-callback',
                method: 'POST',
                body: {
                  id: '5f6a9c98-bc16-48d9-8e29-7b4260f47b9e',
                  amount: 50000,
                  country: 'ID',
                  created: '2023-07-07T02:19:21.896Z',
                  updated: '2023-07-07T02:19:25.958Z',
                  currency: 'IDR',
                  owner_id: '6299e699451d07568bcc512d',
                  bank_code: 'BCA',
                  payment_id: '5f6a9c98-bc16-48d9-8e29-7b4260f47b9e',
                  external_id: 'b3887674-aafc-4962-bcbf-c639094ccfe9',
                  merchant_code: '10766',
                  account_number: '9999815623',
                  payment_detail: {
                    remark: null,
                    reference: '1688696360092',
                  },
                  transaction_timestamp: '2023-07-07T02:19:20.000Z',
                  callback_virtual_account_id: 'e46bff12-ad32-4bc9-86d2-511f3b054caa',
                },
              },
              expected: 200,
            },
          ],
        },
        {
          description: 'on all payload body is missing',
          cases: [
            {
              injected: {
                url: '/external/xendit/virtual-account/payment-callback',
                method: 'POST',
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
            const testCaseDetail = testCase.cases[k];

            it(`should return status ${testCaseDetail.expected}`, async () => {
              const controllerInstance = instance.controller;

              jest
                .spyOn(controllerInstance, api.spyInstance as any)
                .mockReturnValue(Promise.resolve(api.returnValue));

              const result = await instance.inject(testCaseDetail.injected as InjectOptions);

              expect(result.statusCode).toEqual(testCaseDetail.expected);
            });
          }
        });
      }
    });
  }
});
