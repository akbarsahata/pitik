import { captureException } from '@sentry/node';
import crypto from 'crypto';
import { Inject, Service } from 'fastify-decorators';
import { Notification } from 'pg';
import { esEnv } from '../../config/datasource';
import { ElasticSearchConnection } from '../../datasources/connection/elasticsearch.connection';
import { POSTGRES_LISTENER } from '../../libs/constants';
import { QUEUE_AUDIT_TRAIL } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { BaseWorker } from './base.worker';

@Service()
export class AuditTrailWorker extends BaseWorker<Notification> {
  @Inject(ElasticSearchConnection)
  private es: ElasticSearchConnection;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_AUDIT_TRAIL;

  protected async handle(data: Notification) {
    try {
      // eliminate empty payload
      if (!data.payload) return;

      // eliminate duplicate data
      const hash = crypto.createHash('sha256').update(data.payload).digest('hex');
      const redisKey = `${POSTGRES_LISTENER.AUDIT_EVENT}-${hash}`;
      const incr = await this.redis.connection.incr(redisKey);
      if (incr > 1) {
        return;
      }
      await this.redis.connection.setex(redisKey, 15, incr);

      const obj = JSON.parse(data.payload);

      const newData = obj[`new_${obj.table_name}`] || {};

      const oldData = obj[`old_${obj.table_name}`] || {};

      const body = {
        db_user: obj.db_user,
        operation: obj.operation,
        table_name: obj.table_name,
        timestamp: obj.timestamp,
        new_data: Object.keys(newData).map((key) => ({
          key,
          value: `${
            typeof newData[key] === 'object' ? JSON.stringify(newData[key]) : newData[key]
          }`,
        })),
        old_data: Object.keys(oldData).map((key) => ({
          key,
          value: `${
            typeof oldData[key] === 'object' ? JSON.stringify(oldData[key]) : oldData[key]
          }`,
        })),
      };

      await this.es.client.index({
        index: esEnv.ES_IDX_AUDIT,
        body,
      });
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }
}
