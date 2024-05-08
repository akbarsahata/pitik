import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  QueryRunner,
} from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { FarmingCycleMemberD } from '../datasources/entity/pgsql/FarmingCycleMemberD.entity';
import { User } from '../datasources/entity/pgsql/User.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

// eslint-disable-next-line no-unused-vars
type KeyFormatFunc = (item: FarmingCycleMemberD) => string;

@Service()
export class FarmingCycleMemberDDAO extends BaseSQLDAO<FarmingCycleMemberD> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(FarmingCycleMemberD);
  }

  async getOne(params: FindOneOptions<FarmingCycleMemberD>): Promise<FarmingCycleMemberD | null> {
    return this.repository.findOne(params);
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: DeepPartial<FarmingCycleMemberD>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycleMemberD> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const item = queryRunner.manager.create(FarmingCycleMemberD, {
      ...data,
      id: data.id ? data.id : randomHexString(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const newMemberD = await queryRunner.manager.save(FarmingCycleMemberD, item);

    return newMemberD;
  }

  // eslint-disable-next-line class-methods-use-this
  async createManyWithTx(
    data: DeepPartial<FarmingCycleMemberD>[],
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycleMemberD[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const items = queryRunner.manager.create(
      FarmingCycleMemberD,
      data.map<DeepPartial<FarmingCycleMemberD>>((input) => ({
        ...input,
        id: input.id ? input.id : randomHexString(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const result = await queryRunner.manager.save(FarmingCycleMemberD, items);

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteWithTx(farmingCycleId: string, queryRunner: QueryRunner, memberId?: string) {
    const criteria: FindOptionsWhere<FarmingCycleMemberD> = {
      farmingCycleId,
    };
    if (memberId) {
      criteria.userId = memberId;
    }
    const results = await queryRunner.manager.delete(FarmingCycleMemberD, criteria);
    return results;
  }

  async getMappedManyByKey(
    filter: FindManyOptions<FarmingCycleMemberD>,
    keyFormat: KeyFormatFunc,
  ): Promise<Map<string, FarmingCycleMemberD[]>> {
    const items = await this.repository.find(filter);

    return items.reduce((prev, item) => {
      const values = prev.get(keyFormat(item)) || [];

      values.push(item);
      prev.set(keyFormat(item), values);

      return prev;
    }, new Map<string, FarmingCycleMemberD[]>());
  }

  async assignUsersToFarmingCycle(
    users: User[],
    farmingCycleId: string,
    ownerId: string,
  ): Promise<FarmingCycleMemberD[]> {
    const membersMap: { [key: string]: FarmingCycleMemberD } = {};

    const existingMembers = await this.repository.find({
      where: {
        farmingCycleId,
        userId: In(users.map((u) => u.id)),
      },
    });

    existingMembers.forEach((em) => {
      if (em) {
        membersMap[em.userId] = em;
      }
    });

    const userNewMember = users.filter((u) => !Reflect.has(membersMap, u.id));

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const newMembers = userNewMember.map((unm) =>
      this.repository.create({
        id: randomHexString(),
        userId: unm.id,
        isLeader: unm.userType === 'poultry leader',
        createdBy: ownerId,
        createdDate: now,
        modifiedBy: ownerId,
        modifiedDate: now,
        farmingCycleId,
      }),
    );

    await this.repository.save(newMembers);

    return [...Object.values(membersMap), ...newMembers];
  }

  // eslint-disable-next-line class-methods-use-this
  async upsertOneWithTx(
    params: FindOptionsWhere<FarmingCycleMemberD>,
    data: DeepPartial<FarmingCycleMemberD>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycleMemberD> {
    const userMember = await queryRunner.manager.findOne(FarmingCycleMemberD, {
      where: {
        ...params,
      },
    });

    if (!userMember) {
      const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

      const newUserMember = queryRunner.manager.create(FarmingCycleMemberD, {
        ...data,
        id: data.id || randomHexString(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      });

      const result = await queryRunner.manager.save(FarmingCycleMemberD, newUserMember);

      return result;
    }

    return userMember;
  }
}
