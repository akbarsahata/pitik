/* eslint-disable class-methods-use-this */
import { randomUUID } from 'crypto';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOneOptions, FindOptionsWhere, QueryRunner, Repository } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { IotTicketing } from '../datasources/entity/pgsql/IotTicketing.entity';
import { IotTicketingDetails } from '../datasources/entity/pgsql/IotTicketingDetails.entity';
import {
  TicketingAssignBodyPayload,
  TicketingBoydPayload,
  TicketingDeviceStatus,
  TicketingQuery,
} from '../dto/iotTicketing.dto';
import { DEFAULT_TIME_ZONE, TICKETING_STATUS } from '../libs/constants';
import { DEVICE_SENSOR_ERRORS } from '../libs/constants/deviceSensor';
import { ERR_IOT_TICKET_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class IotTicketingDAO extends BaseSQLDAO<IotTicketing> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  protected repository: Repository<IotTicketing>;

  protected repositoryDetails: Repository<IotTicketingDetails>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(IotTicketing);

    this.repositoryDetails = this.pSql.connection.getRepository(IotTicketingDetails);
  }

  async getOneStrict(params: FindOneOptions<IotTicketing>): Promise<IotTicketing> {
    try {
      const ticket = await this.repository.findOneOrFail(params);

      return ticket;
    } catch (error) {
      throw ERR_IOT_TICKET_NOT_FOUND();
    }
  }

  async searchTicketing(filter: TicketingQuery): Promise<[IotTicketing[], number]> {
    const limit: number = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;

    const skip: number = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;

    const order = 'DESC';

    const qb = this.repository
      .createQueryBuilder('iotTicketing')
      .leftJoinAndSelect('iotTicketing.iotDevice', 'iotDevice')
      .leftJoinAndSelect('iotTicketing.userPIC', 'userPIC')
      .leftJoinAndSelect('iotTicketing.userModifier', 'userModifier')
      .leftJoinAndSelect('iotDevice.coop', 'coop')
      .leftJoinAndSelect('coop.farm', 'farm')
      .leftJoinAndSelect('farm.branch', 'branch')
      .leftJoinAndSelect('iotDevice.room', 'room')
      .leftJoinAndSelect('room.roomType', 'roomType')
      .leftJoinAndSelect('room.building', 'building')
      .leftJoinAndSelect('building.buildingType', 'buildingType')
      .where((q) => {
        if (filter.status) {
          q.andWhere('iotTicketing.status = :status', { status: filter.status });
        }
        if (filter.createdOn) {
          q.andWhere('iotTicketing.createdOn = :createdOn', {
            createdOn: new Date(filter.createdOn),
          });
        }
        if (filter.macAddress) {
          q.andWhere('iotDevice.mac = :macAddress', { macAddress: filter.macAddress });
        }
        if (filter.coopCode) {
          q.andWhere("coop.coopCode LIKE '%:coopCode%'", { coopCode: `%${filter.coopCode}%` });
        }
        if (filter.coopId) {
          q.andWhere('coop.id = :coopId', { coopId: filter.coopId });
        }
        if (filter.farmId) {
          q.andWhere('farm.id = :farmId', { farmId: filter.farmId });
        }
        if (filter.farmName) {
          q.andWhere('farm.farmName LIKE :farmName', { farmName: `%${filter.farmName}%` });
        }
        if (filter.branchId) {
          q.andWhere('branch.id = :branchId', { branchId: filter.branchId });
        }
        if (filter.branchName) {
          q.andWhere('branch.name = :branchName', { branchName: filter.branchName });
        }
        if (filter.branchId) {
          q.andWhere('branch.id = :branchId', { branchId: filter.branchId });
        }
        if (filter.incident) {
          const keySearch = filter.incident as string;

          const matchedErrors = DEVICE_SENSOR_ERRORS.filter((error) =>
            error.toLowerCase().includes(keySearch.toLowerCase()),
          );

          const errorCodes = matchedErrors.map((_error, index) => String(index + 1));

          q.andWhere('iotDevice.errorCode = ANY(:incident)', {
            incident: errorCodes,
          });
        }

        if (filter.picId) {
          q.andWhere('userPIC.id = :picId', { picId: filter.picId });
        }
        if (filter.pic) {
          q.andWhere('userPIC.fullName LIKE :pic', { pic: `%${filter.pic}%` });
        }
        if (filter.deviceId) {
          q.andWhere('iotDevice.deviceId LIKE :deviceId', { deviceId: `%${filter.deviceId}%` });
        }
      })
      .orderBy('iotTicketing.createdDate', order)
      .skip(skip)
      .take(limit);

    return qb.getManyAndCount();
  }

  async getCountDeviceByStatus(): Promise<TicketingDeviceStatus> {
    const [open, onMaintenance, resolved, others] = await Promise.all([
      this.repository.count({
        where: {
          status: TICKETING_STATUS.OPEN,
        },
      }),
      this.repository.count({
        where: {
          status: TICKETING_STATUS.ON_MAINTENANCE,
        },
      }),
      this.repository.count({
        where: {
          status: TICKETING_STATUS.RESOLVED,
        },
      }),
      this.repository.count({
        where: {
          status: TICKETING_STATUS.OTHERS,
        },
      }),
    ]);

    return {
      open,
      onMaintenance,
      resolved,
      others,
    };
  }

  async updateOneIotTicketing(
    input: TicketingBoydPayload,
    currentData: IotTicketing,
    params: FindOptionsWhere<IotTicketing>,
    user: RequestUser,
  ): Promise<IotTicketing> {
    const updated = await this.repository.update(params, {
      status: input.status,
      notes: input.notes,
      refUserId: !currentData.refUserId ? input.pic : undefined,
      modifiedBy: user.id,
      modifiedDate: new Date(),
    });

    if (!updated.affected) {
      throw new Error('Error update tickets');
    }

    return this.repository.findOneOrFail({
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });
  }

  async assignPIC(
    input: TicketingAssignBodyPayload,
    params: FindOptionsWhere<IotTicketing>,
    user: RequestUser,
  ): Promise<IotTicketing> {
    const result = await this.repository.update(params, {
      refUserId: input.pic,
      createdOn: new Date(),
      modifiedBy: user.id,
      modifiedDate: new Date(),
    });

    if (!result.affected) {
      throw new Error('Error update assign');
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

  async unAssignPIC(
    params: FindOptionsWhere<IotTicketing>,
    user: RequestUser,
  ): Promise<IotTicketing> {
    const result = await this.repository.update(params, {
      refUserId: user.id,
      createdOn: new Date(),
      modifiedBy: user.id,
      modifiedDate: new Date(),
    });

    if (!result.affected) {
      throw new Error('Error update assign');
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

  async createManyWithTx(
    data: DeepPartial<IotTicketing>[],
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<IotTicketing[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const items = queryRunner.manager.create(
      IotTicketing,
      data.map<DeepPartial<IotTicketing>>((input) => ({
        ...input,
        id: input.id || randomUUID(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const result = await queryRunner.manager.save(IotTicketing, items);

    return result;
  }

  async updateManyWithTx(
    params: FindOptionsWhere<IotTicketing>,
    data: DeepPartial<IotTicketing>,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<IotTicketing[]> {
    await queryRunner.manager.update(IotTicketing, params, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
    });

    const updatedIotTicketing = await queryRunner.manager.find(IotTicketing, {
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updatedIotTicketing;
  }
}
