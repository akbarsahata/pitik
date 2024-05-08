/* eslint-disable no-underscore-dangle */
import { SearchHit } from '@elastic/elasticsearch/api/types.d';
import { add, differenceInCalendarDays, hoursToMilliseconds, isAfter, sub } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { Between, In, IsNull } from 'typeorm';
import { CoopDAO } from '../dao/coop.dao';
import { SensorESDAO } from '../dao/es/sensor.es.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { IOTSensorDAO } from '../dao/iotSensor.dao';
import { RoomDAO } from '../dao/room.dao';
import { TargetDAO } from '../dao/target.dao';
import { TargetDaysDDAO } from '../dao/targetDaysD.dao';
import { VariableDAO } from '../dao/variable.dao';
import {
  IOTSensorData,
  IOTSensorDataItem,
  SensorNames,
} from '../datasources/entity/elasticsearch/IOTSensorData.entity';
import { Coop } from '../datasources/entity/pgsql/Coop.entity';
import { FarmingCycle } from '../datasources/entity/pgsql/FarmingCycle.entity';
import { IotSensor } from '../datasources/entity/pgsql/IotSensor.entity';
import { Variable } from '../datasources/entity/pgsql/Variable.entity';
import {
  GetSensorQuery,
  SensorHistorical,
  SensorHistoricalList,
  SensorHistoricalQuery,
  SensorLatestCondition,
  SensorLatestConditionQuery,
  SensorTypes,
} from '../dto/sensor.dto';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import {
  VAR_HSI_TARGET_CODE,
  VAR_KEAN_CODE,
  VAR_LUX_CODE,
  VAR_NH3_CODE,
  VAR_RH_CODE,
  VAR_TEMP_CODE,
} from '../libs/constants/variableCodes';
import {
  getSensorTypeCategories,
  isInRangeTarget,
  isLessThanMaxTarget,
  parseSkipFailed,
  toSensorCode,
} from '../libs/utils/helpers';

export interface HistoricalItem {
  value: number;
  created: Date;
}

export type HistoricalList = HistoricalItem[];

@Service()
export class SensorService {
  @Inject(FarmingCycleDAO)
  private farmingCycleDAO!: FarmingCycleDAO;

  @Inject(CoopDAO)
  private coopDAO!: CoopDAO;

  @Inject(VariableDAO)
  private variableDAO: VariableDAO;

  @Inject(TargetDAO)
  private targetDAO!: TargetDAO;

  @Inject(TargetDaysDDAO)
  private targetDaysDDAO: TargetDaysDDAO;

  @Inject(SensorESDAO)
  private sensorESDAO: SensorESDAO;

  @Inject(RoomDAO)
  private roomDAO: RoomDAO;

  @Inject(IOTSensorDAO)
  private iotSensorDAO: IOTSensorDAO;

  async getMany(filter: GetSensorQuery): Promise<[IotSensor[], number]> {
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;

    return this.iotSensorDAO.getMany({
      where: {
        deletedDate: IsNull(),
        sensorCode: filter.sensorCode,
        sensorType: filter.sensorType ? In(getSensorTypeCategories(filter.sensorType)) : undefined,
        position: filter.position,
        status: filter.status,
        room: {
          id: filter.roomId,
          building: {
            id: filter.buildingId,
          },
          coop: {
            id: filter.coopId,
          },
        },
      },
      relations: {
        room: {
          roomType: true,
          building: true,
          coop: true,
        },
      },
      take: limit,
      skip,
      order: {
        createdDate: 'DESC',
      },
    });
  }

  async getCoopSensorLatestCondition(
    query: SensorLatestConditionQuery,
    date?: string,
  ): Promise<SensorLatestCondition> {
    const farmingCycle = await this.farmingCycleDAO.getOneById(query.farmingCycleId);

    const coop = await this.coopDAO.getOneById(farmingCycle.coopId);

    const coopCode = toSensorCode(coop.coopCode);

    const now = date ? utcToZonedTime(date, DEFAULT_TIME_ZONE) : new Date();

    // Handles sensor list info from room relation
    let sensorList: string[] = [];
    let deviceIds: string[] = [];
    let macList: string[] = [];

    if (query.roomId) {
      const { sensors, idDevices, macIds } = await this.getSensorListWithinRoom(query.roomId);
      sensorList = sensors;
      deviceIds = idDevices;
      macList = macIds;
    }

    const sensorData = await [1, 3, 5, 7].reduce(
      async (prevSensorData, hours): Promise<SearchHit<IOTSensorData>[]> => {
        const data = await prevSensorData;

        if (data.length > 0) {
          return data as unknown as SearchHit<IOTSensorData>[];
        }

        const resultProto = await this.sensorESDAO.getManyByMac(
          macList,
          {
            from: sub(now, { hours }),
            to: now,
          },
          undefined,
        );

        if (resultProto.length === 0) {
          const resultTlv = await this.sensorESDAO.getManyByCoopCode(
            coopCode,
            {
              from: sub(now, { hours }),
              to: now,
            },
            undefined,
            deviceIds,
          );

          return resultProto.concat(resultTlv);
        }

        return resultProto;
      },
      Promise.resolve([] as SearchHit<IOTSensorData>[]),
    );

    if (!sensorData[0] || !sensorData[0]._source) {
      return {};
    }

    let currentDayNum = differenceInCalendarDays(new Date(), farmingCycle.farmingCycleStartDate);
    // PATCH: to avoid error getting inexist data
    currentDayNum = currentDayNum > 35 ? 35 : currentDayNum;
    currentDayNum = currentDayNum < 1 ? 1 : currentDayNum;

    const data = parseSkipFailed(sensorData);
    if (!data) {
      return {};
    }

    const sensorNames = Object.keys(data).filter((key) => /^s\d{1,}/gi.test(key)) as SensorNames[];
    const sensorCount = sensorNames.length;

    let temperature: number = 0;
    if (sensorList.length > 0) {
      let totalSensor: number = 0;
      temperature = sensorNames.reduce((total, sensorName) => {
        if (sensorList.includes((data[sensorName] as IOTSensorDataItem).id)) {
          totalSensor += 1;
          return (data[sensorName] as IOTSensorDataItem).t + total;
        }
        return total;
      }, 0);

      if (totalSensor === 0) return {};

      temperature /= totalSensor * 10;
    } else {
      temperature =
        sensorNames.reduce(
          (total, sensorName) => (data[sensorName] as IOTSensorDataItem).t + total,
          0,
        ) /
        (sensorCount * 10);
    }
    const temperatureStatus = await this.compareDailyTargetTemperature(
      temperature,
      currentDayNum,
      farmingCycle,
      coop,
    );

    let relativeHumidity: number = 0;
    if (sensorList.length > 0) {
      let totalSensor: number = 0;
      relativeHumidity = sensorNames.reduce((total, sensorName) => {
        if (sensorList.includes((data[sensorName] as IOTSensorDataItem).id)) {
          totalSensor += 1;
          return (data[sensorName] as IOTSensorDataItem).h + total;
        }
        return total;
      }, 0);

      if (totalSensor === 0) return {};

      relativeHumidity /= totalSensor;
    } else {
      relativeHumidity =
        sensorNames.reduce(
          (total, sensorName) => (data[sensorName] as IOTSensorDataItem).h + total,
          0,
        ) / sensorCount;
    }
    const relativeHumidityStatus = await this.compareDailyTargetRelativeHumidity(
      relativeHumidity,
      currentDayNum,
      farmingCycle,
      coop,
    );

    const heatStressIndex = 1.8 * temperature + relativeHumidity + 32;
    const heatStressIndexStatus = await this.compareDailyTargetHeatStressIndex(
      heatStressIndex,
      currentDayNum,
      farmingCycle,
      coop,
    );

    let ammoniaStatus = '';
    let ammonia: number | null = null;

    if (typeof data.Modbus_sensor1?.a === 'number') {
      ammonia = data.Modbus_sensor1.a;
    } else if (data.a && data.a.ppm) {
      ammonia = data.a.ppm;
    } else if (data.a && data.a.R0) {
      const b = -0.1043;
      const m = -0.538;
      const y = data.a.Rs / data.a.R0;
      const z = (Math.log(y) - b) / m;
      const ppm = 10 ** z;

      ammonia = ppm;
    }

    if (ammonia !== null) {
      ammoniaStatus = await this.compareDailyTargetAmmonia(
        ammonia,
        currentDayNum,
        farmingCycle,
        coop,
      );
    }

    const result: SensorLatestCondition = {
      temperature: {
        value: Number(temperature.toFixed(2)),
        uom: '°C',
        status: temperatureStatus,
      },
      relativeHumidity: {
        value: Number(relativeHumidity.toFixed(2)),
        uom: '%',
        status: relativeHumidityStatus,
      },
      heatStressIndex: {
        value: Number(heatStressIndex.toFixed(2)),
        uom: '',
        status: heatStressIndexStatus,
      },
      wind: {
        value: Number(data?.w?.toFixed(2) ?? 0),
        uom: 'm/s',
        status: '',
      },
      ...(ammonia !== null && {
        ammonia: { value: Number(ammonia.toFixed(2)) ?? 0, uom: 'PPM', status: ammoniaStatus },
      }),
      ...(data.l && {
        lights: { value: Number(data?.l?.toFixed(2)) ?? 0, uom: 'lux', status: '' },
      }),
    };

    return result;
  }

  async getCoopSensorHistorical(
    query: SensorHistoricalQuery,
    from?: Date,
    to?: Date,
  ): Promise<SensorHistorical> {
    const { farmingCycleId, sensorType, roomId } = query;

    const farmingCycle = await this.farmingCycleDAO.getOneById(farmingCycleId);

    const coop = await this.coopDAO.getOneById(farmingCycle.coopId);
    const coopCode = toSensorCode(coop.coopCode);

    // Handles sensor list info from room relation
    let sensorList: string[] = [];
    let deviceIds: string[] = [];
    let macList: string[] = [];

    if (roomId) {
      const { sensors, idDevices, macIds } = await this.getSensorListWithinRoom(roomId);
      sensorList = sensors;
      deviceIds = idDevices;
      macList = macIds;
    }

    const now = new Date();
    const last24Hour = sub(now, { hours: 24 });

    const currentTimeRange = {
      from: last24Hour,
      to: now,
    };

    if (from && to) {
      if (!isAfter(to, from)) {
        throw new Error('From can not be after To');
      }

      currentTimeRange.from = from;
      currentTimeRange.to = to;
    }

    const sensorDataTlv = await this.sensorESDAO.getManyByCoopCode(
      coopCode,
      currentTimeRange,
      'asc',
      deviceIds,
    );

    let sensorDataCurrent = [];

    if (macList.length > 0) {
      const resultProto = await this.sensorESDAO.getManyByMac(macList, currentTimeRange, 'asc');

      sensorDataCurrent = resultProto.concat(sensorDataTlv);
    } else {
      sensorDataCurrent = sensorDataTlv;
    }

    let datasetCurrent: HistoricalList = [];
    let variable: Variable;

    if (sensorType === 'temperature') {
      datasetCurrent = SensorService.mapDataset('temperature', sensorList)(sensorDataCurrent);
      variable = await this.variableDAO.getOneStrict({ where: { variableCode: VAR_TEMP_CODE } });
    } else if (sensorType === 'relativeHumidity') {
      datasetCurrent = SensorService.mapDataset('relativeHumidity', sensorList)(sensorDataCurrent);
      variable = await this.variableDAO.getOneStrict({ where: { variableCode: VAR_RH_CODE } });
    } else if (sensorType === 'heatStressIndex') {
      datasetCurrent = SensorService.mapDataset('heatStressIndex', sensorList)(sensorDataCurrent);
      variable = await this.variableDAO.getOneStrict({
        where: { variableCode: VAR_HSI_TARGET_CODE },
      });
    } else if (sensorType === 'lights') {
      datasetCurrent = SensorService.mapDataset('lights')(sensorDataCurrent);
      variable = await this.variableDAO.getOneStrict({ where: { variableCode: VAR_LUX_CODE } });
    } else if (sensorType === 'wind') {
      datasetCurrent = SensorService.mapDataset('wind')(sensorDataCurrent);
      variable = await this.variableDAO.getOneStrict({ where: { variableCode: VAR_KEAN_CODE } });
    } else {
      datasetCurrent = SensorService.mapDataset('ammonia')(sensorDataCurrent);
      variable = await this.variableDAO.getOneStrict({ where: { variableCode: VAR_NH3_CODE } });
    }

    const benchmark = await this.generateBenchmarks(
      farmingCycle,
      coop,
      variable,
      currentTimeRange.from,
      currentTimeRange.to,
    );

    return {
      current: datasetCurrent.map((d) => ({
        value: d.value,
        created: utcToZonedTime(new Date(d.created), DEFAULT_TIME_ZONE).toISOString(),
      })),
      benchmark,
    };
  }

  private async compareDailyTargetTemperature(
    value: number,
    day: number,
    farmingCycle: FarmingCycle,
    coop: Coop,
  ): Promise<string> {
    const temperatureVariable = await this.variableDAO.getOneStrict({
      where: {
        variableCode: VAR_TEMP_CODE,
      },
      cache: hoursToMilliseconds(1),
    });

    const temperatureTarget = await this.targetDAO.getOneStrict({
      where: {
        coopTypeId: coop.coopTypeId,
        chickTypeId: farmingCycle.chickTypeId,
        variableId: temperatureVariable.id,
      },
      cache: hoursToMilliseconds(1),
    });

    const temperatureTargetToday = await this.targetDaysDDAO.getOneStrict({
      where: {
        targetId: temperatureTarget.id,
        day,
      },
      cache: hoursToMilliseconds(1),
    });

    if (isInRangeTarget(value, temperatureTargetToday)) {
      return 'good';
    }

    return 'bad';
  }

  private async compareDailyTargetRelativeHumidity(
    value: number,
    day: number,
    farmingCycle: FarmingCycle,
    coop: Coop,
  ): Promise<string> {
    const relativeHumidityVariable = await this.variableDAO.getOneStrict({
      where: {
        variableCode: VAR_RH_CODE,
      },
      cache: hoursToMilliseconds(1),
    });

    const temperatureTarget = await this.targetDAO.getOneStrict({
      where: {
        coopTypeId: coop.coopTypeId,
        chickTypeId: farmingCycle.chickTypeId,
        variableId: relativeHumidityVariable.id,
      },
      cache: hoursToMilliseconds(1),
    });

    const relativeHumidityTargetToday = await this.targetDaysDDAO.getOneStrict({
      where: {
        targetId: temperatureTarget.id,
        day,
      },
      cache: hoursToMilliseconds(1),
    });

    if (isInRangeTarget(value, relativeHumidityTargetToday)) {
      return 'good';
    }

    return 'bad';
  }

  private async compareDailyTargetHeatStressIndex(
    value: number,
    day: number,
    farmingCycle: FarmingCycle,
    coop: Coop,
  ): Promise<string> {
    const hsiTargetVariable = await this.variableDAO.getOneStrict({
      where: {
        variableCode: VAR_HSI_TARGET_CODE,
      },
      cache: hoursToMilliseconds(1),
    });

    const hsiTarget = await this.targetDAO.getOneStrict({
      where: {
        coopTypeId: coop.coopTypeId,
        chickTypeId: farmingCycle.chickTypeId,
        variableId: hsiTargetVariable.id,
      },
      cache: hoursToMilliseconds(1),
    });

    const hsiTargetToday = await this.targetDaysDDAO.getOneStrict({
      where: {
        targetId: hsiTarget.id,
        day,
      },
      cache: hoursToMilliseconds(1),
    });

    if (isLessThanMaxTarget(value, hsiTargetToday)) {
      return 'good';
    }

    return 'bad';
  }

  private async compareDailyTargetAmmonia(
    value: number,
    day: number,
    farmingCycle: FarmingCycle,
    coop: Coop,
  ): Promise<string> {
    const ammoniaVariable = await this.variableDAO.getOneStrict({
      where: {
        variableCode: VAR_NH3_CODE,
      },
      cache: hoursToMilliseconds(1),
    });

    const ammoniaTarget = await this.targetDAO.getOneStrict({
      where: {
        coopTypeId: coop.coopTypeId,
        chickTypeId: farmingCycle.chickTypeId,
        variableId: ammoniaVariable.id,
      },
      cache: hoursToMilliseconds(1),
    });

    const ammoniaTargetToday = await this.targetDaysDDAO.getOneStrict({
      where: {
        targetId: ammoniaTarget.id,
        day,
      },
      cache: hoursToMilliseconds(1),
    });

    if (isLessThanMaxTarget(value, ammoniaTargetToday)) {
      return 'good';
    }

    return 'bad';
  }

  private static mapDataset(sensorType: SensorTypes, sensorList: string[] = []): Function {
    return function map(dataset: SearchHit<IOTSensorData>[]): HistoricalList {
      return dataset.reduce<HistoricalList>((arr, sd) => {
        try {
          if (!sd._source) {
            return arr;
          }

          const sensors = sd._source?.sensors;

          const sensorNames = Object.keys(sensors).filter((key) =>
            /^s\d{1,}/gi.test(key),
          ) as SensorNames[];
          const sensorCount = sensorNames.length;

          let computed = 0;

          if (sensorType === 'temperature') {
            if (sensorList.length > 0) {
              let totalSensor: number = 0;
              computed = sensorNames.reduce((total, sensorName) => {
                if (sensorList.includes((sensors[sensorName] as IOTSensorDataItem).id)) {
                  totalSensor += 1;
                  return (sensors[sensorName] as IOTSensorDataItem).t + total;
                }
                return total;
              }, 0);
              computed /= totalSensor * 10;
            } else {
              computed =
                sensorNames.reduce(
                  (total, sensorName) => (sensors[sensorName] as IOTSensorDataItem).t + total,
                  0,
                ) /
                (sensorCount * 10);
            }
          } else if (sensorType === 'relativeHumidity') {
            if (sensorList.length > 0) {
              let totalSensor: number = 0;
              computed = sensorNames.reduce((total, sensorName) => {
                if (sensorList.includes((sensors[sensorName] as IOTSensorDataItem).id)) {
                  totalSensor += 1;
                  return (sensors[sensorName] as IOTSensorDataItem).h + total;
                }
                return total;
              }, 0);
              computed /= totalSensor;
            } else {
              computed =
                sensorNames.reduce(
                  (total, sensorName) => (sensors[sensorName] as IOTSensorDataItem).h + total,
                  0,
                ) / sensorCount;
            }
          } else if (sensorType === 'heatStressIndex') {
            if (sensorList.length > 0) {
              let totalSensorTemperature: number = 0;
              let t = sensorNames.reduce((total, sensorName) => {
                if (sensorList.includes((sensors[sensorName] as IOTSensorDataItem).id)) {
                  totalSensorTemperature += 1;
                  return (sensors[sensorName] as IOTSensorDataItem).t + total;
                }
                return total;
              }, 0);
              t /= totalSensorTemperature * 10;

              let totalSensorHumidity: number = 0;
              let rh = sensorNames.reduce((total, sensorName) => {
                if (sensorList.includes((sensors[sensorName] as IOTSensorDataItem).id)) {
                  totalSensorHumidity += 1;
                  return (sensors[sensorName] as IOTSensorDataItem).h + total;
                }
                return total;
              }, 0);
              rh /= totalSensorHumidity;

              computed = 1.8 * t + rh + 32;
            } else {
              const t =
                sensorNames.reduce(
                  (total, sensorName) => (sensors[sensorName] as IOTSensorDataItem).t + total,
                  0,
                ) /
                (sensorCount * 10);

              const rh =
                sensorNames.reduce(
                  (total, sensorName) => (sensors[sensorName] as IOTSensorDataItem).h + total,
                  0,
                ) / sensorCount;

              computed = 1.8 * t + rh + 32;
            }
          } else if (sensorType === 'ammonia') {
            if (typeof sensors.Modbus_sensor1?.a === 'number') {
              computed = sensors.Modbus_sensor1.a;
            } else if (sensors.a.ppm) {
              computed = sensors.a.ppm;
            } else {
              const b = -0.1043;
              const m = -0.538;
              const y = sensors.a.Rs / sensors.a.R0;
              const z = (Math.log(y) - b) / m;
              const ppm = 10 ** z;

              computed = ppm;
            }
          } else if (sensorType === 'lights') {
            computed = Number(sensors.l);
          } else if (sensorType === 'wind') {
            computed = Number(sensors.w);
          }

          // validate temporary
          arr.push({
            value: computed,
            created: sd._source.created ? new Date(sd._source.created) : new Date(),
          });

          return [...arr];
        } catch (error) {
          return arr;
        }
      }, []);
    };
  }

  private async generateBenchmarks(
    farmingCycle: FarmingCycle,
    coop: Coop,
    variable: Variable,
    from: Date,
    to: Date,
  ): Promise<SensorHistoricalList> {
    const farmingCycleStartDate = zonedTimeToUtc(
      farmingCycle.farmingCycleStartDate,
      'Asia/Jakarta',
    );

    let fromDayNum = differenceInCalendarDays(from, farmingCycleStartDate);
    fromDayNum = fromDayNum > 35 ? 35 : fromDayNum;
    fromDayNum = fromDayNum < 1 ? 1 : fromDayNum;

    let toDayNum = differenceInCalendarDays(to, farmingCycleStartDate);
    toDayNum = toDayNum > 35 ? 35 : toDayNum;
    toDayNum = toDayNum < 1 ? 1 : toDayNum;

    const target = await this.targetDAO.getOne({
      where: {
        coopTypeId: coop.coopTypeId,
        chickTypeId: farmingCycle.chickTypeId,
        variableId: variable.id,
      },
      cache: hoursToMilliseconds(1),
    });

    if (!target) {
      return [];
    }

    const targetDays = await this.targetDaysDDAO.getMany({
      where: {
        targetId: target.id,
        day: Between(fromDayNum, toDayNum),
      },
      order: {
        day: 'ASC',
      },
      cache: hoursToMilliseconds(1),
    });

    return targetDays.map((td) => ({
      value: {
        ...(td.minValue && { min: td.minValue }),
        ...(td.maxValue && { max: td.maxValue }),
      },
      created: add(farmingCycleStartDate, { days: td.day }).toISOString(),
    }));
  }

  private async getSensorListWithinRoom(roomId: string) {
    const sensors: string[] = [];

    const idDevices: string[] = [];

    const macIds: string[] = [];

    const roomDetail = await this.roomDAO.getOne({
      where: {
        id: roomId,
        iotSensors: {
          iotDevice: {
            deviceType: 'SMART_MONITORING',
          },
        },
      },
      relations: {
        roomType: true,
        iotSensors: {
          iotDevice: true,
        },
      },
    });

    if (roomDetail) {
      roomDetail?.iotSensors.forEach((sensor: Partial<IotSensor>) => {
        sensors.push(sensor.sensorCode as string);
        if (sensor.iotDevice?.deviceId) idDevices?.push(sensor.iotDevice?.deviceId);
        if (sensor.iotDevice?.mac) macIds?.push(sensor.iotDevice?.mac.toLowerCase());
      });
    }

    return {
      sensors,
      idDevices: idDevices.filter((item, idx, arr) => arr.indexOf(item) === idx),
      macIds: macIds.filter((item, idx, arr) => arr.indexOf(item) === idx),
    };
  }
}
