import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, EntityNotFoundError, FindOneOptions, QueryRunner, Repository } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { SmartCameraJob } from '../datasources/entity/pgsql/SmartCameraJob.entity';
import { ERR_SMART_CAMERA_JOB_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class SmartCameraJobDAO extends BaseSQLDAO<SmartCameraJob> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  protected repository: Repository<SmartCameraJob>;

  @Initializer([PostgreSQLConnection])
  async init(): Promise<void> {
    this.repository = this.pSql.connection.getRepository(SmartCameraJob);
  }

  async upsertOne(opts: {
    item: DeepPartial<SmartCameraJob>;
    user?: RequestUser;
    qr?: QueryRunner;
  }): Promise<SmartCameraJob> {
    const now = new Date();
    const currentVal =
      (opts.item.id &&
        (await this.repository
          .createQueryBuilder(undefined, opts.qr)
          .select()
          .where('id = :id', { id: opts.item.id })
          .getOne())) ||
      {};

    const upsertItem: DeepPartial<SmartCameraJob> = {
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
      .into(SmartCameraJob)
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

  async getOneStrict(params: FindOneOptions<SmartCameraJob>): Promise<SmartCameraJob> {
    try {
      const job = await this.repository.findOneOrFail(params);

      return job;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_SMART_CAMERA_JOB_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getSensorAndSmartCameraRecordsCount(coopId: string, roomId?: string) {
    let query = await this.pSql.connection
      .getRepository(SmartCameraJob)
      .createQueryBuilder('ai_smart_camera_job')
      .select('ai_smart_camera_job.sensor_id as sensor_id, COUNT(id) as job_count')
      .where('ai_smart_camera_job.ref_coop_id = :coopId', { coopId });

    if (roomId) {
      query = query.andWhere('ai_smart_camera_job.floor_id = :roomId', { roomId });
    }

    query = query.groupBy('ai_smart_camera_job.sensor_id');

    const result = await query.getRawMany();

    return result.map((i) => ({
      sensorId: i.sensor_id,
      jobCount: i.job_count,
    }));
  }
}
