import { createMock } from '@golevelup/ts-jest';
import { configureServiceTest } from 'fastify-decorators/testing';
import { QueryRunner } from 'typeorm';
import { ProductsInManufactureDAO } from '../../../src/dao/sales/productsInManufacture.dao';
import { PostgreSQLConnection } from '../../../src/datasources/connection/postgresql.connection';
import { SalesOperationUnit } from '../../../src/datasources/entity/pgsql/sales/OperationUnit.entity';
import { SalesProductsInManufacture } from '../../../src/datasources/entity/pgsql/sales/ProductsInManufacture.entity';
import { SalesManufactureProductCategoryBody } from '../../../src/dto/sales/manufacture.dto';

interface MockRepository {
  findOneOrFail: jest.Mock;
}

interface MockConnection {
  getRepository(): MockRepository;
  initialize: () => Promise<any>;
  destroy: () => Promise<any>;
}

const PRODUCT_CATEGORIES = [
  {
    id: '2e92c502-568b-434d-8054-d13c0092eb97',
    name: 'Live Bird',
    ratio: 1,
    code: 'LB',
  },
  {
    id: '12a3efb5-dca3-4b54-b2bf-597108838514',
    name: 'Ayam Utuh',
    ratio: 0.8,
    code: 'AU',
  },
  {
    id: '198cb678-25a5-4db3-a286-e10f55a6f298',
    name: 'Brangkas',
    ratio: 0.9,
    code: 'BR',
  },
  {
    id: '052fef4a-9eda-42b4-b1a5-d093ae60271e',
    name: 'Ceker',
    ratio: 0.05,
    code: 'CK',
  },
  {
    id: 'f2d29232-5d4a-4b79-8e99-7518075f5aa9',
    name: 'Kepala',
    ratio: 0.05,
    code: 'HD',
  },
  {
    id: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
    name: 'Hati Ampela',
    ratio: 0.1,
    code: 'IN',
  },
  {
    id: 'cb7648d2-c74f-4217-b995-aa9557647553',
    name: 'Karkas',
    ratio: 0.7,
    code: 'CR',
  },
];

const OPERATION_UNIT = {
  JAGAL: {
    id: 'a7730ebfed4fb5f57dd846b6eb53dfec',
    status: true,
    category: 'INTERNAL',
    type: 'JAGAL',
    innardsPrice: 20000,
    headPrice: 10000,
    feetPrice: 10000,
    lbPrice: 24500,
    lbLoss: 5.5,
    operationalDays: 30,
    operationalExpenses: 14100000,
    lbQuantity: 357,
    lbWeight: 450,
    priceBasis: null,
  } as Partial<SalesOperationUnit>,
  LAPAK: {
    id: '3b9b42b1e0ab90cba97fe41fcfa2ff3a',
    status: true,
    category: 'INTERNAL',
    type: 'LAPAK',
    innardsPrice: 20000,
    headPrice: 10000,
    feetPrice: 10000,
    jagalData: null,
  } as Partial<SalesOperationUnit>,
};

const PRODUCTS: Record<
  string,
  Partial<SalesManufactureProductCategoryBody | SalesProductsInManufacture>
> = {
  LIVE_BIRD: {
    salesProductCategoryId: '2e92c502-568b-434d-8054-d13c0092eb97',
    productCategoryId: '2e92c502-568b-434d-8054-d13c0092eb97',
    quantity: 100,
    weight: 100,
  },
  AYAM_UTUH: {
    salesProductCategoryId: '12a3efb5-dca3-4b54-b2bf-597108838514',
    productCategoryId: '12a3efb5-dca3-4b54-b2bf-597108838514',
    quantity: 100,
    weight: 100,
  },
  BRANKAS: {
    salesProductCategoryId: '198cb678-25a5-4db3-a286-e10f55a6f298',
    productCategoryId: '198cb678-25a5-4db3-a286-e10f55a6f298',
    quantity: 100,
    weight: 100,
  },
  CARCASS: {
    salesProductCategoryId: 'cb7648d2-c74f-4217-b995-aa9557647553',
    productCategoryId: 'cb7648d2-c74f-4217-b995-aa9557647553',
    quantity: 100,
    weight: 100,
  },
  CEKER: {
    salesProductCategoryId: '052fef4a-9eda-42b4-b1a5-d093ae60271e',
    productCategoryId: '052fef4a-9eda-42b4-b1a5-d093ae60271e',
    quantity: 100,
    weight: 100,
  },
  KEPALA: {
    salesProductCategoryId: 'f2d29232-5d4a-4b79-8e99-7518075f5aa9',
    productCategoryId: 'f2d29232-5d4a-4b79-8e99-7518075f5aa9',
    quantity: 100,
    weight: 100,
  },
  INNARDS: {
    salesProductCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
    productCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
    quantity: 100,
    weight: 100,
  },
};

describe('DAO: ProductsInManufactureDAO', () => {
  let dao: ProductsInManufactureDAO;
  let repository: MockRepository;

  beforeEach(async () => {
    repository = {
      findOneOrFail: jest.fn(),
    };

    dao = configureServiceTest({
      service: ProductsInManufactureDAO,
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

    dao.init();

    await new Promise(process.nextTick);
  });

  afterEach(() => jest.restoreAllMocks());

  describe('when given an inactive operation unit', () => {
    it('throws error of "Cannot manufacture in an inactive operation unit!"', async () => {
      const mockQueryRunner = createMock<QueryRunner>({
        manager: {
          findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
        },
      });

      await expect(
        dao.calculateCOGS(
          {
            operationUnit: {
              ...OPERATION_UNIT.JAGAL,
              status: false,
            } as SalesOperationUnit,
            productManufactureInput: {} as any,
            productManufactureOutput: [],
          },
          mockQueryRunner,
        ),
      ).rejects.toThrowError('Cannot manufacture in an inactive operation unit!');
    });
  });

  describe('when manufacture in EXTERNAL JAGAL', () => {
    it('throws error of "Cannot manufacture in EXTERNAL JAGAL!"', async () => {
      const mockQueryRunner = createMock<QueryRunner>({
        manager: {
          findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
        },
      });

      await expect(
        dao.calculateCOGS(
          {
            operationUnit: {
              ...OPERATION_UNIT.JAGAL,
              category: 'EXTERNAL',
            } as SalesOperationUnit,
            productManufactureInput: {} as any,
            productManufactureOutput: [],
          },
          mockQueryRunner,
        ),
      ).rejects.toThrowError('Cannot manufacture in EXTERNAL JAGAL!');
    });
  });

  describe('when manufacture in EXTERNAL LAPAK', () => {
    it('throws error of "Cannot manufacture in EXTERNAL LAPAK!"', async () => {
      const mockQueryRunner = createMock<QueryRunner>({
        manager: {
          findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
        },
      });

      await expect(
        dao.calculateCOGS(
          {
            operationUnit: {
              ...OPERATION_UNIT.LAPAK,
              category: 'EXTERNAL',
            } as SalesOperationUnit,
            productManufactureInput: {} as any,
            productManufactureOutput: [],
          },
          mockQueryRunner,
        ),
      ).rejects.toThrowError('Cannot manufacture in EXTERNAL LAPAK!');
    });
  });

  describe('when missing product manufacture output', () => {
    it('throws error of "Missing product manufacture output!"', async () => {
      const mockQueryRunner = createMock<QueryRunner>({
        manager: {
          findAndCount: () => Promise.resolve([[], 0]),
        },
      });

      await expect(
        dao.calculateCOGS(
          {
            operationUnit: OPERATION_UNIT.JAGAL as SalesOperationUnit,
            productManufactureInput: {} as any,
            productManufactureOutput: [],
          },
          mockQueryRunner,
        ),
      ).rejects.toThrowError('Missing product manufacture output!');
    });
  });

  describe('when missing product manufacture input', () => {
    it('throws error of "Invalid product manufacture input!"', async () => {
      const mockQueryRunner = createMock<QueryRunner>({
        manager: {
          findAndCount: () => Promise.resolve([[], 0]),
        },
      });

      await expect(
        dao.calculateCOGS(
          {
            operationUnit: OPERATION_UNIT.JAGAL as SalesOperationUnit,
            productManufactureInput: {} as any,
            productManufactureOutput: [PRODUCTS.BRANKAS] as SalesManufactureProductCategoryBody[],
          },
          mockQueryRunner,
        ),
      ).rejects.toThrowError('Invalid product manufacture input!');
    });
  });

  describe('when the operation unit have no inventory price data', () => {
    it('throws error of "Missing inventory price data!"', async () => {
      const mockQueryRunner = createMock<QueryRunner>({
        manager: {
          findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
        },
      });

      await expect(
        dao.calculateCOGS(
          {
            operationUnit: {
              ...OPERATION_UNIT.JAGAL,
              innardsPrice: null,
            } as SalesOperationUnit,
            productManufactureInput: PRODUCTS.LIVE_BIRD as SalesProductsInManufacture,
            productManufactureOutput: [PRODUCTS.BRANKAS] as SalesManufactureProductCategoryBody[],
          },
          mockQueryRunner,
        ),
      ).rejects.toThrowError('Missing inventory price data!');
    });
  });

  describe('when manufacture happens in JAGAL', () => {
    describe('and JAGAL has no operational live bird price data', () => {
      it('throws error of "Missing jagal OPEX data!"', async () => {
        const mockQueryRunner = createMock<QueryRunner>({
          manager: {
            findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
          },
        });

        await expect(
          dao.calculateCOGS(
            {
              operationUnit: {
                ...OPERATION_UNIT.JAGAL,
                lbPrice: null,
              } as SalesOperationUnit,
              productManufactureInput: PRODUCTS.LIVE_BIRD as SalesProductsInManufacture,
              productManufactureOutput: [PRODUCTS.BRANKAS] as SalesManufactureProductCategoryBody[],
            },
            mockQueryRunner,
          ),
        ).rejects.toThrowError('Missing jagal OPEX data!');
      });
    });

    describe('and JAGAL has no operational expenses data', () => {
      it('throws error of "Missing jagal OPEX data!"', async () => {
        const mockQueryRunner = createMock<QueryRunner>({
          manager: {
            findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
          },
        });

        await expect(
          dao.calculateCOGS(
            {
              operationUnit: {
                ...OPERATION_UNIT.JAGAL,
                operationalExpenses: null,
                lbLoss: null,
              } as SalesOperationUnit,
              productManufactureInput: PRODUCTS.LIVE_BIRD as SalesProductsInManufacture,
              productManufactureOutput: [PRODUCTS.BRANKAS] as SalesManufactureProductCategoryBody[],
            },
            mockQueryRunner,
          ),
        ).rejects.toThrowError('Missing jagal OPEX data!');
      });
    });

    describe("and manufacture's product input is invalid", () => {
      it('thrws error of "Invalid product manufacture input in JAGAL!"', async () => {
        const mockQueryRunner = createMock<QueryRunner>({
          manager: {
            findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
          },
        });

        await expect(
          dao.calculateCOGS(
            {
              operationUnit: OPERATION_UNIT.JAGAL as SalesOperationUnit,
              productManufactureInput: PRODUCTS.CARCASS as SalesProductsInManufacture,
              productManufactureOutput: [PRODUCTS.BRANKAS] as SalesManufactureProductCategoryBody[],
            },
            mockQueryRunner,
          ),
        ).rejects.toThrowError('Invalid product manufacture input in JAGAL!');
      });
    });
  });

  describe('when manufacture happens in LAPAK', () => {
    describe("and manufacture's product input is invalid", () => {
      it('throws error of "Invalid product manufacture input in LAPAK!"', async () => {
        const mockQueryRunner = createMock<QueryRunner>({
          manager: {
            findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
          },
        });

        await expect(
          dao.calculateCOGS(
            {
              operationUnit: OPERATION_UNIT.LAPAK as SalesOperationUnit,
              productManufactureInput: PRODUCTS.LIVE_BIRD as SalesProductsInManufacture,
              productManufactureOutput: [PRODUCTS.BRANKAS] as SalesManufactureProductCategoryBody[],
            },
            mockQueryRunner,
          ),
        ).rejects.toThrowError('Invalid product manufacture input in LAPAK!');
      });
    });

    describe("and manufacture's product input is brankas", () => {
      describe('and it has no brankas price or weight', () => {
        it('throws error of "Missing BRANKAS price and weight!"', async () => {
          const mockQueryRunner = createMock<QueryRunner>({
            manager: {
              findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
            },
          });

          await expect(
            dao.calculateCOGS(
              {
                operationUnit: OPERATION_UNIT.LAPAK as SalesOperationUnit,
                productManufactureInput: {
                  ...PRODUCTS.BRANKAS,
                  price: null,
                } as SalesProductsInManufacture,
                productManufactureOutput: [
                  PRODUCTS.AYAM_UTUH,
                  PRODUCTS.INNARDS,
                ] as SalesManufactureProductCategoryBody[],
              },
              mockQueryRunner,
            ),
          ).rejects.toThrowError('Missing BRANKAS price and weight!');
        });
      });
    });

    describe("and manufacture's product input is ayam utuh", () => {
      describe('and it has no ayam utuh price or weight', () => {
        it('throws error of "Missing AYAM UTUH price and weight"', async () => {
          const mockQueryRunner = createMock<QueryRunner>({
            manager: {
              findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
            },
          });

          await expect(
            dao.calculateCOGS(
              {
                operationUnit: OPERATION_UNIT.LAPAK as SalesOperationUnit,
                productManufactureInput: {
                  ...PRODUCTS.AYAM_UTUH,
                  price: null,
                } as SalesProductsInManufacture,
                productManufactureOutput: [
                  PRODUCTS.CARCASS,
                  PRODUCTS.KEPALA,
                  PRODUCTS.CEKER,
                ] as SalesManufactureProductCategoryBody[],
              },
              mockQueryRunner,
            ),
          ).rejects.toThrowError('Missing AYAM UTUH price and weight!');
        });
      });
    });
  });

  describe('when manufacture happens', () => {
    describe('and product input is live bird', () => {
      describe('and product output is live bird', () => {
        it('throws error of "Invalid product manufacture output from LIVE BIRD!"', async () => {
          const mockQueryRunner = createMock<QueryRunner>({
            manager: {
              findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
            },
          });

          await expect(
            dao.calculateCOGS(
              {
                operationUnit: OPERATION_UNIT.JAGAL as SalesOperationUnit,
                productManufactureInput: PRODUCTS.LIVE_BIRD as SalesProductsInManufacture,
                productManufactureOutput: [
                  PRODUCTS.LIVE_BIRD,
                ] as SalesManufactureProductCategoryBody[],
              },
              mockQueryRunner,
            ),
          ).rejects.toThrowError('Invalid product manufacture output from LIVE BIRD!');
        });
      });
    });

    describe('and product input is brankas', () => {
      describe('and product output is live bird', () => {
        it('throws error of "Invalid product manufacture output from BRANKAS!"', async () => {
          const mockQueryRunner = createMock<QueryRunner>({
            manager: {
              findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
            },
          });

          await expect(
            dao.calculateCOGS(
              {
                operationUnit: OPERATION_UNIT.JAGAL as SalesOperationUnit,
                productManufactureInput: PRODUCTS.BRANKAS as SalesProductsInManufacture,
                productManufactureOutput: [
                  PRODUCTS.LIVE_BIRD,
                ] as SalesManufactureProductCategoryBody[],
              },
              mockQueryRunner,
            ),
          ).rejects.toThrowError('Invalid product manufacture output from BRANKAS!');
        });
      });
      describe('and product output is brankas', () => {
        it('throws error of "Invalid product manufacture output from BRANKAS!', async () => {
          const mockQueryRunner = createMock<QueryRunner>({
            manager: {
              findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
            },
          });

          await expect(
            dao.calculateCOGS(
              {
                operationUnit: OPERATION_UNIT.JAGAL as SalesOperationUnit,
                productManufactureInput: PRODUCTS.BRANKAS as SalesProductsInManufacture,
                productManufactureOutput: [
                  PRODUCTS.LIVE_BIRD,
                ] as SalesManufactureProductCategoryBody[],
              },
              mockQueryRunner,
            ),
          ).rejects.toThrowError('Invalid product manufacture output from BRANKAS!');
        });
      });
    });

    describe('and product input is ayam utuh', () => {
      describe('and product output is live bird', () => {
        it('throws error of "Invalid product manufacture output from AYAM UTUH!"', async () => {
          const mockQueryRunner = createMock<QueryRunner>({
            manager: {
              findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
            },
          });

          await expect(
            dao.calculateCOGS(
              {
                operationUnit: OPERATION_UNIT.JAGAL as SalesOperationUnit,
                productManufactureInput: PRODUCTS.AYAM_UTUH as SalesProductsInManufacture,
                productManufactureOutput: [
                  PRODUCTS.LIVE_BIRD,
                ] as SalesManufactureProductCategoryBody[],
              },
              mockQueryRunner,
            ),
          ).rejects.toThrowError('Invalid product manufacture output from AYAM UTUH!');
        });
      });

      describe('and product output is brankas', () => {
        it('throws error of "Invalid product manufacture output from AYAM UTUH!"', async () => {
          const mockQueryRunner = createMock<QueryRunner>({
            manager: {
              findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
            },
          });

          await expect(
            dao.calculateCOGS(
              {
                operationUnit: OPERATION_UNIT.JAGAL as SalesOperationUnit,
                productManufactureInput: PRODUCTS.AYAM_UTUH as SalesProductsInManufacture,
                productManufactureOutput: [
                  PRODUCTS.BRANKAS,
                ] as SalesManufactureProductCategoryBody[],
              },
              mockQueryRunner,
            ),
          ).rejects.toThrowError('Invalid product manufacture output from AYAM UTUH!');
        });
      });

      describe('and product output is brankas', () => {
        it('throws error of "Invalid product manufacture output from AYAM UTUH!"', async () => {
          const mockQueryRunner = createMock<QueryRunner>({
            manager: {
              findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
            },
          });

          await expect(
            dao.calculateCOGS(
              {
                operationUnit: OPERATION_UNIT.JAGAL as SalesOperationUnit,
                productManufactureInput: PRODUCTS.AYAM_UTUH as SalesProductsInManufacture,
                productManufactureOutput: [
                  PRODUCTS.AYAM_UTUH,
                ] as SalesManufactureProductCategoryBody[],
              },
              mockQueryRunner,
            ),
          ).rejects.toThrowError('Invalid product manufacture output from AYAM UTUH!');
        });
      });
    });
  });

  describe('when COGS calculation happens', () => {
    describe("and using operation unit's live bird base price", () => {
      describe('and when manufacture happens in jagal', () => {
        describe("and when manufacture's product input is live bird", () => {
          describe("and when manufacture's product output is brankas", () => {
            it('returns price for brankas', async () => {
              const mockQueryRunner = createMock<QueryRunner>({
                manager: {
                  findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
                },
              });

              const result = await dao.calculateCOGS(
                {
                  operationUnit: OPERATION_UNIT.JAGAL as SalesOperationUnit,
                  productManufactureInput: PRODUCTS.LIVE_BIRD as SalesProductsInManufacture,
                  productManufactureOutput: [
                    PRODUCTS.BRANKAS,
                  ] as SalesManufactureProductCategoryBody[],
                },
                mockQueryRunner,
              );

              expect(result).toStrictEqual([
                {
                  price: 30034.62015807695,
                  productCategoryId: '198cb678-25a5-4db3-a286-e10f55a6f298',
                  quantity: 100,
                  salesProductCategoryId: '198cb678-25a5-4db3-a286-e10f55a6f298',
                  weight: 100,
                },
              ]);
            });
          });

          describe("and when manufacture's products output are: ayam utuh and innards", () => {
            it('returns prices for ayam utuh and innards', async () => {
              const mockQueryRunner = createMock<QueryRunner>({
                manager: {
                  findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
                },
              });

              const result = await dao.calculateCOGS(
                {
                  operationUnit: OPERATION_UNIT.JAGAL as SalesOperationUnit,
                  productManufactureInput: PRODUCTS.LIVE_BIRD as SalesProductsInManufacture,
                  productManufactureOutput: [
                    PRODUCTS.AYAM_UTUH,
                    PRODUCTS.INNARDS,
                  ] as SalesManufactureProductCategoryBody[],
                },
                mockQueryRunner,
              );

              expect(result).toStrictEqual([
                {
                  price: 31288.947677836568,
                  productCategoryId: '12a3efb5-dca3-4b54-b2bf-597108838514',
                  quantity: 100,
                  salesProductCategoryId: '12a3efb5-dca3-4b54-b2bf-597108838514',
                  weight: 100,
                },
                {
                  price: 20000,
                  productCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
                  quantity: 100,
                  salesProductCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
                  weight: 100,
                },
              ]);
            });
          });

          describe("and when manufacture's products output are: karkas, kepala, ceker, and innards", () => {
            it('returns prices for karkas, kepala, ceker, and innards', async () => {
              const mockQueryRunner = createMock<QueryRunner>({
                manager: {
                  findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
                },
              });

              const result = await dao.calculateCOGS(
                {
                  operationUnit: OPERATION_UNIT.JAGAL as SalesOperationUnit,
                  productManufactureInput: PRODUCTS.LIVE_BIRD as SalesProductsInManufacture,
                  productManufactureOutput: [
                    PRODUCTS.CARCASS,
                    PRODUCTS.KEPALA,
                    PRODUCTS.CEKER,
                    PRODUCTS.INNARDS,
                  ] as SalesManufactureProductCategoryBody[],
                },
                mockQueryRunner,
              );

              expect(result).toStrictEqual([
                {
                  price: 34330.2259175275,
                  productCategoryId: 'cb7648d2-c74f-4217-b995-aa9557647553',
                  quantity: 100,
                  salesProductCategoryId: 'cb7648d2-c74f-4217-b995-aa9557647553',
                  weight: 100,
                },
                {
                  price: 10000,
                  productCategoryId: 'f2d29232-5d4a-4b79-8e99-7518075f5aa9',
                  quantity: 100,
                  salesProductCategoryId: 'f2d29232-5d4a-4b79-8e99-7518075f5aa9',
                  weight: 100,
                },
                {
                  price: 10000,
                  productCategoryId: '052fef4a-9eda-42b4-b1a5-d093ae60271e',
                  quantity: 100,
                  salesProductCategoryId: '052fef4a-9eda-42b4-b1a5-d093ae60271e',
                  weight: 100,
                },
                {
                  price: 20000,
                  productCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
                  quantity: 100,
                  salesProductCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
                  weight: 100,
                },
              ]);
            });
          });
        });

        describe("and when manufacture's product input is brankas", () => {
          describe("and when manufacture's products output are: ayam utuh and innards", () => {
            it('returns prices for ayam utuh and innards', async () => {
              const mockQueryRunner = createMock<QueryRunner>({
                manager: {
                  findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
                },
              });

              const result = await dao.calculateCOGS(
                {
                  operationUnit: OPERATION_UNIT.JAGAL as SalesOperationUnit,
                  productManufactureInput: PRODUCTS.BRANKAS as SalesProductsInManufacture,
                  productManufactureOutput: [
                    PRODUCTS.AYAM_UTUH,
                    PRODUCTS.INNARDS,
                  ] as SalesManufactureProductCategoryBody[],
                },
                mockQueryRunner,
              );

              expect(result).toStrictEqual([
                {
                  price: 31288.947677836568,
                  productCategoryId: '12a3efb5-dca3-4b54-b2bf-597108838514',
                  quantity: 100,
                  salesProductCategoryId: '12a3efb5-dca3-4b54-b2bf-597108838514',
                  weight: 100,
                },
                {
                  price: 20000,
                  productCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
                  quantity: 100,
                  salesProductCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
                  weight: 100,
                },
              ]);
            });
          });

          describe("and when manufacture's products output are: karkas, kepala, ceker, and innards", () => {
            it('returns prices for karkas, kepala, ceker, and innards', async () => {
              const mockQueryRunner = createMock<QueryRunner>({
                manager: {
                  findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
                },
              });

              const result = await dao.calculateCOGS(
                {
                  operationUnit: OPERATION_UNIT.JAGAL as SalesOperationUnit,
                  productManufactureInput: PRODUCTS.BRANKAS as SalesProductsInManufacture,
                  productManufactureOutput: [
                    PRODUCTS.CARCASS,
                    PRODUCTS.KEPALA,
                    PRODUCTS.CEKER,
                    PRODUCTS.INNARDS,
                  ] as SalesManufactureProductCategoryBody[],
                },
                mockQueryRunner,
              );

              expect(result).toStrictEqual([
                {
                  price: 34330.22591752751,
                  productCategoryId: 'cb7648d2-c74f-4217-b995-aa9557647553',
                  quantity: 100,
                  salesProductCategoryId: 'cb7648d2-c74f-4217-b995-aa9557647553',
                  weight: 100,
                },
                {
                  price: 10000,
                  productCategoryId: 'f2d29232-5d4a-4b79-8e99-7518075f5aa9',
                  quantity: 100,
                  salesProductCategoryId: 'f2d29232-5d4a-4b79-8e99-7518075f5aa9',
                  weight: 100,
                },
                {
                  price: 10000,
                  productCategoryId: '052fef4a-9eda-42b4-b1a5-d093ae60271e',
                  quantity: 100,
                  salesProductCategoryId: '052fef4a-9eda-42b4-b1a5-d093ae60271e',
                  weight: 100,
                },
                {
                  price: 20000,
                  productCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
                  quantity: 100,
                  salesProductCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
                  weight: 100,
                },
              ]);
            });
          });
        });

        describe("and when manufacture's product input is ayam utuh", () => {
          describe("and when manufacture's products output are: karkas, kepala, ceker, and innards", () => {
            it('returns prices for karkas, kepala, ceker, and innards', async () => {
              const mockQueryRunner = createMock<QueryRunner>({
                manager: {
                  findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
                },
              });

              const result = await dao.calculateCOGS(
                {
                  operationUnit: OPERATION_UNIT.JAGAL as SalesOperationUnit,
                  productManufactureInput: PRODUCTS.BRANKAS as SalesProductsInManufacture,
                  productManufactureOutput: [
                    PRODUCTS.CARCASS,
                    PRODUCTS.KEPALA,
                    PRODUCTS.CEKER,
                  ] as SalesManufactureProductCategoryBody[],
                },
                mockQueryRunner,
              );

              expect(result).toStrictEqual([
                {
                  price: 34330.22591752751,
                  productCategoryId: 'cb7648d2-c74f-4217-b995-aa9557647553',
                  quantity: 100,
                  salesProductCategoryId: 'cb7648d2-c74f-4217-b995-aa9557647553',
                  weight: 100,
                },
                {
                  price: 10000,
                  productCategoryId: 'f2d29232-5d4a-4b79-8e99-7518075f5aa9',
                  quantity: 100,
                  salesProductCategoryId: 'f2d29232-5d4a-4b79-8e99-7518075f5aa9',
                  weight: 100,
                },
                {
                  price: 10000,
                  productCategoryId: '052fef4a-9eda-42b4-b1a5-d093ae60271e',
                  quantity: 100,
                  salesProductCategoryId: '052fef4a-9eda-42b4-b1a5-d093ae60271e',
                  weight: 100,
                },
              ]);
            });
          });
        });
      });

      describe('and when manufacture happens in lapak', () => {
        describe("and when manufacture's product input is brankas", () => {
          describe("and when manufacture's products output are: ayam utuh and innards", () => {
            it('returns prices for ayam utuh and innards', async () => {
              const mockQueryRunner = createMock<QueryRunner>({
                manager: {
                  findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
                },
              });

              const result = await dao.calculateCOGS(
                {
                  operationUnit: OPERATION_UNIT.LAPAK as SalesOperationUnit,
                  productManufactureInput: {
                    ...PRODUCTS.BRANKAS,
                    price: 30000,
                  } as SalesProductsInManufacture,
                  productManufactureOutput: [
                    PRODUCTS.AYAM_UTUH,
                    PRODUCTS.INNARDS,
                  ] as SalesManufactureProductCategoryBody[],
                },
                mockQueryRunner,
              );

              expect(result).toStrictEqual([
                {
                  price: 31250,
                  productCategoryId: '12a3efb5-dca3-4b54-b2bf-597108838514',
                  quantity: 100,
                  salesProductCategoryId: '12a3efb5-dca3-4b54-b2bf-597108838514',
                  weight: 100,
                },
                {
                  price: 20000,
                  productCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
                  quantity: 100,
                  salesProductCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
                  weight: 100,
                },
              ]);
            });
          });

          describe("and when manufacture's products output are: karkas, kepala, ceker, and innards", () => {
            it('returns prices for karkas, kepala, ceker, and innards', async () => {
              const mockQueryRunner = createMock<QueryRunner>({
                manager: {
                  findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
                },
              });

              const result = await dao.calculateCOGS(
                {
                  operationUnit: OPERATION_UNIT.LAPAK as SalesOperationUnit,
                  productManufactureInput: {
                    ...PRODUCTS.BRANKAS,
                    price: 30000,
                  } as SalesProductsInManufacture,
                  productManufactureOutput: [
                    PRODUCTS.CARCASS,
                    PRODUCTS.KEPALA,
                    PRODUCTS.CEKER,
                    PRODUCTS.INNARDS,
                  ] as SalesManufactureProductCategoryBody[],
                },
                mockQueryRunner,
              );

              expect(result).toStrictEqual([
                {
                  price: 34285.71428571429,
                  productCategoryId: 'cb7648d2-c74f-4217-b995-aa9557647553',
                  quantity: 100,
                  salesProductCategoryId: 'cb7648d2-c74f-4217-b995-aa9557647553',
                  weight: 100,
                },
                {
                  price: 10000,
                  productCategoryId: 'f2d29232-5d4a-4b79-8e99-7518075f5aa9',
                  quantity: 100,
                  salesProductCategoryId: 'f2d29232-5d4a-4b79-8e99-7518075f5aa9',
                  weight: 100,
                },
                {
                  price: 10000,
                  productCategoryId: '052fef4a-9eda-42b4-b1a5-d093ae60271e',
                  quantity: 100,
                  salesProductCategoryId: '052fef4a-9eda-42b4-b1a5-d093ae60271e',
                  weight: 100,
                },
                {
                  price: 20000,
                  productCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
                  quantity: 100,
                  salesProductCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
                  weight: 100,
                },
              ]);
            });
          });
        });

        describe("and when manufacture's product input is ayam utuh", () => {
          describe("and when manufacture's products output are: karkas, kepala, ceker, and innards", () => {
            it('returns prices for karkas, kepala, ceker, and innards', async () => {
              const mockQueryRunner = createMock<QueryRunner>({
                manager: {
                  findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
                },
              });

              const result = await dao.calculateCOGS(
                {
                  operationUnit: OPERATION_UNIT.LAPAK as SalesOperationUnit,
                  productManufactureInput: {
                    ...PRODUCTS.BRANKAS,
                    price: 30000,
                  } as SalesProductsInManufacture,
                  productManufactureOutput: [
                    PRODUCTS.CARCASS,
                    PRODUCTS.KEPALA,
                    PRODUCTS.CEKER,
                  ] as SalesManufactureProductCategoryBody[],
                },
                mockQueryRunner,
              );

              expect(result).toStrictEqual([
                {
                  price: 34285.71428571429,
                  productCategoryId: 'cb7648d2-c74f-4217-b995-aa9557647553',
                  quantity: 100,
                  salesProductCategoryId: 'cb7648d2-c74f-4217-b995-aa9557647553',
                  weight: 100,
                },
                {
                  price: 10000,
                  productCategoryId: 'f2d29232-5d4a-4b79-8e99-7518075f5aa9',
                  quantity: 100,
                  salesProductCategoryId: 'f2d29232-5d4a-4b79-8e99-7518075f5aa9',
                  weight: 100,
                },
                {
                  price: 10000,
                  productCategoryId: '052fef4a-9eda-42b4-b1a5-d093ae60271e',
                  quantity: 100,
                  salesProductCategoryId: '052fef4a-9eda-42b4-b1a5-d093ae60271e',
                  weight: 100,
                },
              ]);
            });
          });
        });
      });
    });

    describe("and using operation unit city's live bird base price", () => {
      describe('and when manufacture happens in jagal', () => {
        describe("and when manufacture's product input is live bird", () => {
          describe("and when manufacture's product output is brankas", () => {
            it('returns price for brankas', async () => {
              const mockQueryRunner = createMock<QueryRunner>({
                manager: {
                  findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
                },
              });

              const result = await dao.calculateCOGS(
                {
                  operationUnit: OPERATION_UNIT.JAGAL as SalesOperationUnit,
                  productManufactureInput: PRODUCTS.LIVE_BIRD as SalesProductsInManufacture,
                  productManufactureOutput: [
                    PRODUCTS.BRANKAS,
                  ] as SalesManufactureProductCategoryBody[],
                  lbPriceInCity: 24500,
                },
                mockQueryRunner,
              );

              expect(result).toStrictEqual([
                {
                  price: 30034.62015807695,
                  productCategoryId: '198cb678-25a5-4db3-a286-e10f55a6f298',
                  quantity: 100,
                  salesProductCategoryId: '198cb678-25a5-4db3-a286-e10f55a6f298',
                  weight: 100,
                },
              ]);
            });
          });

          describe("and when manufacture's products output are: ayam utuh and innards", () => {
            it('returns prices for ayam utuh and innards', async () => {
              const mockQueryRunner = createMock<QueryRunner>({
                manager: {
                  findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
                },
              });

              const result = await dao.calculateCOGS(
                {
                  operationUnit: OPERATION_UNIT.JAGAL as SalesOperationUnit,
                  productManufactureInput: PRODUCTS.LIVE_BIRD as SalesProductsInManufacture,
                  productManufactureOutput: [
                    PRODUCTS.AYAM_UTUH,
                    PRODUCTS.INNARDS,
                  ] as SalesManufactureProductCategoryBody[],
                  lbPriceInCity: 24500,
                },
                mockQueryRunner,
              );

              expect(result).toStrictEqual([
                {
                  price: 31288.947677836568,
                  productCategoryId: '12a3efb5-dca3-4b54-b2bf-597108838514',
                  quantity: 100,
                  salesProductCategoryId: '12a3efb5-dca3-4b54-b2bf-597108838514',
                  weight: 100,
                },
                {
                  price: 20000,
                  productCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
                  quantity: 100,
                  salesProductCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
                  weight: 100,
                },
              ]);
            });
          });

          describe("and when manufacture's products output are: karkas, kepala, ceker, and innards", () => {
            it('returns prices for karkas, kepala, ceker, and innards', async () => {
              const mockQueryRunner = createMock<QueryRunner>({
                manager: {
                  findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
                },
              });

              const result = await dao.calculateCOGS(
                {
                  operationUnit: OPERATION_UNIT.JAGAL as SalesOperationUnit,
                  productManufactureInput: PRODUCTS.LIVE_BIRD as SalesProductsInManufacture,
                  productManufactureOutput: [
                    PRODUCTS.CARCASS,
                    PRODUCTS.KEPALA,
                    PRODUCTS.CEKER,
                    PRODUCTS.INNARDS,
                  ] as SalesManufactureProductCategoryBody[],
                  lbPriceInCity: 24500,
                },
                mockQueryRunner,
              );

              expect(result).toStrictEqual([
                {
                  price: 34330.2259175275,
                  productCategoryId: 'cb7648d2-c74f-4217-b995-aa9557647553',
                  quantity: 100,
                  salesProductCategoryId: 'cb7648d2-c74f-4217-b995-aa9557647553',
                  weight: 100,
                },
                {
                  price: 10000,
                  productCategoryId: 'f2d29232-5d4a-4b79-8e99-7518075f5aa9',
                  quantity: 100,
                  salesProductCategoryId: 'f2d29232-5d4a-4b79-8e99-7518075f5aa9',
                  weight: 100,
                },
                {
                  price: 10000,
                  productCategoryId: '052fef4a-9eda-42b4-b1a5-d093ae60271e',
                  quantity: 100,
                  salesProductCategoryId: '052fef4a-9eda-42b4-b1a5-d093ae60271e',
                  weight: 100,
                },
                {
                  price: 20000,
                  productCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
                  quantity: 100,
                  salesProductCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
                  weight: 100,
                },
              ]);
            });
          });
        });

        describe("and when manufacture's product input is brankas", () => {
          describe("and when manufacture's products output are: ayam utuh and innards", () => {
            it('returns prices for ayam utuh and innards', async () => {
              const mockQueryRunner = createMock<QueryRunner>({
                manager: {
                  findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
                },
              });

              const result = await dao.calculateCOGS(
                {
                  operationUnit: OPERATION_UNIT.JAGAL as SalesOperationUnit,
                  productManufactureInput: PRODUCTS.BRANKAS as SalesProductsInManufacture,
                  productManufactureOutput: [
                    PRODUCTS.AYAM_UTUH,
                    PRODUCTS.INNARDS,
                  ] as SalesManufactureProductCategoryBody[],
                  lbPriceInCity: 24500,
                },
                mockQueryRunner,
              );

              expect(result).toStrictEqual([
                {
                  price: 31288.947677836568,
                  productCategoryId: '12a3efb5-dca3-4b54-b2bf-597108838514',
                  quantity: 100,
                  salesProductCategoryId: '12a3efb5-dca3-4b54-b2bf-597108838514',
                  weight: 100,
                },
                {
                  price: 20000,
                  productCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
                  quantity: 100,
                  salesProductCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
                  weight: 100,
                },
              ]);
            });
          });

          describe("and when manufacture's products output are: karkas, kepala, ceker, and innards", () => {
            it('returns prices for karkas, kepala, ceker, and innards', async () => {
              const mockQueryRunner = createMock<QueryRunner>({
                manager: {
                  findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
                },
              });

              const result = await dao.calculateCOGS(
                {
                  operationUnit: OPERATION_UNIT.JAGAL as SalesOperationUnit,
                  productManufactureInput: PRODUCTS.BRANKAS as SalesProductsInManufacture,
                  productManufactureOutput: [
                    PRODUCTS.CARCASS,
                    PRODUCTS.KEPALA,
                    PRODUCTS.CEKER,
                    PRODUCTS.INNARDS,
                  ] as SalesManufactureProductCategoryBody[],
                  lbPriceInCity: 24500,
                },
                mockQueryRunner,
              );

              expect(result).toStrictEqual([
                {
                  price: 34330.22591752751,
                  productCategoryId: 'cb7648d2-c74f-4217-b995-aa9557647553',
                  quantity: 100,
                  salesProductCategoryId: 'cb7648d2-c74f-4217-b995-aa9557647553',
                  weight: 100,
                },
                {
                  price: 10000,
                  productCategoryId: 'f2d29232-5d4a-4b79-8e99-7518075f5aa9',
                  quantity: 100,
                  salesProductCategoryId: 'f2d29232-5d4a-4b79-8e99-7518075f5aa9',
                  weight: 100,
                },
                {
                  price: 10000,
                  productCategoryId: '052fef4a-9eda-42b4-b1a5-d093ae60271e',
                  quantity: 100,
                  salesProductCategoryId: '052fef4a-9eda-42b4-b1a5-d093ae60271e',
                  weight: 100,
                },
                {
                  price: 20000,
                  productCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
                  quantity: 100,
                  salesProductCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
                  weight: 100,
                },
              ]);
            });
          });
        });

        describe("and when manufacture's product input is ayam utuh", () => {
          describe("and when manufacture's products output are: karkas, kepala, ceker, and innards", () => {
            it('returns prices for karkas, kepala, ceker, and innards', async () => {
              const mockQueryRunner = createMock<QueryRunner>({
                manager: {
                  findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
                },
              });

              const result = await dao.calculateCOGS(
                {
                  operationUnit: OPERATION_UNIT.JAGAL as SalesOperationUnit,
                  productManufactureInput: PRODUCTS.BRANKAS as SalesProductsInManufacture,
                  productManufactureOutput: [
                    PRODUCTS.CARCASS,
                    PRODUCTS.KEPALA,
                    PRODUCTS.CEKER,
                  ] as SalesManufactureProductCategoryBody[],
                  lbPriceInCity: 24500,
                },
                mockQueryRunner,
              );

              expect(result).toStrictEqual([
                {
                  price: 34330.22591752751,
                  productCategoryId: 'cb7648d2-c74f-4217-b995-aa9557647553',
                  quantity: 100,
                  salesProductCategoryId: 'cb7648d2-c74f-4217-b995-aa9557647553',
                  weight: 100,
                },
                {
                  price: 10000,
                  productCategoryId: 'f2d29232-5d4a-4b79-8e99-7518075f5aa9',
                  quantity: 100,
                  salesProductCategoryId: 'f2d29232-5d4a-4b79-8e99-7518075f5aa9',
                  weight: 100,
                },
                {
                  price: 10000,
                  productCategoryId: '052fef4a-9eda-42b4-b1a5-d093ae60271e',
                  quantity: 100,
                  salesProductCategoryId: '052fef4a-9eda-42b4-b1a5-d093ae60271e',
                  weight: 100,
                },
              ]);
            });
          });
        });
      });

      describe('and when manufacture happens in lapak', () => {
        describe("and when manufacture's product input is brankas", () => {
          describe("and when manufacture's products output are: ayam utuh and innards", () => {
            it('returns prices for ayam utuh and innards', async () => {
              const mockQueryRunner = createMock<QueryRunner>({
                manager: {
                  findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
                },
              });

              const result = await dao.calculateCOGS(
                {
                  operationUnit: OPERATION_UNIT.LAPAK as SalesOperationUnit,
                  productManufactureInput: {
                    ...PRODUCTS.BRANKAS,
                    price: 30000,
                  } as SalesProductsInManufacture,
                  productManufactureOutput: [
                    PRODUCTS.AYAM_UTUH,
                    PRODUCTS.INNARDS,
                  ] as SalesManufactureProductCategoryBody[],
                  lbPriceInCity: 24500,
                },
                mockQueryRunner,
              );

              expect(result).toStrictEqual([
                {
                  price: 31250,
                  productCategoryId: '12a3efb5-dca3-4b54-b2bf-597108838514',
                  quantity: 100,
                  salesProductCategoryId: '12a3efb5-dca3-4b54-b2bf-597108838514',
                  weight: 100,
                },
                {
                  price: 20000,
                  productCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
                  quantity: 100,
                  salesProductCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
                  weight: 100,
                },
              ]);
            });
          });

          describe("and when manufacture's products output are: karkas, kepala, ceker, and innards", () => {
            it('returns prices for karkas, kepala, ceker, and innards', async () => {
              const mockQueryRunner = createMock<QueryRunner>({
                manager: {
                  findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
                },
              });

              const result = await dao.calculateCOGS(
                {
                  operationUnit: OPERATION_UNIT.LAPAK as SalesOperationUnit,
                  productManufactureInput: {
                    ...PRODUCTS.BRANKAS,
                    price: 30000,
                  } as SalesProductsInManufacture,
                  productManufactureOutput: [
                    PRODUCTS.CARCASS,
                    PRODUCTS.KEPALA,
                    PRODUCTS.CEKER,
                    PRODUCTS.INNARDS,
                  ] as SalesManufactureProductCategoryBody[],
                  lbPriceInCity: 24500,
                },
                mockQueryRunner,
              );

              expect(result).toStrictEqual([
                {
                  price: 34285.71428571429,
                  productCategoryId: 'cb7648d2-c74f-4217-b995-aa9557647553',
                  quantity: 100,
                  salesProductCategoryId: 'cb7648d2-c74f-4217-b995-aa9557647553',
                  weight: 100,
                },
                {
                  price: 10000,
                  productCategoryId: 'f2d29232-5d4a-4b79-8e99-7518075f5aa9',
                  quantity: 100,
                  salesProductCategoryId: 'f2d29232-5d4a-4b79-8e99-7518075f5aa9',
                  weight: 100,
                },
                {
                  price: 10000,
                  productCategoryId: '052fef4a-9eda-42b4-b1a5-d093ae60271e',
                  quantity: 100,
                  salesProductCategoryId: '052fef4a-9eda-42b4-b1a5-d093ae60271e',
                  weight: 100,
                },
                {
                  price: 20000,
                  productCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
                  quantity: 100,
                  salesProductCategoryId: 'a3aaa57b-345d-4a88-bf55-6896c88cb274',
                  weight: 100,
                },
              ]);
            });
          });
        });

        describe("and when manufacture's product input is ayam utuh", () => {
          describe("and when manufacture's products output are: karkas, kepala, ceker, and innards", () => {
            it('returns prices for karkas, kepala, ceker, and innards', async () => {
              const mockQueryRunner = createMock<QueryRunner>({
                manager: {
                  findAndCount: () => Promise.resolve([PRODUCT_CATEGORIES, 7]),
                },
              });

              const result = await dao.calculateCOGS(
                {
                  operationUnit: OPERATION_UNIT.LAPAK as SalesOperationUnit,
                  productManufactureInput: {
                    ...PRODUCTS.BRANKAS,
                    price: 30000,
                  } as SalesProductsInManufacture,
                  productManufactureOutput: [
                    PRODUCTS.CARCASS,
                    PRODUCTS.KEPALA,
                    PRODUCTS.CEKER,
                  ] as SalesManufactureProductCategoryBody[],
                  lbPriceInCity: 24500,
                },
                mockQueryRunner,
              );

              expect(result).toStrictEqual([
                {
                  price: 34285.71428571429,
                  productCategoryId: 'cb7648d2-c74f-4217-b995-aa9557647553',
                  quantity: 100,
                  salesProductCategoryId: 'cb7648d2-c74f-4217-b995-aa9557647553',
                  weight: 100,
                },
                {
                  price: 10000,
                  productCategoryId: 'f2d29232-5d4a-4b79-8e99-7518075f5aa9',
                  quantity: 100,
                  salesProductCategoryId: 'f2d29232-5d4a-4b79-8e99-7518075f5aa9',
                  weight: 100,
                },
                {
                  price: 10000,
                  productCategoryId: '052fef4a-9eda-42b4-b1a5-d093ae60271e',
                  quantity: 100,
                  salesProductCategoryId: '052fef4a-9eda-42b4-b1a5-d093ae60271e',
                  weight: 100,
                },
              ]);
            });
          });
        });
      });
    });
  });
});
