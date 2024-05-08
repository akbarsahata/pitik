import { JobsOptions } from 'bullmq';
import { differenceInDays, format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { In } from 'typeorm';
import { ErpDAO } from '../../dao/erp.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { FarmingCycleFeedStockDDAO } from '../../dao/farmingCycleFeedStockD.dao';
import { FarmingCycleFeedStockSummaryDAO } from '../../dao/farmingCycleFeedStockSummary.dao';
import { FarmingCycleOvkStockLogDAO } from '../../dao/farmingCycleOvkStockLog.dao';
import { TaskTicketDAO } from '../../dao/taskTicket.dao';
import {
  DetailConsumption,
  ErpDailyMonitoringUpsertPayload,
} from '../../datasources/entity/erp/ERPProduct';
import { FarmingCycleFeedStockSummary } from '../../datasources/entity/pgsql/FarmingCycleFeedStockSummary.entity';
import {
  CONTRACT_TYPE,
  DATE_SQL_FORMAT,
  DEFAULT_TIME_ZONE,
  TICKET_STATUS,
} from '../../libs/constants';
import { QUEUE_DAILY_MONITORING_UPSERT_ODOO } from '../../libs/constants/queue';
import { getFeedSubCategoryAndProductCode } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { DailyMonitoringOdooInterface } from '../queues/daily-monitoring-upsert-odoo.queue';
import { BaseWorker } from './base.worker';

@Service()
export class DailyMonitoringUpsertOdooWorker extends BaseWorker<DailyMonitoringOdooInterface> {
  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(FarmingCycleFeedStockDDAO)
  private farmingCycleFeedStockDDAO: FarmingCycleFeedStockDDAO;

  @Inject(FarmingCycleOvkStockLogDAO)
  private farmingCycleOvkStockLogDAO: FarmingCycleOvkStockLogDAO;

  @Inject(FarmingCycleFeedStockSummaryDAO)
  private farmingCycleFeedStockSummaryDAO: FarmingCycleFeedStockSummaryDAO;

  @Inject(TaskTicketDAO)
  private taskTicketDAO: TaskTicketDAO;

  @Inject(ErpDAO)
  private erpDAO: ErpDAO;

  @Inject(SlackDAO)
  private slackDAO: SlackDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_DAILY_MONITORING_UPSERT_ODOO;

  protected async handle(
    data: DailyMonitoringOdooInterface,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ) {
    try {
      const [[feedStockData], [ovkStockData], taskTicketData] = await Promise.all([
        this.farmingCycleFeedStockDDAO.getMany({
          where: {
            taskTicketId: data.taskTicketId,
          },
        }),
        this.farmingCycleOvkStockLogDAO.getMany({
          where: {
            taskTicketId: data.taskTicketId,
          },
        }),
        this.taskTicketDAO.getOne({
          where: {
            id: data.taskTicketId,
          },
        }),
      ]);

      const farmingCycleData = await this.farmingCycleDAO.getOneStrict({
        where: {
          id: taskTicketData?.farmingCycleId,
        },
        relations: {
          coop: true,
          contract: {
            contractType: true,
          },
        },
      });

      const detailConsumptions: DetailConsumption[] = [];
      if (data.feedConsumption?.length > 0) {
        const [feedStockSummaries] = await this.farmingCycleFeedStockSummaryDAO.getMany({
          where: {
            id: In(data.feedConsumption.map((item: any) => item.feedStockSummaryId)),
          },
        });

        const feedStockSummaryMap = feedStockSummaries.reduce((prev, item) => {
          prev.set(item.id, item);
          return prev;
        }, new Map<string, FarmingCycleFeedStockSummary>());

        data.feedConsumption.forEach(async (item: any) => {
          const feedStockSummary = feedStockSummaryMap.get(item.feedStockSummaryId);

          if (feedStockSummary) {
            detailConsumptions.push({
              subcategoryCode: feedStockSummary.subcategoryCode,
              productCode: feedStockSummary.productCode,
              quantity: item.quantity,
            });
          }
        });
      } else {
        feedStockData.forEach((elm) => {
          const { subcategoryCode, productCode } = getFeedSubCategoryAndProductCode(
            elm.productDetail || '',
          );

          detailConsumptions.push({
            subcategoryCode,
            productCode,
            quantity: elm.qty,
          });
        });
      }

      const isOwnFarm =
        farmingCycleData.contract?.contractType.contractName === CONTRACT_TYPE.OWN_FARM;
      if (isOwnFarm && ovkStockData?.length > 0) {
        detailConsumptions.push(
          ...ovkStockData.map((item) => ({
            subcategoryCode: item.subcategoryCode,
            productCode: item.productCode,
            quantity: item.quantity,
          })),
        );
      }

      const reportedDate = taskTicketData?.reportedDate || new Date();

      const dailyMonitoringErpPayload: ErpDailyMonitoringUpsertPayload = {
        isAdjustment: data.body.isAdjustment || false,
        farmingCycleCode: farmingCycleData.farmingCycleCode as string,
        coopCode: farmingCycleData.coop.coopCode as string,
        date: format(reportedDate, DATE_SQL_FORMAT),
        bw: data.body.bw || 0,
        mortality: data.body.mortality || 0,
        culling: data.body.culling || 0,
        detailConsumption: detailConsumptions,
      };

      // Handle Re-Sync DailyMonitoring to Odoo with particular conditions:
      // 1. Allow to record witin 3 days
      // 2. Allow to record which hasn't been submitted before (ticket still pending - status = 2)
      if (
        differenceInDays(utcToZonedTime(new Date(), DEFAULT_TIME_ZONE), new Date(reportedDate)) <
          3 ||
        (taskTicketData && taskTicketData.ticketStatus === TICKET_STATUS.PENDING)
      ) {
        await this.erpDAO.upsertDailyMonitoring(dailyMonitoringErpPayload);
      }
    } catch (error) {
      this.logger.error(error);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, data, jobId);
      }

      throw error;
    }
  }
}
