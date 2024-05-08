import { Controller, Inject } from 'fastify-decorators';
import { Subscriber } from './subscriber/index.subscriber';

@Controller()
export class MqttController {
  @Inject(Subscriber)
  subscriber: Subscriber;
}
