import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, QueryRunner, Repository } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { AiSmartAudioJob } from '../datasources/entity/pgsql/AiSmartAudioJob.entity';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class AiSmartAudioJobDAO extends BaseSQLDAO<AiSmartAudioJob> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  protected repository: Repository<AiSmartAudioJob>;

  @Initializer([PostgreSQLConnection])
  async init(): Promise<void> {
    this.repository = this.pSql.connection.getRepository(AiSmartAudioJob);
  }

  async upsertOne(opts: {
    item: DeepPartial<AiSmartAudioJob>;
    user?: RequestUser;
    qr?: QueryRunner;
  }): Promise<AiSmartAudioJob> {
    const currentVal =
      (opts.item.id &&
        (await this.repository
          .createQueryBuilder(undefined, opts.qr)
          .select()
          .where('id = :id', { id: opts.item.id })
          .getOne())) ||
      {};

    const upsertItem: DeepPartial<AiSmartAudioJob> = {
      ...currentVal,
      ...opts.item,
      id: opts.item.id || undefined,
    };

    const sql = this.repository
      .createQueryBuilder(undefined, opts.qr)
      .insert()
      .into(AiSmartAudioJob)
      .values(upsertItem)
      .orUpdate(['updated_at', 'upload_state'], ['id'])
      .output('id');

    const upsertResult = await sql.execute();

    const identifier = upsertResult.identifiers.find((item: any) => item.id);

    if (!identifier) throw new Error('Upsert faied');

    const job = await this.repository
      .createQueryBuilder(undefined, opts.qr)
      .select()
      .where('id = :id', { id: identifier.id })
      .getOneOrFail();

    return job;
  }
}
