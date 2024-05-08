import { randomUUID } from 'crypto';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { B2BSmartScaleWeighingData } from '../../datasources/entity/pgsql/b2b/B2BSmartScaleWeighingData.entity';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { RequestUser } from '../../libs/types/index.d';
import { BaseSQLDAO } from '../base.dao';

@Service()
export class B2BSmartScaleWeighingDataDAO extends BaseSQLDAO<B2BSmartScaleWeighingData> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  async init(): Promise<void> {
    this.repository = this.pSql.connection.getRepository(B2BSmartScaleWeighingData);
  }

  async createManyWithTx(
    data: DeepPartial<B2BSmartScaleWeighingData>[],
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<B2BSmartScaleWeighingData[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const record = queryRunner.manager.create(
      B2BSmartScaleWeighingData,
      data.map((d) => ({
        ...d,
        id: randomUUID(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const createdB2BDataInSmartScaleWeighings = await this.repository.save(record);

    return createdB2BDataInSmartScaleWeighings;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteManyWithTx(
    where: FindOptionsWhere<B2BSmartScaleWeighingData>,
    queryRunner: QueryRunner,
  ): Promise<B2BSmartScaleWeighingData[]> {
    const toBeDeleted = await queryRunner.manager.find(B2BSmartScaleWeighingData, { where });

    await queryRunner.manager.delete(B2BSmartScaleWeighingData, where);

    return toBeDeleted;
  }
}
