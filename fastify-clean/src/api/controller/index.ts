import { FastifyInstance } from 'fastify';
import { bootstrap } from 'fastify-decorators';
import { JobsController } from '../../jobs';
import { MqttController } from '../../mqtt';
import { AlertController } from './alert.controller';
import { AlertPresetController } from './alertPreset.controller';
import { AreaController } from './area.controller';
import { BranchController } from './branch.controller';
import { BuildingController } from './building.controller';
import { BuildingTypeController } from './buildingType.controller';
import { ChickInRequestController } from './chickInRequest.controller';
import { ChickTypeController } from './chickType.controller';
import { CityController } from './city.controller';
import { ContractController } from './contract.controller';
import { ContractCostPlusController } from './contractCostPlus.controller';
import { ContractMitraGaransiController } from './contractMitraGaransi.controller';
import { ContractOwnFarmController } from './contractOwnfarm.controller';
import { ControllerTypeController } from './controllerType.controller';
import { CoopController } from './coop.controller';
import { CoopTypeController } from './coopType.controller';
import { DailyPerformanceController } from './dailyPerformance.controller';
import { DeviceController } from './device.controller';
import { DeviceSensorsController } from './devicesSensors.controller';
import { DistrictController } from './district.controller';
import { DocumentController } from './document.controller';
import { FarmController } from './farm.controller';
import { FarmingCycleController } from './farmingCycle.controller';
import { FeedbrandController } from './feedbrand.controller';
import { FirmwareController } from './firmware.controller';
import { FloorTypeController } from './floorType.controller';
import { GamificationController } from './gamification.controller';
import { GoodsReceiptController } from './goodsReceipt.controller';
import { HarvestController } from './harvest.controller';
import { HarvestDealController } from './harvestDeal.controller';
import { HarvestRealizationController } from './harvestRealization.controller';
import { HarvestRequestController } from './harvestRequest.controller';
import { HealthController } from './health.controller';
import { HeaterTypeController } from './heaterType.controller';
import { InternalNotificationController } from './internalNotification.controller';
import { IssueController } from './issue.controller';
import { NotificationController } from './notification.controller';
import { PerformanceController } from './performance.controller';
import { ProductController } from './product.controller';
import { ProvinceController } from './province.controller';
import { PurchaseOrderController } from './purchaseOrder.controller';
import { PurchaseRequestController } from './purchaseRequest.controller';
import { RoomController } from './room.controller';
import { RoomTypeController } from './roomType.controller';
import { SelfRegistrationController } from './selfRegistration.controller';
import { SensorController } from './sensor.controller';
import { SmartCameraController } from './smartCamera.controller';
import { SmartConventronController } from './smartConventron.controller';
import { SmartScaleController } from './smartScale.controller';
import { TargetController } from './target.controller';
import { TaskController } from './task.controller';
import { TaskLibraryController } from './taskLibrary.controller';
import { TaskPresetController } from './taskPreset.controller';
import { TransferRequestController } from './transferRequest.controller';
import { UploadController } from './upload.controller';
import { UserController } from './user.controller';
import { VariableController } from './variable.controller';

export const registerControllers = async (server: FastifyInstance) => {
  server.register(bootstrap, {
    controllers: [
      AlertController,
      AlertPresetController,
      AlertController,
      AreaController,
      BranchController,
      BuildingController,
      BuildingTypeController,
      SmartCameraController,
      ChickInRequestController,
      ChickTypeController,
      CityController,
      ControllerTypeController,
      CoopController,
      CoopTypeController,
      DailyPerformanceController,
      DeviceController,
      DeviceSensorsController,
      DistrictController,
      DocumentController,
      FarmController,
      FarmingCycleController,
      FeedbrandController,
      FirmwareController,
      FloorTypeController,
      GamificationController,
      GoodsReceiptController,
      HarvestController,
      HarvestDealController,
      HarvestRealizationController,
      HarvestRequestController,
      HealthController,
      HeaterTypeController,
      InternalNotificationController,
      IssueController,
      JobsController,
      ContractController,
      ContractCostPlusController,
      ContractMitraGaransiController,
      ContractOwnFarmController,
      MqttController,
      NotificationController,
      PerformanceController,
      ProductController,
      ProvinceController,
      PurchaseOrderController,
      PurchaseRequestController,
      RoomController,
      RoomTypeController,
      SelfRegistrationController,
      SmartConventronController,
      SmartScaleController,
      SensorController,
      TargetController,
      TaskController,
      TaskLibraryController,
      TaskPresetController,
      TransferRequestController,
      UploadController,
      UserController,
      VariableController,
    ],
  });
};
