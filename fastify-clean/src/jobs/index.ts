import { Controller, Inject } from 'fastify-decorators';
import { RepeatableJobQueue } from './queues/repeatable-job.queue';
import { CalculateDailyMonitoringWorker } from './workers/calculate-daily-monitoring.worker';
import { ChickInRequestApprovedWorker } from './workers/chick-in-request-approved.worker';
import { ChickInRequestCreatedWorker } from './workers/chick-in-request-created.worker';
import { ChickInRequestUpdatedWorker } from './workers/chick-in-request-updated.worker';
import { ContractCreatedWorker } from './workers/contract-created.worker';
import { CoopUpdateWorker } from './workers/coop-updated.worker';
import { FarmUpdatedWorker } from './workers/farm-updated.worker';
import { FarmingCycleClosedWorker } from './workers/farming-cycle-closed.worker';
import { FarmingCycleCreatedFmsWorker } from './workers/farming-cycle-created-fms.worker';
import { FarmingCycleCreatedWorker } from './workers/farming-cycle-created.worker';
import { FarmingCycleDOCinWorker } from './workers/farming-cycle-doc-in.worker';
import { FinalizeDailyMonitoringWorker } from './workers/finalize-daily-monitoring.worker';
import { GamificationTaskPointWorker } from './workers/gamification-task-point.worker';
import { GamificationTaskSubmittedWorker } from './workers/gamification-task-submitted.worker';
import { GamificationTaskVerifiedWorker } from './workers/gamification-task-verified.worker';
import { GenerateAlertWorker } from './workers/generate-alert.worker';
import { GenerateDocumentWorker } from './workers/generate-document.worker';
import { GenerateIotDeviceAlertWorker } from './workers/generate-iot-device-alert.worker';
import { GenerateLateTaskReminderWorker } from './workers/generate-late-task-reminder.worker';
import { GenerateTaskTicketWorker } from './workers/generate-task-ticket.worker';
import { GoodsReceiptCreatedWorker } from './workers/goods-receipt-created.worker';
import { HarvestDealCreatedWorker } from './workers/harvest-deal-created.worker';
import { HarvestRealizationSubmittedWorker } from './workers/harvest-realization-submitted.worker';
import { HarvestRequestApprovedWorker } from './workers/harvest-request-approved.worker';
import { HarvestRequestCancelledWorker } from './workers/harvest-request-cancelled.worker';
import { HarvestRequestEditedWorker } from './workers/harvest-request-edited.worker';
import { HarvestRequestRejectedWorker } from './workers/harvest-request-rejected.worker';
import { HarvestRequestSubmittedWorker } from './workers/harvest-request-submitted.worker';
import { InitializeDailyMonitoringWorker } from './workers/initialize-daily-monitoring.worker';
import { IotSmartConventronCreatedWorker } from './workers/iot-smart-conventron-created.worker';
import { IssueCreatedWorker } from './workers/issue-created.worker';
import { NotificationServiceWorker } from './workers/notification-service.worker';
import { PurchaseOrderApprovedWorker } from './workers/purchase-order-approved.worker';
import { PurchaseRequestApprovedWorker } from './workers/purchase-request-approved.worker';
import { PurchaseRequestCreatedWorker } from './workers/purchase-request-created.worker';
import { PushNotificationWorker } from './workers/push-notification.worker';
import { ReindexErpProductsWorker } from './workers/reindex-erp-products.worker';
import { RepeatableJobWorker } from './workers/repeatable-job.worker';
import { RepopulationCreatedWorker } from './workers/repopulation-created.worker';
import { SelfRegistrationWorker } from './workers/self-registration.worker';
import { SetIotDeviceStatusWorker } from './workers/set-iot-device-status.worker';
import { TaskTicketAlertCreatedWorker } from './workers/task-ticket-alert-created.worker';
import { TaskTicketDetailUpdatedWorker } from './workers/task-ticket-detail-updated.worker';
import { TransferRequestApprovedWorker } from './workers/transfer-request-approved.worker';
import { TransferRequestCreatedWorker } from './workers/transfer-request-created.worker';
import { UserAssignedToFcWorker } from './workers/user-assigned-to-fc.worker';
import { UserOwnerUpdatedWorker } from './workers/user-owner-update.worker';

@Controller()
export class JobsController {
  @Inject(GamificationTaskPointWorker)
  gamificationTaskPointWorker: GamificationTaskPointWorker;

  @Inject(GamificationTaskSubmittedWorker)
  gamificationTaskSubmittedWorker: GamificationTaskSubmittedWorker;

  @Inject(GamificationTaskVerifiedWorker)
  gamificationTaskVerifiedWorker: GamificationTaskVerifiedWorker;

  @Inject(PushNotificationWorker)
  pushNotificationWorker: PushNotificationWorker;

  @Inject(UserOwnerUpdatedWorker)
  userOwnerUpdatedWorker: UserOwnerUpdatedWorker;

  @Inject(FarmUpdatedWorker)
  farmUpdatedWorker: FarmUpdatedWorker;

  @Inject(CoopUpdateWorker)
  coopUpdatedWorker: CoopUpdateWorker;

  @Inject(FarmingCycleClosedWorker)
  fcClosedWorker: FarmingCycleClosedWorker;

  @Inject(FarmingCycleCreatedWorker)
  fcCreatedWorker: FarmingCycleCreatedWorker;

  @Inject(FarmingCycleCreatedFmsWorker)
  fcCreatedNewWorker: FarmingCycleCreatedFmsWorker;

  @Inject(PurchaseRequestCreatedWorker)
  prCreatedWorker: PurchaseRequestCreatedWorker;

  @Inject(PurchaseRequestApprovedWorker)
  prApprovedWorker: PurchaseRequestApprovedWorker;

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

  @Inject(GoodsReceiptCreatedWorker)
  goodsReceiptCreatedWorker: GoodsReceiptCreatedWorker;

  @Inject(PurchaseOrderApprovedWorker)
  purchaseOrderApprovedWorker: PurchaseOrderApprovedWorker;

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
}
