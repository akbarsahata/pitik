import * as mqtt from 'mqtt';
import { Destructor, Initializer, Inject, Service } from 'fastify-decorators';
import { mqttEnv } from '../../config/datasource';
import { Logger } from '../../libs/utils/logger';

@Service()
export class MqttConnection {
  public client!: mqtt.Client;

  @Inject(Logger)
  private logger!: Logger;

  @Initializer()
  async init() {
    try {
      this.client = mqtt.connect(`mqtt://${mqttEnv.MQTT_HOST}:${mqttEnv.MQTT_PORT}`, {
        clean: true,
        connectTimeout: 4e3,
        username: mqttEnv.MQTT_USERNAME,
        password: mqttEnv.MQTT_PASSWORD,
        reconnectPeriod: 1e3,
        clientId: `TSC-${Math.random().toString(16).substr(2, 8)}-${Math.random()
          .toString(16)
          .substr(2, 8)}`,
      });

      this.logger.info({ message: '[CONNECTION] Connected to MQTT' });
    } catch (error) {
      this.logger.info({ message: '[CONNECTION] Error connecting to MQTT' });
      this.logger.error(error);
      throw error;
    }
  }

  @Destructor()
  async destroy() {
    await this.client.end();
  }
}
