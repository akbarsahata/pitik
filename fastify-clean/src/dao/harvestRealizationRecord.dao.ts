/* eslint-disable class-methods-use-this */
import { randomUUID } from 'crypto';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { HarvestRealizationRecord } from '../datasources/entity/pgsql/HarvestRealizationRecord.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class HarvestRealizationRecordDAO extends BaseSQLDAO<HarvestRealizationRecord> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(HarvestRealizationRecord);
  }

  async createManyWithTx(
    data: DeepPartial<HarvestRealizationRecord>[],
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<HarvestRealizationRecord[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const items = queryRunner.manager.create(
      HarvestRealizationRecord,
      data.map<DeepPartial<HarvestRealizationRecord>>((input) => ({
        ...input,
        id: input.id || randomUUID(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const result = await queryRunner.manager.save(HarvestRealizationRecord, items);

    return result;
  }

  async deleteManyWithTx(
    where: FindOptionsWhere<HarvestRealizationRecord>,
    queryRunner: QueryRunner,
  ): Promise<HarvestRealizationRecord[]> {
    const toBeDeleted = await queryRunner.manager.find(HarvestRealizationRecord, { where });

    await queryRunner.manager.delete(HarvestRealizationRecord, where);

    return toBeDeleted;
  }

  async deleteMany(
    where: FindOptionsWhere<HarvestRealizationRecord>,
  ): Promise<HarvestRealizationRecord[]> {
    const toBeDeleted = await this.repository.find({ where });

    await this.repository.delete(where);

    return toBeDeleted;
  }
}
