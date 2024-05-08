import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import {
  EntityNotFoundError,
  FindOptionsWhere,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Notification } from '../datasources/entity/pgsql/Notification.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_NOTIF_NOT_FOUND } from '../libs/constants/errors';
import { randomHexString } from '../libs/utils/helpers';

@Service()
export default class NotificationDAO {
  @Inject(PostgreSQLConnection)
  private pSql!: PostgreSQLConnection;

  private repository: Repository<Notification>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(Notification);
  }

  async count(params: FindManyOptions<Notification>): Promise<number> {
    return this.repository.count(params);
  }

  async getMany(params: FindManyOptions<Notification>): Promise<Notification[]> {
    return this.repository.find(params);
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

    if (!notifications.length) throw ERR_NOTIF_NOT_FOUND();

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const result = await this.repository.update(
      notifications.map((n) => n.id),
      {
        ...data,
        modifiedDate: now,
      },
    );

    if (!result.affected) throw ERR_NOTIF_NOT_FOUND();

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

      const result = await this.repository.update(params, {
        ...data,
        modifiedDate: now,
      });

      if (!result.affected) throw ERR_NOTIF_NOT_FOUND();

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
}
