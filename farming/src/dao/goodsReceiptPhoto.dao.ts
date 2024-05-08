import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, QueryRunner } from 'typeorm';
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

  async deleteOne(params: FindOptionsWhere<GoodsReceiptPhoto>): Promise<GoodsReceiptPhoto> {
    const toBeDeleted = await this.repository.findOneOrFail({ where: params });

    await this.repository.delete({
      id: toBeDeleted.id,
    });

    return toBeDeleted;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteOneWithTx(
    params: FindOptionsWhere<GoodsReceiptPhoto>,
    queryRunner: QueryRunner,
  ): Promise<GoodsReceiptPhoto> {
    const toBeDeleted = await queryRunner.manager.findOneOrFail(GoodsReceiptPhoto, {
      where: params,
    });

    await queryRunner.manager.delete(GoodsReceiptPhoto, {
      id: toBeDeleted.id,
    });

    return toBeDeleted;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteManyWithTx(
    where: FindOptionsWhere<GoodsReceiptPhoto>,
    queryRunner: QueryRunner,
  ): Promise<GoodsReceiptPhoto[]> {
    const toBeDeleted = await queryRunner.manager.find(GoodsReceiptPhoto, { where });

    await queryRunner.manager.delete(GoodsReceiptPhoto, where);

    return toBeDeleted;
  }
}
