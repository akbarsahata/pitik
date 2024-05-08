import { Controller, Inject } from 'fastify-decorators';
import { RepeatableJobQueue } from './queues/repeatable-job.queue';
import { CalculateDailyMonitoringWorker } from './workers/calculate-daily-monitoring.worker';
import { ChickInRequestApprovedWorker } from './workers/chick-in-request-approved.worker';
import { ChickInRequestCreatedWorker } from './workers/chick-in-request-created.worker';
import { ChickInRequestUpdatedWorker } from './workers/chick-in-request-updated.worker';
import { ContractCreatedWorker } from './workers/contract-created.worker';
import { CoopUpsertWorker } from './workers/coop-upsert.worker';
import { DailyMonitoringUpsertOdooWorker } from './workers/daily-monitoring-upsert-odoo.worker';
import { FarmUpsertWorker } from './workers/farm-upsert.worker';
import { FarmingCycleClosedWorker } from './workers/farming-cycle-closed.worker';
import { FarmingCycleCreatedFmsWorker } from './workers/farming-cycle-created-fms.worker';
import { FarmingCycleCreatedWorker } from './workers/farming-cycle-created.worker';
import { FarmingCycleDOCinWorker } from './workers/farming-cycle-doc-in.worker';
import { FarmingCycleUpdatedWorker } from './workers/farming-cycle-updated.worker';
import { FeedStockCreatedAdjustmentWorker } from './workers/feed-stock-adjustment-created.worker';
import { FinalizeDailyMonitoringWorker } from './workers/finalize-daily-monitoring.worker';
import { GenerateAlertWorker } from './workers/generate-alert.worker';
import { GenerateDailyReportReminderWorker } from './workers/generate-daily-report-reminder.work';
import { GenerateDocumentWorker } from './workers/generate-document.worker';
import { GenerateIotDeviceAlertWorker } from './workers/generate-iot-device-alert.worker';
import { GenerateLateTaskReminderWorker } from './workers/generate-late-task-reminder.worker';
import { GenerateTaskTicketWorker } from './workers/generate-task-ticket.worker';
import { GoodsReceiptCreatedWorker } from './workers/goods-receipt-created.worker';
import { HarvestDealCreatedWorker } from './workers/harvest-deal-created.worker';
import { HarvestRealizationCreateOdooWorker } from './workers/harvest-realization-create-odoo.worker';
import { HarvestRealizationSubmittedWorker } from './workers/harvest-realization-submitted.worker';
import { HarvestRequestApprovedWorker } from './workers/harvest-request-approved.worker';
import { HarvestRequestCancelledWorker } from './workers/harvest-request-cancelled.worker';
import { HarvestRequestEditedWorker } from './workers/harvest-request-edited.worker';
import { HarvestRequestRejectedWorker } from './workers/harvest-request-rejected.worker';
import { HarvestRequestSubmittedWorker } from './workers/harvest-request-submitted.worker';
import { InitializeDailyMonitoringWorker } from './workers/initialize-daily-monitoring.worker';
import { IotSmartConventronCreatedWorker } from './workers/iot-smart-conventron-created.worker';
import { IotTicketingStageUpsertWorker } from './workers/iot-ticketing-stage-upsert.worker';
import { IssueCreatedWorker } from './workers/issue-created.worker';
import { NotificationServiceWorker } from './workers/notification-service.worker';
import { OvkStockCreatedAdjustmentWorker } from './workers/ovk-stock-adjustment-created.worker';
import { PurchaseOrderApprovedNotificationWorker } from './workers/purchase-order-approved-notification.worker';
import { PurchaseOrderApprovedWorker } from './workers/purchase-order-approved.worker';
import { PurchaseOrderRejectedWorker } from './workers/purchase-order-rejected.worker';
import { PurchaseRequestApprovedWorker } from './workers/purchase-request-approved.worker';
import { PurchaseRequestCreatedWorker } from './workers/purchase-request-created.worker';
import { PurchaseRequestRejectedWorker } from './workers/purchase-request-rejected.worker';
import { PushNotificationWorker } from './workers/push-notification.worker';
import { ReindexErpProductsWorker } from './workers/reindex-erp-products.worker';
import { RepeatableJobWorker } from './workers/repeatable-job.worker';
import { RepopulationCreatedWorker } from './workers/repopulation-created.worker';
import { SalesStockDisposalCreatedWorker } from './workers/sales-stock-disposal-created.worker';
import { SalesStockOpnameCreatedWorker } from './workers/sales-stock-opname-created.worker';
import { SelfRegistrationWorker } from './workers/self-registration.worker';
import { SetIotDeviceStatusWorker } from './workers/set-iot-device-status.worker';
import { TaskTicketAlertCreatedWorker } from './workers/task-ticket-alert-created.worker';
import { TaskTicketDetailUpdatedWorker } from './workers/task-ticket-detail-updated.worker';
import { TransferRequestApprovedWorker } from './workers/transfer-request-approved.worker';
import { TransferRequestCreatedWorker } from './workers/transfer-request-created.worker';
import { TransferRequestRejectedCancelledWorker } from './workers/transfer-request-rejected-cancelled.worker';
import { UserAssignedToFcWorker } from './workers/user-assigned-to-fc.worker';
import { UserOwnerUpsertWorker } from './workers/user-owner-upsert.worker';

@Controller()
export class JobsController {
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

  @Inject(RepeatableJobQueue)
  repeatableJobQueue: RepeatableJobQueue;

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
}
