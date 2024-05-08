/* eslint-disable class-methods-use-this */
import { Initializer, Inject, Service } from 'fastify-decorators';
import { EntityNotFoundError, FindManyOptions, QueryRunner, Repository } from 'typeorm';
import { randomHexString } from '../libs/utils/helpers';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { CoopImage } from '../datasources/entity/pgsql/CoopImage.entity';
import { Coop } from '../datasources/entity/pgsql/Coop.entity';
import { ERR_COOP_IMAGE_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';

@Service()
export class CoopImageDAO {
  @Inject(PostgreSQLConnection)
  private pSql!: PostgreSQLConnection;

  private repository!: Repository<CoopImage>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(CoopImage);
  }

  private async reuseOrCreateQueryRunner(qr?: QueryRunner): Promise<QueryRunner> {
    if (qr) return qr;

    const queryRunner = this.pSql.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    return queryRunner;
  }

  async getAll(params?: FindManyOptions<CoopImage>): Promise<[CoopImage[], number]> {
    return this.repository.findAndCount(params);
  }

  async removeOne(id: string): Promise<CoopImage> {
    try {
      const image = await this.repository.findOneOrFail({
        where: {
          id,
        },
      });

      await this.repository.delete({
        id,
      });

      return image;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_COOP_IMAGE_NOT_FOUND();
      }

      throw error;
    }
  }

  async upsertOneWithTx(
    data: Partial<CoopImage>,
    queryRunner: QueryRunner,
  ): Promise<Partial<CoopImage>> {
    const existing = await queryRunner.manager.findOne(CoopImage, {
      where: {
        id: data.id,
        coopId: data.coopId,
      },
    });

    try {
      if (data.id && existing) {
        await queryRunner.manager.update(
          CoopImage,
          {
            id: existing.id,
          },
          {
            filename: data.filename,
            sort: data.sort,
          },
        );

        return existing;
      }

      const coopImage = queryRunner.manager.create(CoopImage, {
        ...data,
        id: randomHexString(),
      });

      await queryRunner.manager.save(coopImage);

      return coopImage;
    } catch (error) {
      throw new Error(error);
    }
  }

  wrapUpsertHook(filename: string, sort: number, id?: string): Function {
    return (coop: Coop, queryRunner: QueryRunner) =>
      this.upsertOneWithTx(
        {
          id,
          filename,
          sort,
          coopId: coop.id,
        },
        queryRunner,
      );
  }

  async removeByIdWithTx(
    id: string,
    _?: RequestUser,
    prevQr?: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<Partial<CoopImage>> {
    const queryRunner = await this.reuseOrCreateQueryRunner(prevQr);

    try {
      const image = await queryRunner.manager.findOneOrFail(CoopImage, {
        where: {
          id,
        },
      });

      await queryRunner.manager.delete(CoopImage, {
        id,
      });

      const promises = transactionHooks?.map((trxHook) => trxHook(image, queryRunner));
      await Promise.all(promises || []);

      if (!prevQr) {
        await queryRunner.commitTransaction();
      }

      return image;
    } catch (error) {
      if (!prevQr) {
        await queryRunner.rollbackTransaction();
      }

      throw error;
    } finally {
      if (!prevQr) {
        await queryRunner.release();
      }
    }
  }

  async removeByCoopIdWithTx(coopId: string, qr: QueryRunner) {
    await qr.manager.delete(CoopImage, {
      coopId,
    });
  }
}
