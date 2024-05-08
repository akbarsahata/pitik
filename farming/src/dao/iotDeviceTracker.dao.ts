import { randomUUID } from 'crypto';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { IotDeviceTracker } from '../datasources/entity/pgsql/IotDeviceTracker.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_IOT_DEVICE_TRACKER_INSERT_FAILED } from '../libs/constants/errors';
import { BaseSQLDAO } from './base.dao';

@Service()
export class IotDeviceTrackerDAO extends BaseSQLDAO<IotDeviceTracker> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(IotDeviceTracker);
  }

  async upsertMany(items: DeepPartial<IotDeviceTracker>[]): Promise<IotDeviceTracker[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upsertItems = items.map<DeepPartial<IotDeviceTracker>>((item) => ({
      ...item,
      id: item.id || randomUUID(),
      createdDate: now,
      modifiedDate: now,
    }));

    await this.repository
      .createQueryBuilder()
      .insert()
      .into(IotDeviceTracker)
      .values(upsertItems)
      .orUpdate(['last_online_time', 'back_online_time', 'modified_by', 'modified_date'], ['id'])
      .execute();

    const [results, count] = await this.repository
      .createQueryBuilder()
      .where('id IN (:...ids)', {
        ids: upsertItems.map((item) => item.id),
      })
      .getManyAndCount();

    if (count !== upsertItems.length) {
      throw ERR_IOT_DEVICE_TRACKER_INSERT_FAILED('result count not match');
    }

    return results;
  }
}
