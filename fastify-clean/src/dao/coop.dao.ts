import { addDays, format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  EntityNotFoundError,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
  Repository,
} from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Contract } from '../datasources/entity/pgsql/Contract.entity';
import { Coop } from '../datasources/entity/pgsql/Coop.entity';
import { CoopMemberD } from '../datasources/entity/pgsql/CoopMemberD.entity';
import { Farm } from '../datasources/entity/pgsql/Farm.entity';
import { FarmingCycle } from '../datasources/entity/pgsql/FarmingCycle.entity';
import { User } from '../datasources/entity/pgsql/User.entity';
import { GetAvailableCoopQuery } from '../dto/coop.dto';
import { DATE_SQL_FORMAT, DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_COOP_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class CoopDAO extends BaseSQLDAO<Coop> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  protected repository!: Repository<Coop>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(Coop);
  }

  async getOneById(id: string): Promise<Coop> {
    try {
      const coop = await this.repository.findOneOrFail({
        where: {
          id,
        },
      });

      return coop;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_COOP_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getOneStrict(params: FindOneOptions<Coop>, qr?: QueryRunner): Promise<Coop> {
    try {
      let query: Promise<Coop>;

      if (qr) {
        query = qr.manager.findOneOrFail(Coop, params);
      } else {
        query = this.repository.findOneOrFail(params);
      }

      const coop = await query;

      return coop;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_COOP_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getOne(params: FindOneOptions<Coop>): Promise<Coop | null> {
    return this.repository.findOne(params);
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: Partial<Coop>,
    userRequest: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<Coop> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const coop = queryRunner.manager.create(Coop, {
      ...data,
      id: randomHexString(),
      createdBy: userRequest.id,
      createdDate: now,
      modifiedBy: userRequest.id,
      modifiedDate: now,
    });

    const result = await queryRunner.manager.save(Coop, coop);

    const promises = transactionHooks?.map((trxHook) => trxHook(coop, queryRunner));
    await Promise.all(promises || []);

    await queryRunner.commitTransaction();

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<Coop>,
    data: Partial<Coop>,
    user: RequestUser,
    queryRunner: QueryRunner,
    transactionHooks?: Function[],
  ): Promise<Coop> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const updatedCoop = await queryRunner.manager.findOneOrFail(Coop, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    await queryRunner.manager.update(Coop, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const promises = transactionHooks?.map((trxHook) => trxHook(updatedCoop, queryRunner));
    await Promise.all(promises || []);

    return {
      ...updatedCoop,
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    };
  }

  async getAvailableCoop(params: GetAvailableCoopQuery): Promise<[Coop[], number]> {
    const limit = params.$limit && params.$limit > 0 ? params.$limit : 100;
    const skip = !params.$page || params.$page < 1 ? 0 : (params.$page - 1) * limit;

    const sql = this.repository
      .createQueryBuilder('c')
      .leftJoinAndMapOne('c.farm', Farm, 'farm', 'farm.id = c.ref_farm_id')
      .leftJoinAndMapOne(
        'c.activeFarmingCycle',
        FarmingCycle,
        'fc',
        'fc.id = c.active_farmingcycle_id',
      )
      .leftJoinAndMapOne('c.contract', Contract, 'contract', 'contract.id = c.ref_contract_id')
      .leftJoinAndMapMany(
        'c.coopMembers',
        CoopMemberD,
        'coopMembers',
        'coopMembers.ref_coop_id = c.id',
      )
      .leftJoinAndMapOne('coopMembers.user', User, 'user', 'user.id = coopMembers.ref_user_id')
      .offset(skip)
      .limit(limit)
      .orderBy('c.createdDate', 'DESC')
      .where(
        '(c.status = :status AND (c.active_farmingcycle_id IS NULL OR c.active_farmingcycle_id = :farmingCycleId)) OR (c.status = :status AND fc.farmingcycle_startdate >= :limitDate)',
        {
          farmingCycleId: '',
          status: 1,
          limitDate: format(addDays(new Date(), 35), DATE_SQL_FORMAT),
        },
      );

    const [coops, count] = await sql.getManyAndCount();

    return [coops, count];
  }

  async closeFarmingCycleWithTx(id: string, queryRunner: QueryRunner) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const farmingCycleCount = await this.repository
      .createQueryBuilder('coop', queryRunner)
      .innerJoin(FarmingCycle, 'fc', 'fc.ref_coop_id = coop.id')
      .select('fc.id')
      .where('coop.id = :id', { id })
      .getCount();

    await this.repository
      .createQueryBuilder(undefined, queryRunner)
      .update(Coop)
      .set({
        activeFarmingCycleId: null,
        chickInRequestId: null,
        chickInDate: null,
        purchaseRequestOvkId: null,
        lastClosedDate: format(now, DATE_SQL_FORMAT),
        totalPeriod: farmingCycleCount,
      })
      .where('id = :id', { id })
      .execute();
  }
}
