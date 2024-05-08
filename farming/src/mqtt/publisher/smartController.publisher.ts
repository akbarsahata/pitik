import { Inject, Service } from 'fastify-decorators';
import { MqttConnection } from '../../datasources/connection/mqtt.connection';
import {
  MQTT_CONTROLLER_SETTING_TYPES,
  MQTT_DEVICE_CATEGORY,
  MQTT_DEVICE_TYPE,
  MQTT_MESSAGE_CODE,
  MQTT_MESSAGE_TYPE,
  MQTT_SERVER_INFO,
} from '../../libs/constants/mqttMessage';
import { DOWNLOAD_GLOBAL_TOPIC } from '../../libs/constants/mqttTopic';
import { encodeControllerVersion, hmsToSeconds } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { appendCRC, constructMeta } from '../../libs/utils/mqttParser';
import { smartcontroller } from '../../proto/bundle';

export type SetHeaterSettingPayload = {
  temperatureTarget: number;
  deviceId: string;
};

export type SetCoolerSettingPayload = {
  coolingPadTemperature: number;
  timeOnCoolingPad: string;
  timeOffCoolingPad: string;
  deviceId: string;
};

export type SetLampSettingPayload = {
  id: string;
  timeOnLight: string;
  timeOffLight: string;
  deviceId: string;
};

export type SetFanSettingPayload = {
  id: string;
  temperatureFan: number;
  timeOnFan: string;
  timeOffFan: string;
  intermittentFan: boolean;
};

export type SetAlarmSettingPayload = {
  coldAlarm: number;
  hotAlarm: number;
  deviceId: string;
};

export type SetReportSettingCommandPayload = {
  at: Date | number;
  period: number;
};

export type SetOTACommandPayload = {
  version: string;
  fileSize: number;
};

export type TemperatureReductionSettingPayload = {
  day: number;
  group: number;
  reduction: number;
};

export type SetGrowthSettingCommandPayload = {
  growthDay: number;
  requestTemperature: number;
  temperature: number;
  temperatureReduction: TemperatureReductionSettingPayload[];
  deviceId: string;
};

export type SendControllerSensorsList = {
  mac: string;
  atc: number[];
};

type SendSmartControllerCommandParams<T> = {
  macAddress: string;
  // FIXME: How to only accept params from MQTT_MESSAGE_CODE.COMMAND?
  commandType: number;
  payload: T;
};

type SendSmartControllerSetSettingsCommandParams<T> = {
  macAddress: string;
  // FIXME: How to only accept params from MQTT_MESSAGE_CODE.COMMAND?
  settingType: string;
  payload: T;
};

type SendSmartControllerGetSettingsCommandParams = {
  macAddress: string;
};

@Service()
export class SmartControllerPublisher {
  @Inject(Logger)
  private logger: Logger;

  @Inject(MqttConnection)
  private mqttConnection: MqttConnection;

  async sendSmartControllerCommand<T>(params: SendSmartControllerCommandParams<T>) {
    const macs = Array.from(params.macAddress.toLowerCase().split(':'));
    macs.unshift(MQTT_DEVICE_TYPE.SMART_CONTROLLER);
    macs.unshift(MQTT_DEVICE_CATEGORY.ESP32);

    const topic = DOWNLOAD_GLOBAL_TOPIC.replace('+', macs.join(''));

    const meta = constructMeta({
      messageType: MQTT_MESSAGE_TYPE.COMMAND,
      serverInfo: MQTT_SERVER_INFO.PARSER,
      messageCode: params.commandType,
    });

    let commandPayload;
    if (params.commandType === MQTT_MESSAGE_CODE.COMMAND.OTA_DEVICE) {
      const payload = params.payload as unknown as SetOTACommandPayload;
      commandPayload = smartcontroller.ControllerContent.create({
        meta,
        ota: {
          version: encodeControllerVersion(payload.version),
          filesize: payload.fileSize,
        },
      });
    } else {
      commandPayload = smartcontroller.ControllerContent.create({
        meta,
      });
    }

    const msg = smartcontroller.ControllerContent.encode(commandPayload).finish();

    const payload = appendCRC(msg);

    this.mqttConnection.client.publish(topic, payload, { qos: 1 }, async (error) => {
      if (error) {
        this.logger.error({
          error,
          topic,
          payload: payload.toString('hex'),
        });
      }
    });
  }

  async sendSmartControllerSetSettingsCommand<T>(
    params: SendSmartControllerSetSettingsCommandParams<T>,
  ) {
    const deviceId = Array.from(params.macAddress.toLowerCase().split(':'));
    deviceId.unshift(MQTT_DEVICE_TYPE.SMART_CONTROLLER);
    deviceId.unshift(MQTT_DEVICE_CATEGORY.ESP32);

    const topic = DOWNLOAD_GLOBAL_TOPIC.replace('+', deviceId.join(''));

    const meta = constructMeta({
      messageType: MQTT_MESSAGE_TYPE.COMMAND,
      serverInfo: MQTT_SERVER_INFO.PARSER,
      messageCode: MQTT_MESSAGE_CODE.COMMAND.SET_SETTINGS,
    });

    let body;
    if (params.settingType === MQTT_CONTROLLER_SETTING_TYPES.HEATER) {
      const payload = params.payload as unknown as SetHeaterSettingPayload;
      body = smartcontroller.ControllerSetting.create({
        heater: payload.temperatureTarget * 10,
      });
    }

    if (params.settingType === MQTT_CONTROLLER_SETTING_TYPES.COOLER) {
      const payload = params.payload as unknown as SetCoolerSettingPayload;
      body = smartcontroller.ControllerSetting.create({
        cooler: {
          tempCool: payload.coolingPadTemperature * 10,
          TimeCool: {
            on: hmsToSeconds(`00:${payload.timeOnCoolingPad}`),
            off: hmsToSeconds(`00:${payload.timeOffCoolingPad}`),
          },
        },
      });
    }

    if (params.settingType === MQTT_CONTROLLER_SETTING_TYPES.LAMP) {
      const payload = params.payload as unknown as SetLampSettingPayload;
      const id = parseInt(payload.id.slice(-1), 10);

      if (Number.isNaN(id)) {
        throw new Error('Invalid lamp id');
      }

      body = smartcontroller.ControllerSetting.create({
        light: [
          {
            id,
            time: {
              on: hmsToSeconds(`00:${payload.timeOnLight}`),
              off: hmsToSeconds(`00:${payload.timeOffLight}`),
            },
          },
        ],
      });
    }

    if (params.settingType === MQTT_CONTROLLER_SETTING_TYPES.FAN) {
      const payload = params.payload as unknown as SetFanSettingPayload;
      const id = parseInt(payload.id.slice(-1), 10);

      if (!id || Number.isNaN(id)) {
        throw new Error('Invalid fan id');
      }

      body = smartcontroller.ControllerSetting.create({
        fan: [
          {
            id,
            diff: payload.temperatureFan * 10,
            mode: payload.intermittentFan ? 1 : 2,
            time: {
              on: hmsToSeconds(`00:${payload.timeOnFan}`),
              off: hmsToSeconds(`00:${payload.timeOffFan}`),
            },
          },
        ],
      });
    }

    if (params.settingType === MQTT_CONTROLLER_SETTING_TYPES.ALARM) {
      const payload = params.payload as unknown as SetAlarmSettingPayload;
      body = smartcontroller.ControllerSetting.create({
        alarm: {
          hot: payload.hotAlarm * 10,
          cold: payload.coldAlarm * 10,
        },
      });
    }

    if (params.settingType === MQTT_CONTROLLER_SETTING_TYPES.GROWTH_DAY) {
      const payload = params.payload as unknown as SetGrowthSettingCommandPayload;
      body = smartcontroller.ControllerSetting.create({
        growth: payload.growthDay,
        tempDayOne: payload.temperature * 10,
        reqTemp: payload.requestTemperature * 10,
        reduction: payload.temperatureReduction.map((reduction) => ({
          id: reduction.group,
          tempDay: {
            days: reduction.day,
            temp: reduction.reduction * 10,
          },
        })),
      });
    }

    const commandPayload = smartcontroller.ControllerContent.create({
      meta,
      controllerSetting: body,
    });

    const msg = smartcontroller.ControllerContent.encode(commandPayload).finish();

    const payload = appendCRC(msg);

    this.mqttConnection.client.publish(topic, payload, { qos: 1 }, async (error) => {
      if (error) {
        this.logger.error({
          error,
          topic,
          payload: payload.toString('hex'),
        });
      }
    });
  }

  async sendSmartControllerGetSettingsCommand(params: SendSmartControllerGetSettingsCommandParams) {
    const deviceId = Array.from(params.macAddress.toLowerCase().split(':'));
    deviceId.unshift(MQTT_DEVICE_TYPE.SMART_CONTROLLER);
    deviceId.unshift(MQTT_DEVICE_CATEGORY.ESP32);

    const topic = DOWNLOAD_GLOBAL_TOPIC.replace('+', deviceId.join(''));

    const meta = constructMeta({
      messageType: MQTT_MESSAGE_TYPE.COMMAND,
      serverInfo: MQTT_SERVER_INFO.PARSER,
      messageCode: MQTT_MESSAGE_CODE.COMMAND.SET_SETTINGS,
    });

    const commandPayload = smartcontroller.ControllerContent.create({
      meta,
      reportSetting: {},
    });

    const msg = smartcontroller.ControllerContent.encode(commandPayload).finish();

    const payload = appendCRC(msg);

    this.mqttConnection.client.publish(topic, payload, { qos: 1 }, async (error) => {
      if (error) {
        this.logger.error({
          error,
          topic,
          payload: payload.toString('hex'),
        });
      }
    });
  }

  async sendSmartControllerResponse<T>(params: SendSmartControllerCommandParams<T>) {
    const macs = Array.from(params.macAddress.toLowerCase().split(':'));
    macs.unshift(MQTT_DEVICE_TYPE.SMART_CONTROLLER);
    macs.unshift(MQTT_DEVICE_CATEGORY.ESP32);

    const topic = DOWNLOAD_GLOBAL_TOPIC.replace('+', macs.join(''));

    const meta = constructMeta({
      messageType: MQTT_MESSAGE_TYPE.RESPONSE,
      serverInfo: MQTT_SERVER_INFO.PARSER,
      messageCode: params.commandType,
    });

    let commandPayload;
    if (params.commandType === MQTT_MESSAGE_CODE.REPLY.SEND_SENSORS_LIST) {
      const payload = params.payload as unknown as SendControllerSensorsList;
      commandPayload = smartcontroller.ControllerContent.create({
        meta,
        controllerLocalComm: {
          mac: payload.mac.toLowerCase().split(':').join(''),
          atc: payload.atc,
        },
      });
    } else {
      commandPayload = smartcontroller.ControllerContent.create({
        meta,
      });
    }

    const msg = smartcontroller.ControllerContent.encode(commandPayload).finish();

    const payload = appendCRC(msg);

    this.mqttConnection.client.publish(topic, payload, { qos: 1 }, async (error) => {
      if (error) {
        this.logger.error({
          error,
          topic,
          payload: payload.toString('hex'),
        });
      }
    });
  }
}
