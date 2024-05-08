import { configureServiceTest } from 'fastify-decorators/testing';
import { CoopTypeDAO } from '../../src/dao/coopType.dao';
import { PostgreSQLConnection } from '../../src/datasources/connection/postgresql.connection';

interface MockRepository {
  findOneOrFail: jest.Mock;
}

interface MockConnection {
  getRepository(): MockRepository;
  initialize: () => Promise<any>;
  destroy: () => Promise<any>;
}

describe('DAO: CoopTypeDAO', () => {
  let dao: CoopTypeDAO;
  let repository: MockRepository;

  beforeEach(async () => {
    repository = {
      findOneOrFail: jest.fn(),
    };
    dao = configureServiceTest({
      service: CoopTypeDAO,
      mocks: [
        {
          provide: PostgreSQLConnection,
          useValue: {
            connection: {
              getRepository: () => repository,
              initialize: () => Promise.resolve(),
            },
          } as Record<keyof PostgreSQLConnection, MockConnection>,
        },
      ],
    });

    await dao.init();

    await new Promise(process.nextTick);
  });

  afterEach(() => jest.restoreAllMocks());

  it('should return array', async () => {
    repository.findOneOrFail.mockImplementation(() => Promise.resolve([]));

    const result = await dao.getOneById('');

    expect(result).toHaveLength(0);
  });
});
