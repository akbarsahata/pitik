/* eslint-disable no-underscore-dangle */
import { differenceInDays, sub } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { IsNull, Like, Not } from 'typeorm';
import { CoopDAO } from '../dao/coop.dao';
import { IotControllerESDAO } from '../dao/es/iotController.es.dao';
import { IotDeviceDAO } from '../dao/IotDevice.dao';
import { IOTDeviceSettingsDAO } from '../dao/iotDeviceSettings.dao';
import { SendSmartControllerSettingsParamsDTO } from '../dto/smartController.dto';
import { DEVICE_TYPE } from '../libs/constants';
import {
  ERR_IOT_DEVICE_SETTINGS_NOT_FOUND,
  ERR_IOT_DEVICE_SMART_CONTROLLER_NOT_EXISTS,
} from '../libs/constants/errors';
import { secondsTommss, toSensorCode } from '../libs/utils/helpers';
import { SmartControllerPublisher } from '../mqtt/publisher/smartController.publisher';

@Service()
export class SmartControllerService {
  @Inject(SmartControllerPublisher)
  protected smartControllerPublisher: SmartControllerPublisher;

  @Inject(CoopDAO)
  protected coopDAO!: CoopDAO;

  @Inject(IotControllerESDAO)
  protected iotControllerESDAO: IotControllerESDAO;

  @Inject(IotDeviceDAO)
  protected iotDeviceDAO: IotDeviceDAO;

  @Inject(IOTDeviceSettingsDAO)
  protected iotDeviceSettingsDAO: IOTDeviceSettingsDAO;

  async sendControllerSetting(params: SendSmartControllerSettingsParamsDTO) {
    const coop = await this.coopDAO.getOneStrict({
      where: {
        coopCode: Like(`%-${params.coopCode.slice(-4)}`),
      },
    });

    const controller = await this.iotDeviceDAO.getOneStrict({
      where: {
        coopId: coop.id,
        mac: params.payload.deviceId || Not(IsNull()),
        deviceType: 'SMART_CONTROLLER',
      },
    });

    await this.smartControllerPublisher.sendSmartControllerSetSettingsCommand({
      settingType: params.settingType,
      macAddress: controller.mac,
      payload: params.payload,
    });
  }

  async getControllerFanSetting(query: { coopId: string; deviceId: string }) {
    const coop = await this.coopDAO.getOneStrict({
      where: {
        coopCode: Like(`%-${query.coopId.slice(-4)}`),
      },
    });

    const controller = await this.iotDeviceDAO.getOneStrict({
      where: {
        coopId: coop.id,
        mac: query.deviceId || Not(IsNull()),
        deviceType: DEVICE_TYPE.SMART_CONTROLLER.value as keyof typeof DEVICE_TYPE,
        deletedDate: IsNull(),
      },
    });

    const payload = await this.getControllerSetting(coop.id, query.deviceId);

    const stateData = await Promise.all([
      this.iotControllerESDAO.getFanSettingsState(controller.mac, 1),
      this.iotControllerESDAO.getFanSettingsState(controller.mac, 2),
      this.iotControllerESDAO.getFanSettingsState(controller.mac, 3),
      this.iotControllerESDAO.getFanSettingsState(controller.mac, 4),
      this.iotControllerESDAO.getFanSettingsState(controller.mac, 5),
      this.iotControllerESDAO.getFanSettingsState(controller.mac, 6),
      this.iotControllerESDAO.getFanSettingsState(controller.mac, 7),
      this.iotControllerESDAO.getFanSettingsState(controller.mac, 8),
    ]);

    if (payload && payload.controllerSetting) {
      const fanSettings = payload.controllerSetting.fan.map((fan: any) => ({
        id: `FAN${fan.id}`,
        fanName: `Kipas ${fan.id}`,
        temperatureTarget: Number(fan.diff) / 10,
        periodic: stateData[fan.id - 1] || false,
        intermitten: fan.mode === 1,
        errors: false,
        status: stateData[fan.id - 1] || false,
        coopId: `f${coop.coopCode.slice(-4)}`,
      }));

      return fanSettings;
    }

    return [];
  }

  async getControllerFanDetailSetting(query: { coopId: string; id: string; deviceId: string }) {
    const coop = await this.coopDAO.getOneStrict({
      where: {
        coopCode: Like(`%-${query.coopId.slice(-4)}`),
      },
    });

    const payload = await this.getControllerSetting(coop.id, query.deviceId);
    const fanNumber = Number(query.id.slice(-1)) - 1;

    if (payload && payload.controllerSetting) {
      const { fan } = payload.controllerSetting;
      const fanSettings = {
        id: `FAN${fan[fanNumber].id}`,
        fanName: `Kipas ${fan[fanNumber].id}`,
        temperatureTarget: Number(fan[fanNumber].diff) / 10,
        onlineDuration: secondsTommss(Number(fan[fanNumber].time?.on)) || '00:00',
        offlineDuration: secondsTommss(Number(fan[fanNumber].time?.off)) || '00:00',
        intermitten: fan[fanNumber].mode === 1,
      };

      return fanSettings;
    }

    return {};
  }

  async getControllerSetting(coopId: string, mac?: string): Promise<any> {
    const controller = await this.iotDeviceDAO.getOne({
      where: {
        coopId,
        mac: mac || Not(IsNull()),
        deviceType: 'SMART_CONTROLLER',
        deletedDate: IsNull(),
      },
    });

    if (!controller) {
      throw ERR_IOT_DEVICE_SMART_CONTROLLER_NOT_EXISTS();
    }

    const result = await this.iotDeviceSettingsDAO.getOne({
      where: { iotDeviceId: controller.id },
      order: {
        createdDate: 'DESC',
      },
    });

    this.smartControllerPublisher.sendSmartControllerGetSettingsCommand({
      macAddress: controller.mac,
    });

    if (!result) {
      throw ERR_IOT_DEVICE_SETTINGS_NOT_FOUND();
    }

    return result.settings;
  }

  async getDirectControllerSetting(coopId: string): Promise<any> {
    const coop = await this.coopDAO.getOneStrict({
      where: {
        coopCode: Like(`%-${coopId.slice(-4)}`),
      },
    });

    const controller = await this.iotDeviceDAO.getOneStrict({
      where: {
        coopId: coop.id,
        deviceType: 'SMART_CONTROLLER',
        deletedDate: IsNull(),
      },
    });

    return this.smartControllerPublisher.sendSmartControllerGetSettingsCommand({
      macAddress: controller.mac,
    });
  }

  async getCoopData(coopId: string): Promise<any> {
    const coop = await this.coopDAO.getOneStrict({
      where: {
        id: coopId,
      },
      relations: {
        activeFarmingCycle: true,
      },
    });

    const [controllers] = await this.iotDeviceDAO.getMany({
      where: {
        coopId,
        deviceType: 'SMART_CONTROLLER',
      },
      relations: {
        coop: {
          activeFarmingCycle: true,
        },
        room: {
          roomType: true,
        },
      },
    });

    const farmingCycle = coop.activeFarmingCycle;

    const floorPromises = controllers.map(async (controller) => {
      const reportPromise = this.getCoopControllerLatestCondition(
        controller.coopId || '',
        controller.mac,
      );

      const report = await reportPromise;

      return {
        id: controller.id,
        coopId: toSensorCode(coop.coopCode),
        deviceId: controller.mac,
        floorName: controller.room.roomType.name,
        day:
          (farmingCycle.farmingCycleStartDate &&
            differenceInDays(new Date(), farmingCycle.farmingCycleStartDate)) ||
          null,
        periode: 1,
        chickinDate: farmingCycle.farmingCycleStartDate || null,
        temperature: report.temperature || 0,
        humidity: report.humidity || 0,
      };
    });

    const floor = await Promise.all(floorPromises);

    return {
      coopName: coop.coopName,
      floor,
    };
  }

  protected async getCoopControllerLatestCondition(coopId: string, mac?: string): Promise<any> {
    let temperature = 0;
    let humidity = 0;

    const controller = await this.iotDeviceDAO.getOne({
      where: {
        coopId,
        mac: mac || Not(IsNull()),
        deviceType: 'SMART_CONTROLLER',
        deletedDate: IsNull(),
      },
    });

    if (!controller) {
      throw ERR_IOT_DEVICE_SMART_CONTROLLER_NOT_EXISTS();
    }

    const now = new Date();
    const last24Hour = sub(now, { hours: 24 });

    const currentTimeRange = {
      from: last24Hour,
      to: now,
    };

    const sensorData = await this.iotControllerESDAO.getManyByMac(
      [controller.mac],
      1,
      currentTimeRange,
      'desc',
      'sensors',
    );

    if (sensorData[0] && sensorData[0]._source) {
      if (sensorData[0]._source.temperatures) {
        temperature = Number(sensorData[0]._source.temperatures.temperatureAvg.toFixed(1));
      }
      if (sensorData[0]._source.humiditys) {
        humidity = sensorData[0]._source.humiditys.humidityAvg;
      }
    }

    return {
      temperature,
      humidity,
    };
  }

  async getControllerCoopSummarySetting(params: { coopId: string; deviceId: string }) {
    const coop = await this.coopDAO.getOneStrict({
      where: {
        coopCode: Like(`%-${params.coopId.slice(-4)}`),
      },
    });

    const controller = await this.iotDeviceDAO.getOne({
      where: {
        coopId: coop.id,
        mac: params.deviceId || Not(IsNull()),
        deviceType: 'SMART_CONTROLLER',
        deletedDate: IsNull(),
      },
    });

    if (!controller) {
      throw ERR_IOT_DEVICE_SMART_CONTROLLER_NOT_EXISTS();
    }

    const payload = await this.getControllerSetting(coop.id, params.deviceId);

    const [heaterState, coolerState, lampState] = await Promise.all([
      this.iotControllerESDAO.getHeaterSettingsState(controller.mac),
      this.iotControllerESDAO.getCoolerSettingsState(controller.mac),
      this.iotControllerESDAO.getLampSettingsState(controller.mac),
    ]);

    if (payload && payload.controllerSetting) {
      const settings = payload.controllerSetting;
      const sensorCode = toSensorCode(coop.coopCode);

      const currentSettings = {
        growthDay: {
          id: `GD-${sensorCode}`,
          deviceId: controller.mac,
          temperature: Number((settings.reqTemp / 10).toFixed(1)),
          day: Number(settings.growth),
          status: true,
        },
        fan: {
          id: `FN-${sensorCode}`,
          deviceId: controller.mac,
          online: settings.fan.length,
          offline: 8 - settings.fan.length,
          status: true,
        },
        heater: {
          id: `HT-${sensorCode}`,
          deviceId: controller.mac,
          temperature: Number((settings.heater / 10).toFixed(1)),
          status: heaterState,
        },
        cooler: {
          id: `CL-${sensorCode}`,
          deviceId: controller.mac,
          temperature: Number((settings.cooler.tempCool / 10).toFixed(1)),
          status: coolerState,
        },
        lamp: {
          id: `LM-${sensorCode}`,
          deviceId: controller.mac,
          name: `Pengaturan ${settings.light.length}`,
          onlineTime:
            secondsTommss(Number(settings.light[settings.light.length - 1].time.on)) || '00:00',
          offlineTime:
            secondsTommss(Number(settings.light[settings.light.length - 1].time.off)) || '00:00',
          status: lampState,
        },
        alarm: {
          id: `AL-${sensorCode}`,
          deviceId: controller.mac,
          cold: Number((settings.alarm.cold / 10).toFixed(1)),
          hot: Number((settings.alarm.hot / 10).toFixed(1)),
        },
        resetTime: {
          id: `RT-${sensorCode}`,
          deviceId: controller.mac,
          onlineTime: secondsTommss(Number(settings.reset)) || '00:00',
        },
      };

      return currentSettings;
    }

    return {};
  }

  async getControllerGrowthSetting(query: { coopId: string; deviceId: string }) {
    const coop = await this.coopDAO.getOneStrict({
      where: {
        coopCode: Like(`%-${query.coopId.slice(-4)}`),
      },
    });

    const payload = await this.getControllerSetting(coop.id, query.deviceId);

    if (payload && payload.controllerSetting) {
      const temperatureReduction = payload.controllerSetting.reduction.map((red: any) => ({
        group: red.id,
        day: red.tempDay.days,
        reduction: Number((red.tempDay.temp / 10).toFixed(1)),
      }));

      return {
        requestTemperature: Number((payload.controllerSetting.reqTemp / 10).toFixed(1)),
        growthDay: payload.controllerSetting.growth,
        temperature: Number((payload.controllerSetting.tempDayOne / 10).toFixed(1)),
        temperatureReduction,
      };
    }

    return {};
  }

  async getControllerLampSetting(query: { coopId: string; deviceId: string }) {
    const coop = await this.coopDAO.getOneStrict({
      where: {
        coopCode: Like(`%-${query.coopId.slice(-4)}`),
      },
    });

    const payload = await this.getControllerSetting(coop.id, query.deviceId);

    if (payload && payload.controllerSetting) {
      const lampSettings = payload.controllerSetting.light.map((light: any) => ({
        id: `LAMP${light.id}`,
        name: `Pengaturan ${light.id}`,
        onlineTime: secondsTommss(Number(light.time.on)) || '00:00',
        offlineTime: secondsTommss(Number(light.time.off)) || '00:00',
        isOnline: true,
        error: false,
        status: true,
      }));

      return lampSettings;
    }

    return [];
  }

  async getControllerCoolerSetting(query: { coopId: string; deviceId: string }) {
    const coop = await this.coopDAO.getOneStrict({
      where: {
        coopCode: Like(`%-${query.coopId.slice(-4)}`),
      },
    });

    const payload = await this.getControllerSetting(coop.id, query.deviceId);

    if (payload && payload.controllerSetting) {
      return {
        id: query.coopId,
        temperatureTarget: Number((payload.controllerSetting.cooler.tempCool / 10).toFixed(1)),
        onlineDuration:
          secondsTommss(Number(payload.controllerSetting.cooler.TimeCool.on)) || '00:00',
        offlineDuration:
          secondsTommss(Number(payload.controllerSetting.cooler.TimeCool.off)) || '00:00',
      };
    }

    return {};
  }

  async getControllerHeaterSetting(query: { coopId: string; deviceId: string }) {
    const coop = await this.coopDAO.getOneStrict({
      where: {
        coopCode: Like(`%-${query.coopId.slice(-4)}`),
      },
    });

    const payload = await this.getControllerSetting(coop.id, query.deviceId);

    if (payload && payload.controllerSetting) {
      return {
        id: query.coopId,
        temperatureTarget: Number((payload.controllerSetting.heater / 10).toFixed(1)),
      };
    }

    return {};
  }
}
