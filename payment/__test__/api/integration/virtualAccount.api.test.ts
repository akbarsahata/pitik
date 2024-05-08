import { ulid } from 'ulid';
import server from '../../../src/api/server';
import { createExternalId } from '../../../src/libs/utils/helpers';

describe('POST /virtual-accounts', () => {
  beforeEach(() => {});

  afterAll(() => {
    server.close();
  });

  const partnerId = ulid();

  const useCases = [
    {
      name: 'should return 400 when partnerId is not provided',
      payload: {
        bankCode: 'BCA',
        name: 'John Doe',
      },
      expected: {
        code: 400,
        error: {
          message: "body must have required property 'partnerId'",
        },
      },
    },
    {
      name: 'should return 400 when bankCode is not provided',
      payload: {
        partnerId,
        name: 'John Doe',
      },
      expected: {
        code: 400,
        error: {
          message: "body must have required property 'bankCode'",
        },
      },
    },
    {
      name: 'should return 400 when name is not provided',
      payload: {
        partnerId,
        bankCode: 'BCA',
      },
      expected: {
        code: 400,
        error: {
          message: "body must have required property 'name'",
        },
      },
    },
    {
      name: 'should return 400 when bankCode is not supported',
      payload: {
        partnerId,
        bankCode: 'BNI',
        name: 'John Doe',
      },
      expected: {
        code: 400,
      },
    },
    {
      name: 'should return 201 and the virtual account data',
      payload: {
        partnerId,
        bankCode: 'BCA',
        name: 'John Doe',
      },
      expected: {
        code: 201,
        data: {
          id: expect.any(String),
          partnerId: createExternalId(partnerId, 'BCA'),
          merchantCode: expect.any(String),
          bankCode: 'BCA',
          name: 'John Doe',
          isSingleUse: false,
          accountNumber: expect.any(String),
          isClosed: false,
          status: 'PENDING',
          expirationDate: expect.any(String),
        },
      },
    },
    {
      name: 'should return 400 when virtual account is already exist',
      payload: {
        partnerId,
        bankCode: 'BCA',
        name: 'John Doe',
      },
      expected: {
        code: 400,
        error: {
          message: 'Virtual account already exists.',
        },
      },
    },
  ];

  for (let i = 0; i < useCases.length; i += 1) {
    const useCase = useCases[i];

    it(
      useCase.name,
      async () => {
        const response = await server.inject({
          url: '/virtual-accounts',
          method: 'POST',
          headers: {
            'x-request-identifier': new Date().getTime().toString(),
          },
          payload: useCase.payload,
        });

        expect(JSON.parse(response.body)).toMatchObject(useCase.expected);
      },
      10000,
    );
  }
});
