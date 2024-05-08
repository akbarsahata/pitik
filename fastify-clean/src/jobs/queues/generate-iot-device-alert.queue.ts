import { Service } from 'fastify-decorators';
import { GenerateIotDeviceAlertJob } from '../../dto/devicesSensors.dto';
import { QUEUE_GENERATE_IOT_DEVICE_ALERT } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class GenerateIotDeviceAlertQueue extends BaseQueue<GenerateIotDeviceAlertJob> {
  protected queueName = QUEUE_GENERATE_IOT_DEVICE_ALERT;
}
