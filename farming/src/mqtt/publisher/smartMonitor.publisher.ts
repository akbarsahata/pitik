import { Inject, Service } from 'fastify-decorators';
import { IsNull } from 'typeorm';
import { IotDeviceDAO } from '../../dao/IotDevice.dao';
import { MqttConnection } from '../../datasources/connection/mqtt.connection';
import {
  MQTT_DEVICE_CATEGORY,
  MQTT_DEVICE_TYPE,
  MQTT_MESSAGE_CODE,
  MQTT_MESSAGE_TYPE,
  MQTT_SERVER_INFO,
} from '../../libs/constants/mqttMessage';
import { DOWNLOAD_GLOBAL_TOPIC } from '../../libs/constants/mqttTopic';
import { hexToNumber, hexToUint8Array, sleep } from '../../libs/utils/helpers';
import { appendCRC, constructMeta } from '../../libs/utils/mqttParser';
import { smartmonitor } from '../../proto/bundle';

type SetAmmoniaCommandParam = {
  delayInSeconds?: number;
  mac: string;
};

@Service()
export class SmartMonitorPublisher {
  @Inject(MqttConnection)
  private mqttConnection: MqttConnection;

  @Inject(IotDeviceDAO)
  iotDeviceDAO!: IotDeviceDAO;

  async sendSetAmmoniaCommand(param: SetAmmoniaCommandParam) {
    if (param.delayInSeconds) {
      await sleep(param.delayInSeconds * 1000);
    }

    const meta = constructMeta({
      serverInfo: MQTT_SERVER_INFO.PARSER,
      messageType: MQTT_MESSAGE_TYPE.COMMAND,
      messageCode: MQTT_MESSAGE_CODE.COMMAND.STORE_RO,
    });

    const commandPayload = smartmonitor.MonitorContent.create({
      meta,
      storeR0: {},
    });

    this.sendSmartMonitorCommand(param.mac, commandPayload);
  }

  async sendMapDeviceCommand(param: SetAmmoniaCommandParam) {
    if (param.delayInSeconds) {
      await sleep(param.delayInSeconds * 1000);
    }

    const iotDevice = await this.iotDeviceDAO.getOneStrict({
      where: {
        mac: param.mac,
        deletedDate: IsNull(),
      },
      relations: {
        room: {
          roomType: true,
          controllerType: true,
        },
      },
    });

    const meta = constructMeta({
      serverInfo: MQTT_SERVER_INFO.PARSER,
      messageType: MQTT_MESSAGE_TYPE.COMMAND,
      messageCode: MQTT_MESSAGE_CODE.COMMAND.MAP_DEVICE,
    });

    const commandPayload = smartmonitor.MonitorContent.create({
      meta,
      mapDevice: {
        room: iotDevice.room ? hexToNumber(iotDevice.room.roomCode) : 0,
        command: 1,
      },
    });

    this.sendSmartMonitorCommand(param.mac, commandPayload);
  }

  async sendMapSensorCommand(param: SetAmmoniaCommandParam) {
    if (param.delayInSeconds) {
      await sleep(param.delayInSeconds * 1000);
    }

    const iotDevice = await this.iotDeviceDAO.getOneStrict({
      where: {
        mac: param.mac,
        deletedDate: IsNull(),
      },
      relations: {
        room: {
          roomType: true,
          controllerType: true,
        },
        sensors: {
          room: true,
        },
      },
    });

    const meta = constructMeta({
      serverInfo: MQTT_SERVER_INFO.PARSER,
      messageType: MQTT_MESSAGE_TYPE.COMMAND,
      messageCode: MQTT_MESSAGE_CODE.COMMAND.MAP_SENSOR,
    });

    const commandPayload = smartmonitor.MonitorContent.create({
      meta,
      mapSensor: {
        xiaomis: iotDevice.sensors.map((sensor) => ({
          id: hexToUint8Array(sensor.sensorCode ? `01${sensor.sensorCode.substring(4)}` : '00'),
          pos: hexToUint8Array(sensor.position || 'A1'),
        })),
        command: 1,
      },
    });

    this.sendSmartMonitorCommand(param.mac, commandPayload);
  }

  async sendSmartMonitorCommand(mac: string, commandPayload: smartmonitor.IMonitorContent) {
    const msg = smartmonitor.MonitorContent.encode(commandPayload).finish();

    const payload = appendCRC(msg);

    const deviceId = Array.from(mac.toLowerCase().split(':'));
    deviceId.unshift(MQTT_DEVICE_TYPE.SMART_MONITOR);
    deviceId.unshift(MQTT_DEVICE_CATEGORY.ESP32);

    const topic = DOWNLOAD_GLOBAL_TOPIC.replace('+', deviceId.join(''));

    this.mqttConnection.client.publish(topic, payload, {
      qos: 1,
    });
  }
}
