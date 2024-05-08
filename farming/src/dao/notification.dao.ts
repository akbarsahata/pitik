import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  EntityNotFoundError,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Notification } from '../datasources/entity/pgsql/Notification.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_NOTIF_NOT_FOUND } from '../libs/constants/errors';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export default class NotificationDAO extends BaseSQLDAO<Notification> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  protected repository: Repository<Notification>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(Notification);
  }

  async count(params: FindManyOptions<Notification>): Promise<number> {
    const num = await this.repository.count(params);

    return num;
  }

  async getManyWithoutCount(params: FindManyOptions<Notification>): Promise<Notification[]> {
    const data = await this.repository.find(params);

    return data;
  }

  async getOne(params: FindOneOptions<Notification>): Promise<Notification> {
    try {
      const notification = await this.repository.findOneOrFail(params);

      return notification;
    } catch (error) {
      throw ERR_NOTIF_NOT_FOUND();
    }
  }

  async updateMany(
    params: FindOptionsWhere<Notification>,
    data: Partial<Notification>,
  ): Promise<Notification[]> {
    const notifications = await this.repository.find({ where: params });

    if (notifications.length) {
      const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

      await this.repository.update(
        notifications.map((n) => n.id),
        {
          ...data,
          modifiedDate: now,
        },
      );
    }

    return notifications.map((n) => ({
      ...n,
      ...data,
    }));
  }

  async updateOne(
    params: FindOptionsWhere<Notification>,
    data: Partial<Notification>,
  ): Promise<Notification> {
    try {
      const notification = await this.repository.findOneOrFail({ where: params });

      const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

      await this.repository.update(params, {
        ...data,
        modifiedDate: now,
      });

      return {
        ...notification,
        ...data,
      };
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_NOTIF_NOT_FOUND();
      }

      throw error;
    }
  }

  async createOne(data: Partial<Notification>): Promise<Notification> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const notification = this.repository.create({
      ...data,
      id: randomHexString(),
      isRead: false,
      createdDate: now,
      modifiedDate: now,
    });

    return this.repository.save(notification);
  }

  async createMany(data: Partial<Notification>[]): Promise<Notification[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const entities = this.repository.create(
      data.map<Partial<Notification>>((d) => ({
        ...d,
        id: randomHexString(),
        isRead: false,
        createdDate: now,
        modifiedDate: now,
      })),
    );

    const createdEntities = await this.repository.save(entities);

    return createdEntities;
  }
}
