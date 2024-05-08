/* eslint-disable no-unused-vars */
/**
 * COLLECTION OF CONSTANTS
 */
export const DEFAULT_TIME_ZONE = 'Asia/Bangkok';
export const DATE_TIME_FORMAT = 'dd-MM-yyyy';
export const DATE_SQL_FORMAT = 'yyyy-MM-dd';
export const DATETIME_SQL_FORMAT = 'yyyy-MM-dd HH:mm:ss';
export const DATETIME_00_SQL_FORMAT = 'yyyy-MM-dd 00:00:00';
export const DATETIME_17_SQL_FORMAT = 'yyyy-MM-dd 17:00:00';
export const DATETIME_59_SQL_FORMAT = 'yyyy-MM-dd 23:59:59';
export const TIME_HH_MM_SS = 'HH:mm:ss';
export const TIME_HH_MM = 'HH:mm';
export const HISTORICAL_SENSOR_DATE_FORMAT = 'yyyy-MM-dd HH';
export const DATE_DOCUMENT_FORMAT = 'dd MMMM yyyy';
export const SMART_CAMERA_DATE_TIME_FORMAT = 'yyyy/MM/dd/HH:mm:ss';

export const USER_TYPE = {
  AK: 'poultry worker',
  KK: 'poultry leader',
  OWN: 'owner',
  PPL: 'ppl',
  ADM: 'admin',
  AM: 'area manager',
  MM: 'mitra manager',
  BU: 'pembantu umum',
  GM: 'general manager',
  VP: 'vice president',
  IO: 'iotoperations',
  IS: 'itsupport',
  AI: 'adminiot',
  SA: 'superadminiot',
  SLSADM: 'sales admin',
  SLS: 'sales',
};

export const USER_TYPE_COOP_MEMBER = [
  USER_TYPE.AK,
  USER_TYPE.KK,
  USER_TYPE.OWN,
  USER_TYPE.BU,
  USER_TYPE.PPL,
  USER_TYPE.MM,
  USER_TYPE.AM,
  USER_TYPE.GM,
];

export const USER_TYPE_GROUP = {
  APPROVER: 'APPROVER',
  REQUESTER: 'REQUESTER',
  ENDUSER: 'ENDUSER',
};

export const USER_TYPE_REQUESTER_GROUP = [USER_TYPE.BU, USER_TYPE.PPL];

export const USER_TYPE_APPROVER_GROUP = [USER_TYPE.MM, USER_TYPE.AM, USER_TYPE.GM, USER_TYPE.VP];

export const USER_TYPE_ENDUSER_GROUP = [USER_TYPE.AK, USER_TYPE.KK, USER_TYPE.OWN];

export const USER_TYPE_INTERNAL_GROUP = [
  USER_TYPE.VP,
  USER_TYPE.GM,
  USER_TYPE.AM,
  USER_TYPE.MM,
  USER_TYPE.PPL,
  USER_TYPE.BU,
];

export const COOP_CACHE_TTL = 3 * 60 * 60; // 3 hour -- in seconds

export enum DAILY_MONITORING_STATUS_ENUM {
  EMPTY = 'EMPTY',
  FILLED = 'FILLED',
  REVIEWED = 'REVIEWED',
  LATE = 'LATE',
  DONE = 'DONE',
}

export const DAILY_MONITORING_STATUS = {
  EMPTY: 'Segera Isi',
  FILLED: 'Sudah Isi',
  REVIEWED: 'Sudah Review',
  LATE: 'Telat',
  DONE: 'Selesai',
  NEED_REVIEW: 'Segera Review',
};

export const DAILY_REPORT_DEADLINE = 3;

export const USER_MANAGEMENT_WATCHED_FIELDS = ['roleId', 'parentId', 'password'];

export const FC_FARMING_STATUS = {
  NEW: '1',
  IN_PROGRESS: '2',
  CLOSED: '3',
  PENDING: '4',
};

export const FC_CYCLE_STATUS = {
  ACTIVE: true,
  INACTIVE: false,
};

export const FARMING_ACTIVITIES = {
  DOC_IN_REQUEST: 'DOC_IN_REQUEST',
  HARVEST_REQUEST: 'HARVEST_REQUEST',
  TRANSFER_REQUEST: 'TRANSFER_REQUEST',
  PURCHASE_REQUEST: 'PURCHASE_REQUEST',
};

export const FARMING_ACTIVITY_MIN_RANK_ACTOR = {
  DOC_IN_REQUEST: 4,
  HARVEST_REQUEST: 4,
  TRANSFER_REQUEST: 4,
  PURCHASE_REQUEST: 4,
};

export const CLOSING_NOTES_PATTERN = 'closing adjustment - %';

export const FEED_STOCK_NOTES = {
  MINUS: 'feed_stock_minus',
  MINUS_TR: 'feed_stock_minus - tr_id:%',
  PLUS: 'feed_stock_plus',
  PLUS_GR: 'feed_stock_plus - gr_id:%',
  CLOSING_ADJUSTMENT: 'closing adjustment - %',
};

/**
 * Climate Monitoring
 * Climate Controller
 * Camera Technology
 * Electrical Monitoring
 * Conventron
 */
export const DEVICE_TYPE = {
  SMART_MONITORING: {
    text: 'Smart Monitoring',
    value: 'SMART_MONITORING',
  },
  SMART_CONTROLLER: {
    text: 'Smart Controller',
    value: 'SMART_CONTROLLER',
  },
  SMART_CAMERA: {
    text: 'Smart Camera',
    value: 'SMART_CAMERA',
  },
  SMART_CONVENTRON: {
    text: 'Smart Conventron',
    value: 'SMART_CONVENTRON',
  },
  SMART_ELMON: {
    text: 'Smart Elmon',
    value: 'SMART_ELMON',
  },
  SMART_SCALE: {
    text: 'Smart Scale',
    value: 'SMART_SCALE',
  },
};

export const CONTRACT_CODE = {
  MITRA_GARANSI: 'CON/PTIK/MTGR/',
  COST_PLUS: 'CON/PTIK/CSPL/',
  OWN_FARM: 'CON/PTIK/OWFM/',
};

export const CONTRACT_TYPE = {
  MITRA_GARANSI: 'Mitra Garansi',
  COST_PLUS: 'Cost Plus',
  OWN_FARM: 'Own Farm',
};

export const CONTRACT_STATUS = {
  ACTIVE: 'ACTIVE',
  HISTORY: 'HISTORY',
};

export const GOOD_RECEIPT_PHOTO_TYPE = {
  SURAT_JALAN: 'surat-jalan',
  DOC_IN_FORM: 'doc-in-form',
};

export const UOM_CONTRACT = {
  PERCENT: '%',
  EKOR: 'Ekor',
  KG: 'Kg',
};

export const IOT_SECURITY_KEY_PATTERN = 'x-pitik-iot-sec:id|key';

export const AUTO_NUMBERING_TRX_TYPE = {
  FARMING_CYCLE: 'FarmingCycle',
  ISSUE: 'Issue',
  TASK_TICKET: 'TaskTicket',
  PURCHASE_ORDER: 'Purchase Order',
  PURCHASE_REQUEST: 'Purchase Request',
  GOODS_RECEIPT: 'Goods Receipt',
  TRANSFER_REQUEST: 'Transfer Request',
};

export const CONTRACT_CHICKEN_PRICE = {
  LOWER_RANGE: 'down',
  LOWER_RANGE_VALUE: '0',
  UPPER_RANGE: 'up',
  UPPER_RANGE_VALUE: '9',
};

export const CONTRACT_INCENTIVE = {
  LOWER_IP: 'down',
  LOWER_IP_VALUE: '0',
  UPPER_IP: 'up',
  UPPER_IP_VALUE: '999',
};

/**
 * Enum of upload image state in smart camera
 * https://pitik.atlassian.net/wiki/spaces/ENG/pages/111739003/Camtech+-+Subscription+Crowdedness+Detection#Mobile-Device-Trigger-Job-Creation
 */
export enum SMART_CAMERA_UPLOAD_IMAGE_STATE {
  COMMAND_RECEIVED_IN_SERVER = 'COMMAND_RECEIVED_IN_SERVER',
  COMMAND_RECEIVED_IN_DEVICE = 'COMMAND_RECEIVED_IN_DEVICE',
  PRESIGN_REQUESTED = 'PRESIGN_REQUESTED',
  UPLOADING_PROCESS_IN_DEVICE = 'UPLOADING_PROCESS_IN_DEVICE',
  DONE = 'DONE',

  // error state
  ERROR_SEND_COMMAND = 'ERROR_SEND_COMMAND',
  ERROR_CREATE_PRESIGN_URL = 'ERROR_CREATE_PRESIGN_URL',
  ERROR_CAPTURE_IMAGE = 'ERROR_CAPTURE_IMAGE',
  ERROR_UPLOAD_IMAGE = 'ERROR_UPLOAD_IMAGE',
}

export const DOCUMENT_TYPE = {
  PDF: 'pdf',
  DOCX: 'docx',
  EXCLS: 'excls',
};

export const GENERATED_DOCUMENT_MODULE = {
  HARVEST_REALIZATION: 'harvestRealization',
};

export const GENERATED_DOCUMENT_MODULE_TEMPLATE = {
  HARVEST_REALIZATION: './src/libs/templates/smartscale-weighing-harvest.html',
};

export const SENSOR_TYPE_CATEGORIES = {
  temperature: ['XIAOMI_SENSOR', 'TEMPERATURE_SENSOR'],
  relativeHumidity: ['XIAOMI_SENSOR', 'HUMIDITY_SENSOR'],
  ammonia: ['AMMONIA_SENSOR'],
  lights: ['LIGHT'],
  wind: ['WIND_SPEED'],
};

export const IOT_SENSOR_INDEX = {
  CLIMATE: 's',
  TEMPERATURE: 't',
  HUMIDITY: 'h',
  LUX: 'l',
  WIND: 'w',
  AMMONIA: 'a',
};
