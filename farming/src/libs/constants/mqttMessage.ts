export type MetaHeader = {
  version: number;
  timestamp: Uint8Array;
  serverInfo?: number;
  source: number;
  messageType: number;
  messageCode: number;
};

export const MQTT_MESSAGE_TYPE = {
  COMMAND: 0x01,
  REPLY: 0x02,
  REPORT: 0x03,
  ALERT: 0x04,
  CHANGE: 0x05,
  REQUEST: 0x06,
  RESPONSE: 0x07,
};

export const MQTT_SERVER_INFO = {
  PARSER: 0x01,
  FWIOT: 0x02,
  TESTER: 0x03,
};

export const MQTT_MESSAGE_CODE = {
  // TODO: Centralised use object
  RESPONSE_SECURITY_KEY: 0x42,

  COMMAND: {
    DEVICE_INFO: 0x01,
    FARM_INFO: 0x02,
    RESET_DEVICE: 0x05,
    PING: 0x06,
    OTA_DEVICE: 0x07,
    MAP_SENSOR: 0x08,
    MAP_DEVICE: 0x09,
    REPORT_SETTING: 0x0a,
    STORE_RO: 0x0b,
    GET_DATA: 0x32,
    GET_STATUS: 0x33,
    GET_SETTINGS: 0x34,
    SET_SETTINGS: 0x34,
    CAPTURE_IMAGE: 0x40,
    REGISTER_CAMERA: 0x42,
    SET_CAMERA_OTA: 0x43,
  },
  REPLY: {
    DEVICE_INFO: 0x01,
    FARM_INFO: 0x02,
    RESET_DEVICE: 0x05,
    PING: 0x06,
    OTA_DEVICE: 0x07,
    MAP_SENSOR: 0x08,
    MAP_DEVICE: 0x09,
    REPORT_SETTING: 0x0a,
    STORE_RO: 0x0b,
    GET_DATA: 0x32,
    GET_STATUS: 0x33,
    GET_SETTINGS: 0x34,
    SET_SETTINGS: 0x34,
    SEND_SENSORS_LIST: 0x35,
  },
  REPORT: {
    MONITOR_DATA: 0x01,
    DIAGNOSTICS_DATA: 0x0c,
    CAPTURE_IMAGE_STATE: 0x41,
  },
  ALERT: {
    CONTROLLER_STATUS: 0x01,
    MONITOR_STATUS: 0x01,
    CAMERA_OFFLINE: 0x0d,
  },
  REQUEST: {
    CONTROLLER_SENSORS_LIST: 0x35,
  },
  CHANGE: {
    DEVICE_INFO: 0x01,
    SET_SETTINGS: 0x34,
  },
};

export const MQTT_CONTROLLER_SETTING_TYPES = {
  HEATER: 'HEATER',
  COOLER: 'COOLER',
  LAMP: 'LAMP',
  FAN: 'FAN',
  ALARM: 'ALARM',
  GROWTH_DAY: 'GROWTH_DAY',
  REPORT_MONITOR_DATA: 0x01,
  ALERT_MONITOR_STATUS: 0x01,
  COMMAND_REGISTER_CAMERA: 0x42,
  SET_CAMERA_OTA: 0x43,
  SET_MONITOR_R0: 0x0b,
};

export const MQTT_CONTROLLER_SETTING_COMMANDS = {
  HEATER: { id: 0x09, length: 2 },
};

export const MQTT_MAGIC_STRING = {
  1: 'PITIK',
  2: 'DIGITAL',
  3: 'INDONESIA',
  4: 'TUMBUH',
  5: 'BERSAMA',
  6: 'MITRA',
};

// https://pitik.atlassian.net/wiki/spaces/IOT/pages/124256340/IoT+Protocol+v2.0#Tipe-Device
export const MQTT_DEVICE_CATEGORY = {
  ESP32: 'e',
  ORANGEPI: 'o',
};

export const MQTT_DEVICE_TYPE = {
  SMART_MONITOR: 'm',
  SMART_CONTROLLER: 'c',
  SMART_CONVENTRON: 'v',
  SMART_ELMON: 'e',
  SMART_CAMERA: 'a',
  ORANGE_PY: 'o',
  ORANGE_PI: 'o',
  SMART_AUDIO: '',
};

export const DIVIDER = {
  GENERAL: 1e1,
  FLOAT: 1e2,
  POWER: 1e3,
};

export const MAC_LENGTH = 14;

export const MQTT_ERROR_CODE = {
  0: { msg: 'OK', num: 0 },
  1: { msg: 'Message corrupt', num: 1 },
  2: { msg: 'Version unknown', num: 2 },
  3: { msg: 'Time machine', num: 3 },
  4: { msg: 'Unauthorized', num: 4 },
  5: { msg: 'Type unknown', num: 5 },
  6: { msg: 'Code unknown', num: 6 },
  7: { msg: 'Proto error', num: 7 },
  8: { msg: 'Can not decode', num: 8 },
  9: { msg: 'Status error', num: 9 },
};

export const MQTT_MONITOR_STATUS = [
  'light',
  'ammonia',
  'anemo',
  'rtc',
  'sdcard',
  'modtemp',
  'modhum',
  'modammo',
  's1loc',
  's2loc',
  's3loc',
  's4loc',
  's1rem',
  's2rem',
  's3rem',
  's4rem',
];

export const TEMPTRON_TYPE = {
  T304: '304 D',
  T607: '607 AC',
};

export const COMMAND_DEVICE = {
  COOP_CODE: '043C02',
  DEVICE_ID: '033D01',
};
