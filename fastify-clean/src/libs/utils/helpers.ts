/* eslint-disable quote-props */
/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable no-underscore-dangle */
import { SearchHit } from '@elastic/elasticsearch/api/types.d';
import * as Types from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { compare, genSalt, hash } from 'bcryptjs';
import { randomBytes } from 'crypto';
import {
  differenceInDays,
  differenceInHours,
  hoursToSeconds,
  intervalToDuration,
  minutesToSeconds,
  secondsToHours,
  secondsToMinutes,
  subHours,
} from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import {
  ErrorConventron,
  IOTConventronData,
  IOTSensorData,
} from '../../datasources/entity/elasticsearch/IOTSensorData.entity';
import { FarmingCycle } from '../../datasources/entity/pgsql/FarmingCycle.entity';
import { TargetDaysD } from '../../datasources/entity/pgsql/TargetDaysD.entity';
import {
  DATE_SQL_FORMAT,
  DEFAULT_TIME_ZONE,
  HISTORICAL_SENSOR_DATE_FORMAT,
  SENSOR_TYPE_CATEGORIES,
  FC_FARMING_STATUS,
} from '../constants';
import { sensorConventronRegexp, sensorRegexp } from '../constants/regexp';

export function dayDifference(from: Date, to: Date): number {
  const interval = intervalToDuration({
    start: from,
    end: to,
  });
  const yearInDays = (interval?.years && interval.years * 365) || 0;
  const monthInDays = (interval?.months && interval.months * 30) || 0;
  const days = (interval?.days && interval.days) || 0;

  return yearInDays + monthInDays + days;
}

// KS-1001 ==> f1001
export function toSensorCode(coopCode: string): string {
  const codes = coopCode.split('-');

  return `f${codes[codes.length - 1]}`;
}

export function isInRangeTarget(value: number, target: TargetDaysD): boolean {
  return value <= target.maxValue && value >= target.minValue;
}

export function isMoreThanMaxTarget(value: number, target: TargetDaysD): boolean {
  return value > target.maxValue;
}

export function isMoreThanMinTarget(value: number, target: TargetDaysD): boolean {
  return value > target.minValue;
}

export function isLessThanMaxTarget(value: number, target: TargetDaysD): boolean {
  return value < target.maxValue;
}

export function isLessThanMinTarget(value: number, target: TargetDaysD): boolean {
  return value < target.minValue;
}

export function generateXAxis(to: number, from = 0): number[] {
  const xAxis: number[] = [];

  for (let i = from; i < to; i += 1) {
    xAxis.push(i);
  }

  return xAxis;
}

export function parseSkipFailed(arr: SearchHit<IOTSensorData>[]) {
  let index = 0;

  while (index < arr.length) {
    const data = arr[index]._source?.sensors;

    // check if sensor has s1, s2, s3 data
    if (data && Object.keys(data).some((val) => sensorRegexp.test(val))) {
      return data;
    }

    index += 1;
  }

  return null;
}

/**
 * create random hex string with length double the parameter
 * @param length default 16
 * @returns string random hex
 */
export function randomHexString(length = 16): string {
  return randomBytes(length).toString('hex');
}

export function generateFarmingCycleCode(
  lastNumber: number,
  digitCount: number,
  prefix: string,
  ownerCode: string,
): string {
  const monthYear = format(new Date(), 'MMyy', { timeZone: DEFAULT_TIME_ZONE });

  const padZeroes = '0'.repeat(digitCount - String(lastNumber).length);

  const lastNumberStr = `${padZeroes}${Number(lastNumber) + 1}`;

  return `${prefix}-${ownerCode}-${monthYear}-${lastNumberStr}`;
}

export function generateIssueNumber(
  lastNumber: number,
  digitCount: number,
  prefix: string,
  ownerCode: string,
): string {
  const monthYear = format(new Date(), 'MMyy', { timeZone: DEFAULT_TIME_ZONE });

  const padZeroes = '0'.repeat(digitCount - String(lastNumber).length);

  const lastNumberStr = `${padZeroes}${Number(lastNumber) + 1}`;

  return `${prefix}-${ownerCode}-${monthYear}-${lastNumberStr}`;
}

export function generateUserOperatorCode(
  lastNumber: number,
  digitCount: number,
  prefix: string,
  ownerCode: string,
): string {
  const padZeroes = '0'.repeat(digitCount - String(lastNumber).length);

  const lastNumberStr = `${padZeroes}${Number(lastNumber) + 1}`;

  return `${ownerCode}/${prefix}${lastNumberStr}`;
}

export function generateErpCode(lastNumber: number, digitCount: number, prefix: string): string {
  const padZeroes = '0'.repeat(digitCount - String(lastNumber).length);

  const lastNumberStr = `${padZeroes}${Number(lastNumber) + 1}`;

  return `${prefix}${lastNumberStr}`;
}

export async function generateHashCMS(text: string, round = 10) {
  const salt = await genSalt(round);

  let password = await hash(text, salt);
  password = password.replace(/^\$2a/i, '$2y');

  return password;
}

export async function generateHash(text: string, round = 10) {
  const salt = await genSalt(round);
  const password = await hash(text, salt);
  return password;
}

export function revertHashPassword(password: string): string {
  return password.replace(/^\$2y/i, '$2a');
}

export async function comparePassword(
  oldPassword: string,
  storedHashPassword: string,
): Promise<boolean> {
  const revertPassHash = revertHashPassword(storedHashPassword);

  const isPasswordMatch = await compare(oldPassword, revertPassHash);

  return isPasswordMatch;
}

export async function sleep(ms: number) {
  return new Promise((resolve: Function) => setTimeout(resolve, ms));
}

/**
 * convert formatted string to order object for typeorm
 * example shown as below
 * formatted string: farm__created_at__ASC
 * converted object: {
 *  farm: {
 *    created_at: 'ASC',
 *  },
 * };
 */
export function generateOrderQuery(input: string): object {
  const splitted = input.split('__');
  const orderType = splitted.pop();

  return splitted.reduceRight((prev, item) => {
    const val = Object.keys(prev).length === 0 ? orderType : prev;
    return {
      [item]: val,
    };
  }, {});
}

/**
 * isRoleAllowed check if inputRole exist in expectedRoles
 */
export function isRoleAllowed(inputRole: string, expectedRoles: string[]): boolean {
  return expectedRoles.some((val) => val.toUpperCase() === inputRole.toUpperCase());
}

/**
 * TODO: This is tech debt
 * Please Refactor the parseDateperXXX helpers function below
 * as it should be wrapped by more generic function
 */
export function parseDataperHours(sensorData: any, start: Date, end: Date) {
  const hours = differenceInHours(end, start);
  const finalObj: any = {};
  const items = [];
  const data = [];

  for (let index = 0; index < sensorData.current.length; index += 1) {
    const date = format(new Date(sensorData.current[index].created), HISTORICAL_SENSOR_DATE_FORMAT);
    if (finalObj[date]) {
      finalObj[date].push(sensorData.current[index]);
    } else {
      finalObj[date] = [null];
    }
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const key in finalObj) {
    if (Object.prototype.hasOwnProperty.call(finalObj, key)) {
      const element: any = finalObj[key];
      const total = element.filter((x: any) => x && x.value);
      const sum = total.reduce(
        (a: string, b: { value: string }) => parseFloat(a) + parseFloat(b.value),
        0,
      );
      const avg = sum / total.length;

      items.push({ value: parseFloat(avg.toFixed(2)), date: key });
    }
  }

  let formattedTime: string;
  for (let i = 0; i < hours; i += 1) {
    formattedTime = format(
      utcToZonedTime(subHours(new Date(), i), DEFAULT_TIME_ZONE),
      HISTORICAL_SENSOR_DATE_FORMAT,
    );

    // eslint-disable-next-line no-loop-func
    const getData = items.filter((row) => row.date === formattedTime)[0] || {};

    if (formattedTime === getData.date) {
      const retval = {
        current: Number.isNaN(getData.value) ? 0 : getData.value,
        label: `${getData.date}:00`,
        benchmarkMin: null as any,
        benchmarkMax: null as any,
      };

      sensorData.benchmark.filter(
        // eslint-disable-next-line no-loop-func
        (item: { created: string; value: { min: any; max: any } }) => {
          if (
            format(new Date(item.created), DATE_SQL_FORMAT) ===
            format(new Date(formattedTime.split(' ')[0]), DATE_SQL_FORMAT)
          ) {
            retval.benchmarkMin = item.value.min;
            retval.benchmarkMax = item.value.max;
          }
        },
      );
      data.unshift(retval);
    } else {
      data.unshift(null);
    }
  }
  return data;
}

export function parseDataperThreeHours(sensorData: any, start: Date, end: Date) {
  const hours = differenceInHours(end, start);
  const finalObj: any = {};
  const items = [];
  const data = [];

  for (let index = 0; index < sensorData.current.length; index += 1) {
    const a = Number(format(new Date(sensorData.current[index].created), 'k'));
    if (a % 3 === 0) {
      const date = format(
        new Date(sensorData.current[index].created),
        HISTORICAL_SENSOR_DATE_FORMAT,
      );
      if (finalObj[date]) {
        finalObj[date].push(sensorData.current[index]);
      } else {
        finalObj[date] = [null];
      }
    }
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const key in finalObj) {
    if (Object.prototype.hasOwnProperty.call(finalObj, key)) {
      const element: any = finalObj[key];
      const total = element.filter((x: any) => x && x.value);
      const sum = total.reduce(
        (a: string, b: { value: string }) => parseFloat(a) + parseFloat(b.value),
        0,
      );
      const avg = sum / total.length;

      items.push({ value: parseFloat(avg.toFixed(2)), date: key });
    }
  }

  let formattedTime: string;
  for (let i = 0; i < hours; i += 1) {
    formattedTime = format(
      utcToZonedTime(subHours(new Date(), i), DEFAULT_TIME_ZONE),
      HISTORICAL_SENSOR_DATE_FORMAT,
    );

    // eslint-disable-next-line no-loop-func
    const getData = items.filter((row) => row.date === formattedTime)[0] || {};

    if (formattedTime === getData.date) {
      const retval = {
        current: Number.isNaN(getData.value) ? 0 : getData.value,
        label: `${getData.date}:00`,
        benchmarkMin: null,
        benchmarkMax: null,
      };

      sensorData.benchmark.filter(
        // eslint-disable-next-line no-loop-func
        (item: { created: string; value: { min: any; max: any } }) => {
          if (
            format(new Date(item.created), DATE_SQL_FORMAT) ===
            format(new Date(formattedTime.split(' ')[0]), DATE_SQL_FORMAT)
          ) {
            retval.benchmarkMin = item.value.min;
            retval.benchmarkMax = item.value.max;
          }
        },
      );
      data.unshift(retval);
    }
  }
  return data;
}

export function parseDataperSixHours(sensorData: any, start: Date, end: Date) {
  const hours = differenceInHours(end, start);
  const finalObj: any = {};
  const items = [];
  const data = [];

  for (let index = 0; index < sensorData.current.length; index += 1) {
    const a = Number(format(new Date(sensorData.current[index].created), 'k'));
    if (a % 6 === 0) {
      const date = format(
        new Date(sensorData.current[index].created),
        HISTORICAL_SENSOR_DATE_FORMAT,
      );
      if (finalObj[date]) {
        finalObj[date].push(sensorData.current[index]);
      } else {
        finalObj[date] = [null];
      }
    }
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const key in finalObj) {
    if (Object.prototype.hasOwnProperty.call(finalObj, key)) {
      const element: any = finalObj[key];
      const total = element.filter((x: any) => x && x.value);
      const sum = total.reduce(
        (a: string, b: { value: string }) => parseFloat(a) + parseFloat(b.value),
        0,
      );
      const avg = sum / total.length;

      items.push({ value: parseFloat(avg.toFixed(2)), date: key });
    }
  }

  let formattedTime: string;
  for (let i = 0; i < hours; i += 1) {
    formattedTime = format(
      utcToZonedTime(subHours(new Date(), i), DEFAULT_TIME_ZONE),
      HISTORICAL_SENSOR_DATE_FORMAT,
    );

    // eslint-disable-next-line no-loop-func
    const getData = items.filter((row) => row.date === formattedTime)[0] || {};

    if (formattedTime === getData.date) {
      const retval = {
        current: Number.isNaN(getData.value) ? 0 : getData.value,
        label: `${getData.date}:00`,
        benchmarkMin: null as any,
        benchmarkMax: null as any,
      };

      sensorData.benchmark.filter(
        // eslint-disable-next-line no-loop-func
        (item: { created: string; value: { min: any; max: any } }) => {
          if (
            format(new Date(item.created), DATE_SQL_FORMAT) ===
            format(new Date(formattedTime.split(' ')[0]), DATE_SQL_FORMAT)
          ) {
            retval.benchmarkMin = item.value.min;
            retval.benchmarkMax = item.value.max;
          }
        },
      );
      data.unshift(retval);
    }
  }
  return data;
}

export function parseDataperCycleToDate(sensorData: any, start: Date, end: Date) {
  const hours = differenceInHours(end, start);
  const finalObj: any = {};
  const items = [];
  const data = [];

  for (let index = 0; index < sensorData.current.length; index += 1) {
    const a = Number(format(new Date(sensorData.current[index].created), 'k'));
    if (a % 24 === 0) {
      const date = format(
        new Date(sensorData.current[index].created),
        HISTORICAL_SENSOR_DATE_FORMAT,
      );
      if (finalObj[date]) {
        finalObj[date].push(sensorData.current[index]);
      } else {
        finalObj[date] = [null];
      }
    }
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const key in finalObj) {
    if (Object.prototype.hasOwnProperty.call(finalObj, key)) {
      const element: any = finalObj[key];
      const total = element.filter((x: any) => x && x.value);
      const sum = total.reduce(
        (a: string, b: { value: string }) => parseFloat(a) + parseFloat(b.value),
        0,
      );
      const avg = sum / total.length;

      items.push({ value: parseFloat(avg.toFixed(2)), date: key });
    }
  }

  let formattedTime: string;
  for (let i = 0; i < hours; i += 1) {
    formattedTime = format(
      utcToZonedTime(subHours(new Date(), i), DEFAULT_TIME_ZONE),
      HISTORICAL_SENSOR_DATE_FORMAT,
    );

    // eslint-disable-next-line no-loop-func
    const getData = items.filter((row) => row.date === formattedTime)[0] || {};

    if (formattedTime === getData.date) {
      const retval = {
        current: Number.isNaN(getData.value) ? 0 : getData.value,
        label: `${getData.date}:00`,
        benchmarkMin: null as any,
        benchmarkMax: null as any,
      };

      sensorData.benchmark.filter(
        // eslint-disable-next-line no-loop-func
        (item: { created: string; value: { min: any; max: any } }) => {
          if (
            format(new Date(item.created), DATE_SQL_FORMAT) ===
            format(new Date(formattedTime.split(' ')[0]), DATE_SQL_FORMAT)
          ) {
            retval.benchmarkMin = item.value.min;
            retval.benchmarkMax = item.value.max;
          }
        },
      );
      data.unshift(retval);
    }
  }
  return data;
}

export function formatIotHistoricalData(
  days: string = '-1',
  sensorData: any,
  start: Date,
  end: Date,
): any {
  if (!sensorData?.current?.length) return [];

  let result = [];

  switch (days) {
    case '1':
      result = parseDataperHours(sensorData, start, end);
      break;
    case '3':
      result = parseDataperThreeHours(sensorData, start, end);
      break;
    case '7':
      result = parseDataperSixHours(sensorData, start, end);
      break;
    default:
      result = parseDataperCycleToDate(sensorData, start, end || new Date());
  }

  return result.filter((val) => val);
}

/**
 * Get current population of farming cycle
 * @deprecated use DailyMonitoringDAO.getRemainingPopulation() instead
 */
export function getCurrentPopulation(farmingCycle: FarmingCycle): number {
  return farmingCycle.chickStocks.reduce<any>((total, chickStock) => {
    if (chickStock.operator === '-') {
      total -= chickStock.qty;
    }
    if (chickStock.operator === '+') {
      total += chickStock.qty;
    }

    return total;
  }, 0);
}

/**
 * Validate object value with DTO schema
 * @param schema expected DTO schema
 * @param value object value
 * @returns 1 error message or null
 */
export function validateType<T extends Types.TSchema>(schema: T, value: unknown): string | null {
  const errors = [...Value.Errors(schema, value)];

  if (errors.length) {
    return `${errors[0].message} ${errors[0].path.replace(/[//]/g, '')}`;
  }

  return null;
}

/**
 * Replace all - based on this answer https://stackoverflow.com/a/1144788
 * @param str original string
 * @param find search value
 * @param replace replace value
 * @returns string
 */
export function replaceAll(str: string, find: string, replace: string): string {
  return str.replace(new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
}

export function secondsToDurationText(seconds: number): string {
  const hours = secondsToHours(seconds);
  const minutes = secondsToMinutes(seconds - hoursToSeconds(hours));
  seconds = seconds - hoursToSeconds(hours) - minutesToSeconds(minutes);

  return `${hours} hours ${minutes} minutes ${seconds.toFixed(0)} seconds`;
}

export function topicToMac(address: string): string {
  return address.match(/.{1,2}/g)!.join(':');
}

export function getSensorTypeCategories(sensorType: string): string[] {
  switch (sensorType) {
    case 'temperature':
      return SENSOR_TYPE_CATEGORIES.temperature;
    case 'relativeHumidity':
      return SENSOR_TYPE_CATEGORIES.relativeHumidity;
    case 'ammonia':
      return SENSOR_TYPE_CATEGORIES.ammonia;
    case 'lights':
      return SENSOR_TYPE_CATEGORIES.lights;
    case 'wind':
      return SENSOR_TYPE_CATEGORIES.wind;
    default:
      return [];
  }
}

export function hexToNumber(hex: string): number {
  return Number(`0x${hex}`);
}

export function reverseString(str: string): string {
  return str.split('').reverse().join('');
}

export function byteToNumber(byteArray: Uint8Array): number {
  let value = 0;
  for (let i = 0; i < byteArray.length; i += 1) {
    value = (value << 8) | byteArray[i];
  }
  return value;
}

export function getDateTime(arg: Uint8Array): string {
  const dateTime = byteToNumber(arg);
  return (new Date().setTime(Number(dateTime)) * 1000).toString();
}

export function createBinaryString(nMask: number): string {
  let sMask = '';
  for (
    let nFlag = 0, nShifted = nMask;
    nFlag < 32;
    nFlag += 1, sMask += String(nShifted >>> 31), nShifted <<= 1
  );
  return sMask.substring(16, 32);
}

export function binToNumber(str: string): number {
  return parseInt(str, 2);
}

export function decodeTlvVersion(value: string): string {
  const binData = createBinaryString(parseInt(value, 16));

  const MAJOR = binToNumber(binData.substring(2, 8));
  const MINOR = binToNumber(binData.substring(8, 12));
  const PATCH = binToNumber(binData.substring(12, 16));

  return `${MAJOR}.${MINOR}.${PATCH}`;
}

export function relayStatus(params: string) {
  const data = reverseString(createBinaryString(parseInt(params, 16)));

  return {
    alarm: Boolean(Number(data.substring(0, 1))),
    heater: Boolean(Number(data.substring(1, 2))),
    fan1: Boolean(Number(data.substring(2, 3))),
    fan2: Boolean(Number(data.substring(3, 4))),
    fan3: Boolean(Number(data.substring(4, 5))),
    fan4: Boolean(Number(data.substring(5, 6))),
    fan5: Boolean(Number(data.substring(6, 7))),
    coolingPad: Boolean(Number(data.substring(7, 8))),
  };
}

export function intermittentRelayData(params: string) {
  const data = reverseString(createBinaryString(parseInt(params, 16)));
  return {
    fan1: Boolean(Number(data.substring(0, 1))),
    fan2: Boolean(Number(data.substring(1, 2))),
    fan3: Boolean(Number(data.substring(2, 3))),
    fan4: Boolean(Number(data.substring(3, 4))),
    fan5: Boolean(Number(data.substring(4, 5))),
    coolingPad: Boolean(Number(data.substring(5, 6))),
  };
}

export function errorCodeConv(params: string, value: string): string {
  const errorMessages: Record<string, Record<string, string>> = {
    ads: {
      '00': 'No Error',
      '01': 'Error',
    },
    temperature: {
      '00': 'No Error',
      '01': 'Read Error',
      '10': 'Not Set',
    },
    sdCard: {
      '00': 'No Error',
      '01': 'Error',
    },
    rtc: {
      '00': 'No Error',
      '01': 'RTC Error',
      '10': 'NTP Error',
    },
    connection: {
      '00': 'No Error',
      '01': 'WiFi Error',
      '10': 'MQTT Error',
    },
  };

  return errorMessages[params]?.[value];
}

export function errorConv(params: string): ErrorConventron {
  const data = reverseString(createBinaryString(parseInt(params, 16)));
  return {
    ads: errorCodeConv('ads', reverseString(data.substring(0, 2))),
    temperature: errorCodeConv('temperature', reverseString(data.substring(2, 4))),
    sdCard: errorCodeConv('sdCard', reverseString(data.substring(4, 6))),
    rtc: errorCodeConv('rtc', reverseString(data.substring(6, 8))),
    connection: errorCodeConv('connection', reverseString(data.substring(8, 10))),
  };
}

export function constructAdditionalNotificationCoop(farmingCycle: FarmingCycle) {
  return {
    id: farmingCycle.coopId,
    coopName: farmingCycle.coop.coopName,
    farmId: farmingCycle.farmId,
    startDate: format(farmingCycle.farmingCycleStartDate, DATE_SQL_FORMAT),
    day: differenceInDays(
      utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
      farmingCycle.farmingCycleStartDate,
    ),
    coopCity: farmingCycle.farm.city.cityName,
    coopDistrict: farmingCycle.farm.district.districtName,
    farmingCycleId: farmingCycle.id,
    isActionNeeded: false,
    isNew: false,
    period: farmingCycle.coop.totalPeriod,
    bw: {
      actual: 0,
      standard: 0,
    },
    ip: {
      actual: 0,
      standard: 0,
    },
  };
}

export function mapToFarmingStatusEnum(statusNumber: string): keyof typeof FC_FARMING_STATUS {
  const keys = Object.keys(FC_FARMING_STATUS);
  const values = Object.values(FC_FARMING_STATUS);

  let statusEnum: keyof typeof FC_FARMING_STATUS = 'NEW';
  for (let index = 0; index < values.length; index += 1) {
    const val = values[index];
    if (val === statusNumber) {
      statusEnum = keys[index] as keyof typeof FC_FARMING_STATUS;
    }
  }

  return statusEnum;
}

export function bytesToHexString(bytes: Uint8Array): string {
  let hexString = '';
  let i = 0;
  while (i < bytes.length) {
    const hex = bytes[i].toString(16);
    hexString += hex.length === 1 ? `0${hex}` : hex;
    i += 1;
  }
  return hexString;
}

export function parseSkipFailedConventronTemperature(arr: SearchHit<IOTConventronData>[]) {
  let index = 0;

  while (index < arr.length) {
    const data = arr[index]._source?.t;

    // check if sensor has t1, t2, t3 data
    if (data && Object.keys(data).some((val) => sensorConventronRegexp.test(val))) {
      return data;
    }

    index += 1;
  }

  return null;
}

export function getDateTimeString(arg: Uint8Array): string {
  const dateNumber = byteToNumber(arg);
  const dateUTC = new Date().setTime(dateNumber * 1000);
  return new Date(dateUTC).toISOString();
}
