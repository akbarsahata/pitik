import { ChickInRequest } from '../../datasources/entity/pgsql/ChickInRequest.entity';
import { FarmingCycle } from '../../datasources/entity/pgsql/FarmingCycle.entity';
import { GoodsReceipt } from '../../datasources/entity/pgsql/GoodsReceipt.entity';
import { HarvestRealization } from '../../datasources/entity/pgsql/HarvestRealization.entity';
import { HarvestRequest } from '../../datasources/entity/pgsql/HarvestRequest.entity';
import { IotDevice } from '../../datasources/entity/pgsql/IotDevice.entity';
import { PurchaseOrder } from '../../datasources/entity/pgsql/PurchaseOrder.entity';
import { PurchaseRequest } from '../../datasources/entity/pgsql/PurchaseRequest.entity';
import { Repopulation } from '../../datasources/entity/pgsql/Repopulation.entity';
import { TransferRequest } from '../../datasources/entity/pgsql/TransferRequest.entity';
import { PushNotification } from '../../jobs/queues/push-notification.queue';
import { RequestUser } from '../types/index.d';

export interface CalculateDailyMonitoringJobData {
  user?: RequestUser;
  taskTicketId?: string;
  farmingCycleId: string;
  farmingCycleCode: string;
  updateStatusStrategy?: 'single' | 'multiple';
  date: string;
}

export interface ChickInRequestApprovedJobData extends ChickInRequest {
  farmingCycleCode: string;
}

export interface ChickinRequestCreatedJobData extends ChickInRequest {
  farmingCycleCode: string;
}

export interface ChickInRequestUpdatedJobData extends ChickInRequest {
  farmingCycleCode: string;
}

export interface FarmingCycleClosedJobData extends FarmingCycle {}

export interface GoodsReceiptCreatedJobData extends GoodsReceipt {
  farmingCycleId: string;
  farmingCycleCode: string;
}

export interface HarvestRealizationCreateOdooJobData extends HarvestRealization {
  farmingCycleCode: string;
}

export interface HarvestRequestApprovedJobData extends HarvestRequest {
  farmingCycleCode: string;
}

export interface TransferRequestApprovedJobData extends TransferRequest {
  sourceFarmingCycleId: string;
  sourceFarmingCycleCode: string;
  targetFarmingCycleId: string;
  targetFarmingCycleCode: string;
}

export interface TransferRequestCreatedJobData extends TransferRequest {
  sourceFarmingCycleId: string;
  sourceFarmingCycleCode: string;
  targetFarmingCycleId: string;
  targetFarmingCycleCode: string;
}

export interface RepopulationCreatedJobData extends Repopulation {
  farmingCycleCode: string;
}

export interface PurchaseRequestCreatedJobData {
  id: string;
}

export interface PurchaseRequestApprovedJobData extends PurchaseRequest {
  farmingCycleCode: string;
}

export interface PurchaseRequestRejectedJobData {
  id: string;
}

export interface PurchaseOrderApprovedJobData extends PurchaseOrder {
  farmingCycleCode: string;
}

export interface PurchaseOrderRejectedJobData extends PurchaseOrder {
  farmingCycleCode: string;
}

export interface IotTicketingStageDeviceJobData extends IotDevice {
  lastOnlineTime: Date;
}

export interface IotTicketingStageUpsertJobData {
  devices: Partial<IotTicketingStageDeviceJobData>[];
  type: 'offline' | 'online';
}

export interface PushNotificationJobData extends PushNotification<any> {}

export interface SalesStockOpnameCreatedJobData {
  stockOpnameId: string;
}

export interface SalesStockDisposalCreatedJobData {
  stockDisposalId: string;
}

export interface DailyReportRevisionRequestedQueueJobData {
  dailyMonitoringRevisionId: string;
}
