/* eslint-disable camelcase */
export interface Log {
  log_level: 'info' | 'error' | 'warn' | 'debug';
  ctx:
    | 'request-log'
    | 'response-log'
    | 'query-log'
    | 'query-error-log'
    | 'query-slow-log'
    | 'error-log'
    | 'inline-log'
    | 'mqtt-message-log';
  request_id: string;
}

export interface ErrorLog extends Error {
  log_level: 'info' | 'error' | 'warn' | 'debug';
  ctx:
    | 'request-log'
    | 'response-log'
    | 'query-log'
    | 'query-error-log'
    | 'query-slow-log'
    | 'error-log'
    | 'inline-log';
  request_id: string;
}

export interface RequestLog extends Log {
  hostname: string;
  method: string;
  url: string;
  user_id: string;
  user_token: string;
  headers?: any;
  params?: any;
  querystring?: any;
  body?: any;
}

export interface ResponseLog extends Log {
  hostname: string;
  method: string;
  url: string;
  user_id: string;
  user_token: string;
  status_code: number;
  response_time: number | string;
  response: any;
}

export interface MqttMessageLog extends Log {
  hostname: string;
  method: string;
  topic: string;
  device_id: string;
  device_type: string;
  meta?: any;
  payload?: any;
}

export interface ResponseErrorLog extends Log {
  error: any;
}

export interface QueryLog extends Log {
  query: string;
  params: any[] | undefined;
}

export interface QueryErrorLog extends QueryLog {
  error: any;
}

export interface QuerySlowLog extends QueryLog {
  time: number;
}

export interface DebugLog extends Log {
  message: string;
}
