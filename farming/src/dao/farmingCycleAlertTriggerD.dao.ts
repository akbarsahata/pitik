import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, QueryRunner } from 'typeorm';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { FarmingCycleAlertTriggerD } from '../datasources/entity/pgsql/FarmingCycleAlertTriggerD.entity';
import { BaseSQLDAO } from './base.dao';

@Service()
export class FarmingCycleAlertTriggerDDAO extends BaseSQLDAO<FarmingCycleAlertTriggerD> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(FarmingCycleAlertTriggerD);
  }

  // eslint-disable-next-line class-methods-use-this
  async createManyWithTx(
    data: DeepPartial<FarmingCycleAlertTriggerD>[],
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycleAlertTriggerD[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const items = queryRunner.manager.create(
      FarmingCycleAlertTriggerD,
      data.map<DeepPartial<FarmingCycleAlertTriggerD>>((input) => ({
        ...input,
        id: input.id ? input.id : randomHexString(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const result = await queryRunner.manager.save(FarmingCycleAlertTriggerD, items);

    return result;
  }
}
