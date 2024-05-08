import { FastifyInstance } from 'fastify';
import { bootstrap } from 'fastify-decorators';
import { JobsController } from '../../jobs';
import { MqttController } from '../../mqtt';
import { AlertController } from './alert.controller';
import { AlertPresetController } from './alertPreset.controller';
import { AreaController } from './area.controller';
import { B2BControllers } from './b2b';
import { BranchController } from './branch.controller';
import { BranchSapronakStockController } from './branchSapronakStock.controller';
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
import { FeedStockController } from './feedstock.controller';
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
import { IotTicketingController } from './iotTicketing.controller';
import { IssueController } from './issue.controller';
import { NotificationController } from './notification.controller';
import { OvkStockController } from './ovkstock.controller';
import { PerformanceController } from './performance.controller';
import { ProductController } from './product.controller';
import { ProvinceController } from './province.controller';
import { PurchaseOrderController } from './purchaseOrder.controller';
import { PurchaseRequestController } from './purchaseRequest.controller';
import { RoomController } from './room.controller';
import { RoomTypeController } from './roomType.controller';
import { CustomersController } from './sales/customer.controller';
import { GoodsReceivedController } from './sales/goodsReceived.controller';
import { InternalTransferController } from './sales/internalTransfer.controller';
import { PurchaseOrderInvoiceController } from './sales/invoice.controller';
import { ManufactureController } from './sales/manufacture.controller';
import { OperationUnitController } from './sales/operationUnit.controller';
import { OrderIssueCategoryController } from './sales/orderIssueCategory.controller';
import { ProductController as SalesProductController } from './sales/product.controller';
import { ProductCategoryController } from './sales/productCategory.controller';
import { ProductCategoryPriceController } from './sales/productCategoryPrices.controller';
import { PurchaseOrderController as SalesPurchaseOrderController } from './sales/purchaseOrder.controller';
import { SalesOrderController } from './sales/salesOrder.controller';
import { StockDisposalController } from './sales/stockDisposal.controller';
import { StockOpnameController } from './sales/stockOpname.controller';
import { VendorsController } from './sales/vendor.controller';
import { CustomerVisitController } from './sales/visit.controller';
import { SelfRegistrationController } from './selfRegistration.controller';
import { SensorController } from './sensor.controller';
import { SmartAudioController } from './smartAudio.controller';
import { SmartCameraController } from './smartCamera.controller';
import { SmartControllerController } from './smartController.controller';
import { SmartConventronController } from './smartConventron.controller';
import { SmartRecorderController } from './smartRecorder.controller';
import { SmartScaleController } from './smartScale.controller';
import { TargetController } from './target.controller';
import { TaskController } from './task.controller';
import { TaskLibraryController } from './taskLibrary.controller';
import { TaskPresetController } from './taskPreset.controller';
import { TransferRequestController } from './transferRequest.controller';
import { UploadController } from './upload.controller';
import { UserController } from './user.controller';
import { UserManagementController } from './usermanagement/index.controller';
import { VariableController } from './variable.controller';

export const registerControllers = async (server: FastifyInstance) => {
  server.register(bootstrap, {
    controllers: [
      AlertController,
      AlertController,
      AlertPresetController,
      AreaController,
      ...B2BControllers,
      BranchController,
      BranchSapronakStockController,
      BuildingController,
      BuildingTypeController,
      ChickInRequestController,
      ChickTypeController,
      CityController,
      ContractController,
      ContractCostPlusController,
      ContractMitraGaransiController,
      ContractOwnFarmController,
      ControllerTypeController,
      CoopController,
      CoopTypeController,
      CustomersController,
      CustomerVisitController,
      DailyPerformanceController,
      DeviceController,
      DeviceSensorsController,
      DistrictController,
      DocumentController,
      FarmController,
      FarmingCycleController,
      FeedbrandController,
      FeedStockController,
      FirmwareController,
      FloorTypeController,
      GamificationController,
      GoodsReceiptController,
      GoodsReceivedController,
      HarvestController,
      HarvestDealController,
      HarvestRealizationController,
      HarvestRequestController,
      HealthController,
      HeaterTypeController,
      InternalNotificationController,
      IotTicketingController,
      InternalTransferController,
      IssueController,
      JobsController,
      ManufactureController,
      MqttController,
      NotificationController,
      OperationUnitController,
      OrderIssueCategoryController,
      PerformanceController,
      ProductCategoryController,
      ProductCategoryPriceController,
      ProductController,
      ProvinceController,
      PurchaseOrderController,
      SalesPurchaseOrderController,
      PurchaseOrderInvoiceController,
      PurchaseRequestController,
      RoomController,
      RoomTypeController,
      OrderIssueCategoryController,
      OvkStockController,
      ProductCategoryController,
      SalesOrderController,
      SalesProductController,
      SelfRegistrationController,
      SensorController,
      SmartAudioController,
      SmartCameraController,
      SmartRecorderController,
      SmartConventronController,
      SmartControllerController,
      SmartScaleController,
      StockDisposalController,
      StockOpnameController,
      TargetController,
      TaskController,
      TaskLibraryController,
      TaskPresetController,
      TransferRequestController,
      UploadController,
      UserController,
      VariableController,
      VendorsController,
      ...UserManagementController,
    ],
  });
};
