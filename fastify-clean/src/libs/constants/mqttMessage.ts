export type MetaHeader = {
  version: number;
  timestamp: Uint8Array;
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

export const MQTT_MESSAGE_CODE = {
  COMMAND_CAPTURE_IMAGE: 0x40,
  REPORT_CAPTURE_IMAGE_STATE: 0x41,
  REPORT_MONITOR_DATA: 0x01,
  ALERT_MONITOR_STATUS: 0x01,
  COMMAND_REGISTER_CAMERA: 0x42,
  SET_CAMERA_OTA: 0x43,
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
export const MQTT_DEVICE_TYPE = {
  SMART_MONITOR: 'm',
  CLIMATE_CONTROLLER: 'c',
  CONVENTRON: 'v',
  ELECTRICAL_MONITOR: 'e',
  SMART_CAMERA: 'a',
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

export const MAC_LENGTH = 14;

export const DIVIDER = {
  GENERAL: 1e1,
  FLOAT: 1e2,
  POWER: 1e3,
};

export const TEMPTRON_TYPE = {
  T304: '304 D',
  T607: '607 AC',
};
