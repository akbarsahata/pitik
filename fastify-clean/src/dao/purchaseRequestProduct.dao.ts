import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, In, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { PurchaseRequest } from '../datasources/entity/pgsql/PurchaseRequest.entity';
import { PurchaseRequestProduct } from '../datasources/entity/pgsql/PurchaseRequestProduct.entity';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class PurchaseRequestProductDAO extends BaseSQLDAO<PurchaseRequestProduct> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(PurchaseRequestProduct);
  }

  // eslint-disable-next-line class-methods-use-this
  async createManyWithTx(
    inputs: DeepPartial<PurchaseRequestProduct>[],
    _user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<PurchaseRequestProduct[]> {
    const items = queryRunner.manager.create(
      PurchaseRequestProduct,
      inputs.map<DeepPartial<PurchaseRequestProduct>>((input) => ({
        ...input,
        id: randomHexString(),
      })),
    );

    const result = await queryRunner.manager.save(PurchaseRequestProduct, items);

    transactionHooks?.reduce(async (prev, trxHook) => {
      await prev;

      return trxHook(items, queryRunner);
    }, Promise.resolve());

    return result;
  }

  wrapCreateManyHook(
    inputs: Partial<PurchaseRequestProduct>[],
    userRequest: RequestUser,
    transactionHooks?: Function[],
  ): Function {
    return (purchaseRequest: PurchaseRequest, queryRunner: QueryRunner) =>
      this.createManyWithTx(
        inputs.reduce<Partial<PurchaseRequestProduct>[]>((prev, current) => {
          prev.push({ ...current, purchaseRequestId: purchaseRequest.id });
          return prev;
        }, []),
        userRequest,
        queryRunner,
        transactionHooks,
      );
  }

  async deleteMany(
    where: FindOptionsWhere<PurchaseRequestProduct>,
  ): Promise<PurchaseRequestProduct[]> {
    const toBeDeleted = await this.repository.find({ where });

    await this.repository.delete(where);

    return toBeDeleted;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteManyWithTx(
    where: FindOptionsWhere<PurchaseRequestProduct>,
    queryRunner: QueryRunner,
  ): Promise<PurchaseRequestProduct[]> {
    const toBeDeleted = await queryRunner.manager.find(PurchaseRequestProduct, { where });

    await queryRunner.manager.delete(PurchaseRequestProduct, where);

    return toBeDeleted;
  }

  // eslint-disable-next-line class-methods-use-this
  async upsertManyWithTx(
    data: DeepPartial<PurchaseRequestProduct>[],
    params: FindOptionsWhere<PurchaseRequestProduct>,
    _user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<PurchaseRequestProduct[]> {
    const dataIds = data.map((d) => d.id);

    const oldData = await queryRunner.manager.find(PurchaseRequestProduct, {
      where: {
        purchaseRequestId: params.purchaseRequestId,
      },
    });

    const oldDataIds = oldData.map((d) => d.id);

    const deleteIds = oldDataIds.filter((id) => !dataIds.includes(id));

    await queryRunner.manager.delete(PurchaseRequestProduct, { id: In(deleteIds) });

    await Promise.all(
      data.map((datum) => {
        if (!datum.id) {
          const item = queryRunner.manager.create(PurchaseRequestProduct, {
            ...datum,
            id: randomHexString(),
            purchaseRequestId: String(params.purchaseRequestId),
          });

          return queryRunner.manager.save(PurchaseRequestProduct, item);
        }

        return queryRunner.manager.update(PurchaseRequestProduct, { id: datum.id }, datum);
      }),
    );

    const result = await this.repository.find({
      where: {
        purchaseRequestId: params.purchaseRequestId,
      },
    });

    return result;
  }
}
