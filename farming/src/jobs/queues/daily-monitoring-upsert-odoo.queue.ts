import { Service } from 'fastify-decorators';
import { ErpDailyMonitoringUpsertPayload } from '../../datasources/entity/erp/ERPProduct';
import { QUEUE_DAILY_MONITORING_UPSERT_ODOO } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

export interface DailyMonitoringOdooInterface {
  body: Partial<ErpDailyMonitoringUpsertPayload>;
  taskTicketId: string;
  feedConsumption?: any;
}

@Service()
export class DailyMonitoringUpsertOdooQueue extends BaseQueue<DailyMonitoringOdooInterface> {
  protected queueName = QUEUE_DAILY_MONITORING_UPSERT_ODOO;
}
