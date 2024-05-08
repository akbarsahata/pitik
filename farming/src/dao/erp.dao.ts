/* eslint-disable class-methods-use-this */
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Service } from 'fastify-decorators';
import fetch from 'node-fetch';
import env from '../config/env';
import {
  CreateAdjustmentPayload,
  ErpDailyMonitoringCreated,
  ErpDailyMonitoringUpserted,
  ErpDailyMonitoringUpsertPayload,
  ErpHarvestDealCancelled,
  ErpHarvestRealizationCreate,
  ErpHarvestRequestCreate,
  ErpTransferRequestCreate,
} from '../datasources/entity/erp/ERPProduct';
import { ChickInRequest } from '../datasources/entity/pgsql/ChickInRequest.entity';
import { Coop } from '../datasources/entity/pgsql/Coop.entity';
import { Farm } from '../datasources/entity/pgsql/Farm.entity';
import { FarmingCycle } from '../datasources/entity/pgsql/FarmingCycle.entity';
import { GoodsReceipt } from '../datasources/entity/pgsql/GoodsReceipt.entity';
import { PurchaseRequest } from '../datasources/entity/pgsql/PurchaseRequest.entity';
import { Repopulation } from '../datasources/entity/pgsql/Repopulation.entity';
import { TransferRequest } from '../datasources/entity/pgsql/TransferRequest.entity';
import { User } from '../datasources/entity/pgsql/User.entity';
import { InternalUpsertProductItem } from '../dto/product.dto';
import { DATETIME_SQL_FORMAT, DATE_SQL_FORMAT, DEFAULT_TIME_ZONE } from '../libs/constants';

@Service()
export class ErpDAO {
  async updateUser(data: User) {
    const body = {
      code: data.userCode,
      phone: data.phoneNumber,
      name: data.fullName,
      email: data.email ? data.email : undefined,
      createdAt: format(new Date(data.createdDate), DATETIME_SQL_FORMAT),
      modifiedAt: format(new Date(data.modifiedDate), DATETIME_SQL_FORMAT),
      isActive: data.status,
    };

    const result = await ErpDAO.post('/user_owner_updated', body);

    return result;
  }

  async updateFarm(data: Farm) {
    const body = {
      name: data.farmName,
      code: data.farmCode,
      branchCode: data.branch?.code,
      street: data.addressName,
      street2: `${data.address1} ${data.address2}`,
      ownerCode: data.owner.userCode,
      createdAt: format(new Date(data.createdDate), DATETIME_SQL_FORMAT),
      modifiedAt: format(new Date(data.modifiedDate), DATETIME_SQL_FORMAT),
      isActive: data.status,
    };

    const result = await ErpDAO.post('/farm_updated', body);

    return result;
  }

  async updateCoop(data: Coop) {
    const body = {
      code: data.coopCode,
      name: data.coopName,
      coopType: data.coopType?.coopTypeName.toUpperCase(),
      chickType: data.chickType?.chickTypeName.toUpperCase(),
      lat: data.farm.latitude,
      long: data.farm.longitude,
      farmCode: data.farm.farmCode,
      createdAt: format(new Date(data.createdDate), DATETIME_SQL_FORMAT),
      modifiedAt: format(new Date(data.modifiedDate), DATETIME_SQL_FORMAT),
      active: data.status,
      polaCode: data.contract?.contractType?.contractName.toUpperCase(),
      isActive: data.status,
    };

    const result = await ErpDAO.post('/coop_updated', body);

    return result;
  }

  async createFarmingCycle(fc: FarmingCycle, chickInReq: ChickInRequest) {
    const body = {
      contractCode: fc.contract?.code || fc.coop.contract?.code,
      code: fc.farmingCycleCode,
      initialPopulation: fc.initialPopulation,
      chickInDatePlan: chickInReq.chickInDate || format(fc.createdDate, DATE_SQL_FORMAT),
      coop: {
        name: fc.coop.coopName,
        chickType: fc.coop.chickType?.chickTypeName.toUpperCase(),
        code: fc.coop.coopCode,
        coopType: fc.coop.coopType?.coopTypeName.toUpperCase(),
        polaCode:
          fc.contract?.contractType?.contractName.toUpperCase() ||
          fc.coop?.contract?.contractType?.contractName.toUpperCase(),
        createdAt: format(fc.coop.createdDate, DATETIME_SQL_FORMAT),
        modifiedAt: format(fc.coop.modifiedDate, DATETIME_SQL_FORMAT),
        farm: {
          owner: {
            code: fc.farm.owner.userCode,
            phone: fc.farm.owner.phoneNumber,
            name: fc.farm.owner.fullName,
            email: fc.farm.owner.email ? fc.farm.owner.email : undefined,
            createdAt: format(fc.farm.owner.createdDate, DATETIME_SQL_FORMAT),
            modifiedAt: format(fc.farm.owner.modifiedDate, DATETIME_SQL_FORMAT),
          },
          street: fc.farm.addressName ?? '',
          street2: `${fc.farm.address1 ?? ''} ${fc.farm.address2 ?? ''}`,
          name: fc.farm.farmName,
          code: fc.farm.farmCode,
          branchCode: fc.farm.branch?.code,
          createdAt: format(fc.farm.createdDate, DATETIME_SQL_FORMAT),
          modifiedAt: format(fc.farm.modifiedDate, DATETIME_SQL_FORMAT),
        },
      },
      chickInDateApproved: chickInReq.approvedDate || format(fc.createdDate, DATE_SQL_FORMAT),
    };

    const result = await ErpDAO.post('/farming_cycle_created', body);

    return result;
  }

  async createPurchaseRequest(data: PurchaseRequest): Promise<string> {
    const requestSchedule = data.chickInRequest
      ? data.chickInRequest.approvedDate
      : data.requestSchedule;

    const body = {
      id: data.id,
      farmingCycleCode: data.farmingCycle.farmingCycleCode,
      requestSchedule,
      requestedBy: `${data.userCreator.fullName} - ${data.userCreator.phoneNumber}`,
      approvedBy: `${data.userApprover.fullName} - ${data.userApprover.phoneNumber}`,
      notes: data.notes || '',
      details: data.products.map((p) => ({
        categoryCode: p.categoryCode,
        subcategoryCode: p.subcategoryCode ?? '',
        productCode: p.productCode ?? '',
        quantity: p.quantity,
      })),
      matchingNumber: data.logisticInfo?.matchingNumber || '',
    };

    const result = await ErpDAO.post('/purchase_request_create', body);

    return result?.data?.code;
  }

  async createDailyMonitoring(
    erpCode: string,
    coopCode: string,
    date: string,
    mortality: number,
    culling: number,
    feedTypeCode: string,
    feedQuantity: number,
    bw: number,
  ): Promise<ErpDailyMonitoringCreated> {
    const body = {
      dailyMonitoringCode: erpCode,
      coopCode,
      date,
      mortality,
      culling,
      feedTypeCode,
      feedQuantity,
      bw,
    };

    const result = await ErpDAO.post('/daily_monitoring_created', body);

    return {
      id: result?.data?.id,
      dailyMonitoringCode: result?.data?.daily_monitoring_code,
      coopCopde: result?.data?.coop_code,
      date: result?.data?.date,
      mortality: result?.data?.mortality,
      culling: result?.data?.culling,
      feedTypeCode: result?.data?.feed_type_code,
      feedQuantity: result?.data?.feed_quantity,
      secondDailyMonitoring: result?.data?.second_daily_monitoring,
      bw: result?.data?.bw,
    };
  }

  async upsertDailyMonitoring(
    data: ErpDailyMonitoringUpsertPayload,
  ): Promise<ErpDailyMonitoringUpserted> {
    const result = await ErpDAO.post('/daily_monitoring_created', data);

    return {
      id: result?.data?.id,
      coopCopde: result?.data?.coop_code,
      date: result?.data?.date,
      mortality: result?.data?.mortality,
      culling: result?.data?.culling,
      feedTypeCode: result?.data?.feed_type_code,
      feedQuantity: result?.data?.feed_quantity,
      secondDailyMonitoring: result?.data?.second_daily_monitoring,
      bw: result?.data?.bw,
    };
  }

  async createTransferRequest(data: ErpTransferRequestCreate): Promise<string> {
    const result = await ErpDAO.post('/transfer_request', data);

    return result?.data?.code;
  }

  // FIXME: update implementation after API from odoo is available
  // https://pitik.atlassian.net/wiki/spaces/~627b215f0d1e73006f7c6745/pages/78610686/Procurement+API
  async cancelTransferRequest(data: TransferRequest): Promise<string> {
    const body = {
      erpCode: data.erpCode,
    };

    const result = await ErpDAO.post('/cancel_transfer_request', body);

    return result?.data?.code;
  }

  async cancelHarvestDeal(data: ErpHarvestDealCancelled): Promise<string> {
    const body = {
      date: data.date,
      deliveryOrder: data.deliveryOrder,
      reason: data.reason,
      cancelBy: data.cancelBy,
    };

    const result = await ErpDAO.post('/cancel_harvest_deals', body);

    return result?.data?.code;
  }

  async createGoodsReceipt(data: GoodsReceipt): Promise<string> {
    let source = 'purchase_order';

    if (data.transferRequestId && !data.purchaseOrderId) {
      source = 'transfer_request';
    }

    const body = {
      source,
      purchaseOrderCode: data.purchaseOrder?.erpCode || '',
      transferRequestCode: data.transferRequest?.erpCode || '',
      dateReceived:
        data.receivedDate || format(utcToZonedTime(new Date(), DEFAULT_TIME_ZONE), DATE_SQL_FORMAT),
      details: data.goodsReceiptProducts.map((grp) => ({
        categoryCode: grp.categoryCode,
        subcategoryCode: grp.subcategoryCode,
        productCode: grp.productCode,
        quantity: grp.quantity,
        isReturned: grp.isReturned === null ? false : grp.isReturned,
      })),
    };

    const result = await ErpDAO.post('/good_received_confirmation', body);

    return result?.data?.pickingCode;
  }

  async createRepopulation(farmingCycleCode: string, repopulation: Repopulation) {
    const body = {
      farmingCycleCode,
      date: format(repopulation.repopulateDate, DATE_SQL_FORMAT),
      qtyRepopulation: repopulation.approvedAmount,
      reason: repopulation.repopulateReason,
    };

    const result = await ErpDAO.post('/farming_cycle_repopulation', body);

    return result;
  }

  async createHarvestRequest(data: ErpHarvestRequestCreate) {
    const body = {
      farmingCycleCode: data.farmingCycleCode,
      coopCode: data.coopCode,
      requester: data.requester,
      approver: data.approver,
      datePlanned: data.datePlanned,
      rangeMin: data.rangeMin,
      rangeMax: data.rangeMax,
      quantity: data.quantity,
      reason: data.reason,
    };

    const result = await ErpDAO.post('/harvest_request', body);

    return result?.data?.code;
  }

  async createHarvestRealization(data: ErpHarvestRealizationCreate) {
    const body = {
      farmingCycleCode: data.farmingCycleCode,
      coopCode: data.coopCode,
      datePlanned: data.datePlanned,
      rangeMin: data.rangeMin,
      rangeMax: data.rangeMax,
      quantity: data.quantity,
      tonnage: data.tonnage,
      deliveryOrder: data.deliveryOrder,
      requester: data.requester,
    };

    const result = await ErpDAO.post('/harvest_realization', body);

    return result?.data?.saleCode;
  }

  async closeFarmingCycle(body: {
    feed: number;
    fcrStd: number;
    tonnage: number;
    ip: number;
    fcrAct: number;
    deplesi: number;
    averageAge: number;
    finalPopulation: number;
    farmingCycleCode: string;
    initialPopulation: number;
    date: string;
  }) {
    const result = await ErpDAO.post('/farming_cycle_closing', body);

    return result;
  }

  async getAllActiveProducts(): Promise<InternalUpsertProductItem[]> {
    const result = await ErpDAO.get('/product_get');

    return result?.data as InternalUpsertProductItem[];
  }

  async createAdjusments(data: CreateAdjustmentPayload) {
    await ErpDAO.post('/adjustment', data);
  }

  protected static async post(path: string, body: any): Promise<any> {
    const response = await fetch(`${env.HOST_ERP_V1}${path}`, {
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'API-KEY': env.API_KEY_ERP,
      },
    });

    const responseText = await response.text();

    try {
      const result = JSON.parse(responseText);

      if (!result || !result.result || !result.result.data) {
        throw new Error('unexpected response');
      }

      if (result.result.code < 200 || result.result.code > 300) {
        throw new Error(`${result.result.code} - ${result.result.message}`);
      }

      if (result.error) {
        throw new Error(`${result.error.http_status} - ${result.error.message}`);
      }

      return result.result;
    } catch (error) {
      throw new Error(
        `${error.message || error} - response:${responseText} - body:${JSON.stringify(body)}`,
      );
    }
  }

  protected static async get(path: string): Promise<any> {
    const response = await fetch(`${env.HOST_ERP_V1}${path}`, {
      method: 'get',
      headers: {
        'API-KEY': env.API_KEY_ERP,
      },
    });

    const responseText = await response.text();

    try {
      const result = JSON.parse(responseText);

      if (!result || !result.result || !result.result.data) {
        throw new Error('unexpected response');
      }

      if (result.result.code < 200 || result.result.code > 300) {
        throw new Error(`${result.result.code} - ${result.result.message}`);
      }

      if (result.error) {
        throw new Error(`${result.error.http_status} - ${result.error.message}`);
      }

      return result.result;
    } catch (error) {
      throw new Error(`${error.message || error} - response:${responseText}}`);
    }
  }
}
