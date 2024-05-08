import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, EntityNotFoundError, FindOneOptions, QueryRunner, Repository } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { AiCrowdManualChecking } from '../datasources/entity/pgsql/AiCrowdManualChecking.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_CROWD_MANUAL_CHECKING_NOT_FOUND } from '../libs/constants/errors';
import { BaseSQLDAO } from './base.dao';

@Service()
export class AiCrowdManualCheckingDAO extends BaseSQLDAO<AiCrowdManualChecking> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  protected repository: Repository<AiCrowdManualChecking>;

  @Initializer([PostgreSQLConnection])
  async init(): Promise<void> {
    this.repository = this.pSql.connection.getRepository(AiCrowdManualChecking);
  }

  async upsertOne(opts: {
    item: DeepPartial<AiCrowdManualChecking>;
    qr?: QueryRunner;
  }): Promise<AiCrowdManualChecking> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItem: DeepPartial<AiCrowdManualChecking> = {
      ...opts.item,
      createdAt: now,
      updatedAt: now,
    };

    const sql = this.repository
      .createQueryBuilder(undefined, opts.qr)
      .insert()
      .into(AiCrowdManualChecking)
      .values(upsertItem)
      .orUpdate(['updated_at', 'ppl_checked_by', 'ppl_actual_probability', 'ppl_remarks'], ['id'])
      .output('id');
    const upsertResult = await sql.execute();

    const identifier = upsertResult.identifiers.find((item: any) => item.id);

    if (!identifier) throw new Error('Upsert faied');

    const item = await this.repository
      .createQueryBuilder(undefined, opts.qr)
      .select()
      .where('id = :id', { id: identifier.id })
      .getOneOrFail();

    return item;
  }

  async getOneStrict(
    params: FindOneOptions<AiCrowdManualChecking>,
  ): Promise<AiCrowdManualChecking> {
    try {
      const coop = await this.repository.findOneOrFail(params);

      return coop;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_CROWD_MANUAL_CHECKING_NOT_FOUND(error.message);
      }

      throw error;
    }
  }
}
