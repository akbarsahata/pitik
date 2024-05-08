/* eslint-disable class-methods-use-this */
import { randomUUID } from 'crypto';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { HarvestEgg } from '../../datasources/entity/pgsql/layer/HarvestEgg.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class HarvestEggDAO extends BaseSQLDAO<HarvestEgg> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(HarvestEgg);
  }

  async upsertOne(
    user: RequestUser,
    item: DeepPartial<HarvestEgg>,
    opts?: {
      qr?: QueryRunner;
    },
  ): Promise<HarvestEgg> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItem: DeepPartial<HarvestEgg> = {
      ...item,
      id: item.id || randomUUID(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    };

    await this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .insert()
      .into(HarvestEgg)
      .values(upsertItem)
      .orUpdate(
        [
          'total_quantity',
          'total_weight',
          'is_abnormal',
          'modified_by',
          'modified_date',
          'disposal',
        ],
        ['farmingcycle_id', 'date'],
      )
      .returning(['id'])
      .execute();

    return this.repository
      .createQueryBuilder(undefined, opts && opts.qr)
      .where('farmingcycle_id = :farmingCycleId AND "date" = :date', {
        farmingCycleId: item.farmingCycleId,
        date: item.date,
      })
      .getOneOrFail();
  }
}
