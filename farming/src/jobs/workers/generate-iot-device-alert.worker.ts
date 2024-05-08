/* eslint-disable no-unused-vars */
import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { SlackDAO } from '../../dao/external/slack.dao';
import { GenerateIotDeviceAlertJob } from '../../dto/devicesSensors.dto';
import { QUEUE_GENERATE_IOT_DEVICE_ALERT } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { DeviceSensorsService } from '../../services/devicesSensors.service';
import { BaseWorker } from './base.worker';

@Service()
export class GenerateIotDeviceAlertWorker extends BaseWorker<GenerateIotDeviceAlertJob> {
  @Inject(DeviceSensorsService)
  private deviceSensorService: DeviceSensorsService;

  @Inject(SlackDAO)
  private slackDAO: SlackDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_GENERATE_IOT_DEVICE_ALERT;

  protected async handle(
    data: {
      redisKey: string;
      macAddress: string;
      metricName: string;
    },
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ): Promise<void> {
    try {
      await this.deviceSensorService.generateDeviceSensorAlert(data);
    } catch (error) {
      this.logger.error(error);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, data, jobId);
      }

      throw error;
    }
  }
}
