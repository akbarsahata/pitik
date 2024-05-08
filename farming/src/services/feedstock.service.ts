import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { FarmingCycleFeedStockAdjustmentDAO } from '../dao/farmingCycleFeedStockAdjustment.dao';
import { FarmingCycleFeedStockDDAO } from '../dao/farmingCycleFeedStockD.dao';
import { FarmingCycleFeedStockSummaryDAO } from '../dao/farmingCycleFeedStockSummary.dao';
import { FeedStockAdjustmentTypeEnum } from '../datasources/entity/pgsql/FarmingCycleFeedStockAdjustment.entity';
import { FeedStockOperatorEnum } from '../datasources/entity/pgsql/FarmingCycleFeedStockD.entity';
import {
  CreateFeedStockAdjustmentBody,
  CreateFeedStockAdjustmentParams,
  CreateFeedStockAdjustmentResponseList,
  FeedStockSummaryResponseItem,
  FeedStockSummaryResponseList,
  GetFeedStockSummaryGroupByTypeResponseItem,
  GetFeedStockSummaryParams,
  GetFeedStockSummaryQuery,
} from '../dto/feedstock.dto';
import { FeedStockAdjustmentCreatedQueue } from '../jobs/queues/feed-stock-adjustment-created.queue';
import {
  DATE_TIME_FORMAT_SLASH,
  DEFAULT_TIME_ZONE,
  FEED_SUBCATEGORY_ORDER,
} from '../libs/constants';
import { ERR_FEED_STOCK_ADJUSTMENT_CANNOT_BE_DONE } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';

@Service()
export class FeedStockService {
  @Inject(FarmingCycleFeedStockSummaryDAO)
  stockSummaryDAO!: FarmingCycleFeedStockSummaryDAO;

  @Inject(FarmingCycleFeedStockAdjustmentDAO)
  stockAdjustmentDAO!: FarmingCycleFeedStockAdjustmentDAO;

  @Inject(FarmingCycleFeedStockDDAO)
  fcFeedStockDAO!: FarmingCycleFeedStockDDAO;

  @Inject(FeedStockAdjustmentCreatedQueue)
  adjustmentCreatedQueue: FeedStockAdjustmentCreatedQueue;

  async getSummaries(
    params: GetFeedStockSummaryParams,
    query: GetFeedStockSummaryQuery,
  ): Promise<FeedStockSummaryResponseList> {
    const [summaries] = await this.stockSummaryDAO.getMany({
      where: {
        farmingCycleId: params.farmingCycleId,
        ...(query.subcategoryCode && {
          subcategoryCode: query.subcategoryCode,
        }),
        ...(query.subcategoryName && {
          subcategoryCode: query.subcategoryCode,
        }),
        ...(query.productCode && {
          subcategoryCode: query.subcategoryCode,
        }),
        ...(query.productName && {
          subcategoryCode: query.subcategoryCode,
        }),
      },
      order: {
        productName: 'ASC',
      },
    });

    summaries.sort(
      (a, b) =>
        FEED_SUBCATEGORY_ORDER[a.subcategoryCode] - FEED_SUBCATEGORY_ORDER[b.subcategoryCode],
    );

    const [logs] = await this.fcFeedStockDAO.getMany({
      where: {
        farmingCycleId: params.farmingCycleId,
      },
    });

    const details = summaries.map((item) => ({
      ...item,
      used: 0,
      transfer: 0,
      in: 0,
    }));

    const detailsMappedByProductCode = details.reduce((prev, item) => {
      prev.set(item.productCode, item);
      return prev;
    }, new Map<string, FeedStockSummaryResponseItem>());

    logs.forEach((item) => {
      const productCode = item.productDetail?.split(':')[2] || null;
      if (productCode && detailsMappedByProductCode.get(productCode)) {
        if (item.operator === '-' && item.notes.includes('tr_id')) {
          detailsMappedByProductCode.get(productCode)!.transfer += item.qty;
        } else if (item.operator === '-') {
          detailsMappedByProductCode.get(productCode)!.used += item.qty;
        } else if (item.operator === '+') {
          detailsMappedByProductCode.get(productCode)!.in += item.qty;
        }
      }
    });

    return details.map((s) => ({
      ...s,
      remainingQuantity: s.remainingQuantity - s.bookedQuantity,
    }));
  }

  async getSummariesGroupBySubcategory(
    params: GetFeedStockSummaryParams,
  ): Promise<GetFeedStockSummaryGroupByTypeResponseItem> {
    const summaries = await this.stockSummaryDAO.getManyGroupBySubcategory(params.farmingCycleId);

    return {
      date: format(utcToZonedTime(new Date(), DEFAULT_TIME_ZONE), DATE_TIME_FORMAT_SLASH),
      summaries: summaries.map((s) => ({
        ...s,
        remainingQuantity: s.remainingQuantity - s.bookedQuantity,
      })),
    };
  }

  async createAdjustments(
    params: CreateFeedStockAdjustmentParams,
    body: CreateFeedStockAdjustmentBody,
    user: RequestUser,
  ): Promise<CreateFeedStockAdjustmentResponseList> {
    // TODO: revisit the used of feed adjustment
    this.isAllowedForAdjustmentAction(body);

    const queryRunner = await this.stockAdjustmentDAO.startTransaction();

    try {
      const results = await body.reduce<Promise<CreateFeedStockAdjustmentResponseList>>(
        async (prev, current) => {
          const previousResults = await prev;

          const [summary, [consumptions]] = await Promise.all([
            this.stockSummaryDAO.getOneStrict({
              where: {
                id: current.feedStockSummaryId,
              },
            }),
            this.fcFeedStockDAO.getMany({
              where: {
                notes: `feed_stock_minus - fc_feedstock_summary_id:${current.feedStockSummaryId}`,
              },
            }),
          ]);

          const {
            subcategoryCode,
            subcategoryName,
            productCode,
            productName,
            remainingQuantity,
            bookedQuantity,
            farmingCycleId,
          } = summary;

          let { adjustmentQuantity } = current;

          let operator = FeedStockOperatorEnum.PLUS;

          if (current.type === FeedStockAdjustmentTypeEnum.Pengurangan) {
            if (remainingQuantity - bookedQuantity <= 0) {
              throw ERR_FEED_STOCK_ADJUSTMENT_CANNOT_BE_DONE(
                `untuk feed ${productName}`,
                `karena stok saat ini: ${remainingQuantity - bookedQuantity} karung`,
              );
            }

            adjustmentQuantity *= -1;

            operator = FeedStockOperatorEnum.MINUS;
          }

          const totalConsumption = consumptions.reduce(
            (total, feedStock) => total + Number(feedStock.qty),
            0,
          );

          const validationFlag = false;
          if (current.adjustmentQuantity > totalConsumption && validationFlag) {
            throw ERR_FEED_STOCK_ADJUSTMENT_CANNOT_BE_DONE(
              `untuk feed ${productName}`,
              `karena melebihi total penggunaan (${totalConsumption})`,
            );
          }

          const adjustment = await this.stockAdjustmentDAO.createOneWithTx(
            {
              ...current,
              ...params,
              uom: summary.uom,
            },
            user,
            queryRunner,
          );

          await this.stockSummaryDAO.incrementRemainingQuantityWithTx(
            {
              id: current.feedStockSummaryId,
            },
            adjustmentQuantity,
            user,
            queryRunner,
          );

          await this.fcFeedStockDAO.createOneWithTx(
            {
              farmingCycleId,
              operator,
              userId: user.id,
              qty: current.adjustmentQuantity,
              notes: `feed-stock-adjustment:${summary.farmingCycleId}`,
              productDetail: `${subcategoryCode}:${subcategoryName}:${productCode}:${productName}`,
              uom: summary.uom,
            },
            user,
            queryRunner,
          );

          return [...previousResults, adjustment];
        },
        Promise.resolve([] as CreateFeedStockAdjustmentResponseList),
      );

      await this.stockAdjustmentDAO.commitTransaction(queryRunner);

      await this.adjustmentCreatedQueue.addJob(results);

      return results;
    } catch (error) {
      await this.stockAdjustmentDAO.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private isAllowedForAdjustmentAction(body: CreateFeedStockAdjustmentBody): void {
    let isAllowed: boolean = true;

    body.forEach((elm) => {
      if (elm.remarks === undefined) {
        isAllowed = false;
      }
    });

    if (!isAllowed) {
      throw ERR_FEED_STOCK_ADJUSTMENT_CANNOT_BE_DONE(
        '- Mohon maaf saat ini penyesuaian pakan hanya dapat dilakukan saat closing',
      );
    }
  }
}
