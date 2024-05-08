import createError from '@fastify/error';

const AUTH_FORBIDDEN = 'AUTH_FORBIDDEN';

const AUTH_UNAUTHORIZED = 'AUTH_UNAUTHORIZED';

const BAD_REQUEST = 'BAD_REQUEST';

const ENTITY_NOT_FOUND = 'ENTITY_NOT_FOUND';

const INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR';

export const ERR_FARM_CYCLE_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Farming Cycle is not found',
  404,
);

export const ERR_COOP_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'Coop is not found', 404);

export const ERR_FARM_CYCLE_TASK_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Farming Cycle Task not found',
  404,
);

export const ERR_TARGET_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'Target is not found', 404);

export const ERR_VAR_LINKED_DATA_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Variable Linked Data is not found',
  404,
);

export const ERR_TARGET_DAYS_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Target days not found',
  404,
);

export const ERR_TASK_TICKET_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Task ticket not found',
  404,
);

export const ERR_TASK_TICKET_DETAIL_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Task ticket detail not found',
  404,
);

export const ERR_USER_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'User not found', 404);

export const ERR_VARIABLE_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'Variable is not found', 404);

export const ERR_FARM_CYCLE_ALERT_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Farming Cycle Alert is not found',
  404,
);

export const ERR_FARM_CYCLE_ALERT_INST_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Farming Cycle Alert Instruction is not found',
  404,
);

export const ERR_FARM_CYCLE_ALERT_FORM_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Farming Cycle Alert Form is not found',
  404,
);

export const ERR_ALERT_TRIGGERED_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Alert Triggered is not found',
  404,
);

export const ERR_AUTH_FORBIDDEN = createError(AUTH_FORBIDDEN, 'request forbidden', 403);

export const ERR_AUTH_UNAUTHORIZED = createError(AUTH_UNAUTHORIZED, 'request unauthorized', 401);

export const ERR_BAD_REQUEST = createError(BAD_REQUEST, 'bad request', 400);

export const ERR_TASK_ALREADY_DONE = createError(BAD_REQUEST, 'Tugas sudah dikerjakan', 400);

export const ERR_ALERT_ALREADY_DISMISSED = createError(
  BAD_REQUEST,
  'Peringatan sudah ditutup',
  400,
);

export const ERR_METHOD_NOT_IMPLEMENTED = createError(
  INTERNAL_SERVER_ERROR,
  'Method is not implemented yet',
  500,
);

export const ERR_PAYMENT_EXIST = createError(BAD_REQUEST, 'Payment already exists', 400);

export const ERR_UNEXPECTED_ACCOUNT_NUMBER = createError(
  BAD_REQUEST,
  'Unexpected account number.',
  400,
);

export const ERR_VIRTUAL_ACCOUNT_EXIST = createError(
  BAD_REQUEST,
  'Virtual account already exists.',
  400,
);

export const ERR_CREATE_VIRTUAL_ACCOUNT_FAILED = createError(
  BAD_REQUEST,
  'Failed to create virtual account.',
  400,
);

export const ERR_VIRTUAL_ACCOUNT_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Virtual account is not found',
  404,
);

export const ERR_VIRTUAL_ACCOUNT_PAYMENT_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Virtual account payment is not found',
  404,
);
