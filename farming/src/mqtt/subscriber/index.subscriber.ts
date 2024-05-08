import { Initializer, Inject, Service } from 'fastify-decorators';
import { randomUUID } from 'node:crypto';
import os from 'node:os';
import tx2 from 'tx2';
import env from '../../config/env';
import { MqttConnection } from '../../datasources/connection/mqtt.connection';
import {
  MQTT_DEVICE_TYPE,
  MQTT_MESSAGE_CODE,
  MQTT_MESSAGE_TYPE,
} from '../../libs/constants/mqttMessage';
import { UPLOAD_CONVENTRON_TOPIC, UPLOAD_GLOBAL_TOPIC } from '../../libs/constants/mqttTopic';
import { getDateTime, sleep } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { extractMqttHeader, validateCRC } from '../../libs/utils/mqttParser';
import { base } from '../../proto/bundle';
import { SmartCameraSubscriber } from './smartCamera.subscriber';
import { SmartControllerSubscriber } from './smartController.subscriber';
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

    // wait for other connections to be ready
    await sleep(3000);

    const activeHandlerCounter = tx2.counter({
      name: 'MQTT active handlers',
      unit: '',
    });

    activeHandlerCounter.reset();

    this.mqttDeviceType = {
      [MQTT_DEVICE_TYPE.SMART_CAMERA]: {
        [MQTT_MESSAGE_TYPE.REPORT]: {
          [MQTT_MESSAGE_CODE.REPORT.CAPTURE_IMAGE_STATE]: SmartCameraSubscriber.updateStateWraper,
          [MQTT_MESSAGE_CODE.REPORT.DIAGNOSTICS_DATA]: SmartCameraSubscriber.diagnosticsDataWrapper,
        },
        [MQTT_MESSAGE_TYPE.ALERT]: {
          [MQTT_MESSAGE_CODE.ALERT.CAMERA_OFFLINE]: SmartCameraSubscriber.cameraOfflineWrapper,
        },
      },
      [MQTT_DEVICE_TYPE.SMART_MONITOR]: {
        [MQTT_MESSAGE_TYPE.REPORT]: {
          [MQTT_MESSAGE_CODE.REPORT.MONITOR_DATA]: SmartMonitorSubscriber.updatePeriodicWraper,
          [MQTT_MESSAGE_CODE.REPORT.DIAGNOSTICS_DATA]:
            SmartMonitorSubscriber.diagnosticsDataWrapper,
        },
        [MQTT_MESSAGE_TYPE.ALERT]: {
          [MQTT_MESSAGE_CODE.ALERT.MONITOR_STATUS]: SmartMonitorSubscriber.sendMetricWrapper,
        },
        [MQTT_MESSAGE_TYPE.REPLY]: {
          [MQTT_MESSAGE_CODE.REPLY.STORE_RO]: SmartMonitorSubscriber.handlerReplyDeviceWrapper,
          [MQTT_MESSAGE_CODE.REPLY.DEVICE_INFO]: SmartMonitorSubscriber.handlerReplyDeviceWrapper,
          [MQTT_MESSAGE_CODE.REPLY.PING]: SmartMonitorSubscriber.handlerReplyDeviceWrapper,
          [MQTT_MESSAGE_CODE.REPLY.OTA_DEVICE]: SmartMonitorSubscriber.handlerReplyDeviceWrapper,
          [MQTT_MESSAGE_CODE.REPLY.MAP_DEVICE]: SmartMonitorSubscriber.handlerReplyDeviceWrapper,
          [MQTT_MESSAGE_CODE.REPLY.MAP_SENSOR]: SmartMonitorSubscriber.handlerReplyDeviceWrapper,
        },
      },
      [MQTT_DEVICE_TYPE.SMART_CONTROLLER]: {
        [MQTT_MESSAGE_TYPE.REPLY]: {
          [MQTT_MESSAGE_CODE.REPLY.DEVICE_INFO]:
            SmartControllerSubscriber.handleSmartControllerSubscribeWrapper,
          [MQTT_MESSAGE_CODE.REPLY.PING]:
            SmartControllerSubscriber.handleSmartControllerSubscribeWrapper,
          [MQTT_MESSAGE_CODE.REPLY.FARM_INFO]:
            SmartControllerSubscriber.handleSmartControllerSubscribeWrapper,
          [MQTT_MESSAGE_CODE.REPLY.RESET_DEVICE]:
            SmartControllerSubscriber.handleSmartControllerSubscribeWrapper,
          [MQTT_MESSAGE_CODE.REPLY.OTA_DEVICE]:
            SmartControllerSubscriber.handleSmartControllerSubscribeWrapper,
          [MQTT_MESSAGE_CODE.REPLY.REPORT_SETTING]:
            SmartControllerSubscriber.handleSmartControllerSubscribeWrapper,
          [MQTT_MESSAGE_CODE.REPLY.GET_DATA]:
            SmartControllerSubscriber.handleSmartControllerSubscribeWrapper,
          [MQTT_MESSAGE_CODE.REPLY.GET_STATUS]:
            SmartControllerSubscriber.handleSmartControllerSubscribeWrapper,
          [MQTT_MESSAGE_CODE.REPLY.GET_SETTINGS]:
            SmartControllerSubscriber.handleSmartControllerSubscribeWrapper,
          [MQTT_MESSAGE_CODE.REPLY.SET_SETTINGS]:
            SmartControllerSubscriber.handleSmartControllerSubscribeWrapper,
          [MQTT_MESSAGE_CODE.REPLY.SEND_SENSORS_LIST]:
            SmartControllerSubscriber.handleSmartControllerSubscribeWrapper,
        },
        [MQTT_MESSAGE_TYPE.REPORT]: {
          [MQTT_MESSAGE_CODE.REPORT.MONITOR_DATA]:
            SmartControllerSubscriber.handleSmartControllerSubscribeWrapper,
        },
        [MQTT_MESSAGE_TYPE.ALERT]: {
          [MQTT_MESSAGE_CODE.ALERT.CONTROLLER_STATUS]:
            SmartControllerSubscriber.handleSmartControllerSubscribeWrapper,
        },
        [MQTT_MESSAGE_TYPE.CHANGE]: {
          [MQTT_MESSAGE_CODE.CHANGE.DEVICE_INFO]:
            SmartControllerSubscriber.handleSmartControllerSubscribeWrapper,
          [MQTT_MESSAGE_CODE.CHANGE.SET_SETTINGS]:
            SmartControllerSubscriber.handleSmartControllerSubscribeWrapper,
        },
        [MQTT_MESSAGE_TYPE.REQUEST]: {
          [MQTT_MESSAGE_CODE.REQUEST.CONTROLLER_SENSORS_LIST]:
            SmartControllerSubscriber.handleSmartControllerSubscribeWrapper,
        },
      },
    };

    this.mqttHandlerTlv = SmartConventronSubcriber.updatePeriodicWraper;

    const client = this.mqttConnection.client.subscribe(UPLOAD_GLOBAL_TOPIC, { qos: 1 });

    client.on('message', async (topic, payload) => {
      try {
        activeHandlerCounter.inc(1);

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
          this.logger.logMqttMessage({
            log_level: 'info',
            ctx: 'mqtt-message-log',
            request_id: `${getDateTime(meta.timestamp)}-${meta.messageType}-${meta.messageCode}`,
            hostname: os.hostname(),
            method: 'MQTT',
            topic,
            device_id: deviceId,
            device_type: deviceType,
            meta,
            payload,
          });

          await handler(topic, payload);
        }
      } catch (error) {
        this.logger.error(error);
      } finally {
        activeHandlerCounter.dec(1);
      }
    });

    const clientTlv = this.mqttConnection.client.subscribe(UPLOAD_CONVENTRON_TOPIC, { qos: 1 });

    clientTlv.on('message', async (topic, payload) => {
      try {
        activeHandlerCounter.inc(1);

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
          this.logger.logMqttMessage({
            log_level: 'info',
            ctx: 'mqtt-message-log',
            request_id: randomUUID(),
            hostname: os.hostname(),
            method: 'MQTT-TLV',
            topic,
            device_id: deviceType,
            device_type: deviceType,
            payload,
          });

          await handler(topic, data);
        }
      } catch (error) {
        this.logger.error(error);
      } finally {
        activeHandlerCounter.dec(1);
      }
    });
  }
}
