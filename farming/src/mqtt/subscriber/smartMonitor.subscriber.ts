import { sub } from 'date-fns';
import { getInstanceByToken, Inject, Service } from 'fastify-decorators';
import { IsNull } from 'typeorm';
import env from '../../config/env';
import { DailyMonitoringDAO } from '../../dao/dailyMonitoring.dao';
import { IotSensorESDAO } from '../../dao/es/iotSensor.es.dao';
import { SensorESDAO } from '../../dao/es/sensor.es.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { IotDeviceDAO } from '../../dao/IotDevice.dao';
import { TargetDAO } from '../../dao/target.dao';
import { TargetDaysDDAO } from '../../dao/targetDaysD.dao';
import { RedisConnection } from '../../datasources/connection/redis.connection';
import { StatsdConnection } from '../../datasources/connection/statsd.connection';
import { IotSensor } from '../../datasources/entity/pgsql/IotSensor.entity';
import {
  DIVIDER,
  MAC_LENGTH,
  MQTT_ERROR_CODE,
  MQTT_MONITOR_STATUS,
} from '../../libs/constants/mqttMessage';
import { decodeFirmwareVersion, getDateTimeString, topicToMac } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import {
  commandReply,
  errorMonitor,
  extractMqttHeader,
  generateIdXiaomi,
} from '../../libs/utils/mqttParser';
import { base, smartmonitor } from '../../proto/bundle';

type BaseResponse = {
  meta: string;
  error: { num?: number; msg: string };
};

interface InfoDeviceResponse extends BaseResponse {
  infoDevice: { firmware: number; hardware: number };
}

@Service()
export class SmartMonitorSubscriber {
  @Inject(StatsdConnection)
  private statsdConnection: StatsdConnection;

  @Inject(RedisConnection)
  private redisConnection: RedisConnection;

  @Inject(IotDeviceDAO)
  private IotDeviceDAO: IotDeviceDAO;

  @Inject(Logger)
  private logger: Logger;

  @Inject(IotSensorESDAO)
  private sensorEs: IotSensorESDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(SensorESDAO)
  private sensorESDAO: SensorESDAO;

  @Inject(TargetDaysDDAO)
  private targetDaysDDAO: TargetDaysDDAO;

  @Inject(TargetDAO)
  private targetDAO: TargetDAO;

  @Inject(DailyMonitoringDAO)
  private dailyMonitoringDAO: DailyMonitoringDAO;

  async updatePeriodic(topic: string, payloadBuffer: Buffer) {
    // decode protobuf message
    const decode = this.decodeSmartMonitorPayload(payloadBuffer);
    const meta = this.decodeSmartMonitorMeta(topic, payloadBuffer);
    const nowUnix = Date.now();

    const device = await this.IotDeviceDAO.getOne({
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
        sensors: {
          room: {
            roomType: true,
          },
        },
      },
      where: {
        mac: meta.mac.toLowerCase(),
      },
    });
    // get sensor codes registered in fms
    const sensorCodes = device?.sensors.map((item) => item.sensorCode);

    const data: any = {};
    const onlineSensors: string[] = [];
    const abnormalTempSensors: string[] = [];
    const abnormalTemps: number[] = [];
    decode.monitorData?.local?.xiaomis?.forEach((item) => {
      // get sensor index (s1, s2, ...)
      const sensorId = generateIdXiaomi(item.id);
      const index = sensorCodes?.indexOf(sensorId);
      onlineSensors.push(sensorId);
      if (item.temp! < 100 || item.temp! > 500) {
        abnormalTempSensors.push(sensorId);
        abnormalTemps.push(item.temp!);
      }

      data[`s${index! + 1}`] = {
        id: generateIdXiaomi(item.id),
        t: item.temp!,
        h: item.humi,
        b: item.batt,
        // eslint-disable-next-line no-bitwise
        s: item.rssi! >> 0,
      };
    });

    // slack notification for offline xiaomi sensors
    const timeDiff = nowUnix - Date.parse(meta.timestamp);
    const tenMinutesUnix = 600000;
    if (onlineSensors.length < (sensorCodes?.length || 0) && timeDiff < tenMinutesUnix) {
      // prevent backup data from being checked
      await this.alertOfflineSensors(onlineSensors, meta, device, decode);
    }

    // slack notification for errant xiaomi sensors
    if (abnormalTempSensors.length > 0 && timeDiff < tenMinutesUnix) {
      // prevent backup data from being checked
      await this.alertAbnormalTemp(device, meta, abnormalTempSensors, abnormalTemps);
    }

    // await this.checkHotColdTemp(device, data, meta);

    decode.monitorData?.remote?.xiaomis?.forEach((item, idx) => {
      data[`s${idx + 5}`] = {
        id: generateIdXiaomi(item.id),
        t: item.temp!,
        h: item.humi,
        b: item.batt,
        // eslint-disable-next-line no-bitwise
        s: item.rssi! >> 0,
      };
    });

    if (decode.monitorData?.local?.room) {
      data.roomLocal = decode.monitorData.local.room!;
    }

    if (decode.monitorData?.remote?.room) {
      data.roomRemote = decode.monitorData.remote.room!;
    }

    if (decode.monitorData?.local?.light) {
      data.l = Number((decode.monitorData.local.light! / DIVIDER.FLOAT).toFixed(2));
    }

    if (decode.monitorData?.local?.wind) {
      data.w = Number((decode.monitorData.local.wind.speed! / DIVIDER.FLOAT).toFixed(2));
    }

    let ppm;
    if (decode.monitorData?.local?.ammoniaMics) {
      ppm = Number(
        SmartMonitorSubscriber.ammonia(
          decode.monitorData.local.ammoniaMics.rs! / DIVIDER.FLOAT,
          decode.monitorData.local.ammoniaMics.ro! / DIVIDER.FLOAT,
        ).toFixed(2),
      );
    }

    if (decode.monitorData?.local?.nh3wsModbus) {
      data.ammoModbusA = Number(decode.monitorData.local.nh3wsModbus.ammo);
      data.ammoModbusH = Number(decode.monitorData.local.nh3wsModbus.humi);
      data.ammoModbusT = Number(decode.monitorData.local.nh3wsModbus.temp);
    }

    if (decode.monitorData?.local?.errorCodeSensor) {
      data.errorCode = decode.monitorData.local.errorCodeSensor;
      data.errorMsg = data.errorCode;
    }

    try {
      await this.sensorEs.saveDataToElastic(meta.mac, { ...data, a: { ppm } }, meta.timestamp);
    } catch (error) {
      this.logger.error(error);
    }

    // check for anomaly
    // await this.checkAnomaly(meta.mac, meta.deviceId);
  }

  async alertOfflineSensors(onlineSensors: string[], meta: any, device: any, decode: any) {
    // get past hour data from elastic
    const now = new Date();
    const response = await this.sensorESDAO.getManyByMac(
      [meta.mac.toLowerCase()],
      {
        from: sub(now, { hours: 1 }),
        to: now,
      },
      undefined,
    );
    // eslint-disable-next-line no-underscore-dangle
    const esData = response.map((item) => item._source?.sensors);

    const offlineSensors: IotSensor[] = [];
    const promises: Promise<any>[] = [];
    device?.sensors.forEach((item: IotSensor, index: number) => {
      // check if sensor is offline in elastic for the past hour
      if (!onlineSensors.includes(item.sensorCode)) {
        const sensors = esData
          .map((sensor) => (sensor as any)?.[`s${index + 1}`]?.id)
          .filter((sensor) => sensor !== undefined);

        if (sensors.length === 0) {
          const promise = (async () => {
            // find message in slack with corresponding sensor code
            const message = await this.slackDAO.getAlertMessage(
              env.IOT_ALERTS_SEARCH_TOKEN,
              item.sensorCode,
              env.isProd ? 'alert-iot-prod' : 'alert-iot-staging',
            );

            // check whether 24 hours has passed since last alert
            if (message.messages.matches.length) {
              const lastNotificationTime = parseInt(message.messages.matches[0].ts, 10) * 1000;
              const nextNotificationTime = lastNotificationTime + 24 * 60 * 60 * 1000;

              if (now.getTime() > nextNotificationTime) {
                offlineSensors.push(item);
              }
            } else {
              offlineSensors.push(item);
            }
          })();

          promises.push(promise);
        }
      }
    });

    await Promise.allSettled(promises);

    // send notification to slack
    if (offlineSensors.length) {
      await this.slackDAO.sendIotAlert(
        env.IOT_ALERTS_WEBHOOK,
        'XIAOMI SENSOR OFFLINE',
        { ...device!, sensors: offlineSensors },
        {
          ...errorMonitor(decode.monitorData?.local?.errorCodeSensor!),
          timestamp: new Intl.DateTimeFormat('en-GB', {
            dateStyle: 'full',
            timeStyle: 'long',
            timeZone: 'Asia/Jakarta',
          }).format(new Date(meta.timestamp)),
        },
        env.IOT_ALERTS_SLACK_ID,
      );
    }
  }

  async alertAbnormalTemp(
    device: any,
    meta: any,
    abnormalTempSensors: string[],
    abnormalTemps: number[],
  ) {
    const now = new Date();
    const errantSensors: IotSensor[] = [];
    const data: { sensorCode: string; temp: number }[] = [];
    const promises: Promise<any>[] = [];
    device?.sensors.forEach((item: IotSensor) => {
      if (abnormalTempSensors.includes(item.sensorCode)) {
        const promise = (async () => {
          // find message in slack with corresponding sensor code
          const message = await this.slackDAO.getAlertMessage(
            env.IOT_ALERTS_SEARCH_TOKEN,
            item.sensorCode,
            env.isProd ? 'alert-iot-prod' : 'alert-iot-staging',
          );

          // check whether 24 hours has passed since last alert
          if (message.messages.matches.length) {
            const lastNotificationTime = parseInt(message.messages.matches[0].ts, 10) * 1000;
            const nextNotificationTime = lastNotificationTime + 24 * 60 * 60 * 1000;

            if (now.getTime() > nextNotificationTime) {
              errantSensors.push(item);
              data.push({
                sensorCode: item.sensorCode,
                temp: abnormalTemps[abnormalTempSensors.indexOf(item.sensorCode)] / 10,
              });
            }
          } else {
            errantSensors.push(item);
            data.push({
              sensorCode: item.sensorCode,
              temp: abnormalTemps[abnormalTempSensors.indexOf(item.sensorCode)] / 10,
            });
          }
        })();

        promises.push(promise);
      }
    });

    await Promise.allSettled(promises);

    // send notification to slack
    if (errantSensors.length) {
      await this.slackDAO.sendIotAlert(
        env.IOT_ALERTS_WEBHOOK,
        'XIAOMI SENSOR ABNORMAL TEMPERATURE',
        {
          ...device!,
          sensors: errantSensors,
          timestamp: new Intl.DateTimeFormat('en-GB', {
            dateStyle: 'full',
            timeStyle: 'long',
            timeZone: 'Asia/Jakarta',
          }).format(new Date(meta.timestamp)),
        },
        data,
        env.IOT_ALERTS_SLACK_ID,
      );
    }
  }

  async alertHotColdTemp(device: any, data: any, meta: any) {
    // check for hot cold temperatures
    if (
      ['SRG', 'BGR'].includes(device?.coop.farm.branch?.code!) &&
      [1, 2, 3, 4].includes(device?.room.roomType.level!)
    ) {
      const temperatures = Object.values(data)
        .map((value: any) => value.t)
        .filter((t) => t >= 0 && t <= 600);

      const avgTemp = temperatures.reduce((a, b) => a + b, 0) / temperatures.length / 10;
      const day = await this.dailyMonitoringDAO.getOne({
        where: {
          farmingCycleId: device?.coop.activeFarmingCycleId!,
        },
        order: {
          day: 'desc',
        },
      });

      const target = await this.targetDAO.getOne({
        where: {
          coopTypeId: device?.coop.coopTypeId,
          chickTypeId: device?.coop.chickTypeId,
          variable: {
            variableName: 'TEMPERATURE',
          },
        },
      });

      const targetDay = await this.targetDaysDDAO.getOne({
        where: {
          targetId: target?.id,
          day: day?.day,
        },
      });

      const thresholdTemp = {
        threshold: {
          day: day?.day,
          hotThreshold: targetDay?.maxValue,
          coldThreshold: targetDay?.minValue,
        },
      };

      if (avgTemp > thresholdTemp.threshold.hotThreshold!) {
        const message = await this.slackDAO.getAlertMessage(
          env.IOT_ALERTS_SEARCH_TOKEN,
          `HOT ALARM (HUB) ${meta.mac.toLowerCase()}`,
          env.isProd ? 'alert-iot-hot-cold-prod' : 'alert-iot-hot-cold-staging',
        );

        // check whether 1 hour has passed since last alert
        const now = new Date();
        if (message.messages.matches.length) {
          const lastNotificationTime = parseInt(message.messages.matches[0].ts, 10) * 1000;
          const nextNotificationTime = lastNotificationTime + 1 * 60 * 60 * 1000;

          if (now.getTime() > nextNotificationTime) {
            await this.slackDAO.sendIotAlert(
              env.IOT_HOT_COLD_ALERTS_WEBHOOK,
              'HOT ALARM (HUB)',
              { ...device!, sensors: [] },
              { ...thresholdTemp, avgRoomTemp: avgTemp },
            );
          }
        } else {
          await this.slackDAO.sendIotAlert(
            env.IOT_HOT_COLD_ALERTS_WEBHOOK,
            'HOT ALARM (HUB)',
            { ...device!, sensors: [] },
            { ...thresholdTemp, avgRoomTemp: avgTemp },
          );
        }
      } else if (avgTemp < thresholdTemp.threshold.coldThreshold!) {
        const message = await this.slackDAO.getAlertMessage(
          env.IOT_ALERTS_SEARCH_TOKEN,
          `COLD ALARM (HUB) , ${meta.mac.toLowerCase()}`,
          env.isProd ? 'alert-iot-hot-cold-prod' : 'alert-iot-hot-cold-staging',
        );

        // check whether 1 hour has passed since last alert
        const now = new Date();
        if (message.messages.matches.length) {
          const lastNotificationTime = parseInt(message.messages.matches[0].ts, 10) * 1000;
          const nextNotificationTime = lastNotificationTime + 1 * 60 * 60 * 1000;

          if (now.getTime() > nextNotificationTime) {
            await this.slackDAO.sendIotAlert(
              env.IOT_HOT_COLD_ALERTS_WEBHOOK,
              'COLD ALARM (HUB)',
              { ...device!, sensors: [] },
              { ...thresholdTemp, avgRoomTemp: avgTemp },
            );
          }
        } else {
          await this.slackDAO.sendIotAlert(
            env.IOT_HOT_COLD_ALERTS_WEBHOOK,
            'COLD ALARM (HUB)',
            { ...device!, sensors: [] },
            { ...thresholdTemp, avgRoomTemp: avgTemp },
          );
        }
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  decodeSmartMonitorPayload(payloadBuffer: Buffer) {
    const payloadBufferWithoutCRC = payloadBuffer.slice(0, payloadBuffer.length - 2);
    const decoded = smartmonitor.MonitorContent.decode(payloadBufferWithoutCRC);

    return decoded;
  }

  // eslint-disable-next-line class-methods-use-this
  decodeSmartMonitorMeta(topic: string, payloadBuffer: Buffer) {
    const basePayload = base.BasePayload.decode(payloadBuffer.slice(0, payloadBuffer.length - 2));
    const meta = extractMqttHeader(Buffer.from(basePayload.meta));
    const timestamp = getDateTimeString(meta.timestamp);
    const deviceId = topic.split('/').pop() as string;
    const mac = topicToMac(deviceId.substring(2, MAC_LENGTH));

    return {
      timestamp,
      deviceId,
      mac,
    };
  }

  async checkAnomaly(mac: string, deviceId: string) {
    const device = await this.IotDeviceDAO.getOne({
      where: {
        mac,
        deletedDate: IsNull(),
      },
    });

    if (device && device.status) {
      const REDIS_PREFIX = 'iot:';

      const metricName = `${deviceId}_electricity`;
      const self = getInstanceByToken<SmartMonitorSubscriber>(SmartMonitorSubscriber);
      const prev = await self.redisConnection.connection.get(REDIS_PREFIX + metricName);
      const now = Date.now();
      self.redisConnection.connection.set(REDIS_PREFIX + metricName, now);
      const maxTimeDiff = env.IOT_DEVICE_ALERT_TIMEOUT;

      if (prev && now - Number(prev) > maxTimeDiff) {
        self.sendGauge(metricName, 0);
      }
    }
  }

  async handleSmartMonitorSubscribe(topic: string, payloadBuffer: Buffer) {
    const deviceId = topic.split('/').pop() as string;
    const mac = topicToMac(deviceId.substring(2, MAC_LENGTH));
    const result = this.decodeSmartMonitorPayload(payloadBuffer).toJSON();

    const basePayload = base.BasePayload.decode(payloadBuffer.slice(0, payloadBuffer.length - 2));
    const meta = extractMqttHeader(Buffer.from(basePayload.meta));

    const timestamp = getDateTimeString(meta.timestamp);

    if (result.error) {
      if (result.error && result.error.num && result.error.num !== MQTT_ERROR_CODE[0].num) {
        await this.sensorEs.saveDataToElastic<Record<string, string>>(
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
        firmwareVersion: decodeFirmwareVersion(resultData.infoDevice.firmware),
        hardwareVersion: decodeFirmwareVersion(resultData.infoDevice.hardware),
        raw: payloadBuffer.toString('hex'),
      };
    } else {
      const resultData = result;
      delete resultData.error;
      delete resultData.meta;

      elastic = resultData;
    }
    try {
      await this.sensorEs.saveDataToElastic(mac, elastic, timestamp);
    } catch (error) {
      this.logger.error(error);
    }
  }

  static async updatePeriodicWraper(topic: string, payload: Buffer) {
    const self = getInstanceByToken<SmartMonitorSubscriber>(SmartMonitorSubscriber);
    await self.updatePeriodic(topic, payload);
  }

  static async handleSmartMonitorSubscribeWrapper(topic: string, payload: Buffer) {
    const self = getInstanceByToken<SmartMonitorSubscriber>(SmartMonitorSubscriber);
    await self.handleSmartMonitorSubscribe(topic, payload);
  }

  async sendGauge(name: string, value: number) {
    this.statsdConnection.client.gauge(name, value);
  }

  static async sendMetricWrapper(topic: string, payload: Buffer) {
    // TODO: remove once statsd is ready to be integrated
    if (env.STATSD_IS_ACTIVE) {
      // reprocess payload, without checking CRC
      const payloadWithoutCRC = payload.slice(0, payload.length - 2);

      const content = smartmonitor.MonitorContent.decode(payloadWithoutCRC);

      // process the status bits
      const deviceId = topic.split('/').pop() as string;

      const self = getInstanceByToken<SmartMonitorSubscriber>(SmartMonitorSubscriber);

      MQTT_MONITOR_STATUS.forEach((monitorStatus, i) => {
        const metricName = `${deviceId}_${monitorStatus}`;

        if (content.monitorStatus?.status) {
          const { status } = content.monitorStatus;

          const shift = 2 ** i;

          const bitset = (status / shift) % 2 !== 0;

          self.sendGauge(metricName, bitset ? 1 : 0);
        }
      });
    }
  }

  private static ammonia(Rs: number, R0: number): number {
    /*
      y = Rs / R0
      z = (log y - b) / m
      ppm = 10^z

      where b = -0.1043, m = -0.538
    */

    const b = -0.1043;
    const m = -0.538;
    const y = Rs / R0;
    const z = (Math.log10(y) - b) / m;

    return 10 ** z;
  }

  static async diagnosticsDataWrapper(topic: string, payload: Buffer) {
    const self = getInstanceByToken<SmartMonitorSubscriber>(SmartMonitorSubscriber);
    await self.parseDiagnosticsData(topic, payload);
  }

  async parseDiagnosticsData(topic: string, payloadBuffer: Buffer) {
    // decode protobuf message
    const decode = this.decodeSmartMonitorPayload(payloadBuffer);
    const meta = this.decodeSmartMonitorMeta(topic, payloadBuffer);

    // parse protobuf payload
    const data: any = {};
    if (decode.diagnosticsData) {
      data.unixTimeData = Number(decode.diagnosticsData.unixTimeData!);
      data.pingResponseTime = decode.diagnosticsData.pingResponseTime!;
      data.wifiRSSI = decode.diagnosticsData.wifiRSSI!;
      data.minFreeHeapSinceBoot = decode.diagnosticsData.minFreeHeapSinceBoot!;
    }

    // send data to elastic
    try {
      await this.sensorEs.saveDiagnosticsToElastic(meta.mac, data, meta.timestamp);
    } catch (error) {
      this.logger.error(error);
    }
  }

  /**
   * @description this function for all reply message (based command server) from device
   * @param topic topic of message (ex : /u/emxxxxxxxxxxxx)
   * @param payloadBuffer payload of message
   */
  async parseReplyDevice(topic: string, payloadBuffer: Buffer) {
    // decode protobuf message
    const decode = this.decodeSmartMonitorPayload(payloadBuffer);
    const meta = this.decodeSmartMonitorMeta(topic, payloadBuffer);
    const data: any = {};

    // reply command store r0 mics
    if (decode.storeR0) {
      data.micsR0 = decode.storeR0.r0Value!;
    }

    // check error message command
    if (decode.error) {
      data.errorMsg = {
        num: Number(decode.error.num),
        msg: decode.error.msg!.toString(),
      };
    }

    // parse reply info device
    if (decode.infoDevice) {
      data.version = {
        firmware: decodeFirmwareVersion(Number(decode.infoDevice.firmware)),
        hardware: decodeFirmwareVersion(Number(decode.infoDevice.hardware)),
      };
    }

    // parse reply ota firmware
    if (decode.ota) {
      data.ota = {
        version: decodeFirmwareVersion(Number(decode.ota.version)),
        filesize: decode.ota.filesize,
        deviceType: decode.ota.devtype,
        status: decode.ota.status === 1 ? 'success' : 'failed',
      };
    }

    // parse reply ping device
    if (decode.ping) {
      data.ping = {
        status: 'online',
      };
    }

    // parse reply maping device
    if (decode.mapDevice) {
      data.mapDevice = {
        room: decode.mapDevice.room,
        cmd: commandReply(Number(decode.mapDevice.command)),
      };
    }

    // parse reply maping sensor
    if (decode.mapSensor) {
      data.mapSensor = {
        cmd: commandReply(Number(decode.mapSensor.command)),
      };
      decode.mapSensor?.xiaomis?.forEach((item, idx) => {
        data.mapSensor[`sensor${idx + 1}`] = generateIdXiaomi(item.id);
      });
    }

    // send data to elastic
    try {
      await this.sensorEs.saveReplyDeviceToElastic(meta.mac, data, meta.timestamp);
    } catch (error) {
      this.logger.error(error);
    }
  }

  static async handlerReplyDeviceWrapper(topic: string, payload: Buffer) {
    const self = getInstanceByToken<SmartMonitorSubscriber>(SmartMonitorSubscriber);
    await self.parseReplyDevice(topic, payload);
  }
}
