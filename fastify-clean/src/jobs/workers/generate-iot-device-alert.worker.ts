/* eslint-disable no-unused-vars */
import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import { GenerateIotDeviceAlertJob } from '../../dto/devicesSensors.dto';
import { QUEUE_GENERATE_IOT_DEVICE_ALERT } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { DeviceSensorsService } from '../../services/devicesSensors.service';
import { BaseWorker } from './base.worker';

@Service()
export class GenerateIotDeviceAlertWorker extends BaseWorker<GenerateIotDeviceAlertJob> {
  @Inject(DeviceSensorsService)
  private deviceSensorService: DeviceSensorsService;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_GENERATE_IOT_DEVICE_ALERT;

  protected async handle(data: {
    redisKey: string;
    macAddress: string;
    metricName: string;
  }): Promise<void> {
    try {
      await this.deviceSensorService.generateDeviceSensorAlert(data);
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }
}
