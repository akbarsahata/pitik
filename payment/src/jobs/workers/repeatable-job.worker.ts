import { Job, Worker } from 'bullmq';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { SlackDAO } from '../../dao/slack/slack.dao';
import { PostgreSQLConnection } from '../../datasources/connection/postgresql.connection';
import { RedisConnection } from '../../datasources/connection/redis.connection';
import { JOB_CHECK_UNDELIVERED_PAYMENT, QUEUE_REPEATABLE_JOB } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { PaymentService } from '../../services/payment.service';

@Service()
export class RepeatableJobWorker {
  @Inject(PostgreSQLConnection)
  private pSql!: PostgreSQLConnection;

  @Inject(PaymentService)
  private paymentService!: PaymentService;

  @Inject(RedisConnection)
  protected redis!: RedisConnection;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  protected worker!: Worker;

  protected workerName = '';

  @Inject(Logger)
  private logger!: Logger;

  @Initializer([RedisConnection, PostgreSQLConnection])
  init() {
    this.worker = new Worker(
      QUEUE_REPEATABLE_JOB,
      async (job: Job) => {
        /**
         * delay job execution near initialization time
         * because it will causing some 'metadata not found' error
         */
        while (!this.pSql.connection.isInitialized) {
          (() => null)();
        }

        switch (job.name) {
          case JOB_CHECK_UNDELIVERED_PAYMENT:
            await this.triggerUndeliveredPaymentAlert(job);
            break;
          default:
            break;
        }
      },
      { connection: this.redis.connection, concurrency: 11 },
    );

    return this.worker;
  }

  private async triggerUndeliveredPaymentAlert(job: Job) {
    try {
      await this.paymentService.alertUndeliveredPayments();
    } catch (error) {
      await this.slackDAO.alertFailedJobs(
        this.workerName,
        error,
        {
          jobName: JOB_CHECK_UNDELIVERED_PAYMENT,
        },
        job.id,
      );

      this.logger.error(error);

      throw error;
    }
  }
}
