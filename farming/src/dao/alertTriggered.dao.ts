import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { FindOptionsWhere } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { AlertTriggered } from '../datasources/entity/pgsql/AlertTriggered.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_ALERT_TRIGGERED_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class AlertTriggeredDAO extends BaseSQLDAO<AlertTriggered> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(AlertTriggered);
  }

  async getSummary(
    farmingCycleId: string,
    skip = 0,
    limit = 5,
  ): Promise<[AlertTriggered[], number]> {
    return this.repository
      .createQueryBuilder('at')
      .leftJoinAndSelect(
        'at.farmingCycleAlert',
        'farmingCycleAlert',
        'at.ref_farmingcyclealert_id = farmingCycleAlert.id',
      )
      .where('at.ref_farmingcycle_id = :id', { id: farmingCycleId })
      .andWhere('at.dismissed = 0')
      .offset(skip)
      .limit(limit)
      .orderBy('at.created_date', 'DESC')
      .getManyAndCount();
  }

  async getDetail(id: string): Promise<AlertTriggered> {
    return this.repository
      .createQueryBuilder('at')
      .leftJoinAndSelect(
        'at.farmingCycleAlert',
        'farmingCycleAlert',
        'at.ref_farmingcyclealert_id = farmingCycleAlert.id',
      )
      .where('at.id = :id', { id })
      .getOneOrFail();
  }

  /**
   * check whether alert is dismissed alread
   * to prevent double creation
   * @param id alert triggered id
   * @returns true if dismissed, false otherwise
   */
  async isAlertDismissed(id: string): Promise<boolean> {
    const alert = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!alert) return false;

    if (alert.dismissed && alert.addToTask) return true;

    return false;
  }

  async createAlertTriggered(data: Partial<AlertTriggered>): Promise<AlertTriggered> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const newAlertTriggered = this.repository.create({
      ...data,
      id: randomHexString(),
      dismissed: false,
      addToTask: false,
      createdBy: 'System-Issue',
      createdDate: now,
      modifiedBy: 'System-Issue',
      modifiedDate: now,
    });

    await this.repository.save(newAlertTriggered);

    return newAlertTriggered;
  }

  async updateAlertTriggered(
    params: FindOptionsWhere<AlertTriggered>,
    data: Partial<AlertTriggered>,
    user: RequestUser,
  ) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const result = await this.repository.update(params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    if (!result.affected) {
      throw ERR_ALERT_TRIGGERED_NOT_FOUND();
    }

    const updated = await this.repository.findOneOrFail({
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updated;
  }
}
