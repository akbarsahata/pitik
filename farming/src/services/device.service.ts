import { Inject, Service } from 'fastify-decorators';
import DeviceDAO from '../dao/device.dao';
import { DeviceBody, DeviceResponse, DeviceResponsePaginated } from '../dto/device.dto';
import { RequestUser } from '../libs/types/index.d';

@Service()
export default class DeviceService {
  @Inject(DeviceDAO)
  dao!: DeviceDAO;

  async createDevice(data: Partial<DeviceBody>, user: RequestUser): Promise<DeviceResponse> {
    const device = await this.dao.createOne({
      userId: user.id,
      uuid: data.uuid,
      token: data.token,
      type: data.type,
      os: data.os,
      model: data.model,
    });

    return {
      data: {
        ...device,
        createdDate: device.createdDate.toISOString(),
        modifiedDate: device.modifiedDate.toISOString(),
      },
    };
  }

  async deleteDeviceById(id: string): Promise<DeviceResponse> {
    const device = await this.dao.removeOne(id);

    return {
      data: {
        ...device,
        createdDate: device.createdDate.toISOString(),
        modifiedDate: device.modifiedDate.toISOString(),
      },
    };
  }

  async deleteDeviceByUserId(userId: string): Promise<DeviceResponsePaginated> {
    const deletedDevices = await this.dao.removeMany({
      where: {
        userId,
      },
    });

    return {
      data: deletedDevices.map((d) => ({
        ...d,
        createdDate: d.createdDate.toISOString(),
        modifiedDate: d.modifiedDate.toISOString(),
      })),
      count: deletedDevices.length,
    };
  }
}
