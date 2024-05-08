import { getInstanceByToken, Inject, Service } from 'fastify-decorators';
import { IsNull } from 'typeorm';
import env from '../../config/env';
import { IotControllerESDAO } from '../../dao/es/iotController.es.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { IotDeviceDAO } from '../../dao/IotDevice.dao';
import { IOTDeviceSettingsDAO } from '../../dao/iotDeviceSettings.dao';
import { DEVICE_TYPE } from '../../libs/constants';
import {
  MAC_LENGTH,
  MQTT_ERROR_CODE,
  MQTT_MESSAGE_CODE,
  MQTT_MESSAGE_TYPE,
} from '../../libs/constants/mqttMessage';
import { RequestUser } from '../../libs/types/index.d';
import {
  calculateSensorAverage,
  convertSignal,
  decodeControllerVersion,
  getDateTime,
  topicToMac,
} from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { extractMqttHeader } from '../../libs/utils/mqttParser';
import { base, smartcontroller } from '../../proto/bundle';
import {
  SendControllerSensorsList,
  SmartControllerPublisher,
} from '../publisher/smartController.publisher';

type BaseResponse = {
  meta: string;
  error: { num?: number; msg: string };
};

interface InfoDeviceResponse extends BaseResponse {
  infoDevice: { firmware: number; hardware: number };
}

interface ControllerDataResponse extends BaseResponse {
  controllerData: {
    temp: number[];
    humi: number[];
    rssi: number;
    extTemp: number;
    extHumi: number;
  };
}

@Service()
export class SmartControllerSubscriber {
  @Inject(Logger)
  private logger: Logger;

  @Inject(IOTDeviceSettingsDAO)
  private iotDeviceSettingsDAO: IOTDeviceSettingsDAO;

  @Inject(IotDeviceDAO)
  private iotDeviceDAO: IotDeviceDAO;

  @Inject(IotControllerESDAO)
  private controllerEs: IotControllerESDAO;

  @Inject(SmartControllerPublisher)
  private smartControllerPublisher: SmartControllerPublisher;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  // eslint-disable-next-line class-methods-use-this
  decodeSmartControllerPayload<T = { [key: string]: any }>(payloadBuffer: Buffer): T {
    const payloadBufferWithoutCRC = payloadBuffer.slice(0, payloadBuffer.length - 2);
    const decoded = smartcontroller.ControllerContent.decode(payloadBufferWithoutCRC);

    return decoded.toJSON() as T;
  }

  async handleSmartControllerSubscribe(topic: string, payloadBuffer: Buffer) {
    const deviceId = topic.split('/').pop() as string;
    const mac = topicToMac(deviceId.substring(2, MAC_LENGTH));
    const result = this.decodeSmartControllerPayload(payloadBuffer);

    const basePayload = base.BasePayload.decode(payloadBuffer.slice(0, payloadBuffer.length - 2));
    const meta = extractMqttHeader(Buffer.from(basePayload.meta));
    const timestamp = parseInt(getDateTime(meta.timestamp), 10);

    if (result.error) {
      if (result.error && result.error.num && result.error.num !== MQTT_ERROR_CODE[0].num) {
        await this.controllerEs.saveToElastic<Record<string, string>>(
          mac,
          {
            error: result.error,
            raw: payloadBuffer.toString('hex'),
          },
          timestamp,
        );

        this.logger.error({
          error: result.error,
          topic,
          payload: payloadBuffer.toString('hex'),
        });
        return;
      }
    }

    let elastic;
    if (result.infoDevice) {
      const resultData = result as InfoDeviceResponse;
      elastic = {
        version: decodeControllerVersion(resultData.infoDevice.firmware),
        hardwareVersion: decodeControllerVersion(resultData.infoDevice.hardware),
        raw: payloadBuffer.toString('hex'),
      };
    } else if (result.controllerData) {
      const resultData = result as ControllerDataResponse;
      const temperatureData = resultData.controllerData.temp;
      const humidityData = resultData.controllerData.humi;
      const temperatureExtData = resultData.controllerData.extTemp / 10;
      const humidityExtData = resultData.controllerData.extHumi / 10;
      const temperatures: Record<string, number> = {};
      const humiditys: Record<string, number> = {};
      const fans: Record<string, object> = {};
      const intermits: Record<string, object> = {};
      let heater;
      let cooler;
      let lamp;
      let alarms;

      temperatureData.forEach((item, index) => {
        temperatures[`temperature${index + 1}`] = item / 10;
      });

      const temperatureAvgSht = temperatureData.includes(0)
        ? (temperatureData.filter((x) => x).pop() || 0) / 10
        : temperatureData.reduce((a, b) => a + b) / temperatureData.length / 10;

      humidityData.forEach((item, index) => {
        humiditys[`humidity${index + 1}`] = item / 10;
      });

      const humidityAvgSht = humidityData.includes(0)
        ? (humidityData.filter((x) => x).pop() || 0) / 10
        : humidityData.reduce((a, b) => a + b) / humidityData.length / 10;

      if (temperatureExtData > 0.0 && humidityExtData > 0.0) {
        // for Average temperature
        temperatures.temperatureAvgExt = temperatureExtData;
        temperatures.temperatureAvgSht = temperatureAvgSht;
        temperatures.temperatureAvg = calculateSensorAverage(temperatureExtData, temperatureAvgSht);

        // For Average humidity
        humiditys.humidityAvgExt = humidityExtData;
        humiditys.humidityAvgSht = humidityAvgSht;
        humiditys.humidityAvg = calculateSensorAverage(humidityExtData, humidityAvgSht);
      } else {
        // for data temp/humi if External sensor disabled
        temperatures.temperatureAvg = temperatureAvgSht;
        humiditys.humidityAvg = humidityAvgSht;
      }

      result.controllerData.fan?.forEach((fanData: any, index: number) => {
        if (fanData.leveltime) {
          fans[`fan${index + 1}`] = fanData.leveltime.map((time: any) => convertSignal(time));
        } else {
          fans[`fan${index + 1}`] = {};
        }
      });

      if (result.controllerData.heater && result.controllerData.heater.leveltime) {
        heater = result.controllerData.heater.leveltime.map((time: any) => convertSignal(time));
      }

      if (result.controllerData.cooler && result.controllerData.cooler.leveltime) {
        cooler = result.controllerData.cooler.leveltime.map((time: any) => convertSignal(time));
      }

      if (result.controllerData.lamp && result.controllerData.lamp.leveltime) {
        lamp = result.controllerData.lamp.leveltime.map((time: any) => convertSignal(time));
      }

      if (result.controllerData.alarm && result.controllerData.alarm.leveltime) {
        alarms = result.controllerData.alarm.leveltime.map((time: any) => convertSignal(time));
      }

      result.controllerData.intermit?.forEach((intermitData: any, index: number) => {
        if (intermitData.leveltime) {
          intermits[`intermit${index + 1}`] = intermitData.leveltime.map((time: any) =>
            convertSignal(time),
          );
        } else {
          intermits[`intermit${index + 1}`] = {};
        }
      });

      elastic = {
        ...result.controllerData,
        temperatures,
        humiditys,
        fan: fans,
        intermit: intermits,
        heater,
        cooler,
        lamp,
        alarms,
        rssi: resultData.controllerData.rssi,
        raw: payloadBuffer.toString('hex'),
      };
      if (temperatures.temperatureAvgExt > 0 && humiditys.humidityAvgExt > 0) {
        // changes to temperatures.temperatureAvgExt & humiditys.humidityAvgExt
        delete elastic.extHumi;
        delete elastic.extTemp;
      }

      delete elastic.alarm;
    } else if (result.controllerStatus) {
      // alert object
      const controllerStatus: Record<string, object> = {
        rtc: result.controllerStatus.rtc,
        relay: result.controllerStatus.relay,
        modbus: result.controllerStatus.modbus,
        sdcard: result.controllerStatus.sdcard,
        eeprom: result.controllerStatus.eeprom,
        stm32: result.controllerStatus.stm32,
        hot: result.controllerStatus.hot,
        cold: result.controllerStatus.cold,
        undervolt: result.controllerStatus.undervolt,
        button: result.controllerStatus.button,
      };

      // get device info
      const device = await this.iotDeviceDAO.getOne({
        relations: {
          coop: {
            farm: {
              branch: true,
            },
          },
          building: true,
          room: {
            roomType: true,
          },
        },
        where: {
          mac: mac.toLowerCase(),
        },
      });

      // check for hot alarm
      const hot: Record<string, object> = {};
      if (result.controllerStatus.hot) {
        hot.hot = controllerStatus.hot;
        // send notification to slack
        if (device) {
          await this.slackDAO.sendIotAlert(
            env.IOT_HOT_COLD_ALERTS_WEBHOOK,
            'HOT ALARM (CONTROLLER)',
            device,
            hot,
          );
        }
      }

      // check for hot alarm
      const cold: Record<string, object> = {};
      if (result.controllerStatus.cold) {
        cold.cold = controllerStatus.cold;
        // send notification to slack
        if (device) {
          await this.slackDAO.sendIotAlert(
            env.IOT_HOT_COLD_ALERTS_WEBHOOK,
            'COLD ALARM (CONTROLLER)',
            device,
            cold,
          );
        }
      }

      // check for errorSht20
      const errorSht20: Record<string, object> = {};
      if (result.controllerStatus.errorSht20) {
        result.controllerStatus.errorSht20?.forEach((item: any, index: number) => {
          errorSht20[`${index + 1}`] = item;
        });
        controllerStatus.errorSht20 = errorSht20;

        // send notification to slack
        if (device) {
          await this.slackDAO.sendIotAlert(
            env.IOT_ALERTS_WEBHOOK,
            'ERROR SHT20',
            device,
            errorSht20,
            env.IOT_ALERTS_SLACK_ID,
          );
        }
      }

      elastic = {
        controllerStatus,
      };
    } else {
      const resultData = result;
      delete resultData.error;
      delete resultData.meta;

      elastic = resultData;
    }

    await this.controllerEs.saveToElastic(mac, elastic, timestamp);
  }

  async handleSmartControllerReply(topic: string, payloadBuffer: Buffer) {
    const deviceId = topic.split('/').pop() as string;
    const mac = topicToMac(deviceId.substring(2, MAC_LENGTH));
    const result = this.decodeSmartControllerPayload(payloadBuffer);
    const user: RequestUser = {
      id: `system${env.isDev ? '-local' : ''}`,
      role: 'system',
    };

    const basePayload = base.BasePayload.decode(payloadBuffer.slice(0, payloadBuffer.length - 2));
    const meta = extractMqttHeader(Buffer.from(basePayload.meta));
    const timestamp = parseInt(getDateTime(meta.timestamp), 10);

    if (result.error) {
      if (result.error && result.error.num && result.error.num !== MQTT_ERROR_CODE[0].num) {
        await this.controllerEs.saveToElastic<Record<string, string>>(
          mac,
          {
            error: result.error,
            raw: payloadBuffer.toString('hex'),
          },
          timestamp,
        );

        this.logger.error({
          error: result.error,
          topic,
          payload: payloadBuffer.toString('hex'),
        });
        return;
      }
    }

    let elastic;
    if (
      meta.messageCode === MQTT_MESSAGE_CODE.REPLY.SET_SETTINGS ||
      meta.messageCode === MQTT_MESSAGE_CODE.REPLY.GET_SETTINGS ||
      meta.messageCode === MQTT_MESSAGE_CODE.CHANGE.SET_SETTINGS
    ) {
      if (result.controllerSetting) {
        const device = await this.iotDeviceDAO.getOneStrict({
          where: { mac, deletedDate: IsNull() },
        });
        await this.iotDeviceSettingsDAO.createOne(
          {
            iotDeviceId: device.id,
            settings: result,
          },
          user,
        );
      }
    }

    if (result.infoDevice) {
      const resultData = result as InfoDeviceResponse;
      elastic = {
        version: decodeControllerVersion(resultData.infoDevice.firmware),
        hardwareVersion: decodeControllerVersion(resultData.infoDevice.hardware),
        raw: payloadBuffer.toString('hex'),
      };
    } else if (result.controllerData) {
      const resultData = result as ControllerDataResponse;
      const temperatureData = resultData.controllerData.temp;
      const humidityData = resultData.controllerData.humi;
      const temperatures: Record<string, number> = {};
      const humiditys: Record<string, number> = {};
      const fans: Record<string, object> = {};
      const intermits: Record<string, object> = {};
      let heater;
      let cooler;
      let lamp;
      let alarm;

      temperatureData.forEach((item, index) => {
        temperatures[`temperature${index + 1}`] = item / 10;
      });

      temperatures.temperatureAvg = temperatureData.includes(0)
        ? (temperatureData.filter((x) => x).pop() || 0) / 10
        : temperatureData.reduce((a, b) => a + b) / temperatureData.length / 10;

      humidityData.forEach((item, index) => {
        humiditys[`humidity${index + 1}`] = item / 10;
      });

      humiditys.humidityAvg = humidityData.includes(0)
        ? (humidityData.filter((x) => x).pop() || 0) / 10
        : humidityData.reduce((a, b) => a + b) / humidityData.length / 10;

      result.controllerData.fan?.forEach((fanData: any, index: number) => {
        if (fanData.leveltime) {
          fans[`fan${index + 1}`] = fanData.leveltime.map((time: any) => convertSignal(time));
        } else {
          fans[`fan${index + 1}`] = {};
        }
      });

      if (result.controllerData.heater && result.controllerData.heater.leveltime) {
        heater = result.controllerData.heater.leveltime.map((time: any) => convertSignal(time));
      }

      if (result.controllerData.cooler && result.controllerData.cooler.leveltime) {
        cooler = result.controllerData.cooler.leveltime.map((time: any) => convertSignal(time));
      }

      if (result.controllerData.lamp && result.controllerData.lamp.leveltime) {
        lamp = result.controllerData.lamp.leveltime.map((time: any) => convertSignal(time));
      }

      if (result.controllerData.alarm && result.controllerData.alarm.leveltime) {
        alarm = result.controllerData.alarm.leveltime.map((time: any) => convertSignal(time));
      }

      result.controllerData.intermit?.forEach((intermitData: any, index: number) => {
        if (intermitData.leveltime) {
          intermits[`intermit${index + 1}`] = intermitData.leveltime.map((time: any) =>
            convertSignal(time),
          );
        } else {
          intermits[`intermit${index + 1}`] = {};
        }
      });

      elastic = {
        ...result.controllerData,
        temperatures,
        humiditys,
        fan: fans,
        intermit: intermits,
        heater,
        cooler,
        lamp,
        alarm,
        rssi: result.controllerData.rssi,
        raw: payloadBuffer.toString('hex'),
      };
    } else {
      const resultData = result;
      delete resultData.error;
      delete resultData.meta;

      elastic = resultData;
    }

    await this.controllerEs.saveToElastic(mac, elastic, timestamp);
  }

  async handleSmartControllerRequest(topic: string, payloadBuffer: Buffer) {
    const deviceId = topic.split('/').pop() as string;
    const mac = topicToMac(deviceId.substring(2, MAC_LENGTH));
    const result = this.decodeSmartControllerPayload(payloadBuffer);

    const basePayload = base.BasePayload.decode(payloadBuffer.slice(0, payloadBuffer.length - 2));
    const meta = extractMqttHeader(Buffer.from(basePayload.meta));
    const timestamp = parseInt(getDateTime(meta.timestamp), 10);

    if (result.error) {
      if (result.error && result.error.num && result.error.num !== MQTT_ERROR_CODE[0].num) {
        await this.controllerEs.saveToElastic<Record<string, string>>(
          mac,
          {
            error: result.error,
            raw: payloadBuffer.toString('hex'),
          },
          timestamp,
        );

        this.logger.error({
          error: result.error,
          topic,
          payload: payloadBuffer.toString('hex'),
        });
      }
    }

    const device = await this.iotDeviceDAO.getOneStrict({
      where: {
        mac,
        deletedDate: IsNull(),
      },
    });

    const smartMonitor = await this.iotDeviceDAO.getOne({
      where: {
        roomId: device.roomId || undefined,
        deviceType: DEVICE_TYPE.SMART_MONITORING.value as keyof typeof DEVICE_TYPE,
        deletedDate: IsNull(),
        sensors: {
          deletedDate: IsNull(),
        },
      },
      relations: {
        sensors: true,
      },
    });

    const sensorCodes = smartMonitor?.sensors.length
      ? smartMonitor.sensors.map((item) => {
          const clean = item.sensorCode.replace(/^ATC_/, '01');
          const hex = parseInt(clean, 16);

          return hex;
        })
      : [];

    await this.smartControllerPublisher.sendSmartControllerResponse<SendControllerSensorsList>({
      macAddress: mac,
      commandType: MQTT_MESSAGE_CODE.REPLY.SEND_SENSORS_LIST,
      payload: {
        atc: sensorCodes,
        mac: smartMonitor ? smartMonitor.mac.toLowerCase().split(':').join('') : '',
      },
    });
  }

  static async handleSmartControllerSubscribeWrapper(topic: string, payload: Buffer) {
    const self = getInstanceByToken<SmartControllerSubscriber>(SmartControllerSubscriber);

    const basePayload = base.BasePayload.decode(payload.slice(0, payload.length - 2));
    const meta = extractMqttHeader(Buffer.from(basePayload.meta));

    if (
      meta.messageType === MQTT_MESSAGE_TYPE.REPORT ||
      meta.messageType === MQTT_MESSAGE_TYPE.ALERT
    ) {
      await self.handleSmartControllerSubscribe(topic, payload);
    }

    if (
      meta.messageType === MQTT_MESSAGE_TYPE.REPLY ||
      meta.messageType === MQTT_MESSAGE_TYPE.CHANGE
    ) {
      await self.handleSmartControllerReply(topic, payload);
    }

    if (meta.messageType === MQTT_MESSAGE_TYPE.REQUEST) {
      await self.handleSmartControllerRequest(topic, payload);
    }
  }
}
