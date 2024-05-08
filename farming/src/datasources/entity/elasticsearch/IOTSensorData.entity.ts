/* eslint-disable camelcase */
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
  mac: string;
  coopCode: string;
  roomCode: string;
  created: string | null;
}

export interface RelayController {
  fan1: boolean;
  fan2: boolean;
  fan3: boolean;
  fan4: boolean;
  fan5: boolean;
  fan6: boolean;
  fan7: boolean;
  fan8: boolean;
  heater: boolean;
  lamp: boolean;
  cooler: boolean;
  alarm: boolean;
}

export interface IntermittentFanController {
  fan1: boolean;
  fan2: boolean;
  fan3: boolean;
  fan4: boolean;
  fan5: boolean;
  fan6: boolean;
  fan7: boolean;
  fan8: boolean;
}

export interface TemperaturesController {
  temperature1: number;
  temperature2: number;
}

export interface HumiditysController {
  humidity1: number;
  humidity2: number;
}

export interface ErrorsController {
  rtc: string;
  relay: string;
  modbus: string;
  sdCard: string;
  eeprom: string;
  serial: string;
}

export interface IOTSensorController {
  version: string;
  hardwareVersion: string;
  created: string | null;
  relay: RelayController;
  intermittentFan: IntermittentFanController;
  temperatures: TemperaturesController;
  humiditys: HumiditysController;
  errors: ErrorsController;
  dateTime: string;
  paths: string[];
  coopId: string;
  deviceId: string;
  raw: string;
  temperature: number;
  humidity: number;
}

export interface RelayInputConventron {
  alarm: boolean;
  heater: boolean;
  fan_1: boolean;
  fan_2: boolean;
  fan_3: boolean;
  fan_4: boolean;
  fan_5: boolean;
  cooling_pad: boolean;
}

export interface RelayOutputConventron {
  alarm: boolean;
  heater: boolean;
  fan_1: boolean;
  fan_2: boolean;
  fan_3: boolean;
  fan_4: boolean;
  fan_5: boolean;
  cooling_pad: boolean;
}

export interface IntermittentRelayConventron {
  fan_1: boolean;
  fan_2: boolean;
  fan_3: boolean;
  fan_4: boolean;
  fan_5: boolean;
  cooling_pad: boolean;
}

export interface TemperatureConventron {
  temperature_1: number;
  temperature_2: number;
  temperature_3: number;
  temperature_4: number;
  temperature_5: number;
}

export interface ErrorsConventron {
  ads: string;
  temperature: string;
  sd_card: string;
  rtc: string;
  connection: string;
}

export interface IOTSensorConventron {
  version: string;
  created: string | null;
  relayInput: RelayInputConventron;
  relayOutput: RelayOutputConventron;
  intermittentRelay: IntermittentRelayConventron;
  temperature: TemperatureConventron;
  humidity: number;
  errors: ErrorsConventron;
  dateTime: string;
  paths: string[];
  coop_id: string;
  device_id: string;
  raw: string;
}

// Sensors ELMON
export interface VoltElmon {
  AB: number;
  BC: number;
  CA: number;
  AN: number;
  BN: number;
  CN: number;
}

export interface CurrentElmon {
  A: number;
  B: number;
  C: number;
}

export interface PwrElmon {
  activeA: number;
  activeB: number;
  activeC: number;
  activeTotal: number;
  reactiveA: number;
  reactiveB: number;
  reactiveC: number;
  reactiveTotal: number;
  pfA: number;
  pfB: number;
  pfC: number;
  pfTotal: number;
  apparentA: number;
  apparentB: number;
  apparentC: number;
  apparentTotal: number;
}

export interface ThdCurrentElmon {
  A: number;
  B: number;
  C: number;
}

export interface ThdVoltageElmon {
  AN: number;
  BN: number;
  CN: number;
}

export interface EnergyElmon {
  absorptiveActive: number;
  releaseActive: number;
  inductiveReactive: number;
  capasitiveReactive: number;
}

export interface AngleElmon {
  phaseA: number;
  phaseB: number;
  phaseC: number;
}

export interface IOTSensorElmon {
  volt: VoltElmon;
  current: CurrentElmon;
  pwr: PwrElmon;
  thdCurrent: ThdCurrentElmon;
  thdVoltage: ThdVoltageElmon;
  energy: EnergyElmon;
  angle: AngleElmon;
  f: number;
  created: string | null;
  topic: string;
  mac: string;
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

export type IOTSensors = IOTSensorData | IOTSensorController | IOTSensorConventron | IOTSensorElmon;
