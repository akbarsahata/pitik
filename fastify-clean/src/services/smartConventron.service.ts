/* eslint-disable no-underscore-dangle */
import { SearchHit } from '@elastic/elasticsearch/api/types.d';
import {
  add,
  differenceInCalendarDays,
  hoursToMilliseconds,
  isAfter,
  isValid,
  sub,
} from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { Between, IsNull } from 'typeorm';
import { IotConventronESDAO } from '../dao/es/iotConventron.es.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { IotDeviceDAO } from '../dao/IotDevice.dao';
import { TargetDAO } from '../dao/target.dao';
import { TargetDaysDDAO } from '../dao/targetDaysD.dao';
import { VariableDAO } from '../dao/variable.dao';
import {
  ConventronFanNames,
  IOTConventronData,
  SensorConventronTemperatureNames,
} from '../datasources/entity/elasticsearch/IOTSensorData.entity';
import { Coop } from '../datasources/entity/pgsql/Coop.entity';
import { FarmingCycle } from '../datasources/entity/pgsql/FarmingCycle.entity';
import { IotSensorTypeEnum } from '../datasources/entity/pgsql/IotSensor.entity';
import { Variable } from '../datasources/entity/pgsql/Variable.entity';
import { SensorHistoricalList, SensorTypes } from '../dto/sensor.dto';
import {
  ConventronAdditionalData,
  GetConventronByCoopIdItem,
  GetConventronHistoricalItem,
  GetConventronHistoricalQuery,
  GetConventronSummaryItemResponse,
} from '../dto/smartConventron.dto';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { VAR_TEMP_CODE } from '../libs/constants/variableCodes';
import { parseSkipFailedConventronTemperature, toSensorCode } from '../libs/utils/helpers';

export interface HistoricalItem {
  value: number;
  created: Date;
}

export type HistoricalList = HistoricalItem[];

@Service()
export class SmartConventronService {
  @Inject(IotDeviceDAO)
  private iotDeviceDAO!: IotDeviceDAO;

  @Inject(IotConventronESDAO)
  private iotConventronESDAO!: IotConventronESDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO!: FarmingCycleDAO;

  @Inject(VariableDAO)
  private variableDAO!: VariableDAO;

  @Inject(TargetDAO)
  private targetDAO!: TargetDAO;

  @Inject(TargetDaysDDAO)
  private targetDaysDDAO!: TargetDaysDDAO;

  async getConventronSummary(deviceId: string): Promise<GetConventronSummaryItemResponse> {
    const conventron = await this.iotDeviceDAO.getOneStrict({
      where: {
        id: deviceId,
        deviceType: 'SMART_CONVENTRON',
        deletedDate: IsNull(),
      },
      relations: {
        building: true,
        coop: {
          activeFarmingCycle: true,
        },
        room: {
          roomType: true,
        },
      },
    });

    const conventronInfo: ConventronAdditionalData = conventron.additional;

    const conventronDeviceDetail = await this.getConventronSensorData(conventron.coop.coopCode);

    const dataInfo = conventronDeviceDetail[0]._source;

    return {
      generalInfo: {
        deviceId: conventron.id,
        buildingName: conventron.building.name,
        roomTypeName: conventron.room.roomType.name,
        conventronType: conventronInfo.conventronType || '',
        day: conventron.coop?.activeFarmingCycle.farmingCycleStartDate
          ? differenceInCalendarDays(
              new Date(),
              new Date(conventron.coop?.activeFarmingCycle.farmingCycleStartDate.toString()),
            )
          : 0,
        period: conventron.coop.totalPeriod || 1,
        chickInDate: conventron.coop.activeFarmingCycle.farmingCycleStartDate.toISOString(),
      },
      temperatureInfo: {
        value: await this.getConventronLatestTemperature(conventron.coop.coopCode),
        uom: '°C',
      },
      alarmInfo: {
        status: this.checkAlarmStatus(dataInfo as IOTConventronData),
      },
      fanInfo: this.checkFanStatus(dataInfo as IOTConventronData),
      heaterInfo: {
        status: this.checkHeaterStatus(dataInfo as IOTConventronData),
      },
      coolerInfo: {
        status: this.checkCoolerStatus(dataInfo as IOTConventronData),
      },
    };
  }

  async getConventronByCoopId(coopId: string): Promise<[GetConventronByCoopIdItem[], number]> {
    const [conventronDevices, count] = await this.iotDeviceDAO.getMany({
      where: {
        coopId,
        deviceType: 'SMART_CONVENTRON',
        deletedDate: IsNull(),
      },
      relations: {
        building: true,
        coop: {
          activeFarmingCycle: true,
        },
        room: {
          roomType: true,
        },
      },
    });

    const results: GetConventronByCoopIdItem[] = [];
    await Promise.all<any>(
      conventronDevices.map(async (conventron) => {
        const conventronInfo: ConventronAdditionalData = conventron.additional;

        const conventronDetail: GetConventronByCoopIdItem = {
          deviceId: conventron.id,
          buildingId: conventron.building.id,
          buildingName: conventron.building.name,
          roomCode: conventron.room.roomCode,
          roomId: conventron.room.id,
          roomTypeName: conventron.room.roomType.name,
          sensorType: IotSensorTypeEnum.TEMPERATURE_SENSOR,
          conventronType: conventronInfo.conventronType || '',
          day: conventron.coop?.activeFarmingCycle.farmingCycleStartDate
            ? differenceInCalendarDays(
                new Date(),
                new Date(conventron.coop?.activeFarmingCycle.farmingCycleStartDate.toString()),
              )
            : 0,
          period: conventron.coop?.totalPeriod || 1,
          chickInDate:
            conventron.coop?.activeFarmingCycle.farmingCycleStartDate.toISOString() || '',
          temperature: await this.getConventronLatestTemperature(conventron.coop.coopCode),
        };

        results.push(conventronDetail);
      }),
    );

    return [results.sort((a, b) => a.roomTypeName.localeCompare(b.roomTypeName)), count];
  }

  async getConventronHistorical(
    filter: GetConventronHistoricalQuery,
    from?: Date,
    to?: Date,
  ): Promise<GetConventronHistoricalItem> {
    const farmingCycle = await this.farmingCycleDAO.getOneById(filter.farmingCycleId);

    let deviceCodeId: string | null = null;
    if (filter.deviceId) {
      const iotDevice = await this.iotDeviceDAO.getOneStrict({
        where: {
          id: filter.deviceId,
          deletedDate: IsNull(),
        },
      });
      deviceCodeId = iotDevice.deviceId;
    }

    const coopCode = toSensorCode(farmingCycle.coop.coopCode);

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

    const conventronDataCurrent = await this.iotConventronESDAO.getManyByCoopCode(
      coopCode,
      currentTimeRange,
      'desc',
      deviceCodeId,
    );

    let datasetCurrent: HistoricalList = [];
    let variable: Variable;

    if (filter.sensorType === 'temperature') {
      datasetCurrent = SmartConventronService.mapDataset('temperature')(conventronDataCurrent);
      variable = await this.variableDAO.getOneStrict({ where: { variableCode: VAR_TEMP_CODE } });
    } else {
      return {
        current: [],
        benchmark: [],
      };
    }

    const benchmark = await this.generateBenchmarks(
      farmingCycle,
      farmingCycle.coop,
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

  private async getConventronSensorData(coopCode: string): Promise<SearchHit<IOTConventronData>[]> {
    const coopKeyCode = toSensorCode(coopCode);

    const now = new Date();

    const sensorData = await [1, 3, 5, 7].reduce(
      async (prevSensorData, hours): Promise<SearchHit<IOTConventronData>[]> => {
        const data = await prevSensorData;

        if (data.length > 0) {
          return data as unknown as SearchHit<IOTConventronData>[];
        }

        const result = await this.iotConventronESDAO.getManyByCoopCode(coopKeyCode, {
          from: sub(now, { hours }),
          to: now,
        });

        return result;
      },
      Promise.resolve([] as SearchHit<IOTConventronData>[]),
    );

    return sensorData;
  }

  // eslint-disable-next-line class-methods-use-this
  private async getConventronLatestTemperature(coopCode: string): Promise<number> {
    const sensorData = await this.getConventronSensorData(coopCode);

    if (!sensorData[0] || !sensorData[0]._source) {
      return 0;
    }

    const data = parseSkipFailedConventronTemperature(sensorData);
    if (!data) {
      return 0;
    }

    const sensorNames = Object.keys(data).filter((key) =>
      /^t[12]$/i.test(key),
    ) as SensorConventronTemperatureNames[];

    const sensorCount = sensorNames.length;

    const temperature: number =
      sensorNames.reduce((total, sensorName) => (data[sensorName] as number) + total, 0) /
      sensorCount;

    return Number(temperature.toFixed(2));
  }

  // eslint-disable-next-line class-methods-use-this
  private checkAlarmStatus(dataInfo: IOTConventronData): string {
    if (dataInfo.relayOutput.alarm === true) {
      return 'Nyala';
    }
    if (dataInfo.relayOutput.alarm === false) {
      return 'Mati';
    }
    return 'N/A';
  }

  // eslint-disable-next-line class-methods-use-this
  private checkCoolerStatus(dataInfo: IOTConventronData): string {
    if (dataInfo.relayOutput.coolingPad === true) {
      return 'Nyala';
    }
    if (dataInfo.relayOutput.coolingPad === false) {
      return 'Mati';
    }
    return 'N/A';
  }

  // eslint-disable-next-line class-methods-use-this
  private checkFanStatus(dataInfo: IOTConventronData): any {
    const fanList = Object.keys(dataInfo.relayOutput).filter((key) =>
      /^fan\d{1,}/gi.test(key),
    ) as ConventronFanNames[];

    let totalActive: number = 0;
    let totalInActive: number = 0;
    const detailFanStatus: any = {};

    fanList.forEach((fan) => {
      if (dataInfo.relayOutput[fan] === true) {
        totalActive += 1;
        Object.assign(detailFanStatus, { [`${fan}`]: 'Nyala' });
      } else {
        totalInActive += 1;
        Object.assign(detailFanStatus, { [`${fan}`]: 'Mati' });
      }
    });

    return {
      status: totalActive > 0 ? 'Nyala' : 'Mati',
      totalActive,
      totalInActive,
      detailFanStatus,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private checkHeaterStatus(dataInfo: IOTConventronData): string {
    if (dataInfo.relayOutput.heater === true) {
      return 'Nyala';
    }
    if (dataInfo.relayOutput.heater === false) {
      return 'Mati';
    }
    return 'N/A';
  }

  private static mapDataset(sensorType: SensorTypes): Function {
    return function map(dataset: SearchHit<IOTConventronData>[]): HistoricalList {
      return dataset.reduce<HistoricalList>((arr, sd) => {
        try {
          if (!sd._source) {
            return arr;
          }

          const sensors = sd._source.t;

          const sensorNames = Object.keys(sensors).filter((key) =>
            /^t[12]$/i.test(key),
          ) as SensorConventronTemperatureNames[];

          const sensorCount = sensorNames.length;

          let computed = 0;

          if (sensorType === 'temperature') {
            computed =
              sensorNames.reduce(
                (total, sensorName) => (sensors[sensorName] as number) + total,
                0,
              ) / sensorCount;
          }

          const createdDate = new Date(sd._source.created);

          if (isValid(createdDate)) {
            arr.push({
              value: computed,
              created: new Date(sd._source.created),
            });
          }

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

    const target = await this.targetDAO.getOneStrict({
      where: {
        coopTypeId: coop.coopTypeId,
        chickTypeId: farmingCycle.chickTypeId,
        variableId: variable.id,
      },
      cache: hoursToMilliseconds(1),
    });

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
}
