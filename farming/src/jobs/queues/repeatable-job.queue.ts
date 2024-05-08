import { Queue, RepeatOptions } from 'bullmq';
import { Destructor, Initializer, Inject, Service } from 'fastify-decorators';
import env from '../../config/env';
import { RedisConnection } from '../../datasources/connection/redis.connection';
import {
  JOB_GENERATE_ALERT_JOB,
  JOB_GENERATE_TASK_TICKET_JOB,
  JOB_SET_FARMINGCYCLE_INPROGRESS,
  JOB_SET_HARVEST_REALIZATION_FINAL,
  JOB_TRIGGER_DAILY_MONITORING_DEADLINE,
  JOB_TRIGGER_DAILY_MONITORING_INITIALIZATION,
  JOB_TRIGGER_DAILY_REPORT_REMINDER,
  JOB_TRIGGER_IOT_DEVICE_ALERT,
  JOB_TRIGGER_IOT_DEVICE_OFFLINE,
  QUEUE_REPEATABLE_JOB,
} from '../../libs/constants/queue';

@Service()
export class RepeatableJobQueue {
  @Inject(RedisConnection)
  private redis!: RedisConnection;

  private queue!: Queue;

  @Initializer([RedisConnection])
  async init() {
    this.queue = new Queue(QUEUE_REPEATABLE_JOB, { connection: this.redis.connection });

    /**
     * remove old jobs to prevent duplication
     * and reset repeat if triggered before schedule
     */
    await this.queue.drain(true);
    await this.queue.clean(0, 9999, 'failed');

    // add all repeatable jobs here
    this.addRepeatableJob(JOB_TRIGGER_DAILY_MONITORING_DEADLINE, {
      pattern: '0 01 17 * * *',
    });

    this.addRepeatableJob(JOB_TRIGGER_DAILY_MONITORING_INITIALIZATION, {
      pattern: '0 5,20,40 10 * * *',
    });

    this.addRepeatableJob(JOB_GENERATE_TASK_TICKET_JOB, {
      pattern: '0 0 * * * *', // every hour
    });

    // deactivated https://pitik.atlassian.net/wiki/spaces/PROD/pages/237371400/PPL+App+Improvement+-+after+Revamp+Odoo
    // this.addRepeatableJob(JOB_GENERATE_LATE_TASK_REMINDER_JOB, {
    //   pattern: '0 0 4,9,13 * * *', // every 11am, 4pm, 8pm WIB
    // });

    this.addRepeatableJob(JOB_GENERATE_ALERT_JOB, {
      pattern: '0 0 4,14 * * *', // every 11am, 9pm WIB
    });

    this.addRepeatableJob(JOB_SET_FARMINGCYCLE_INPROGRESS, {
      pattern: '0 0 * * * *', // every hour
    });

    // TODO: remove once statsd is ready to be integrated
    if (env.STATSD_IS_ACTIVE) {
      this.addRepeatableJob(JOB_TRIGGER_IOT_DEVICE_ALERT, {
        pattern: '0 */5 * * * *', // every minute
      });
    }

    this.addRepeatableJob(JOB_TRIGGER_IOT_DEVICE_OFFLINE, {
      pattern: '0 0 * * * *', // every hour
    });

    this.addRepeatableJob(JOB_TRIGGER_IOT_DEVICE_ALERT, {
      pattern: '0 */5 * * * *', // every minute
    });

    this.addRepeatableJob(JOB_SET_HARVEST_REALIZATION_FINAL, {
      pattern: env.HARVEST_REALIZATION_CRON_EXPRESSION,
    });

    this.addRepeatableJob(JOB_TRIGGER_DAILY_REPORT_REMINDER, {
      pattern: '0 5 17 * * *', // every 00:05 WIB
    });

    /**
     * check whether NODE_ENV === 'development' and PAUSE_REPEATABLE_JOB === true
     * to prevent repeatable jobs to be executed on local machines accidentally
     */
    if (env.isDev && env.PAUSE_REPEATABLE_JOB) {
      await this.queue.pause();
    }
  }

  async addRepeatableJob(name: string, repeat: RepeatOptions) {
    this.queue.add(
      name,
      {},
      {
        repeat,
        jobId: name,
      },
    );
  }

  async removeRepeatableJob(name: string, repeat: RepeatOptions) {
    await this.queue.removeRepeatable(name, repeat);
  }

  async clean(duration = 60 * 60 * 1000, limit = 999999) {
    await this.queue.clean(duration, limit, 'completed');
  }

  @Destructor()
  async destroy() {
    await this.queue.close();
  }
}
