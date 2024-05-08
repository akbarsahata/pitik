/* eslint-disable no-console */
require('dotenv').config();

const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const { Queue: QueueMQ } = require('bullmq');
const express = require('express');

const {
  REDIS_HOST,
  REDIS_PORT,
} = process.env;

const PORT = process.env.PORT || 5000;

const redisOptions = {
  port: REDIS_PORT,
  host: REDIS_HOST,
  password: '',
  tls: false,
};

const queues = [
  'TRIGGER_DAILY_MONITORING_DEADLINE',
  'CLEAN_COMPLETED_JOBS',
  'GENERATE_TASK_TICKET_JOB',
  'GENERATE_LATE_TASK_REMINDER_JOB',
  'GENERATE_ALERT_JOB',
  'SET_FARMINGCYCLE_INPROGRESS',
  'SET_HARVEST_REALIZATION_FINAL',
  'TRIGGER_IOT_DEVICE_ALERT',
  'TRIGGER_IOT_DEVICE_OFFLINE',
  'push-notification',
  'REPEATABLE_JOB',
  'USER_OWNER_UPSERT',
  'FARM_UPSERT',
  'COOP_UPSERT',
  'FARMING_CYCLE_CREATED',
  'FARMING_CYCLE_CLOSED',
  'FARMING_CYCLE_CREATED_FMS',
  'FARMING_CYCLE_UPDATED',
  'PURCHASE_REQUEST_CREATED',
  'PURCHASE_REQUEST_APPROVED',
  'CALCULATE_DAILY_MONITORING',
  'INITIALIZE_DAILY_MONITORING',
  'FINALIZE_DAILY_MONITORING',
  'CHICKIN_REQUEST_CREATED',
  'CHICKIN_REQUEST_UPDATED',
  'CHICKIN_REQUEST_APPROVED',
  'TRANSFER_REQUEST_CREATED',
  'TRANSFER_REQUEST_APPROVED',
  'TRANSFER_REQUEST_REJECTED_CANCELLED',
  'GOODS_RECEIPT_CREATED',
  'PURCHASE_ORDER_APPROVED',
  'PURCHASE_ORDER_REJECTED',
  'REINDEX_ERP_PRODUCTS',
  'FARMING_CYCLE_DOC_IN',
  'REPOPULATION_CREATED',
  'SELF_REGISTRATION',
  'NOTIFICATION_SERVICE',
  'HARVEST_REQUEST_APPROVED',
  'HARVEST_REQUEST_CANCELLED',
  'HARVEST_REQUEST_EDITED',
  'HARVEST_REQUEST_REJECTED',
  'HARVEST_REQUEST_SUBMITTED',
  'HARVEST_REALIZATION_SUBMITTED',
  'HARVEST_REALIZATION_CREATE_ODOO',
  'HARVEST_DEAL_CREATED',
  'USER_ASSIGNED_TO_FC',
  'ISSUE_CREATED',
  'TASK_TICKET_ALERT_CREATED',
  'TASK_TICKET_DETAIL_UPDATED',
  'GENERATE_DOCUMENT',
  'GENERATE_TASK_TICKET',
  'GENERATE_LATE_TASK_REMINDER',
  'CONTRACT_CREATED',
  'CONTRACT_UPDATED',
  'GENERATE_ALERT',
  'SET_IOT_DEVICE_STATUS',
  'GENERATE_IOT_DEVICE_ALERT',
  'CREATE_IOT_SMART_CONVENTRON',
  'FEED_STOCK_ADJUSTMENT_CREATED',
  'OVK_STOCK_ADJUSTMENT_CREATED',
  'DAILY_MONITORING_UPSERT_ODOO',
  'IOT_TICKETING_STAGE_UPSERT',
  'SALES_STOCK_OPNAME_CREATED',
  'SALES_STOCK_DISPOSAL_CREATED',
];

const createQueueMQ = (name) => new QueueMQ(name, { connection: redisOptions });

const run = async () => {
  const bullMQs = queues.map((q) => createQueueMQ(q));

  // Sort Queue Name shown in queue.monitor UI Sidebar ASC
  bullMQs.sort((a, b) => a.name.localeCompare(b.name));

  const app = express();

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/ui');

  createBullBoard({
    queues: bullMQs.map((mq) => new BullMQAdapter(mq)),
    serverAdapter,
  });

  app.use('/health', (req, res) => {
    res.status(200).json({
      pid: process.pid,
      uptime: process.uptime(),
      cpuUsage: process.cpuUsage(),
      memoryUsage: process.memoryUsage(),
    });
  });

  app.use('/ui', serverAdapter.getRouter());

  app.use('/', (req, res) => res.send(
    `<head>
      <meta http-equiv="refresh" content="5; URL="http://${req.headers.host}/ui" />
    </head>
    <body>
      <p>If you are not redirected in five seconds, <a href="http://${req.headers.host}/ui">click here</a>.</p>
    </body>`,
  ));

  app.listen(PORT, () => {
    console.log(`Running on ${PORT}...`);
    console.log(`For the UI, open http://localhost:${PORT}/ui`);
  });
};

// eslint-disable-next-line no-console
run().catch((e) => console.error(e));
