export interface IOTSensorDataItem {
  id: string;
  t: number;
  h: number;
  b: number;
  s: number;
  Rs: number;
  R0: number;
  ppm: number;
  a: number;
}

export interface IOTSensorData {
  topic: string;
  paths: string[];
  message: string;
  sensors: {
    a: IOTSensorDataItem;
    s1: IOTSensorDataItem;
    s2: IOTSensorDataItem;
    s3: IOTSensorDataItem;
    s4: IOTSensorDataItem;
    s5: IOTSensorDataItem;
    s6: IOTSensorDataItem;
    s7: IOTSensorDataItem;
    s8: IOTSensorDataItem;
    w: number;
    l: number;
    // eslint-disable-next-line camelcase
    Modbus_sensor1: IOTSensorDataItem;
  };
  created: string;
}

export type SensorNames = 'a' | 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 's8' | 'w' | 'l';

export type SensorConventronTemperatureNames = 't1' | 't2';

export type ConventronFanNames = 'fan1' | 'fan2' | 'fan3' | 'fan4' | 'fan5';
export interface ErrorConventron {
  ads: string;
  temperature: string;
  sdCard: string;
  rtc: string;
  connection: string;
}
export interface IOTConventronData {
  topic: string;
  paths: string[];
  message: string;
  t: {
    t1: number;
    t2: number;
    t3: number;
    t4: number;
    t5: number;
  };
  relayInput: {
    alarm: boolean;
    heater: boolean;
    fan1: boolean;
    fan2: boolean;
    fan3: boolean;
    fan4: boolean;
    fan5: boolean;
    coolingPad: boolean;
  };
  relayOutput: {
    alarm: boolean;
    heater: boolean;
    fan1: boolean;
    fan2: boolean;
    fan3: boolean;
    fan4: boolean;
    fan5: boolean;
    coolingPad: boolean;
  };
  intermittentRelay: {
    fan1: boolean;
    fan2: boolean;
    fan3: boolean;
    fan4: boolean;
    fan5: boolean;
    coolingPad: boolean;
  };
  h: number;
  e: ErrorConventron;
  raw: string;
  created: string;
  fwVersion: string;
  temptronVersion: string;
  hwVersion: string;
}
