/* eslint-disable no-unused-vars */

import { ProductCategoryCodeEnum } from '../../datasources/entity/pgsql/sales/ProductCategory.entity';

/**
 * COLLECTION OF CONSTANTS
 */
export const DEFAULT_TIME_ZONE = 'Asia/Bangkok';
export const DATE_TIME_FORMAT = 'dd-MM-yyyy';
export const DATE_TIME_FORMAT_SLASH = 'dd/MM/yyyy';
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
export const SMART_RECORDER_DATE_TIME_FORMAT = 'yyyy/MM/dd/HH:mm:ss';
export const SMART_AUDIO_DATE_TIME_FORMAT = 'yyyy/MM/dd/HH:mm:ss';
export const DATETIME_ISO_FORMAT = "yyyy-MM-dd'T'HH:mm:ss'Z'";

export const USER_TYPE_B2B_EXTERNAL = {
  ADMEXT: 'admin external',
  AKEXT: 'poultry worker external',
  OWNEXT: 'owner external',
};

export const B2B_DEFAULT_ORG = {
  ID: '28c8dc47-9db6-4f84-b040-be0ae6bfc856',
  NAME: 'PT. Pitik Digital Indonesia',
};

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
  PA: 'production associate',
  SLS: 'sales',
  SLSLD: 'sales lead',
  SUPER: 'superadmin',
  DRIVER: 'driver',
  ADMIN_UNIT: 'admin unit',
  SHOPKEEPER: 'shopkeeper',
  OPERATIONAL_LEAD: 'operational lead',
  DOWNSTREAM_FMS_ADMIN: 'downstream fms admin',
  SC_RELATION: 'sc relation',
  SC_FLEET: 'sc fleet',
  ...USER_TYPE_B2B_EXTERNAL,
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

export const USER_TYPE_B2B_EXTERNAL_APP_GROUP = [
  USER_TYPE_B2B_EXTERNAL.ADMEXT,
  USER_TYPE_B2B_EXTERNAL.OWNEXT,
  USER_TYPE_B2B_EXTERNAL.AKEXT,
  USER_TYPE.ADM,
];

export const COOP_CACHE_TTL = 3 * 60 * 60; // 3 hour -- in seconds

export enum DAILY_MONITORING_STATUS_ENUM {
  EMPTY = 'EMPTY',
  FILLED = 'FILLED',
  REVIEWED = 'REVIEWED',
  LATE = 'LATE',
  DONE = 'DONE',
  REVISION = 'REVISION',
}

export const DAILY_MONITORING_STATUS = {
  EMPTY: 'Segera Isi',
  FILLED: 'Sudah Isi',
  REVIEWED: 'Sudah Review',
  LATE: 'Telat',
  DONE: 'Selesai',
  NEED_REVIEW: 'Segera Review',
  REVISION: 'Revisi',
};

export const DAILY_REPORT_DEADLINE = 3;

export const USER_MANAGEMENT_WATCHED_FIELDS = [
  'roleId',
  'parentId',
  'password',
  'roleIds',
  'supervisors',
];

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

export const TICKET_STATUS = {
  PENDING: 2,
  EXECUTED: 3,
};

export const FEED_STOCK_NOTES = {
  MINUS: 'feed_stock_minus',
  MINUS_SUMMARY: 'feed_stock_minus - fc_feedstock_summary_id:%',
  MINUS_TR: 'feed_stock_minus - tr_id:%',
  PLUS: 'feed_stock_plus',
  PLUS_GR: 'feed_stock_plus - gr_id:%',
  CLOSING_ADJUSTMENT: 'closing adjustment - %',
  ADJUSTMENT_SUMMARY: 'feed-stock-adjustment:%',
};

export const OVK_STOCK_NOTES = {
  MINUS: 'ovk_stock_minus - fc_ovkstock_summary_id:%',
  MINUS_TR: 'ovk_stock_minus - tr_id:%',
  PLUS: 'ovk_stock_plus - gr_id:%',
  CLOSING_ADJUSTMENT: 'closing adjustment - %',
  ADJUSTMENT_SUMMARY: 'ovk-stock-adjustment:%',
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
  SMART_AUDIO: {
    text: 'Smart Audio',
    value: 'SMART_AUDIO',
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
  INACTIVE: 'INACTIVE',
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
  MATCHING_NUMBER: 'Matching Number',
  B2B_FARM_CODE: 'B2B Farm Code',
  B2B_COOP_CODE: 'B2B Coop Code',
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
export enum SMART_RECORDER_UPLOAD_STATE {
  COMMAND_RECEIVED_IN_SERVER = 'COMMAND_RECEIVED_IN_SERVER',
  COMMAND_RECEIVED_IN_DEVICE = 'COMMAND_RECEIVED_IN_DEVICE',
  PRESIGN_REQUESTED = 'PRESIGN_REQUESTED',
  UPLOADING_PROCESS_IN_DEVICE = 'UPLOADING_PROCESS_IN_DEVICE',
  DONE = 'DONE',

  // error state
  ERROR_SEND_COMMAND = 'ERROR_SEND_COMMAND',
  ERROR_CREATE_PRESIGN_URL = 'ERROR_CREATE_PRESIGN_URL',
  ERROR_CAPTURE_AUDIO = 'ERROR_CAPTURE_AUDIO',
  ERROR_UPLOAD_AUDIO = 'ERROR_UPLOAD_AUDIO',
}

export enum SMART_AUDIO_UPLOAD_FILE_STATE {
  COMMAND_RECEIVED_IN_SERVER = 'COMMAND_RECEIVED_IN_SERVER',
  COMMAND_RECEIVED_IN_DEVICE = 'COMMAND_RECEIVED_IN_DEVICE',
  PRESIGN_REQUESTED = 'PRESIGN_REQUESTED',
  UPLOADING_PROCESS_IN_DEVICE = 'UPLOADING_PROCESS_IN_DEVICE',
  DONE = 'DONE',

  // error state
  ERROR_SEND_COMMAND = 'ERROR_SEND_COMMAND',
  ERROR_CREATE_PRESIGN_URL = 'ERROR_CREATE_PRESIGN_URL',
  ERROR_RECORD_SOUND = 'ERROR_RECORD_SOUND',
  ERROR_UPLOAD_FILE = 'ERROR_UPLOAD_FILE',
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
  temperature: ['XIAOMI_SENSOR', 'TEMPERATURE_SENSOR', 'TEMPERATURE_OR_HUMIDITY'],
  relativeHumidity: ['XIAOMI_SENSOR', 'HUMIDITY_SENSOR', 'TEMPERATURE_OR_HUMIDITY'],
  ammonia: ['AMMONIA_SENSOR'],
  lights: ['LIGHT'],
  wind: ['WIND_SPEED'],
  sounds: ['RECORDER'],
};

export const IOT_SENSOR_INDEX = {
  CLIMATE: 's',
  TEMPERATURE: 't',
  HUMIDITY: 'h',
  LUX: 'l',
  WIND: 'w',
  AMMONIA: 'a',
};

export const TICKETING_STATUS = {
  OPEN: 'OPEN',
  ON_MAINTENANCE: 'ON_MAINTENANCE',
  RESOLVED: 'RESOLVED',
  OTHERS: 'OTHERS',
};

// ROLE RANK CONTEXT
export enum ROLE_RANK_CONTEXT {
  internal = 'internal',
  external = 'external',
  ownerApp = 'ownerApp',
  downstream = 'downstream',
}

export const FEED_SUBCATEGORY_ORDER: { [key: string]: number } = {
  PRESTARTER: 0,
  STARTER: 1,
  FINISHER: 2,
};

export const SALES_CACHE_PATTERN = {
  LATEST_STOCK: 'sales:operation_unit:$operationUnitId:latest-stocks',
};

export const USER_SYSTEM_CRON: { [key: string]: string } = {
  id: 'f2bd6a80971966d72d7e47e08ee86bde',
  role: 'system',
};

export enum APP_ID {
  DOWNSTREAM_APP = '049e582f-8723-4b99-94ff-9194849648be',
  FMS = 'ed8622d4-ef88-4a03-941b-fbf151df695e',
}

export const B2B_FARM_DEFAULT_ADDRESS = {
  // DEFAULT EXTERNAL USES HO AS MAIN BRANCH
  branchId: '08083e6356d05a12cdb2b702794cda04',
  provinceId: 3,
  cityId: 455,
  districtId: 6270,
  zipCode: '15345',
};

export const CHICK_IN_REQ_REMARKS = {
  REJECTED_BY_PROC: 'Ditolak oleh Procurement',
};

export const CACHE_KEY_PREFIX = {
  GET_ONE_IOT_DEVICE: 'getoneiotdevice',
};

export const HARVEST_DEAL_STATUS_TEXT_MAP = {
  AVAILABLE: 'Tersedia',
  DRAFT: 'Draft',
  FINAL: 'Final',
  REJECTED: 'Ditolak',
  CANCELLED: 'Dibatalkan',
};

export const HARVEST_DEAL_DEFAULT_REASON = 'Panen Normal/Panen Raya';

export const DEFAULT_CHICK_TYPE_ID = 'EwKCLp656PM8KT26oAfIBPEjM1nxMli7';

export const SALES_TOTAL_WEIGHT_PRODUCT = {
  id: '99497ac0-ac63-4a30-9988-854015b76c49',
  categoryId: '9f9224c1-7b93-4a50-9eca-802877b9439a',
};

export const SALES_PRODUCT_CATEGORY_GROUP = {
  QUANTITY: [
    ProductCategoryCodeEnum.LIVE_BIRD,
    ProductCategoryCodeEnum.CARCASS,
    ProductCategoryCodeEnum.BRANKAS,
    ProductCategoryCodeEnum.AYAM_UTUH,
  ],
  WEIGHT: [
    ProductCategoryCodeEnum.HEAD,
    ProductCategoryCodeEnum.INNARDS,
    ProductCategoryCodeEnum.FEET,
  ],
};

export const LAYER_ROOM_DEFAULT_VALUE = {
  ROOM_TYPE_ID: {
    INDOOR: '4236f283-2290-41d7-a80f-4df8eed920c9',
    OUTDOOR: '30371111-dbd6-418f-91e1-dc36ec0e5d3d',
  },
  FLOOR_TYPE_ID: '954b76b5-a223-4d34-b07d-08cb633086b9',
  POPULATION: 1,
  COOLING_PAD: false,
  ACTIVE: true,
};

/**
 * USER MANAGEMENT COLLECTION OF CONSTANTS
 */

// TOKEN RELATED CONSTANTS
export const DEFAULT_EXPIRATION_TOKEN = 24 * 60 * 60;

export const DEFAULT_EXPIRATION_REFRESH_TOKEN = 2 * 24 * 60 * 60;

// USER SUPERVISOR CHAIN RELATED CONSTANTS
export const MAX_USER_CHAIN_LIST = 10;

// AUTH ATTEMPT, BRUTE FORCE PREVENTION
export const AUTH_ATTEMPT_LIMIT = 5;
export const AUTH_ATTEMPT_COUNTER_KEY = 'auth-attempt-counter-$';

export const POSTGRES_LISTENER = {
  AUDIT_EVENT: 'audit_event',
};

// CACHE KEY FOR AUTH VERIFY PROCESS
export const CACHE_KEY_AUTH_VERIFY = {
  API: 'verify_api',
  PRIVILEGE: 'verify_privilege',
  ROLE_ACL: 'verify_roleAcl',
  USER: 'verify_user',
};

export enum ROLE_ID {
  SUPER_ADMIN = '73db61f1-50f8-45fa-b0c9-e7c77a6fcb7f',
}
