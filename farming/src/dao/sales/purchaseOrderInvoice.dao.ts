/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOneOptions, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { PurchaseOrderInvoice } from '../../datasources/entity/pgsql/sales/PurchaseOrderInvoice.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_SALES_PURCHASE_ORDER_INVOICE_NOT_FOUND } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class PurchaseOrderInvoiceDAO extends BaseSQLDAO<PurchaseOrderInvoice> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(PurchaseOrderInvoice);
  }

  async getOneStrict(params: FindOneOptions<PurchaseOrderInvoice>): Promise<PurchaseOrderInvoice> {
    try {
      const invoice = await this.repository.findOneOrFail(params);

      return invoice;
    } catch (error) {
      throw ERR_SALES_PURCHASE_ORDER_INVOICE_NOT_FOUND();
    }
  }

  async createOneWithTx(
    data: Partial<PurchaseOrderInvoice>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<PurchaseOrderInvoice> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const item = queryRunner.manager.create(PurchaseOrderInvoice, {
      ...data,
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const invoice = await queryRunner.manager.save(PurchaseOrderInvoice, item);

    return invoice;
  }

  async upsertOne(
    user: RequestUser,
    item: DeepPartial<PurchaseOrderInvoice>,
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<PurchaseOrderInvoice> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItem: DeepPartial<PurchaseOrderInvoice> = {
      ...item,
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    };

    const result = await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .insert()
      .into(PurchaseOrderInvoice)
      .values(upsertItem)
      .orUpdate(
        ['status', 'date', 'ref_sales_purchase_order_id', 'modified_by', 'modified_date'],
        ['id'],
      )
      .returning(['id'])
      .execute();

    return this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('id = :id', { id: result.identifiers[0].id })
      .getOneOrFail();
  }
}
