import { Inject, Service } from 'fastify-decorators';
import { CalculateDailyMonitoringWorker } from '../../jobs/workers/calculate-daily-monitoring.worker';
import { ChickInRequestApprovedWorker } from '../../jobs/workers/chick-in-request-approved.worker';
import { ChickInRequestCreatedWorker } from '../../jobs/workers/chick-in-request-created.worker';
import { ChickInRequestUpdatedWorker } from '../../jobs/workers/chick-in-request-updated.worker';
import { ContractCreatedWorker } from '../../jobs/workers/contract-created.worker';
import { CoopUpsertWorker } from '../../jobs/workers/coop-upsert.worker';
import { DailyMonitoringUpsertOdooWorker } from '../../jobs/workers/daily-monitoring-upsert-odoo.worker';
import { FarmUpsertWorker } from '../../jobs/workers/farm-upsert.worker';
import { FarmingCycleClosedWorker } from '../../jobs/workers/farming-cycle-closed.worker';
import { FarmingCycleCreatedFmsWorker } from '../../jobs/workers/farming-cycle-created-fms.worker';
import { FarmingCycleCreatedWorker } from '../../jobs/workers/farming-cycle-created.worker';
import { FarmingCycleDOCinWorker } from '../../jobs/workers/farming-cycle-doc-in.worker';
import { FarmingCycleUpdatedWorker } from '../../jobs/workers/farming-cycle-updated.worker';
import { FeedStockCreatedAdjustmentWorker } from '../../jobs/workers/feed-stock-adjustment-created.worker';
import { FinalizeDailyMonitoringWorker } from '../../jobs/workers/finalize-daily-monitoring.worker';
import { GenerateAlertWorker } from '../../jobs/workers/generate-alert.worker';
import { GenerateDailyReportReminderWorker } from '../../jobs/workers/generate-daily-report-reminder.work';
import { GenerateDocumentWorker } from '../../jobs/workers/generate-document.worker';
import { GenerateIotDeviceAlertWorker } from '../../jobs/workers/generate-iot-device-alert.worker';
import { GenerateLateTaskReminderWorker } from '../../jobs/workers/generate-late-task-reminder.worker';
import { GenerateTaskTicketWorker } from '../../jobs/workers/generate-task-ticket.worker';
import { GoodsReceiptCreatedWorker } from '../../jobs/workers/goods-receipt-created.worker';
import { HarvestDealCreatedWorker } from '../../jobs/workers/harvest-deal-created.worker';
import { HarvestRealizationCreateOdooWorker } from '../../jobs/workers/harvest-realization-create-odoo.worker';
import { HarvestRealizationSubmittedWorker } from '../../jobs/workers/harvest-realization-submitted.worker';
import { HarvestRequestApprovedWorker } from '../../jobs/workers/harvest-request-approved.worker';
import { HarvestRequestCancelledWorker } from '../../jobs/workers/harvest-request-cancelled.worker';
import { HarvestRequestEditedWorker } from '../../jobs/workers/harvest-request-edited.worker';
import { HarvestRequestRejectedWorker } from '../../jobs/workers/harvest-request-rejected.worker';
import { HarvestRequestSubmittedWorker } from '../../jobs/workers/harvest-request-submitted.worker';
import { InitializeDailyMonitoringWorker } from '../../jobs/workers/initialize-daily-monitoring.worker';
import { IotSmartConventronCreatedWorker } from '../../jobs/workers/iot-smart-conventron-created.worker';
import { IotTicketingStageUpsertWorker } from '../../jobs/workers/iot-ticketing-stage-upsert.worker';
import { IssueCreatedWorker } from '../../jobs/workers/issue-created.worker';
import { NotificationServiceWorker } from '../../jobs/workers/notification-service.worker';
import { OvkStockCreatedAdjustmentWorker } from '../../jobs/workers/ovk-stock-adjustment-created.worker';
import { PurchaseOrderApprovedNotificationWorker } from '../../jobs/workers/purchase-order-approved-notification.worker';
import { PurchaseOrderApprovedWorker } from '../../jobs/workers/purchase-order-approved.worker';
import { PurchaseOrderRejectedWorker } from '../../jobs/workers/purchase-order-rejected.worker';
import { PurchaseRequestApprovedWorker } from '../../jobs/workers/purchase-request-approved.worker';
import { PurchaseRequestCreatedWorker } from '../../jobs/workers/purchase-request-created.worker';
import { PurchaseRequestRejectedWorker } from '../../jobs/workers/purchase-request-rejected.worker';
import { PushNotificationWorker } from '../../jobs/workers/push-notification.worker';
import { ReindexErpProductsWorker } from '../../jobs/workers/reindex-erp-products.worker';
import { RepeatableJobWorker } from '../../jobs/workers/repeatable-job.worker';
import { RepopulationCreatedWorker } from '../../jobs/workers/repopulation-created.worker';
import { SalesStockDisposalCreatedWorker } from '../../jobs/workers/sales-stock-disposal-created.worker';
import { SalesStockOpnameCreatedWorker } from '../../jobs/workers/sales-stock-opname-created.worker';
import { SelfRegistrationWorker } from '../../jobs/workers/self-registration.worker';
import { SetIotDeviceStatusWorker } from '../../jobs/workers/set-iot-device-status.worker';
import { TaskTicketAlertCreatedWorker } from '../../jobs/workers/task-ticket-alert-created.worker';
import { TaskTicketDetailUpdatedWorker } from '../../jobs/workers/task-ticket-detail-updated.worker';
import { TransferRequestApprovedWorker } from '../../jobs/workers/transfer-request-approved.worker';
import { TransferRequestCreatedWorker } from '../../jobs/workers/transfer-request-created.worker';
import { TransferRequestRejectedCancelledWorker } from '../../jobs/workers/transfer-request-rejected-cancelled.worker';
import { UserAssignedToFcWorker } from '../../jobs/workers/user-assigned-to-fc.worker';
import { UserOwnerUpsertWorker } from '../../jobs/workers/user-owner-upsert.worker';

@Service()
export class WorkerUtil {
  @Inject(PushNotificationWorker)
  pushNotificationWorker: PushNotificationWorker;

  @Inject(UserOwnerUpsertWorker)
  userOwnerUpsertWorker: UserOwnerUpsertWorker;

  @Inject(FarmUpsertWorker)
  farmUpsertWorker: FarmUpsertWorker;

  @Inject(CoopUpsertWorker)
  coopUpsertWorker: CoopUpsertWorker;

  @Inject(FarmingCycleClosedWorker)
  fcClosedWorker: FarmingCycleClosedWorker;

  @Inject(FarmingCycleCreatedWorker)
  fcCreatedWorker: FarmingCycleCreatedWorker;

  @Inject(FarmingCycleCreatedFmsWorker)
  fcCreatedNewWorker: FarmingCycleCreatedFmsWorker;

  @Inject(FarmingCycleUpdatedWorker)
  fcUpdatedWorker: FarmingCycleUpdatedWorker;

  @Inject(PurchaseRequestCreatedWorker)
  prCreatedWorker: PurchaseRequestCreatedWorker;

  @Inject(PurchaseRequestApprovedWorker)
  prApprovedWorker: PurchaseRequestApprovedWorker;

  @Inject(PurchaseRequestRejectedWorker)
  prRejectedWorker: PurchaseRequestRejectedWorker;

  @Inject(RepeatableJobWorker)
  repeatableJobWorker: RepeatableJobWorker;

  @Inject(CalculateDailyMonitoringWorker)
  dailyMonitoringCalculateWorker: CalculateDailyMonitoringWorker;

  @Inject(FinalizeDailyMonitoringWorker)
  finalizeDailyMonitoringWorker: FinalizeDailyMonitoringWorker;

  @Inject(ChickInRequestCreatedWorker)
  chickInRequestCreatedWorker: ChickInRequestCreatedWorker;

  @Inject(ChickInRequestApprovedWorker)
  chickInRequestApprovedWorker: ChickInRequestApprovedWorker;

  @Inject(ChickInRequestUpdatedWorker)
  chickInRequestUpdateWorker: ChickInRequestUpdatedWorker;

  @Inject(TransferRequestCreatedWorker)
  transferRequestCreatedWorker: TransferRequestCreatedWorker;

  @Inject(TransferRequestApprovedWorker)
  transferRequestApprovedWorker: TransferRequestApprovedWorker;

  @Inject(TransferRequestRejectedCancelledWorker)
  transferRequestRejectCancelWorker: TransferRequestRejectedCancelledWorker;

  @Inject(GoodsReceiptCreatedWorker)
  goodsReceiptCreatedWorker: GoodsReceiptCreatedWorker;

  @Inject(PurchaseOrderApprovedWorker)
  purchaseOrderApprovedWorker: PurchaseOrderApprovedWorker;

  @Inject(PurchaseOrderApprovedNotificationWorker)
  purchaseOrderApprovedNotificationWorker: PurchaseOrderApprovedNotificationWorker;

  @Inject(PurchaseOrderRejectedWorker)
  purchaseOrderRejectedWorker: PurchaseOrderApprovedWorker;

  @Inject(ReindexErpProductsWorker)
  reindexErpProductsWorker: ReindexErpProductsWorker;

  @Inject(FarmingCycleDOCinWorker)
  farmingCycleDOCinWorker: FarmingCycleDOCinWorker;

  @Inject(RepopulationCreatedWorker)
  repopulationCreatedWorker: RepopulationCreatedWorker;

  @Inject(SelfRegistrationWorker)
  selfRegistrationWorker: SelfRegistrationWorker;

  @Inject(ContractCreatedWorker)
  contractCreatedWorker: ContractCreatedWorker;

  @Inject(InitializeDailyMonitoringWorker)
  initializeDailyMonitoringWorker: InitializeDailyMonitoringWorker;

  @Inject(NotificationServiceWorker)
  notificationServiceWorker: NotificationServiceWorker;

  @Inject(HarvestRequestApprovedWorker)
  harvestRequestApprovedWorker: HarvestRequestApprovedWorker;

  @Inject(HarvestRequestCancelledWorker)
  harvestRequestCancelledWorker: HarvestRequestCancelledWorker;

  @Inject(HarvestRequestEditedWorker)
  harvestRequestEditedWorker: HarvestRequestEditedWorker;

  @Inject(HarvestRequestRejectedWorker)
  harvestRequestRejectedWorker: HarvestRequestRejectedWorker;

  @Inject(HarvestRequestSubmittedWorker)
  harvestRequestSubmittedWorker: HarvestRequestSubmittedWorker;

  @Inject(HarvestRealizationSubmittedWorker)
  harvestRealizationSubmittedWorker: HarvestRealizationSubmittedWorker;

  @Inject(HarvestRealizationCreateOdooWorker)
  harvestRealizationCreateOdooWorker: HarvestRealizationCreateOdooWorker;

  @Inject(HarvestDealCreatedWorker)
  harvestDealCreatedWorker: HarvestDealCreatedWorker;

  @Inject(UserAssignedToFcWorker)
  userAssignedToFcQueue: UserAssignedToFcWorker;

  @Inject(TaskTicketAlertCreatedWorker)
  taskTicketAlertCreatedWorker: TaskTicketAlertCreatedWorker;

  @Inject(TaskTicketDetailUpdatedWorker)
  taskTicketDetailUpdatedWorker: TaskTicketDetailUpdatedWorker;

  @Inject(IssueCreatedWorker)
  issueCreatedWorker: IssueCreatedWorker;

  @Inject(GenerateDocumentWorker)
  generateDocumentWorker: GenerateDocumentWorker;

  @Inject(GenerateTaskTicketWorker)
  generateTaskTicketWorker: GenerateTaskTicketWorker;

  @Inject(GenerateLateTaskReminderWorker)
  generateLateTaskReminderWorker: GenerateLateTaskReminderWorker;

  @Inject(GenerateAlertWorker)
  generateAlertWorker: GenerateAlertWorker;

  @Inject(SetIotDeviceStatusWorker)
  setIotDeviceStatusWorker: SetIotDeviceStatusWorker;

  @Inject(GenerateIotDeviceAlertWorker)
  generateIotDeviceAlertWorker: GenerateIotDeviceAlertWorker;

  @Inject(IotSmartConventronCreatedWorker)
  iotSmartConventronCreatedWorker: IotSmartConventronCreatedWorker;

  @Inject(FeedStockCreatedAdjustmentWorker)
  feedStockCreatedAdjustmentWorker: FeedStockCreatedAdjustmentWorker;

  @Inject(OvkStockCreatedAdjustmentWorker)
  ovkStockCreatedAdjustmentWorker: OvkStockCreatedAdjustmentWorker;

  @Inject(DailyMonitoringUpsertOdooWorker)
  dailyMonitoringUpsertOdooWorker: DailyMonitoringUpsertOdooWorker;

  @Inject(GenerateDailyReportReminderWorker)
  generateDailyReportReminderWorker: GenerateDailyReportReminderWorker;

  @Inject(IotTicketingStageUpsertWorker)
  iotTicketingStageUpsertWorker: IotTicketingStageUpsertWorker;

  @Inject(SalesStockDisposalCreatedWorker)
  salesStockDisposalCreatedWorker: SalesStockDisposalCreatedWorker;

  @Inject(SalesStockOpnameCreatedWorker)
  salesStockOpnameCreatedWorker: SalesStockOpnameCreatedWorker;

  async closeAllWorkers() {
    await Promise.all([
      this.pushNotificationWorker.destroy(),
      this.userOwnerUpsertWorker.destroy(),
      this.farmUpsertWorker.destroy(),
      this.coopUpsertWorker.destroy(),
      this.fcClosedWorker.destroy(),
      this.fcCreatedWorker.destroy(),
      this.fcCreatedNewWorker.destroy(),
      this.fcUpdatedWorker.destroy(),
      this.prCreatedWorker.destroy(),
      this.prApprovedWorker.destroy(),
      this.prRejectedWorker.destroy(),
      this.repeatableJobWorker.destroy(),
      this.dailyMonitoringCalculateWorker.destroy(),
      this.finalizeDailyMonitoringWorker.destroy(),
      this.chickInRequestCreatedWorker.destroy(),
      this.chickInRequestApprovedWorker.destroy(),
      this.chickInRequestUpdateWorker.destroy(),
      this.transferRequestCreatedWorker.destroy(),
      this.transferRequestApprovedWorker.destroy(),
      this.transferRequestRejectCancelWorker.destroy(),
      this.goodsReceiptCreatedWorker.destroy(),
      this.purchaseOrderApprovedWorker.destroy(),
      this.purchaseOrderApprovedNotificationWorker.destroy(),
      this.purchaseOrderRejectedWorker.destroy(),
      this.reindexErpProductsWorker.destroy(),
      this.farmingCycleDOCinWorker.destroy(),
      this.repopulationCreatedWorker.destroy(),
      this.selfRegistrationWorker.destroy(),
      this.contractCreatedWorker.destroy(),
      this.initializeDailyMonitoringWorker.destroy(),
      this.notificationServiceWorker.destroy(),
      this.harvestRequestApprovedWorker.destroy(),
      this.harvestRequestCancelledWorker.destroy(),
      this.harvestRequestEditedWorker.destroy(),
      this.harvestRequestRejectedWorker.destroy(),
      this.harvestRequestSubmittedWorker.destroy(),
      this.harvestRealizationSubmittedWorker.destroy(),
      this.harvestRealizationCreateOdooWorker.destroy(),
      this.harvestDealCreatedWorker.destroy(),
      this.userAssignedToFcQueue.destroy(),
      this.taskTicketAlertCreatedWorker.destroy(),
      this.taskTicketDetailUpdatedWorker.destroy(),
      this.issueCreatedWorker.destroy(),
      this.generateDocumentWorker.destroy(),
      this.generateTaskTicketWorker.destroy(),
      this.generateLateTaskReminderWorker.destroy(),
      this.generateAlertWorker.destroy(),
      this.setIotDeviceStatusWorker.destroy(),
      this.generateIotDeviceAlertWorker.destroy(),
      this.iotSmartConventronCreatedWorker.destroy(),
      this.feedStockCreatedAdjustmentWorker.destroy(),
      this.ovkStockCreatedAdjustmentWorker.destroy(),
      this.dailyMonitoringUpsertOdooWorker.destroy(),
      this.generateDailyReportReminderWorker.destroy(),
      this.iotTicketingStageUpsertWorker.destroy(),
      this.salesStockDisposalCreatedWorker.destroy(),
      this.salesStockOpnameCreatedWorker.destroy(),
    ]);
  }
}
