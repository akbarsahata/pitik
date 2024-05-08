import { JobsOptions } from 'bullmq';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { In } from 'typeorm';
import { ErpDAO } from '../../dao/erp.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { FarmingCycleFeedStockAdjustmentDAO } from '../../dao/farmingCycleFeedStockAdjustment.dao';
import {
  CreateAdjustmentDetailItem,
  CreateAdjustmentPayload,
} from '../../datasources/entity/erp/ERPProduct';
import { CreateFeedStockAdjustmentResponseList } from '../../dto/feedstock.dto';
import { DATE_SQL_FORMAT, DEFAULT_TIME_ZONE } from '../../libs/constants';
import { QUEUE_FEED_STOCK_ADJUSTMENT_CREATED } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { BaseWorker } from './base.worker';

@Service()
// eslint-disable-next-line max-len
export class FeedStockCreatedAdjustmentWorker extends BaseWorker<CreateFeedStockAdjustmentResponseList> {
  @Inject(Logger)
  private logger: Logger;

  @Inject(FarmingCycleFeedStockAdjustmentDAO)
  private feedStockAdjustmentDAO: FarmingCycleFeedStockAdjustmentDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(ErpDAO)
  private erpDAO: ErpDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  protected workerName = QUEUE_FEED_STOCK_ADJUSTMENT_CREATED;

  protected async handle(
    data: CreateFeedStockAdjustmentResponseList,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ) {
    try {
      const [[adjustments], farmingCycle] = await Promise.all([
        this.feedStockAdjustmentDAO.getMany({
          where: {
            id: In(data.map((d) => d.id)),
          },
          relations: {
            feedStockSummary: true,
          },
        }),
        this.farmingCycleDAO.getOneStrict({
          where: {
            id: data[0].farmingCycleId,
          },
        }),
      ]);

      const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

      const payload: CreateAdjustmentPayload = {
        farmingCycleCode: farmingCycle.farmingCycleCode,
        dateAdjustment: format(now, DATE_SQL_FORMAT),
        detailAdjustmment: adjustments.map<CreateAdjustmentDetailItem>((adj) => ({
          subcategoryCode: adj.feedStockSummary.subcategoryCode,
          productCode: adj.feedStockSummary.productCode,
          quantity: adj.adjustmentQuantity * -1, // + in FMS means - in odoo, vice versa
        })),
      };

      await this.erpDAO.createAdjusments(payload);
    } catch (error) {
      this.logger.error(error);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, data, jobId);
      }

      throw error;
    }
  }
}
