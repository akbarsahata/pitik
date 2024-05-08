import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  DeepPartial,
  EntityNotFoundError,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  LessThan,
  Not,
  QueryRunner,
  Repository,
} from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { AutoNumbering } from '../datasources/entity/pgsql/AutoNumbering.entity';
import { Branch } from '../datasources/entity/pgsql/Branch.entity';
import { City } from '../datasources/entity/pgsql/City.entity';
import { Contract } from '../datasources/entity/pgsql/Contract.entity';
import { ContractType } from '../datasources/entity/pgsql/ContractType.entity';
import { Coop } from '../datasources/entity/pgsql/Coop.entity';
import { CoopMemberD } from '../datasources/entity/pgsql/CoopMemberD.entity';
import { CoopType } from '../datasources/entity/pgsql/CoopType.entity';
import { DailyPerformanceD } from '../datasources/entity/pgsql/DailyPerformanceD.entity';
import { District } from '../datasources/entity/pgsql/District.entity';
import { Farm } from '../datasources/entity/pgsql/Farm.entity';
import { FarmingCycle } from '../datasources/entity/pgsql/FarmingCycle.entity';
import { FarmingCycleAlertD } from '../datasources/entity/pgsql/FarmingCycleAlertD.entity';
import { FarmingCycleMemberD } from '../datasources/entity/pgsql/FarmingCycleMemberD.entity';
import { FarmingCycleTaskD } from '../datasources/entity/pgsql/FarmingCycleTaskD.entity';
import { FarmingCycleTaskTriggerD } from '../datasources/entity/pgsql/FarmingCycleTaskTriggerD.entity';
import { Province } from '../datasources/entity/pgsql/Province.entity';
import { User } from '../datasources/entity/pgsql/User.entity';
import { GetDailyPerformanceQuery } from '../dto/dailyPerformance.dto';
import { AlertJob, TaskTicketJob } from '../dto/farmingCycle.dto';
import { AUTO_NUMBERING_TRX_TYPE, DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_FARM_CYCLE_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { generateFarmingCycleCode, randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class FarmingCycleDAO extends BaseSQLDAO<FarmingCycle> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  protected repository!: Repository<FarmingCycle>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(FarmingCycle);
  }

  async getDailyPerformanceWithSummary(
    params: GetDailyPerformanceQuery,
  ): Promise<[FarmingCycle[], number]> {
    const limit = params.$limit && params.$limit > 0 ? params.$limit : 10;
    const skip = !params.$page || params.$page < 1 ? 0 : (params.$page - 1) * limit;

    const sql = this.repository
      .createQueryBuilder('fc')
      .innerJoinAndMapOne('fc.farm', Farm, 'farm', 'farm.id = fc.ref_farm_id')
      .innerJoinAndMapOne('fc.coop', Coop, 'coop', 'coop.id = fc.ref_coop_id')
      .leftJoinAndMapOne('fc.contract', Contract, 'contract', 'contract.id = fc.contract')
      .leftJoinAndMapOne(
        'contract.contractType',
        ContractType,
        'contractType',
        'contract.ref_contract_type_id = contractType.id',
      )
      .leftJoinAndMapOne('fc.userPpl', User, 'userPpl', 'userPpl.id = fc.ref_user_ppl_id')
      .offset(skip)
      .limit(limit)
      .orderBy('fc.farmingcycle_startdate', 'DESC');

    sql.where('fc.id IS NOT NULL');

    if (params.contractName) {
      if (params.contractName === 'N/A') {
        sql.andWhere(
          '(contractType.contract_name = :contractName OR fc.contract = :contractName OR fc.contract IS NULL)',
          {
            contractName: params.contractName,
          },
        );
      } else {
        sql.andWhere(
          '(contractType.contract_name = :contractName OR fc.contract = :contractName)',
          {
            contractName: params.contractName,
          },
        );
      }
    }

    if (params.pplId) {
      sql.leftJoinAndMapMany(
        'fc.farmingCycleMembers',
        FarmingCycleMemberD,
        'farmingCycleMembers',
        'farmingCycleMembers.ref_farmingcycle_id = fc.id',
      );
      sql.leftJoin(CoopMemberD, 'coopMember', 'coopMember.ref_coop_id = coop.id');
      sql.andWhere(
        '(farmingCycleMembers.ref_user_id = :pplId OR coopMember.ref_user_id = :pplId)',
        {
          pplId: params.pplId,
        },
      );
    }

    if (params.farmingCycleCode) {
      sql.andWhere('fc.farmingcycle_code = :farmingCycleCode', {
        farmingCycleCode: params.farmingCycleCode,
      });
    }

    if (params.farmingStatus) {
      sql.andWhere('fc.farming_status = :farmingStatus', {
        farmingStatus: params.farmingStatus,
      });
    }

    if (params.ownerId) {
      sql.andWhere('farm.ref_user_owner_id = :ownerId', {
        ownerId: params.ownerId,
      });
    }

    if (params.farmId) {
      sql.andWhere('fc.ref_farm_id = :farmId', {
        farmId: params.farmId,
      });
    }

    if (params.farmCategory) {
      sql.andWhere('farm.category = :farmCategory', {
        farmCategory: params.farmCategory,
      });
    }

    if (params.coopId) {
      sql.andWhere('fc.ref_coop_id = :coopId', {
        coopId: params.coopId,
      });
    }

    if (params.branchId) {
      sql.andWhere('farm.ref_branch_id = :branchId', {
        branchId: params.branchId,
      });
    }

    if (params.provinceId) {
      sql.andWhere('farm.ref_province_id = :provinceId', {
        provinceId: params.provinceId,
      });
    }

    if (params.cityId) {
      sql.andWhere('farm.ref_city_id = :cityId', {
        cityId: params.cityId,
      });
    }

    if (params.districtId) {
      sql.andWhere('farm.ref_district_id = :districtId', {
        districtId: params.districtId,
      });
    }

    if (params.summary) {
      sql.innerJoinAndMapMany(
        'fc.summary',
        (qb) =>
          qb
            .subQuery()
            .from(DailyPerformanceD, 'dp')
            .distinctOn(['dp.ref_farmingcycle_id'])
            .where('dp.summary is not null')
            .orderBy('dp.ref_farmingcycle_id', 'DESC')
            .addOrderBy('dp."day"', 'DESC'),
        'summary',
        'summary.ref_farmingcycle_id = fc.id',
      );
      sql.andWhere('summary.summary = :summary', {
        summary: params.summary,
      });
    }

    const [farmingCycles, count] = await sql.getManyAndCount();

    return [farmingCycles, count];
  }

  async getDailyPerformanceWithSummaryById(farmingCycleId: string): Promise<FarmingCycle> {
    const sql = this.repository
      .createQueryBuilder('fc')
      .leftJoinAndMapOne('fc.farm', Farm, 'farm', 'farm.id = fc.ref_farm_id')
      .leftJoinAndMapOne('farm.owner', User, 'owner', 'owner.id = farm.ref_user_owner_id')
      .leftJoinAndMapOne(
        'farm.province',
        Province,
        'province',
        'province.id = farm.ref_province_id',
      )
      .leftJoinAndMapOne('farm.city', City, 'city', 'city.id = farm.ref_city_id')
      .leftJoinAndMapOne(
        'farm.district',
        District,
        'district',
        'district.id = farm.ref_district_id',
      )
      .leftJoinAndMapOne('fc.coop', Coop, 'coop', 'coop.id = fc.ref_coop_id')
      .leftJoinAndMapOne('farm.branch', Branch, 'branch', 'branch.id = farm.ref_branch_id')
      .leftJoinAndMapOne(
        'coop.coopType',
        CoopType,
        'coopType',
        'coopType.id = coop.ref_cooptype_id',
      )
      .leftJoinAndMapMany(
        'coop.coopMembers',
        CoopMemberD,
        'members',
        'coop.id = members.ref_coop_id AND members.is_internal IS TRUE',
      )
      .leftJoinAndMapOne(
        'fc.userPpl',
        User,
        'userPpl',
        "userPpl.id = members.ref_user_id AND userPpl.user_type = 'ppl'",
      )
      .leftJoinAndMapMany(
        'fc.summary',
        DailyPerformanceD,
        'dp',
        // NOTE: Timezone?
        'dp.ref_farmingcycle_id = fc.id AND dp.day = current_date - fc.farmingcycle_startdate::date',
      )
      .where('fc.id = :farmingCycleId', { farmingCycleId })
      .orderBy('dp.day', 'DESC');

    const farmingCycle = await sql.getOneOrFail();

    return farmingCycle;
  }

  async getAll(params: FindManyOptions<FarmingCycle>): Promise<FarmingCycle[]> {
    return this.repository.find(params);
  }

  async getMany(params?: FindManyOptions<FarmingCycle>): Promise<[FarmingCycle[], number]> {
    const [entities, count] = await this.repository.findAndCount(params);

    return [entities, count];
  }

  async getOneStrict(params: FindOneOptions<FarmingCycle>): Promise<FarmingCycle> {
    try {
      return this.repository.findOneOrFail(params);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_FARM_CYCLE_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getOneById(id: string): Promise<FarmingCycle> {
    try {
      return this.repository.findOneOrFail({
        where: {
          id,
        },
        relations: {
          coop: {
            contract: true,
          },
        },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_FARM_CYCLE_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async createOneWithTx(
    data: Partial<FarmingCycle>,
    user: RequestUser,
    queryRunner: QueryRunner,
    _transactionHooks?: Function[],
    fromFMS: boolean = false,
  ): Promise<FarmingCycle> {
    const [farm, fcNumbering] = await Promise.all([
      queryRunner.manager.findOneOrFail(Farm, {
        select: {
          owner: {
            id: true,
            userCode: true,
          },
        },
        where: {
          id: data.farmId,
        },
        relations: {
          owner: true,
        },
        relationLoadStrategy: 'join',
      }),
      queryRunner.manager.findOneOrFail(AutoNumbering, {
        where: {
          transactionType: AUTO_NUMBERING_TRX_TYPE.FARMING_CYCLE,
        },
      }),
    ]);

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    let farmingCycle: Partial<FarmingCycle>;
    if (fromFMS) {
      farmingCycle = queryRunner.manager.create(FarmingCycle, {
        id: data.id ? data.id : randomHexString(),
        farmingCycleCode: generateFarmingCycleCode(
          fcNumbering.lastNumber,
          fcNumbering.digitCount,
          fcNumbering.prefix,
          farm.owner.userCode,
        ),
        farmId: data.farmId,
        coopId: data.coopId,
        farmingCycleStartDate: data.farmingCycleStartDate,
        initialPopulation: data.initialPopulation,
        chickTypeId: data.chickTypeId,
        feedBrandId: data.feedBrandId,
        chickSupplier: data.chickSupplier,
        hatchery: data.hatchery,
        cycleStatus: data.cycleStatus,
        farmingStatus: data.farmingStatus,
        remarks: data.remarks,
        contractId: data.contractId,
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
        docInBW: data.docInBW,
        docInUniformity: data.docInUniformity,
        pulletInWeeks: data.pulletInWeeks,
      });
    } else {
      farmingCycle = queryRunner.manager.create(FarmingCycle, {
        id: randomHexString(),
        farmingCycleCode: generateFarmingCycleCode(
          fcNumbering.lastNumber,
          fcNumbering.digitCount,
          fcNumbering.prefix,
          farm.owner.userCode,
        ),
        chickTypeId: data.chickTypeId,
        contractId: data.contractId,
        farmId: data.farmId,
        coopId: data.coopId,
        initialPopulation: data.initialPopulation,
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      });
    }

    const newFarmingCycle = await queryRunner.manager.save(FarmingCycle, farmingCycle);

    await queryRunner.manager.update(AutoNumbering, fcNumbering.id, {
      lastNumber: () => 'last_number + 1',
    });

    return newFarmingCycle;
  }

  async getPreviousSameCoopCycles(
    id: string,
    startDate: Date,
    coopId?: string,
  ): Promise<FarmingCycle[]> {
    const params: FindManyOptions<FarmingCycle> = {
      where: {
        coopId,
        id: Not(id),
        farmingCycleStartDate: LessThan(startDate),
      },
    };

    if (arguments.length < 3) {
      const farmingCycle = await this.getOneById(id);

      params.where = {
        id: Not(id),
        coopId: farmingCycle.coopId,
        farmingCycleStartDate: LessThan(startDate),
      };
    }

    return this.getAll({
      where: params.where,
      order: {
        farmingCycleStartDate: 'ASC',
      },
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async updateOneWithTx(
    params: FindOptionsWhere<FarmingCycle>,
    data: Partial<FarmingCycle>,
    user: Partial<RequestUser>,
    queryRunner: QueryRunner,
  ) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await queryRunner.manager.update(FarmingCycle, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    const updatedFarmingCycle = await queryRunner.manager.findOneOrFail(FarmingCycle, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updatedFarmingCycle;
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteOneWithTx(
    params: FindOptionsWhere<FarmingCycle>,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycle> {
    const toBeDeleted = await queryRunner.manager.findOneOrFail(FarmingCycle, { where: params });

    await queryRunner.manager.delete(FarmingCycle, {
      id: toBeDeleted.id,
    });

    return toBeDeleted;
  }

  async updateOne(
    params: FindOptionsWhere<FarmingCycle>,
    data: DeepPartial<FarmingCycle>,
    user: RequestUser,
  ): Promise<FarmingCycle> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const result = await this.repository.update(params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    if (!result.affected) {
      throw ERR_FARM_CYCLE_NOT_FOUND();
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

  async updateMany(
    params: FindOptionsWhere<FarmingCycle>,
    data: DeepPartial<FarmingCycle>,
    user: RequestUser,
  ): Promise<FarmingCycle[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const result = await this.repository.update(params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    if (!result.affected) {
      return [];
    }

    const updated = await this.repository.find({
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updated;
  }

  async getTaskTicketJobs(farmingCycleId?: string): Promise<TaskTicketJob[]> {
    let query = this.repository
      .createQueryBuilder('fc')
      .select([
        'fc.id as "farmingCycleId"',
        'fc.farmingcycle_startdate as "farmingCycleStartDate"',
        'fc.farming_status as "farmingCycleStatus"',
        'fct.id as "farmingCycleTaskId"',
        'fct.ref_task_id as "taskId"',
        'fct.task_code as "taskCode"',
        'fct.task_name as "taskName"',
        'fct.instruction as "instruction"',
        'fctt.id as "farmingCycleTaskTriggerId"',
        'fctt.day as "triggerDay"',
        'fctt.trigger_time as "triggerTime"',
        'fctt.deadline as "triggerDeadline"',
        'fc.farmingcycle_startdate + fctt.day as "triggerDate"',
        'fc.farmingcycle_startdate + fctt.day + fctt.trigger_time as "reportedDate"',
        'f.id as "farmId"',
        'f.farm_name as "farmName"',
        'c.id as "coopId"',
        'c.coop_name as "coopName"',
        'u.id as "farmOwnerId"',
        'u.user_code as "farmOwnerCode"',
      ])
      .innerJoin(Farm, 'f', 'f.id = fc.ref_farm_id')
      .innerJoin(Coop, 'c', 'c.id = fc.ref_coop_id')
      .innerJoin(User, 'u', 'u.id = f.ref_user_owner_id')
      .innerJoin(FarmingCycleTaskD, 'fct', 'fct.ref_farmingcycle_id = fc.id')
      .innerJoin(FarmingCycleTaskTriggerD, 'fctt', 'fctt.ref_farmingcycletask_id = fct.id')
      .where('fc.cycle_status = true')
      .andWhere("fc.farming_status = '2'")
      .andWhere('fct.status = 1');

    if (!farmingCycleId) {
      query = query.andWhere(
        "fc.farmingcycle_startdate + fctt.day + fctt.trigger_time between (now() + interval '7 hours') - interval '1 day' and (now() + interval '7 hours')",
      );
    } else {
      query = query
        .andWhere(`fc.id = '${farmingCycleId}'`)
        .andWhere(
          "fc.farmingcycle_startdate + fctt.day + fctt.trigger_time <= (now() + interval '7 hours')",
        );
    }

    const jobs = await query.getRawMany();

    return jobs;
  }

  async getAlertJobs(): Promise<AlertJob[]> {
    const jobs = await this.repository
      .createQueryBuilder('fc')
      .select([
        'fc.id as "farmingCycleId"',
        'fc.farmingcycle_startdate as "farmingCycleStartDate"',
        'fc.ref_chicktype_id as "chickTypeId"',
        'fca.id as "farmingCycleAlertId"',
        'fca.ref_alert_id as "alertId"',
        'fca.alert_code as "alertCode"',
        'fca.alert_name as "alertName"',
        'fca.alert_description as "alertDescription"',
        'f.farm_name as "farmName"',
        'f.ref_user_owner_id as "farmOwnerId"',
        'c.coop_name as "coopName"',
        'c.ref_cooptype_id as "coopTypeId"',
      ])
      .innerJoin(Farm, 'f', 'f.id = fc.ref_farm_id')
      .innerJoin(Coop, 'c', 'c.id = fc.ref_coop_id')
      .innerJoin(FarmingCycleAlertD, 'fca', 'fca.ref_farmingcycle_id = fc.id')
      .where('fc.cycle_status = true')
      .andWhere("fc.farming_status = '2'")
      .getRawMany();

    return jobs;
  }
}
