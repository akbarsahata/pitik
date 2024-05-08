/* eslint-disable no-case-declarations */
import { JobsOptions } from 'bullmq';
import { Inject, Service } from 'fastify-decorators';
import { ContractCostPlusDAO } from '../../dao/contractCostPlus.dao';
import { ContractMitraGaransiDAO } from '../../dao/contractMitraGaransi.dao';
import { CoopDAO } from '../../dao/coop.dao';
import { ErpContractDAO } from '../../dao/erpContract.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
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

  @Inject(ErpContractDAO)
  private erpContractDAO!: ErpContractDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(Logger)
  private logger: Logger;

  protected workerName = QUEUE_CONTRACT_CREATED;

  protected async handle(
    data: FarmingCycle,
    attemptsMade: number,
    opts: JobsOptions,
    jobId?: string,
  ) {
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
            coopCode: coopInfo.coopCode || '',
            code: String(coopInfo.seqNo),
          });
          break;
      }

      return result;
    } catch (error) {
      this.logger.error(error);

      if (attemptsMade === opts.attempts) {
        await this.slackDAO.alertFailedJobs(this.workerName, error, data, jobId);
      }

      throw error;
    }
  }
}
