import { Service } from 'fastify-decorators';
import { SetDevicesStatusJob } from '../../dto/devicesSensors.dto';
import { QUEUE_SET_IOT_DEVICE_STATUS } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class SetIotDeviceStatusQueue extends BaseQueue<SetDevicesStatusJob> {
  protected queueName = QUEUE_SET_IOT_DEVICE_STATUS;
}
