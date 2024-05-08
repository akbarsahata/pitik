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
  differenceInCalendarDays,
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
  DEVICE_TYPE,
  FC_FARMING_STATUS,
  HISTORICAL_SENSOR_DATE_FORMAT,
  SENSOR_TYPE_CATEGORIES,
} from '../constants';
import { ERR_IOT_SENSOR_CODE_WRONG_FORMAT } from '../constants/errors';
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

export function generateB2BCode(lastNumber: number, digitCount: number, prefix: string): string {
  const monthYear = format(new Date(), 'MMyy', { timeZone: DEFAULT_TIME_ZONE });

  const padZeroes = '0'.repeat(digitCount - String(lastNumber).length);

  const lastNumberStr = `${padZeroes}${Number(lastNumber) + 1}`;

  return `${prefix}-${monthYear}-X${lastNumberStr}`;
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
 *
 * @param   {string}  input  formatted string: farm__created_at__ASC
 *
 * @return  {object}         converted object: ```{
 *  farm: {
 *    created_at: 'ASC',
 *  },
 * };```
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

export function generateSensorCode(prefix: string): string {
  const alphanumericChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  let code: string = prefix;

  for (let i = 0; i < 6; i += 1) {
    const randomIndex = Math.floor(Math.random() * alphanumericChars.length);
    const randomChar = alphanumericChars[randomIndex];
    code += randomChar;
  }

  return code;
}

/**
 * isRoleAllowed check if inputRole exist in expectedRoles
 */
export function isRoleAllowed(inputRole: string | string[], expectedRoles: string[]): boolean {
  const inputRoles = typeof inputRole === 'string' ? [inputRole] : inputRole;

  return expectedRoles.some((expected) =>
    inputRoles.some((input) => input.toUpperCase() === expected.toUpperCase()),
  );
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

      sensorData.benchmark?.filter(
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

      sensorData.benchmark?.filter(
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

      sensorData.benchmark?.filter(
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

      sensorData.benchmark?.filter(
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

/* eslint-disable no-bitwise */
export function toHexString(byteArray: Uint8Array): string {
  return Array.from(byteArray, (byte) => `0${(byte & 0xff).toString(16)}`.slice(-2)).join('');
}

export function reverseString(str: string): string {
  return str.split('').reverse().join('');
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

export function numberToHex(d: number) {
  return (d + 0x10000).toString(16).slice(-4).toUpperCase();
}

export function hexToNumber(hex: string): number {
  return Number(`0x${hex}`);
}

export function macToTopic(address: string): string {
  return address.replace(/:/g, '').toLowerCase();
}

export function byteToNumber(byteArray: Uint8Array): number {
  let value = 0;
  for (let i = 0; i < byteArray.length; i += 1) {
    value = (value << 8) | byteArray[i];
  }
  return value;
}

export function hmsToSeconds(time: string) {
  let [hours, minutes, seconds] = time.split(':').map((x) => parseInt(x, 10));
  if (!hours) hours = 0;
  if (!minutes) minutes = 0;
  if (!seconds) seconds = 0;

  return hours * 3600 + minutes * 60 + seconds;
}

export function hmsToMinutes(time: string) {
  let [hours, minutes, seconds] = time.split(':').map((x) => parseInt(x, 10));
  if (!hours) hours = 0;
  if (!minutes) minutes = 0;
  if (!seconds) seconds = 0;

  return hours * 60 + minutes + seconds / 60;
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

export function decodeFirmwareVersion(value: number): string {
  const binData = createBinaryString(value);

  const MAJOR = binToNumber(binData.substring(1, 6));
  const MINOR = binToNumber(binData.substring(6, 11));
  const PATCH = binToNumber(binData.substring(11, 16));

  return `${MAJOR}.${MINOR}.${PATCH}`;
}

export function decodeControllerVersion(value: number): string {
  const binData = createBinaryString(value);

  const MAJOR = binToNumber(binData.substring(2, 8));
  const MINOR = binToNumber(binData.substring(8, 12));
  const PATCH = binToNumber(binData.substring(12, 16));

  return `${MAJOR}.${MINOR}.${PATCH}`;
}

export function decodeTlvVersion(value: string): string {
  const binData = createBinaryString(parseInt(value, 16));

  const MAJOR = binToNumber(binData.substring(2, 8));
  const MINOR = binToNumber(binData.substring(8, 12));
  const PATCH = binToNumber(binData.substring(12, 16));

  return `${MAJOR}.${MINOR}.${PATCH}`;
}

export function numberToBin(num: number, bitLength: number): string {
  let bin = num.toString(2);
  while (bin.length < bitLength) {
    bin = `0${bin}`;
  }
  return bin;
}

export function encodeControllerVersion(version: string): number {
  const [MAJOR, MINOR, PATCH] = version.split('.').map(Number);
  if (MAJOR === undefined || MINOR === undefined || PATCH === undefined) {
    throw new Error('Invalid firmware version!');
  }

  const MAJOR_BIN = numberToBin(MAJOR, 6);
  const MINOR_BIN = numberToBin(MINOR, 4);
  const PATCH_BIN = numberToBin(PATCH, 4);

  const binData = `10${MAJOR_BIN}${MINOR_BIN}${PATCH_BIN}`;

  return parseInt(binData, 2);
}

export function encodeVersion(version: string): number {
  const [MAJOR, MINOR, PATCH] = version.split('.').map(Number);
  if (MAJOR === undefined || MINOR === undefined || PATCH === undefined) {
    throw new Error('Invalid firmware version!');
  }

  const MAJOR_BIN = numberToBin(MAJOR, 6);
  const MINOR_BIN = numberToBin(MINOR, 4);
  const PATCH_BIN = numberToBin(PATCH, 4);

  const binData = `10${MAJOR_BIN}${MINOR_BIN}${PATCH_BIN}`;

  return parseInt(binData, 2);
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
    startDate: farmingCycle.farmingCycleStartDate
      ? format(farmingCycle.farmingCycleStartDate, DATE_SQL_FORMAT)
      : '',
    day: farmingCycle.farmingCycleStartDate
      ? differenceInCalendarDays(
          utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
          farmingCycle.farmingCycleStartDate,
        )
      : 0,
    coopCity: farmingCycle.farm.city?.cityName || '',
    coopDistrict: farmingCycle.farm.district?.districtName || '',
    farmingCycleId: farmingCycle.id,
    isActionNeeded: false,
    isNew: farmingCycle.farmingStatus === FC_FARMING_STATUS.NEW,
    period: farmingCycle.coop.totalPeriod || 0,
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

export function getDateTimeString(arg: Uint8Array): string {
  const dateNumber = byteToNumber(arg);
  const dateUTC = new Date().setTime(dateNumber * 1000);
  return new Date(dateUTC).toISOString();
}

export function toRadian(value: number): number {
  return (value * Math.PI) / 180;
}

// https://en.wikipedia.org/wiki/Haversine_formula
export function calculateDistance(
  coordinate1: {
    lat: number;
    lon: number;
  },
  coordinate2: {
    lat: number;
    lon: number;
  },
): number {
  const R = 6371000; // radius of the earth in meters
  const dLat = toRadian(coordinate2.lat - coordinate1.lat);
  const dLon = toRadian(coordinate2.lon - coordinate1.lon);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadian(coordinate1.lat)) *
      Math.cos(toRadian(coordinate2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

export function extractNumbersFromString(str: string): number {
  const regex = /\d+/g;

  const matches = str.match(regex);

  if (matches) {
    const numberInArray = matches.map((match) => parseInt(match, 10));
    return numberInArray[0];
  }

  return 0;
}

export function sumProduct(arr1: number[], arr2: number[]): number {
  if (arr1.length !== arr2.length) {
    throw new Error("Invalid 'sumProduct' input!");
  }
  return arr1.reduce((sum, value, index) => sum + value * arr2[index], 0);
}
export function decimalToHexString(data: number): string {
  let hexString = data.toString(16);

  if (data < 16 || (data > 255 && data < 4096)) {
    hexString = `0${hexString}`;
  } else if (data < 256) {
    hexString = `00${hexString}`;
  }

  return hexString;
}

export function getFeedSubCategoryAndProductCode(feedProductName: string): any {
  const feedProductDetailArr = feedProductName.split(':');

  if (feedProductDetailArr.length < 3) {
    return {
      subcategoryCode: 'PRESTARTER',
      productCode: 'PRESTARTER',
    };
  }

  return {
    subcategoryCode: feedProductDetailArr[0],
    productCode: feedProductDetailArr[2],
  };
}

export function hexToUint8Array(hex: string) {
  hex = hex.replace(/\s/g, '');

  if (hex.length % 2 !== 0) {
    hex = `0${hex}`;
  }

  const pairs = hex.match(/.{1,2}/g);
  const uint8Array = new Uint8Array((pairs && pairs.length) || 0);

  pairs?.forEach((pair, idx) => {
    const byte = parseInt(pair, 16);
    uint8Array[idx] = byte;
  });

  return uint8Array;
}

export const hexToBin = (hex: any): string => {
  hex = hex.replace('0x', '').toLowerCase();
  let out = '';

  Object.keys(hex).forEach((c) => {
    switch (c) {
      case '0':
        out += '0000';
        break;
      case '1':
        out += '0001';
        break;
      case '2':
        out += '0010';
        break;
      case '3':
        out += '0011';
        break;
      case '4':
        out += '0100';
        break;
      case '5':
        out += '0101';
        break;
      case '6':
        out += '0110';
        break;
      case '7':
        out += '0111';
        break;
      case '8':
        out += '1000';
        break;
      case '9':
        out += '1001';
        break;
      case 'a':
        out += '1010';
        break;
      case 'b':
        out += '1011';
        break;
      case 'c':
        out += '1100';
        break;
      case 'd':
        out += '1101';
        break;
      case 'e':
        out += '1110';
        break;
      case 'f':
        out += '1111';
        break;
      default:
        out = '';
    }
  });

  return out;
};

/**
 * delete keys not needed from an object
 * while still returning the object with previously defined type
 *
 * @param   {T}                    data    any typed object
 * @param   {Array<keyof T>}       fields  array of string keys of object
 * @param   {undefined<T>}         T       [T description]
 *
 * @return  {T}                            return the same object
 */
export function omit<T = object>(data: T, fields: Array<keyof T>): T {
  fields.forEach((f) => {
    delete data[f];
  });

  return data;
}

export function checkAllUndefinedProperties(obj: Record<string, unknown>): boolean {
  const values = Object.values(obj);
  for (let i = 0; i < values.length; i += 1) {
    const value = values[i];

    if (typeof value === 'object' && value !== null) {
      if (!Array.isArray(value) && !checkAllUndefinedProperties(value as Record<string, unknown>)) {
        return false;
      }
    } else if (typeof value !== 'undefined') {
      return false;
    }
  }

  return true;
}

export function convertSignal(asciiString: string): any {
  const decodedData = Buffer.from(asciiString, 'base64');
  const uint8Array = new Uint8Array(decodedData);

  const hexString = Array.from(uint8Array)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  const datetime = new Date(hexToNumber(hexString.substring(2)) * 1000).toISOString();
  const state = hexToNumber(hexString.substring(0, 2));

  return {
    states: `${datetime}|${state ? 'on' : 'off'}`,
  };
}

export function secondsTommss(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}

export function b2bValidateSensorCode(sensorType: string, sensorCode: string) {
  const sensorTypeCodePatternMapping = {
    XIAOMI_SENSOR: {
      pattern: 'ATC_\\w{6}',
      description: 'ATC_(6 digit angka huruf)',
    },
    CAMERA: {
      pattern: 'BRD_\\w{6}',
      description: 'BRD_(6 digit angka huruf)',
    },
    RECORDER: {
      pattern: 'MIC_\\w{6}',
      description: 'MIC_(6 digit angka huruf)',
    },
  };

  if (!Reflect.has(sensorTypeCodePatternMapping, sensorType)) return;

  const validator =
    sensorTypeCodePatternMapping[sensorType as keyof typeof sensorTypeCodePatternMapping];

  const regexp = new RegExp(validator.pattern);

  if (!regexp.test(sensorCode)) {
    throw ERR_IOT_SENSOR_CODE_WRONG_FORMAT(
      sensorCode,
      `untuk type ${sensorType} gunakan`,
      validator.description,
    );
  }
}

export function b2bGenerateDefaultDeviceName(deviceType: string, number?: number): string {
  switch (deviceType) {
    case DEVICE_TYPE.SMART_MONITORING.value:
      return `${DEVICE_TYPE.SMART_MONITORING.text} ${number || 1}`;
    case DEVICE_TYPE.SMART_CONTROLLER.value:
      return `${DEVICE_TYPE.SMART_CONTROLLER.text} ${number || 1}`;
    case DEVICE_TYPE.SMART_CAMERA.value:
      return `${DEVICE_TYPE.SMART_CAMERA.text} ${number || 1}`;
    default:
      return 'Smart Iot Device 1';
  }
}

export function roundToN(num: number, n: number = 2) {
  const x = parseInt(`1${'0'.repeat(n)}`, 10);

  return Math.round((num + Number.EPSILON) * x) / x;
}

export function calculateSensorAverage(externalAvg: number, internalAvg: number): number {
  if (externalAvg > 0 && internalAvg > 0) {
    return (externalAvg + internalAvg) / 2;
  }
  return externalAvg > 0 ? externalAvg : internalAvg;
}

export function uomConverter(fromQty: number, fromUom: string, toUom: string): number {
  const conversionFactors: Record<string, number> = {
    gram: 1,
    kilogram: 1000,
    karung: 500000,
  };

  const fromFactor = conversionFactors[fromUom];
  const toFactor = conversionFactors[toUom];
  if (!fromFactor || !toFactor) {
    throw new Error(`Invalid unit of measurement: ${fromUom} or ${toUom}`);
  }

  return (fromQty * fromFactor) / toFactor;
}
