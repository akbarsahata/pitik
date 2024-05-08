/* eslint-disable class-methods-use-this */
import { format } from 'date-fns';
import { Service } from 'fastify-decorators';
import fetch from 'node-fetch';
import env from '../config/env';
import { ChickInRequest } from '../datasources/entity/pgsql/ChickInRequest.entity';
import { Coop } from '../datasources/entity/pgsql/Coop.entity';
import { DailyMonitoring } from '../datasources/entity/pgsql/DailyMonitoring.entity';
import { Farm } from '../datasources/entity/pgsql/Farm.entity';
import { FarmingCycle } from '../datasources/entity/pgsql/FarmingCycle.entity';
import { GoodsReceipt } from '../datasources/entity/pgsql/GoodsReceipt.entity';
import { PurchaseRequest } from '../datasources/entity/pgsql/PurchaseRequest.entity';
import { Repopulation } from '../datasources/entity/pgsql/Repopulation.entity';
import { TransferRequest } from '../datasources/entity/pgsql/TransferRequest.entity';
import { User } from '../datasources/entity/pgsql/User.entity';
import { InternalUpsertProductItem } from '../dto/product.dto';
import { DATETIME_SQL_FORMAT } from '../libs/constants';

export type ErpDailyMonitoringCreated = {
  id: number;
  dailyMonitoringCode: string;
  coopCopde: string;
  date: string;
  mortality: number;
  culling: number;
  feedTypeCode: string;
  feedQuantity: number;
  secondDailyMonitoring: boolean;
  bw: number;
};
@Service()
export class ErpDAO {
  async updateUser(data: User) {
    const body = {
      code: data.userCode,
      phone: data.phoneNumber,
      name: data.fullName,
      email: data.email,
      createdAt: format(new Date(data.createdDate), DATETIME_SQL_FORMAT),
      modifiedAt: format(new Date(data.modifiedDate), DATETIME_SQL_FORMAT),
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
    };

    const result = await ErpDAO.post('/farm_updated', body);

    return result;
  }

  async updateCoop(data: Coop) {
    const body = {
      code: data.coopCode,
      name: data.coopName,
      coopType: data.coopType.coopTypeName.toUpperCase(),
      chickType: data.chickType.chickTypeName.toUpperCase(),
      lat: data.farm.latitude,
      long: data.farm.longitude,
      farmCode: data.farm.farmCode,
      createdAt: format(new Date(data.createdDate), DATETIME_SQL_FORMAT),
      updatedAt: format(new Date(data.modifiedDate), DATETIME_SQL_FORMAT),
      active: data.status,
    };

    const result = await ErpDAO.post('/coop_updated', body);

    return result;
  }

  async createFarmingCycle(fc: FarmingCycle, chickInReq: ChickInRequest) {
    const body = {
      code: fc.farmingCycleCode,
      chickInDatePlan: chickInReq.chickInDate,
      chickInDateApproved: chickInReq.approvedDate ?? '',
      initialPopulation: chickInReq.initialPopulation,
      pola: fc.coop?.contract.contractType.contractName.toUpperCase(),
      owner: [
        {
          code: fc.farm.owner.userCode,
          phone: fc.farm.owner.phoneNumber,
          name: fc.farm.owner.fullName,
          email: fc.farm.owner.email,
          createdAt: format(fc.farm.owner.createdDate, DATETIME_SQL_FORMAT),
          modifiedAt: format(fc.farm.owner.modifiedDate, DATETIME_SQL_FORMAT),
        },
      ],
      farm: [
        {
          name: fc.farm.farmName,
          code: fc.farm.farmCode,
          branchCode: fc.farm.branch?.code,
          street: fc.farm.addressName ?? '',
          street2: `${fc.farm.address1 ?? ''} ${fc.farm.address2 ?? ''}`,
          ownerCode: fc.farm.owner.userCode,
          createdAt: format(fc.farm.createdDate, DATETIME_SQL_FORMAT),
          modifiedAt: format(fc.farm.modifiedDate, DATETIME_SQL_FORMAT),
        },
      ],
      coop: [
        {
          code: fc.coop.coopCode,
          name: fc.coop.coopName,
          coopType: fc.coop.coopType.coopTypeName.toUpperCase(),
          chickType: fc.chickType?.chickTypeName?.toUpperCase(),
          lat: fc.farm.latitude,
          long: fc.farm.longitude,
          farmCode: fc.farm.farmCode,
          createdAt: format(fc.coop.createdDate, DATETIME_SQL_FORMAT),
          modifiedAt: format(fc.coop.modifiedDate, DATETIME_SQL_FORMAT),
        },
      ],
    };

    const result = await ErpDAO.post('/farming_cycle_created', body);

    return result;
  }

  async createPurchaseRequest(data: PurchaseRequest): Promise<string> {
    const requestSchedule = data.chickInRequest
      ? data.chickInRequest.approvedDate
      : data.requestSchedule;

    const body = {
      farmingCycleCode: data.farmingCycle.farmingCycleCode,
      requestSchedule,
      requestedBy: `${data.userCreator.fullName} - ${data.userCreator.phoneNumber}`,
      approvedBy: `${data.userApprover.fullName} - ${data.userApprover.phoneNumber}}`,
      details: data.products.map((p) => ({
        categoryCode: p.categoryCode,
        subcategoryCode: p.subcategoryCode,
        productCode: p.productCode ?? '',
        quantity: p.quantity,
      })),
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

  async createTransferRequest(data: TransferRequest): Promise<string> {
    const body = {
      coopCodeSource: data.coopSource.coopCode,
      coopCodeTarget: data.coopTarget.coopCode,
      subcategoryCode: data.subcategoryCode,
      quantity: data.quantity,
      requestedBy: `${data.userRequester.fullName} - ${data.userRequester.phoneNumber}`,
      approvedBy: `${data.userApprover.fullName} - ${data.userApprover.phoneNumber}`,
      logistic: data.logisticOption,
    };

    const result = await ErpDAO.post('/transfer_request', body);

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

  async createGoodsReceipt(data: GoodsReceipt): Promise<string> {
    let source = 'purchase_order';

    if (data.transferRequestId && !data.purchaseOrderId) {
      source = 'transfer_request';
    }

    const body = {
      source,
      purchaseOrderCode: data.purchaseOrder?.erpCode || '',
      transferRequestCode: data.transferRequest?.erpCode || '',
      details: data.goodsReceiptProducts.map((grp) => ({
        categoryCode: grp.categoryCode,
        subcategoryCode: grp.subcategoryCode,
        productCode: grp.productCode,
        quantity: grp.quantity,
      })),
    };

    const result = await ErpDAO.post('/good_received_confirmation', body);

    return result?.data?.picking_code;
  }

  async createRepopulation(farmingCycleCode: string, repopulation: Repopulation) {
    const body = {
      farmingCycleCode,
      date: format(repopulation.repopulateDate, DATETIME_SQL_FORMAT),
      qtyRepopulation: repopulation.approvedAmount,
      reason: repopulation.repopulateReason,
    };

    const result = await ErpDAO.post('/farming_cycle_repopulation', body);

    return result;
  }

  async closeFarmingCycle(
    fc: FarmingCycle,
    latestDailyMonitoring: DailyMonitoring,
    feed: number,
    tonnage: number,
    fcrStd: number,
  ) {
    const body = {
      initialPopulation: fc.initialPopulation,
      finalPopulation: fc.initialPopulation - (latestDailyMonitoring.populationMortaled || 0),
      tonnage,
      averageAge: latestDailyMonitoring.averageChickenAge,
      feed,
      fcrAct: latestDailyMonitoring.fcr,
      fcrStd,
      deplesi: latestDailyMonitoring.populationMortaled,
      ip: latestDailyMonitoring.ip,
    };

    const result = await ErpDAO.post('/farming_cycle_closing', body);

    return result;
  }

  async getAllActiveProducts(): Promise<InternalUpsertProductItem[]> {
    const result = await ErpDAO.get('/product_get');

    return result?.data as InternalUpsertProductItem[];
  }

  protected static async post(path: string, body: any): Promise<any> {
    const response = await fetch(`${env.HOST_ERP_V1}${path}`, {
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.API_KEY_ERP,
      },
    });

    const result = await response.json();

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
  }

  protected static async get(path: string): Promise<any> {
    const response = await fetch(`${env.HOST_ERP_V1}${path}`, {
      method: 'get',
      headers: {
        'x-api-key': env.API_KEY_ERP,
      },
    });

    const result = await response.json();

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
  }
}
