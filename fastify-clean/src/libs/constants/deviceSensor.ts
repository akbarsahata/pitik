/* eslint-disable quote-props */
export const DEVICE_SENSOR_ERRORS = [
  'Can not read lux data from light sensor',
  'Can not read data from ammonia sensor',
  'Can not read data from anemometer',
  'RTC error',
  'SD card error',
  'Does not receive temp and RH data from S1',
  'Does not receive temp and RH data from S2',
  'Does not receive temp and RH data from S3',
  'Does not receive temp and RH data from S4',
  'Does not receive temp and RH data from S5',
  'Does not receive temp and RH data from S6',
  'Does not receive temp and RH data from S7',
  'Does not receive temp and RH data from S8',
];

export const DEVICE_SENSOR_STATUS = {
  ACTIVE: true,
  INACTIVE: false,
};

export const DEVICE_SENSOR_DELAY = 200;
