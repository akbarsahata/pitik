import { Inject, Service } from 'fastify-decorators';
import { In } from 'typeorm';
import { IotDeviceDAO } from '../../dao/IotDevice.dao';
import { SetDevicesStatusJob } from '../../dto/devicesSensors.dto';
import { QUEUE_SET_IOT_DEVICE_STATUS } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { BaseWorker } from './base.worker';

@Service()
export class SetIotDeviceStatusWorker extends BaseWorker<SetDevicesStatusJob> {
  protected workerName = QUEUE_SET_IOT_DEVICE_STATUS;

  @Inject(Logger)
  private logger!: Logger;

  @Inject(IotDeviceDAO)
  private iotDeviceDAO: IotDeviceDAO;

  protected async handle(data: SetDevicesStatusJob): Promise<void> {
    try {
      const [iotDevices] = await this.iotDeviceDAO.getManyDevicesSensors({
        where: {
          deviceType: In(data.deviceTypes),
          status: !data.status,
          ...(data.farmId && {
            farmId: data.farmId,
          }),
          ...(data.coopId && {
            coopId: data.coopId,
          }),
          ...(data.buildingId && {
            buildingId: data.buildingId,
          }),
          ...(data.roomId && {
            roomId: data.roomId,
          }),
        },
      });

      iotDevices.reduce(async (prev, iotDevice) => {
        await prev;

        await this.iotDeviceDAO.updateDevicesSensors(
          {
            id: iotDevice.id,
          },
          {
            status: data.status,
          },
        );
      }, Promise.resolve());
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }
}
