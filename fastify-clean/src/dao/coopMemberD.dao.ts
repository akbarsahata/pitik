/* eslint-disable class-methods-use-this */
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { EntityNotFoundError, FindManyOptions, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Coop } from '../datasources/entity/pgsql/Coop.entity';
import { CoopMemberD } from '../datasources/entity/pgsql/CoopMemberD.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_COOP_MEMBER_NOT_FOUND } from '../libs/constants/errors';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

// eslint-disable-next-line no-unused-vars
type KeyFormatFunc = (item: CoopMemberD) => string;

@Service()
export class CoopMemberDDAO extends BaseSQLDAO<CoopMemberD> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(CoopMemberD);
  }

  async getOneById(id: string): Promise<CoopMemberD> {
    try {
      const coopMember = await this.repository.findOneOrFail({
        where: {
          id,
        },
      });

      return coopMember;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_COOP_MEMBER_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async upsertOne(data: Partial<CoopMemberD>, userId: string): Promise<CoopMemberD> {
    const existing = await this.repository.findOne({
      where: {
        coopId: data.coopId,
        userId: data.userId,
      },
    });

    if (existing) {
      if (existing.isLeader !== data.isLeader) {
        await this.repository.update(
          {
            id: existing.id,
          },
          {
            isLeader: data.isLeader,
            modifiedBy: userId,
            modifiedDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
          },
        );

        return existing;
      }
    }

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const coopMember = this.repository.create({
      ...data,
      id: randomHexString(),
      createdBy: userId,
      createdDate: now,
      modifiedBy: userId,
      modifiedDate: now,
    });

    await this.repository.save(coopMember);

    return coopMember;
  }

  async upsertOneWithTx(
    data: Partial<CoopMemberD>,
    userId: string,
    queryRunner: QueryRunner,
  ): Promise<Partial<CoopMemberD>> {
    const existing = await queryRunner.manager.findOne(CoopMemberD, {
      where: {
        coopId: data.coopId,
        userId: data.userId,
      },
    });

    if (existing) {
      if (existing.isLeader !== data.isLeader) {
        await queryRunner.manager.update(
          CoopMemberD,
          {
            id: existing.id,
          },
          {
            isLeader: data.isLeader,
            modifiedBy: userId,
            modifiedDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
          },
        );

        return existing;
      }
    }

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const coopMember = queryRunner.manager.create(CoopMemberD, {
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

  wrapUpsertHook(
    memberId: string,
    isLeader: boolean,
    userId: string,
    additional?: Partial<CoopMemberD>,
  ): Function {
    return (coop: Coop, queryRunner: QueryRunner) =>
      this.upsertOneWithTx(
        {
          coopId: coop.id,
          userId: memberId,
          isLeader,
          ...additional,
        },
        userId,
        queryRunner,
      );
  }

  async deleteWithTx(coopId: string, queryRunner: QueryRunner, memberId?: string) {
    const criteria: FindOptionsWhere<CoopMemberD> = {
      coopId,
    };
    if (memberId) {
      criteria.userId = memberId;
    }
    const results = await queryRunner.manager.delete(CoopMemberD, criteria);
    return results;
  }

  wrapDeleteHook(memberId?: string) {
    return (coop: Coop, queryRunner: QueryRunner) =>
      this.deleteWithTx(coop.id, queryRunner, memberId);
  }

  async getMappedManyByKey(
    filter: FindManyOptions<CoopMemberD>,
    keyFormat: KeyFormatFunc,
  ): Promise<Map<string, CoopMemberD[]>> {
    const items = await this.repository.find(filter);

    return items.reduce((prev, item) => {
      const values = prev.get(keyFormat(item)) || [];

      values.push(item);
      prev.set(keyFormat(item), values);

      return prev;
    }, new Map<string, CoopMemberD[]>());
  }
}
