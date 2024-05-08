/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { AlertPreset } from '../datasources/entity/pgsql/AlertPreset.entity';
import { AlertPresetD } from '../datasources/entity/pgsql/AlertPresetD.entity';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { CoopMemberD } from '../datasources/entity/pgsql/CoopMemberD.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';
import { RequestUser } from '../libs/types/index.d';

@Service()
export class AlertPresetDDAO extends BaseSQLDAO<AlertPresetD> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(AlertPresetD);
  }

  async createManyWithTx(
    data: DeepPartial<AlertPresetD>[],
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<AlertPresetD[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const items = queryRunner.manager.create(
      AlertPresetD,
      data.map<DeepPartial<AlertPresetD>>((input) => ({
        ...input,
        id: randomHexString(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const result = await queryRunner.manager.save(AlertPresetD, items);

    transactionHooks?.reduce(async (prev, trxHook) => {
      await prev;

      return trxHook(items, queryRunner);
    }, Promise.resolve());

    return result;
  }

  async upsertOneWithTx(
    data: Partial<AlertPresetD>,
    userId: string,
    queryRunner: QueryRunner,
  ): Promise<Partial<CoopMemberD>> {
    const existing = await queryRunner.manager.findOne(AlertPresetD, {
      where: {
        alertPresetId: data.alertPresetId,
        alertId: data.alertId,
      },
    });

    if (existing) {
      return existing;
    }

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const coopMember = queryRunner.manager.create(AlertPresetD, {
      ...data,
      id: randomHexString(),
      createdBy: userId,
      createdDate: now,
      modifiedBy: userId,
      modifiedDate: now,
    });

    await queryRunner.manager.save(coopMember);

    return coopMember;
  }

  wrapUpsertHook(alertId: string, userId: string): Function {
    return async (alertPreset: AlertPreset, queryRunner: QueryRunner) =>
      this.upsertOneWithTx(
        {
          alertPresetId: alertPreset.id,
          alertId,
        },
        userId,
        queryRunner,
      );
  }

  async deleteWithTx(params: FindOptionsWhere<AlertPresetD>, queryRunner: QueryRunner) {
    const results = await queryRunner.manager.delete(AlertPresetD, params);
    return results;
  }

  wrapDeleteHook() {
    return (alertPreset: AlertPreset, queryRunner: QueryRunner) =>
      this.deleteWithTx(alertPreset, queryRunner);
  }
}
