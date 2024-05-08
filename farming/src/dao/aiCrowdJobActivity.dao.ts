import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, QueryRunner, Repository } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { AiCrowdJobActivity } from '../datasources/entity/pgsql/AiCrowdJobActivity.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { BaseSQLDAO } from './base.dao';

@Service()
export class AiCrowdJobActivityDAO extends BaseSQLDAO<AiCrowdJobActivity> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  protected repository: Repository<AiCrowdJobActivity>;

  @Initializer([PostgreSQLConnection])
  async init(): Promise<void> {
    this.repository = this.pSql.connection.getRepository(AiCrowdJobActivity);
  }

  async upsertOne(opts: {
    item: DeepPartial<AiCrowdJobActivity>;
    qr?: QueryRunner;
  }): Promise<AiCrowdJobActivity> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItem: DeepPartial<AiCrowdJobActivity> = {
      ...opts.item,
      id: opts.item.id || undefined,
      createdAt: now,
      updatedAt: now,
    };

    const upsertResult = await this.repository
      .createQueryBuilder(undefined, opts.qr)
      .insert()
      .into(AiCrowdJobActivity)
      .values(upsertItem)
      .orUpdate(['updated_at'], ['id'])
      .output('id')
      .execute();

    const identifier = upsertResult.identifiers.find((item: any) => item.id);

    if (!identifier) throw new Error('Upsert faied');

    const activty = await this.repository
      .createQueryBuilder(undefined, opts.qr)
      .select()
      .where('id = :id', { id: identifier.id })
      .getOneOrFail();

    return activty;
  }
}
