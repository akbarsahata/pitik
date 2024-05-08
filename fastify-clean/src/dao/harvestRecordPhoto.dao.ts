/* eslint-disable class-methods-use-this */
import { randomUUID } from 'crypto';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { HarvestRecordPhoto } from '../datasources/entity/pgsql/HarvestRecordPhoto.entity';
import { BaseSQLDAO } from './base.dao';
import { RequestUser } from '../libs/types/index.d';

@Service()
export class HarvestRecordPhotoDAO extends BaseSQLDAO<HarvestRecordPhoto> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(HarvestRecordPhoto);
  }

  async createManyWithTx(
    data: DeepPartial<HarvestRecordPhoto>[],
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<HarvestRecordPhoto[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const items = queryRunner.manager.create(
      HarvestRecordPhoto,
      data.map<DeepPartial<HarvestRecordPhoto>>((input) => ({
        ...input,
        id: randomUUID(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const result = await queryRunner.manager.save(HarvestRecordPhoto, items);

    return result;
  }

  async deleteMany(where: FindOptionsWhere<HarvestRecordPhoto>): Promise<HarvestRecordPhoto[]> {
    const toBeDeleted = await this.repository.find({ where });

    await this.repository.delete(where);

    return toBeDeleted;
  }
}
