import { Inject, Service } from 'fastify-decorators';
import { IsNull } from 'typeorm';
import { FirmwareDAO } from '../dao/firmware.dao';
import { IotFirmware } from '../datasources/entity/pgsql/IotFirmware.entity';
import { FirmwareBody, GetFirmwareQuery } from '../dto/firmware.dto';
import { RequestUser } from '../libs/types/index.d';
import { generateOrderQuery } from '../libs/utils/helpers';

@Service()
export class FirmwareService {
  @Inject(FirmwareDAO)
  private firmwareDAO!: FirmwareDAO;

  async get(filter: GetFirmwareQuery): Promise<[IotFirmware[], number]> {
    const limit: number = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip: number = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;
    const order = (filter.$order && generateOrderQuery(filter.$order)) || 'DESC';

    return this.firmwareDAO.getMany({
      where: {
        id: filter.id,
        version: filter.version,
        fileName: filter.fileName,
        fileSize: filter.fileSize,
        description: filter.description,
        deletedDate: IsNull(),
      },
      take: (filter.$limit !== 0 && limit) || undefined,
      skip,
      order: {
        createdDate: order,
      },
    });
  }

  async createOne(input: FirmwareBody, user: RequestUser): Promise<IotFirmware> {
    const data = await this.firmwareDAO.createFirmware(input, user);

    return data;
  }

  async deleteFirmware(id: string, user: RequestUser): Promise<IotFirmware> {
    const data = await this.firmwareDAO.deleteFirmware({ id }, user);

    return data;
  }
}
