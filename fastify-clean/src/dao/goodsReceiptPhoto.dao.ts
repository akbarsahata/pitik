import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { GoodsReceiptPhoto } from '../datasources/entity/pgsql/GoodsReceiptPhoto.entity';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class GoodsReceiptPhotoDAO extends BaseSQLDAO<GoodsReceiptPhoto> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(GoodsReceiptPhoto);
  }

  // eslint-disable-next-line class-methods-use-this
  async createManyWithTx(
    data: DeepPartial<GoodsReceiptPhoto>[],
    _user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<GoodsReceiptPhoto[]> {
    const photos = data.map((d) =>
      queryRunner.manager.create(GoodsReceiptPhoto, {
        ...d,
        id: randomHexString(),
      }),
    );

    const createdPhotos = await queryRunner.manager.save(GoodsReceiptPhoto, photos);

    return createdPhotos;
  }
}
