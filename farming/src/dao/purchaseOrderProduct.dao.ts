import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { PurchaseOrderProduct } from '../datasources/entity/pgsql/PurchaseOrderProduct.entity';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class PurchaseOrderProductDAO extends BaseSQLDAO<PurchaseOrderProduct> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(PurchaseOrderProduct);
  }

  // eslint-disable-next-line class-methods-use-this
  async createManyWithTx(
    inputs: Partial<PurchaseOrderProduct>[],
    _: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<PurchaseOrderProduct[]> {
    const items = queryRunner.manager.create(
      PurchaseOrderProduct,
      inputs.map<Partial<PurchaseOrderProduct>>((input) => ({
        ...input,
        id: randomHexString(),
      })),
    );

    const results = await queryRunner.manager.save(PurchaseOrderProduct, items);

    return results;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteManyWithTx(
    where: FindOptionsWhere<PurchaseOrderProduct>,
    queryRunner: QueryRunner,
  ): Promise<PurchaseOrderProduct[]> {
    const toBeDeleted = await queryRunner.manager.find(PurchaseOrderProduct, { where });

    await queryRunner.manager.delete(PurchaseOrderProduct, where);

    return toBeDeleted;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateManyWithTx(
    params: FindOptionsWhere<PurchaseOrderProduct>,
    data: DeepPartial<PurchaseOrderProduct>,
    _: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[] | undefined,
  ): Promise<PurchaseOrderProduct[]> {
    await queryRunner.manager.update(PurchaseOrderProduct, params, {
      ...data,
    });

    const updatedPRs = await queryRunner.manager.find(PurchaseOrderProduct, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    await transactionHooks?.reduce(async (prev, trxHook) => {
      await prev;

      return trxHook(updatedPRs, queryRunner);
    }, Promise.resolve());

    return updatedPRs;
  }
}
