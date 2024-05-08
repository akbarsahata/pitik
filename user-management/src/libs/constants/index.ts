/* eslint-disable no-unused-vars */
/**
 * COLLECTION OF CONSTANTS
 */

// DATETIME RELATED CONSTANTS
export const DEFAULT_TIME_ZONE = 'Asia/Bangkok';
export const DATE_TIME_FORMAT = 'dd-MM-yyyy';
export const DATE_SQL_FORMAT = 'yyyy-MM-dd';
export const DATETIME_SQL_FORMAT = 'yyyy-MM-dd HH:mm:ss';
export const DATETIME_00_SQL_FORMAT = 'yyyy-MM-dd 00:00:00';
export const DATETIME_17_SQL_FORMAT = 'yyyy-MM-dd 17:00:00';
export const DATETIME_59_SQL_FORMAT = 'yyyy-MM-dd 23:59:59';
export const TIME_HH_MM_SS = 'HH:mm:ss';

// ROLE NAME RELATED CONSTANTS
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
};

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

// ROLE RANK CONTEXT
export enum ROLE_RANK_CONTEXT {
  internal = 'internal',
  external = 'external',
  ownerApp = 'ownerApp',
  downstream = 'downstream',
}

export enum ROLE_ID {
  SUPER_ADMIN = '73db61f1-50f8-45fa-b0c9-e7c77a6fcb7f',
}
