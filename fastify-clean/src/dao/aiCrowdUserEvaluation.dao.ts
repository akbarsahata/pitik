import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, QueryRunner, Repository } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { AiCrowdUserEvaluation } from '../datasources/entity/pgsql/AiCrowdUserEvaluation.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class AiCrowdUserEvaluationDAO extends BaseSQLDAO<AiCrowdUserEvaluation> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  protected repository: Repository<AiCrowdUserEvaluation>;

  @Initializer([PostgreSQLConnection])
  async init(): Promise<void> {
    this.repository = this.pSql.connection.getRepository(AiCrowdUserEvaluation);
  }

  async upsertOne(opts: {
    item: DeepPartial<AiCrowdUserEvaluation>;
    user: RequestUser;
    qr?: QueryRunner;
  }): Promise<AiCrowdUserEvaluation> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItem: DeepPartial<AiCrowdUserEvaluation> = {
      ...opts.item,
      userId: opts.user.id,
      createdAt: now,
      updatedAt: now,
    };

    await this.repository
      .createQueryBuilder(undefined, opts.qr)
      .insert()
      .into(AiCrowdUserEvaluation)
      .values(upsertItem)
      .orUpdate(['is_crowded', 'remarks', 'updated_date'], ['job_id', 'user_id'])
      .output(['job_id', 'user_id'])
      .execute();

    const job = await this.repository
      .createQueryBuilder(undefined, opts.qr)
      .select()
      .where('job_id = :jobId', { jobId: opts.item.jobId })
      .andWhere('user_id = :userId', { userId: opts.user.id })
      .getOneOrFail();

    return job;
  }
}
