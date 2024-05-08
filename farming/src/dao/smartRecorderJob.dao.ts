import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, QueryRunner, Repository } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { SmartRecorderJob } from '../datasources/entity/pgsql/SmartRecorderJob.entity';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class SmartRecorderJobDAO extends BaseSQLDAO<SmartRecorderJob> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  protected repository: Repository<SmartRecorderJob>;

  @Initializer([PostgreSQLConnection])
  async init(): Promise<void> {
    this.repository = this.pSql.connection.getRepository(SmartRecorderJob);
  }

  async upsertOne(opts: {
    item: DeepPartial<SmartRecorderJob>;
    user?: RequestUser;
    qr?: QueryRunner;
  }): Promise<SmartRecorderJob> {
    const now = new Date();
    const currentVal =
      (opts.item.id &&
        (await this.repository
          .createQueryBuilder(undefined, opts.qr)
          .select()
          .where('id = :id', { id: opts.item.id })
          .getOne())) ||
      {};

    const upsertItem: DeepPartial<SmartRecorderJob> = {
      createdAt: now,
      ...currentVal,
      ...opts.item,
      id: opts.item.id || undefined,
      requestedBy: opts.user?.id,
      updatedAt: now,
    };

    const sql = this.repository
      .createQueryBuilder(undefined, opts.qr)
      .insert()
      .into(SmartRecorderJob)
      .values(upsertItem)
      .orUpdate(['updated_at', 'upload_state'], ['id'])
      .output('id');

    const upsertResult = await sql.execute();

    const identifier = upsertResult.identifiers.find((item: any) => item.id);

    if (!identifier) throw new Error('Upsert failed');

    const job = await this.repository
      .createQueryBuilder(undefined, opts.qr)
      .select()
      .where('id = :id', { id: identifier.id })
      .getOneOrFail();

    return job;
  }
}
