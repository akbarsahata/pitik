/* eslint-disable no-case-declarations */
import { captureException } from '@sentry/node';
import { Inject, Service } from 'fastify-decorators';
import env from '../../config/env';
import { ContractCostPlusDAO } from '../../dao/contractCostPlus.dao';
import { ContractMitraGaransiDAO } from '../../dao/contractMitraGaransi.dao';
import { ContractOwnFarmDAO } from '../../dao/contractOwnFarm.dao';
import { CoopDAO } from '../../dao/coop.dao';
import { ErpContractDAO } from '../../dao/erpContract.dao';
import { FarmingCycle } from '../../datasources/entity/pgsql/FarmingCycle.entity';
import { CONTRACT_TYPE } from '../../libs/constants';
import { QUEUE_CONTRACT_CREATED } from '../../libs/constants/queue';
import { Logger } from '../../libs/utils/logger';
import { BaseWorker } from './base.worker';

@Service()
export class ContractCreatedWorker extends BaseWorker<FarmingCycle> {
  @Inject(CoopDAO)
  private coopDAO: CoopDAO;

  @Inject(ContractMitraGaransiDAO)
  private contractMitraGaransiDAO!: ContractMitraGaransiDAO;

  @Inject(ContractCostPlusDAO)
  private contractCostPlusDAO!: ContractCostPlusDAO;

  @Inject(ContractOwnFarmDAO)
  private contractOwnFarmDAO!: ContractOwnFarmDAO;

  @Inject(ErpContractDAO)
  private erpContractDAO!: ErpContractDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_CONTRACT_CREATED;

  protected async handle(data: FarmingCycle) {
    // FIXME:  please remove conditional USE_ERP feature flag once flow with ODOO is ready
    if (!env.USE_ERP_CONTRACT) return false;

    try {
      let result;
      let payloadERP;

      const coopInfo = await this.coopDAO.getOneStrict({
        where: {
          id: data.coopId,
        },
      });

      switch (data.coop.contract?.contractTag) {
        case CONTRACT_TYPE.COST_PLUS:
          payloadERP = await this.contractCostPlusDAO.payloadErpCostPlus(data.contractId || '');

          result = await this.erpContractDAO.createContractCostPlus({
            ...payloadERP,
            farmingCycleCode: data.farmingCycleCode,
            coopCode: coopInfo.coopCode || '',
            code: String(coopInfo.seqNo),
          });
          break;

        case CONTRACT_TYPE.OWN_FARM:
          payloadERP = await this.contractOwnFarmDAO.payloadErpOwnFarm(data.contractId || '');

          result = await this.erpContractDAO.createContractOwnFarm({
            ...payloadERP,
            bop: payloadERP.bop.map((item) => {
              const row = {
                bopNo: item.bopNo ?? '',
                dayAfterChickInDate: item.dayAfterChickInDate ?? 0,
                minIp: item.minIp ?? 0,
                price: item.price ?? 0,
              };
              return row;
            }),
            farmingCycleCode: data.farmingCycleCode,
            coopCode: coopInfo.coopCode || '',
            code: String(coopInfo.seqNo),
          });
          break;

        default:
          payloadERP = await this.contractMitraGaransiDAO.payloadErpMitraGaransi(
            data.contractId || '',
          );

          result = await this.erpContractDAO.createContractMitraGaransi({
            ...payloadERP,
            farmingCycleCode: data.farmingCycleCode,
            coopCode: coopInfo.coopCode || '',
            code: String(coopInfo.seqNo),
          });
          break;
      }

      return result;
    } catch (error) {
      this.logger.error(error);

      captureException(error);

      throw error;
    }
  }
}
