import { captureException } from '@sentry/node';
import { Initializer, Inject, Service } from 'fastify-decorators';
import env from '../../config/env';
import { MqttConnection } from '../../datasources/connection/mqtt.connection';
import {
  MQTT_DEVICE_TYPE,
  MQTT_MESSAGE_CODE,
  MQTT_MESSAGE_TYPE,
} from '../../libs/constants/mqttMessage';
import { UPLOAD_CONVENTRON_TOPIC, UPLOAD_GLOBAL_TOPIC } from '../../libs/constants/mqttTopic';
import { Logger } from '../../libs/utils/logger';
import { extractMqttHeader, validateCRC } from '../../libs/utils/mqttParser';
import { base } from '../../proto/bundle';
import { SmartCameraSubscriber } from './smartCamera.subscriber';
import { SmartConventronSubcriber } from './smartConventron.subscriber';
import { SmartMonitorSubscriber } from './smartMonitor.subscriber';

// eslint-disable-next-line no-unused-vars
type MqttHandlerFunc = (topic: string, payload: Buffer) => Promise<void>;

type MqttActionMap = { [key: number]: MqttHandlerFunc };

type MqttOperationMap = { [key: number]: MqttActionMap };

type MqttDeviceTypeMap = { [key: string]: MqttOperationMap };

// eslint-disable-next-line no-unused-vars
type MqttHandlerTlv = (topic: string, payload: string) => Promise<void>;

@Service()
export class Subscriber {
  @Inject(Logger)
  private logger: Logger;

  @Inject(MqttConnection)
  private mqttConnection: MqttConnection;

  private mqttDeviceType: MqttDeviceTypeMap;

  private mqttHandlerTlv: MqttHandlerTlv;

  @Initializer([MqttConnection])
  async init() {
    if (!env.ENABLE_MQTT_SUBSCRIBER) return;

    this.mqttDeviceType = {
      [MQTT_DEVICE_TYPE.SMART_CAMERA]: {
        [MQTT_MESSAGE_TYPE.REPORT]: {
          [MQTT_MESSAGE_CODE.REPORT_CAPTURE_IMAGE_STATE]: SmartCameraSubscriber.updateStateWraper,
        },
      },
      [MQTT_DEVICE_TYPE.SMART_MONITOR]: {
        [MQTT_MESSAGE_TYPE.REPORT]: {
          [MQTT_MESSAGE_CODE.REPORT_MONITOR_DATA]: SmartMonitorSubscriber.updatePeriodicWraper,
        },
        [MQTT_MESSAGE_TYPE.ALERT]: {
          [MQTT_MESSAGE_CODE.ALERT_MONITOR_STATUS]: SmartMonitorSubscriber.sendMetricWrapper,
        },
      },
    };

    this.mqttHandlerTlv = SmartConventronSubcriber.updatePeriodicWraper;

    const client = this.mqttConnection.client.subscribe(UPLOAD_GLOBAL_TOPIC, { qos: 1 });
    client.on('message', async (topic, payload) => {
      try {
        const payloadWithoutCRC = payload.slice(0, payload.length - 2);
        const crcBytes = payload.slice(payload.length - 2);

        // validate CRC
        if (!validateCRC(payloadWithoutCRC, crcBytes)) {
          // TODO: publish proper response to topic
          return;
        }

        // extract meta
        const basePayload = base.BasePayload.decode(payloadWithoutCRC);
        const meta = extractMqttHeader(Buffer.from(basePayload.meta));
        const deviceId = topic.split('/').pop() as string;
        const deviceType = deviceId[1];

        const handler = this.mqttDeviceType[deviceType]?.[meta.messageType]?.[meta.messageCode];

        if (handler) {
          await handler(topic, payload);
        }
      } catch (error) {
        this.logger.error(error);

        captureException(error);
      }
    });

    const clientTlv = this.mqttConnection.client.subscribe(UPLOAD_CONVENTRON_TOPIC, { qos: 1 });
    clientTlv.on('message', async (topic, payload) => {
      try {
        const paths = topic.toString().split('/');
        if (paths.length < 5) {
          return;
        }

        const deviceType = paths[paths.length - 2].substring(0, 1).toUpperCase();
        const data = payload.toString().toUpperCase();

        if (data.length < 60 && deviceType !== 'T') {
          // for skip smart controller
          return;
        }

        const payloadWithoutCRC = data.substring(0, data.length - 4);
        const crcBytes = data.substring(data.length - 4, data.length);
        // validate CRC
        if (!validateCRC(Buffer.from(payloadWithoutCRC, 'hex'), Buffer.from(crcBytes, 'hex'))) {
          // TODO: publish proper response to topic
          return;
        }
        const handler = this.mqttHandlerTlv;
        if (handler) {
          await handler(topic, data);
        }
      } catch (error) {
        this.logger.error(error);
        captureException(error);
      }
    });
  }
}
