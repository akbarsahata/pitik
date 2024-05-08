import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { EntityNotFoundError, FindManyOptions, Repository } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Device } from '../datasources/entity/pgsql/Device.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_DEVICE_NOT_FOUND } from '../libs/constants/errors';
import { randomHexString } from '../libs/utils/helpers';

@Service()
export default class DeviceDAO {
  @Inject(PostgreSQLConnection)
  private pSql!: PostgreSQLConnection;

  private repository: Repository<Device>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(Device);
  }

  async createOne(data: Partial<Device>): Promise<Device> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    let device = await this.repository.findOne({
      where: {
        ...data,
      },
    });

    if (!device) {
      device = this.repository.create({
        ...data,
        id: randomHexString(),
        createdDate: now,
        modifiedDate: now,
      });

      return this.repository.save(device);
    }

    return device;
  }

  async removeOne(id: string): Promise<Device> {
    try {
      const device = await this.repository.findOneOrFail({
        where: {
          id,
        },
      });

      await this.repository.delete({
        id,
      });

      return device;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_DEVICE_NOT_FOUND();
      }

      throw error;
    }
  }

  async removeMany(params: FindManyOptions<Device>): Promise<Device[]> {
    const devices = await this.repository.find(params);

    if (!devices.length) {
      throw ERR_DEVICE_NOT_FOUND();
    }

    await this.repository.remove(devices.map((d) => ({ ...d })));

    return devices;
  }

  async getMany(params: FindManyOptions<Device>): Promise<Device[]> {
    return this.repository.find(params);
  }
}
