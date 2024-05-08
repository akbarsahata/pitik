import { Inject, Service } from 'fastify-decorators';
import { SlackDAO } from '../../dao/external/slack.dao';
import { StockDisposalDAO } from '../../dao/sales/stockDisposal.dao';
import { USER_TYPE } from '../../libs/constants';
import { QUEUE_SALES_STOCK_DISPOSAL_CREATED } from '../../libs/constants/queue';
import { targetPage } from '../../libs/constants/targetPage';
import { SalesStockDisposalCreatedJobData } from '../../libs/interfaces/job-data';
import { Logger } from '../../libs/utils/logger';
import { UserService as UserCoreService } from '../../services/usermanagement/userCore.service';
import { PushNotificationQueue } from '../queues/push-notification.queue';
import { BaseWorker } from './base.worker';

@Service()
export class SalesStockDisposalCreatedWorker extends BaseWorker<SalesStockDisposalCreatedJobData> {
  @Inject(StockDisposalDAO)
  private stockDisposalDAO: StockDisposalDAO;

  @Inject(UserCoreService)
  private userCoreService: UserCoreService;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(PushNotificationQueue)
  private pushNotificationQueue: PushNotificationQueue;

  @Inject(Logger)
  private logger!: Logger;

  protected workerName = QUEUE_SALES_STOCK_DISPOSAL_CREATED;

  protected async handle(
    data: SalesStockDisposalCreatedJobData,
    attemptsMade: number,
    opts: any,
    jobId?: string,
  ) {
    try {
      const { stockDisposalId } = data;

      const stockDisposal = await this.stockDisposalDAO.getOneStrict({
        where: {
          id: stockDisposalId,
        },
        relations: {
          salesOperationUnit: {
            salesUsersInOperationUnit: true,
          },
          userCreator: true,
        },
      });

      const salesUserIds = stockDisposal.salesOperationUnit.salesUsersInOperationUnit.map(
        (user) => user.userId,
      );

      const [salesUsersDetails] = await this.userCoreService.search({ cmsIds: salesUserIds });

      const operationalLeads = salesUsersDetails.filter((user) =>
        user.roles?.some((role) => role.name === USER_TYPE.OPERATIONAL_LEAD),
      );

      const userReceivers = operationalLeads.reduce((ids, user) => {
        if (user.cmsId) return [...ids, user.cmsId];
        return ids;
      }, [] as string[]);

      await this.pushNotificationQueue.sendNotificationToApp('internal', {
        appTarget: 'internal',
        userReceivers,
        content: {
          type: 'stock-disposal',
          headline: `Ada stok disposal baru di ${stockDisposal.salesOperationUnit.operationUnitName}`,
          subHeadline: `${`${
            stockDisposal.userCreator?.fullName || 'Shop keeper'
          } telah membuat stok disposal baru,`} silahkan cek stok disposal yang telah dibuat`,
          body: `Ada stok disposal baru di ${stockDisposal.salesOperationUnit.operationUnitName}`,
          target: targetPage.android.internal.detailDisposal,
          additionalParameters: {
            disposal: {
              id: stockDisposal.id,
            },
          },
        },
        notification: {
          subjectId: 'stock-disposal-created',
          notificationType: 'stock-disposal',
          headline: `Ada stok disposal baru di ${stockDisposal.salesOperationUnit.operationUnitName}`,
          subHeadline: `${`${
            stockDisposal.userCreator?.fullName || 'Shop keeper'
          } telah membuat stok disposal baru,`} silahkan cek stok disposal yang telah dibuat`,
          referenceId: `stock-disposal-id: ${stockDisposal.id}`,
          target: targetPage.android.internal.detailDisposal,
          additionalParameters: {
            disposal: {
              id: stockDisposal.id,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(error);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, data, jobId);
      }

      throw error;
    }
  }
}
