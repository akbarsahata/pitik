import { Destructor, Initializer, Inject, Service } from 'fastify-decorators';
import { DataSource } from 'typeorm';

import { minutesToMilliseconds } from 'date-fns';
import { psqlEnv, redisEnv } from '../../config/datasource';
import { env } from '../../config/env';
import { DBLogger, Logger } from '../../libs/utils/logger';
import { AiCrowdJobActivity } from '../entity/pgsql/AiCrowdJobActivity.entity';
import { AiCrowdManualChecking } from '../entity/pgsql/AiCrowdManualChecking.entity';
import { AiCrowdResult } from '../entity/pgsql/AiCrowdResult.entity';
import { AiNotifConfig } from '../entity/pgsql/AiNotifyConfig.entity';
import { Alert } from '../entity/pgsql/Alert.entity';
import { AlertFormD } from '../entity/pgsql/AlertFormD.entity';
import { AlertInstruction } from '../entity/pgsql/AlertInstruction.entity';
import { AlertInstructionCoopTypeD } from '../entity/pgsql/AlertInstructionCoopTypeD.entity';
import { AlertPreset } from '../entity/pgsql/AlertPreset.entity';
import { AlertPresetD } from '../entity/pgsql/AlertPresetD.entity';
import { AlertTriggerD } from '../entity/pgsql/AlertTriggerD.entity';
import { AlertTriggered } from '../entity/pgsql/AlertTriggered.entity';
import { Area } from '../entity/pgsql/Area.entity';
import { AutoNumbering } from '../entity/pgsql/AutoNumbering.entity';
import { Branch } from '../entity/pgsql/Branch.entity';
import { Building } from '../entity/pgsql/Building.entity';
import { BuildingType } from '../entity/pgsql/BuildingType.entity';
import { ChickInRequest } from '../entity/pgsql/ChickInRequest.entity';
import { ChickType } from '../entity/pgsql/ChickType.entity';
import { City } from '../entity/pgsql/City.entity';
import { Contract } from '../entity/pgsql/Contract.entity';
import { ContractBop } from '../entity/pgsql/ContractBop.entity';
import { ContractChickenPrice } from '../entity/pgsql/ContractChickenPrice.entity';
import { ContractDeductionFc } from '../entity/pgsql/ContractDeductionFc.entity';
import { ContractDeductionFcBop } from '../entity/pgsql/ContractDeductionFcBop.entity';
import { ContractHistory } from '../entity/pgsql/ContractHistory.entity';
import { ContractInsentiveDeals } from '../entity/pgsql/ContractInsentiveDeals.entity';
import { ContractMarketInsentive } from '../entity/pgsql/ContractMarketInsentive.entity';
import { ContractPaymentTerm } from '../entity/pgsql/ContractPaymentTerm.entity';
import { ContractSapronak } from '../entity/pgsql/ContractSapronak.entity';
import { ContractSaving } from '../entity/pgsql/ContractSaving.entity';
import { ContractType } from '../entity/pgsql/ContractType.entity';
import { ControllerType } from '../entity/pgsql/ControllerType.entity';
import { Coop } from '../entity/pgsql/Coop.entity';
import { CoopImage } from '../entity/pgsql/CoopImage.entity';
import { CoopMemberD } from '../entity/pgsql/CoopMemberD.entity';
import { CoopType } from '../entity/pgsql/CoopType.entity';
import { DailyMonitoring } from '../entity/pgsql/DailyMonitoring.entity';
import { DailyPerformanceD } from '../entity/pgsql/DailyPerformanceD.entity';
import { DataVerificationGamification } from '../entity/pgsql/DataVerificationGamification.entity';
import { DataVerificationGamificationD } from '../entity/pgsql/DataVerificationGamificationD.entity';
import { Device } from '../entity/pgsql/Device.entity';
import { District } from '../entity/pgsql/District.entity';
import { Document } from '../entity/pgsql/Document.entity';
import { Fan } from '../entity/pgsql/Fan.entity';
import { Farm } from '../entity/pgsql/Farm.entity';
import { FarmingCycle } from '../entity/pgsql/FarmingCycle.entity';
import { FarmingCycleAlertD } from '../entity/pgsql/FarmingCycleAlertD.entity';
import { FarmingCycleAlertFormD } from '../entity/pgsql/FarmingCycleAlertFormD.entity';
import { FarmingCycleAlertInstructionCoopTypeD } from '../entity/pgsql/FarmingCycleAlertInstructionCoopTypeD.entity';
import { FarmingCycleAlertInstructionD } from '../entity/pgsql/FarmingCycleAlertInstructionD.entity';
import { FarmingCycleAlertTriggerD } from '../entity/pgsql/FarmingCycleAlertTriggerD.entity';
import { FarmingCycleChickStockD } from '../entity/pgsql/FarmingCycleChickStockD.entity';
import { FarmingCycleFeedStockD } from '../entity/pgsql/FarmingCycleFeedStockD.entity';
import { FarmingCycleGamificationPoint } from '../entity/pgsql/FarmingCycleGamificationPoint.entity';
import { FarmingCycleMemberD } from '../entity/pgsql/FarmingCycleMemberD.entity';
import { FarmingCyclePPLMember } from '../entity/pgsql/FarmingCyclePPLMember.entity';
import { FarmingCycleTaskD } from '../entity/pgsql/FarmingCycleTaskD.entity';
import { FarmingCycleTaskFormD } from '../entity/pgsql/FarmingCycleTaskFormD.entity';
import { FarmingCycleTaskGamificationPoint } from '../entity/pgsql/FarmingCycleTaskGamificationPoint.entity';
import { FarmingCycleTaskTriggerD } from '../entity/pgsql/FarmingCycleTaskTriggerD.entity';
import { FeatureWhitelist } from '../entity/pgsql/FeatureWhitelist.entity';
import { FeedBrand } from '../entity/pgsql/FeedBrand.entity';
import { FloorType } from '../entity/pgsql/FloorType.entity';
import { GamificationPointHistory } from '../entity/pgsql/GamificationPointHistory.entity';
import { GoodsReceipt } from '../entity/pgsql/GoodsReceipt.entity';
import { GoodsReceiptPhoto } from '../entity/pgsql/GoodsReceiptPhoto.entity';
import { GoodsReceiptProduct } from '../entity/pgsql/GoodsReceiptProduct.entity';
import { HarvestDeal } from '../entity/pgsql/HarvestDeal.entity';
import { HarvestRealization } from '../entity/pgsql/HarvestRealization.entity';
import { HarvestRealizationRecord } from '../entity/pgsql/HarvestRealizationRecord.entity';
import { HarvestRecordPhoto } from '../entity/pgsql/HarvestRecordPhoto.entity';
import { HarvestRequest } from '../entity/pgsql/HarvestRequest.entity';
import { HarvestTaskD } from '../entity/pgsql/HarvestTaskD.entity';
import { HeaterInRoom } from '../entity/pgsql/HeaterInRoom.entity';
import { HeaterType } from '../entity/pgsql/HeaterType.entity';
import { InletType } from '../entity/pgsql/InletType.entity';
import { IotDevice } from '../entity/pgsql/IotDevice.entity';
import { IotDeviceTracker } from '../entity/pgsql/IotDeviceTracker.entity';
import { IotFirmware } from '../entity/pgsql/IotFirmware.entity';
import { IotSensor } from '../entity/pgsql/IotSensor.entity';
import { Issue } from '../entity/pgsql/Issue.entity';
import { IssuePhotoD } from '../entity/pgsql/IssuePhotoD.entity';
import { Notification } from '../entity/pgsql/Notification.entity';
import { Product } from '../entity/pgsql/Product.entity';
import { Province } from '../entity/pgsql/Province.entity';
import { PurchaseOrder } from '../entity/pgsql/PurchaseOrder.entity';
import { PurchaseOrderProduct } from '../entity/pgsql/PurchaseOrderProduct.entity';
import { PurchaseRequest } from '../entity/pgsql/PurchaseRequest.entity';
import { PurchaseRequestProduct } from '../entity/pgsql/PurchaseRequestProduct.entity';
import { Repopulation } from '../entity/pgsql/Repopulation.entity';
import { Room } from '../entity/pgsql/Room.entity';
import { RoomType } from '../entity/pgsql/RoomType.entity';
import { SmartCameraJob } from '../entity/pgsql/SmartCameraJob.entity';
import { SmartScaleWeighing } from '../entity/pgsql/SmartScaleWeighing.entity';
import { SmartScaleWeighingD } from '../entity/pgsql/SmartScaleWeighingD.entity';
import { Target } from '../entity/pgsql/Target.entity';
import { TargetDaysD } from '../entity/pgsql/TargetDaysD.entity';
import { Task } from '../entity/pgsql/Task.entity';
import { TaskFormD } from '../entity/pgsql/TaskFormD.entity';
import { TaskPreset } from '../entity/pgsql/TaskPreset.entity';
import { TaskPresetD } from '../entity/pgsql/TaskPresetD.entity';
import { TaskTicket } from '../entity/pgsql/TaskTicket.entity';
import { TaskTicketD } from '../entity/pgsql/TaskTicketD.entity';
import { TaskTicketPhotoD } from '../entity/pgsql/TaskTicketPhotoD.entity';
import { TaskTicketVideoD } from '../entity/pgsql/TaskTicketVideoD.entity';
import { TaskTriggerD } from '../entity/pgsql/TaskTriggerD.entity';
import { TransferRequest } from '../entity/pgsql/TransferRequest.entity';
import { TransferRequestPhoto } from '../entity/pgsql/TransferRequestPhoto.entity';
import { User } from '../entity/pgsql/User.entity';
import { UserRegister } from '../entity/pgsql/UserRegister.entity';
import { Variable } from '../entity/pgsql/Variable.entity';
import { VariableLinkedData } from '../entity/pgsql/VariableLinkedData.entity';
import { TargetSubscriber } from '../subscribers/Target.subscriber';
import { RedisConnection } from './redis.connection';

@Service()
export class PostgreSQLConnection {
  connection!: DataSource;

  @Inject(TargetSubscriber)
  private targetSubscriber!: TargetSubscriber;

  @Inject(Logger)
  private logger!: Logger;

  @Inject(DBLogger)
  private dbLogger!: DBLogger;

  @Initializer([RedisConnection])
  async init() {
    try {
      this.targetSubscriber.listenTo();

      this.connection = new DataSource({
        type: 'postgres',
        database: psqlEnv.PSQL_DB,
        host: psqlEnv.PSQL_HOST,
        port: psqlEnv.PSQL_PORT,
        schema: psqlEnv.PSQL_SCHEMA,
        username: psqlEnv.PSQL_USERNAME,
        password: psqlEnv.PSQL_PASSWORD,
        maxQueryExecutionTime: minutesToMilliseconds(10),
        synchronize: false,
        cache: {
          type: 'ioredis',
          options: {
            host: redisEnv.REDIS_HOST,
            port: redisEnv.REDIS_PORT,
          },
          ignoreErrors: true,
        },
        extra: {
          max: 10,
        },
        entities: [
          AiCrowdJobActivity,
          AiCrowdManualChecking,
          AiNotifConfig,
          AiCrowdResult,
          Alert,
          AlertFormD,
          AlertInstruction,
          AlertInstructionCoopTypeD,
          AlertPreset,
          AlertPresetD,
          AlertTriggerD,
          AlertTriggered,
          Area,
          AutoNumbering,
          Branch,
          Building,
          BuildingType,
          ChickType,
          ControllerType,
          ChickInRequest,
          City,
          Coop,
          CoopImage,
          CoopMemberD,
          CoopType,
          Contract,
          ContractBop,
          ContractChickenPrice,
          ContractDeductionFc,
          ContractDeductionFcBop,
          ContractInsentiveDeals,
          ContractMarketInsentive,
          ContractPaymentTerm,
          ContractSapronak,
          ContractSaving,
          ContractHistory,
          ContractType,
          DailyMonitoring,
          DailyPerformanceD,
          DataVerificationGamification,
          DataVerificationGamificationD,
          Device,
          District,
          Document,
          Fan,
          Farm,
          FarmingCycle,
          FarmingCycleAlertD,
          FarmingCycleAlertFormD,
          FarmingCycleAlertInstructionD,
          FarmingCycleAlertInstructionCoopTypeD,
          FarmingCycleAlertTriggerD,
          FarmingCycleMemberD,
          FarmingCyclePPLMember,
          FarmingCycleTaskD,
          FarmingCycleTaskTriggerD,
          FarmingCycleTaskFormD,
          FarmingCycleChickStockD,
          FarmingCycleFeedStockD,
          FarmingCycleGamificationPoint,
          FarmingCycleTaskGamificationPoint,
          FeatureWhitelist,
          FeedBrand,
          FloorType,
          GamificationPointHistory,
          GoodsReceipt,
          GoodsReceiptPhoto,
          GoodsReceiptProduct,
          HarvestDeal,
          HarvestRealization,
          HarvestRealizationRecord,
          HarvestRecordPhoto,
          HarvestRequest,
          HarvestTaskD,
          HeaterInRoom,
          HeaterType,
          InletType,
          IotDevice,
          IotDeviceTracker,
          IotFirmware,
          IotSensor,
          Issue,
          IssuePhotoD,
          Notification,
          Task,
          Product,
          Province,
          PurchaseRequest,
          PurchaseOrder,
          PurchaseOrderProduct,
          PurchaseRequestProduct,
          Repopulation,
          Room,
          RoomType,
          SmartCameraJob,
          SmartScaleWeighing,
          SmartScaleWeighingD,
          Target,
          TargetDaysD,
          TaskFormD,
          TaskPreset,
          TaskPresetD,
          TaskTicket,
          TaskTicketD,
          TaskTicketPhotoD,
          TaskTicketVideoD,
          TaskTriggerD,
          TransferRequest,
          TransferRequestPhoto,
          User,
          UserRegister,
          Variable,
          VariableLinkedData,
        ],
        logging: env.DEBUG_MODE,
        logger: this.dbLogger,
        subscribers: [TargetSubscriber],
      });

      await this.connection.initialize();

      this.logger.info({ message: '[CONNECTION] Connected to PostgreSQL' });
    } catch (error) {
      this.logger.info({ message: '[CONNECTION] Error connecting to PostgreSQL' });
      this.logger.error(error);
    }
  }

  @Destructor()
  async destroy() {
    await this.connection.destroy();
  }
}
