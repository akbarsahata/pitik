import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { EntityNotFoundError, IsNull, Not } from 'typeorm';
import env from '../config/env';
import { ContractDAO } from '../dao/contract.dao';
import { ContractChickenPriceDAO } from '../dao/contractChickenPrice.dao';
import { ContractDeductionFcDAO } from '../dao/contractDeductionFc.dao';
import { ContractHistoryDAO } from '../dao/contractHistory.dao';
import { ContractInsentiveDealsDAO } from '../dao/contractInsentiveDeals.dao';
import { ContractMarketInsentiveDAO } from '../dao/contractMarketInsentive.dao';
import { ContractMitraGaransiDAO } from '../dao/contractMitraGaransi.dao';
import { ContractSapronakDAO } from '../dao/contractSapronak.dao';
import { ContractSavingDAO } from '../dao/contractSaving.dao';
import { ContractTypeDAO } from '../dao/contractType.dao';
import { CoopDAO } from '../dao/coop.dao';
import { ErpContractDAO } from '../dao/erpContract.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { Contract } from '../datasources/entity/pgsql/Contract.entity';
import {
  ContractChickenPriceInput,
  ContractDeductionFcInput,
  ContractInsentiveDealsInput,
  ContractMarketInsentiveInput,
  ContractSapronakInput,
  ContractSavingInput,
  ContractUpdateParams,
} from '../dto/contract.dto';
import { ContractMitraGaransiInput } from '../dto/contractMitraGaransi.dto';
import { CONTRACT_CODE, CONTRACT_TYPE, DEFAULT_TIME_ZONE, UOM_CONTRACT } from '../libs/constants';
import { ERR_CONTRACT_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';

@Service()
export class ContractMitraGaransiService {
  @Inject(ContractDAO)
  private contractDAO: ContractDAO;

  @Inject(ContractSapronakDAO)
  private contractSapronakDAO: ContractSapronakDAO;

  @Inject(ContractInsentiveDealsDAO)
  private contractInsentiveDealsDAO: ContractInsentiveDealsDAO;

  @Inject(ContractSavingDAO)
  private contractSavingDAO: ContractSavingDAO;

  @Inject(ContractDeductionFcDAO)
  private contractDeductionFcDAO: ContractDeductionFcDAO;

  @Inject(ContractMarketInsentiveDAO)
  private contractMarketInsentiveDAO: ContractMarketInsentiveDAO;

  @Inject(ContractMitraGaransiDAO)
  private contractMitraGaransiDAO: ContractMitraGaransiDAO;

  @Inject(ContractChickenPriceDAO)
  private contractChickenPriceDAO: ContractChickenPriceDAO;

  @Inject(ContractTypeDAO)
  private contractTypeDAO: ContractTypeDAO;

  @Inject(ContractHistoryDAO)
  private contractHistoryDAO: ContractHistoryDAO;

  @Inject(CoopDAO)
  private coopDAO: CoopDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(ErpContractDAO)
  private erpContractDAO!: ErpContractDAO;

  async create(input: ContractMitraGaransiInput, user: RequestUser): Promise<Contract> {
    const contractType = await this.contractTypeDAO.getOneStrict({
      where: {
        contractName: CONTRACT_TYPE.MITRA_GARANSI,
      },
    });

    const getOneMitragaransi = await this.contractDAO.getOne({
      where: {
        id: Not(IsNull()),
      },
      order: { seqNo: 'DESC' },
    });

    const coop = await this.coopDAO.getOne({
      where: {
        contract: {
          branchId: input.branchId,
        },
      },
      relations: {
        contract: true,
      },
    });

    const payloadContract: Partial<ContractMitraGaransiInput> = {
      code: `${CONTRACT_CODE.MITRA_GARANSI}${((getOneMitragaransi || {}).seqNo || 0) + 1}`,
      refContractTypeId: contractType.id,
      customize: input.customize,
      branchId: input.branchId,
      coopId: input.coopId || coop?.id,
      effectiveStartDate: input.effectiveStartDate,
      contractTag: CONTRACT_TYPE.MITRA_GARANSI,
    };

    if (input.customize) {
      payloadContract.refContractParent = input.refContractParent;
      payloadContract.coopId = input.coopId;
    }
    const contract = await this.contractDAO.createOne(payloadContract, user);

    const { id } = contract;

    const sapronak: ContractSapronakInput[] = [];
    if (input.sapronak) {
      input.sapronak.forEach((item) => {
        sapronak.push({
          categoryCode: item.categoryCode,
          subcategoryCode: item.subcategoryCode,
          price: item.price,
          uom: item.uom,
          refContractId: id,
        });
      });

      await this.contractSapronakDAO.createMany(sapronak, user);
    }

    const chickenPrice: ContractChickenPriceInput[] = [];
    if (input.chickenPrice) {
      input.chickenPrice.forEach((item) => {
        chickenPrice.push({
          lowerRange: item.lowerRange,
          upperRange: item.upperRange,
          price: item.price,
          uom: UOM_CONTRACT.KG,
          refContractId: id,
        });
      });

      await this.contractChickenPriceDAO.createMany(chickenPrice, user);
    }

    const insentiveDeals: ContractInsentiveDealsInput[] = [];
    if (input.insentiveDeals) {
      input.insentiveDeals.forEach((item) => {
        insentiveDeals.push({
          lowerIp: item.lowerIp,
          upperIp: item.upperIp,
          price: item.price,
          uom: UOM_CONTRACT.KG,
          refContractId: id,
        });
      });

      await this.contractInsentiveDealsDAO.createMany(insentiveDeals, user);
    }

    if (input.saving) {
      const contractSaving: ContractSavingInput = {
        precentage: input.saving.precentage,
        minimumProfit: input.saving.minimumProfit,
        uom: UOM_CONTRACT.PERCENT,
        refContractId: id,
      };

      await this.contractSavingDAO.createOne(contractSaving, user);
    }

    if (input.deductionDueToFarmingCycleLoss) {
      const contractDeductionFc: ContractDeductionFcInput = {
        precentage: input.deductionDueToFarmingCycleLoss?.precentage,
        minimumProfit: input.deductionDueToFarmingCycleLoss?.minimumProfit,
        uom: UOM_CONTRACT.PERCENT,
        refContractId: id,
      };

      await this.contractDeductionFcDAO.createOne(contractDeductionFc, user);
    }

    if (input.contractMarketInsentive) {
      const contractMarketInsentive: ContractMarketInsentiveInput = {
        rangeIp: input.contractMarketInsentive.rangeIp,
        insentivePrecentage: input.contractMarketInsentive.insentivePrecentage,
        refContractId: id,
      };

      await this.contractMarketInsentiveDAO.createOne(contractMarketInsentive, user);
    }

    // todo uncoment if odoo ready
    if (env.USE_ERP && contract.customize) {
      const farmingCycleInfo = await this.farmingCycleDAO.getOne({
        where: {
          coopId: coop?.id,
        },
      });
      const payloadERP = await this.contractMitraGaransiDAO.payloadErpMitraGaransi(contract.id);
      await this.erpContractDAO.createContractMitraGaransi({
        ...payloadERP,
        farmingCycleCode: farmingCycleInfo?.farmingCycleCode || '',
        coopCode: coop?.coopCode || '',
        code: String(coop?.seqNo),
      });
    }

    return contract;
  }

  async update(contractId: string, input: Partial<ContractMitraGaransiInput>, user: RequestUser) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const getOneMitragaransi = await this.contractDAO.getOne({
      where: {
        id: contractId,
        branchId: Not(IsNull()),
      },
      order: { seqNo: 'DESC' },
    });

    if (!getOneMitragaransi) {
      throw ERR_CONTRACT_NOT_FOUND();
    }

    await this.contractDAO.update(contractId, input, user);

    const { id } = getOneMitragaransi;
    const sapronak: ContractSapronakInput[] = [];
    const paramsUpdate: Partial<ContractUpdateParams> = {
      refContractId: contractId,
    };
    if (input.sapronak) {
      input.sapronak.forEach((item) => {
        sapronak.push({
          id: item.id,
          categoryCode: item.categoryCode,
          subcategoryCode: item.subcategoryCode,
          price: item.price,
          uom: item.uom,
          refContractId: contractId,
        });
      });
      await this.contractSapronakDAO.updateMultiple(paramsUpdate, sapronak, user);
    }
    // TODO: update to use transactions
    const chickenPrice: ContractChickenPriceInput[] = [];
    if (input.chickenPrice) {
      input.chickenPrice.forEach((item) => {
        chickenPrice.push({
          id: item.id,
          lowerRange: item.lowerRange,
          upperRange: item.upperRange,
          price: item.price,
          uom: UOM_CONTRACT.KG,
          refContractId: id,
        });
      });

      await this.contractChickenPriceDAO.updateMultiple(paramsUpdate, chickenPrice, user);
    }

    const insentiveDeals: ContractInsentiveDealsInput[] = [];
    if (input.insentiveDeals) {
      input.insentiveDeals.forEach((item) => {
        insentiveDeals.push({
          id: item.id,
          lowerIp: item.lowerIp,
          upperIp: item.upperIp,
          price: item.price,
          uom: UOM_CONTRACT.KG,
          refContractId: id,
        });
      });

      await this.contractInsentiveDealsDAO.updateMultiple(paramsUpdate, insentiveDeals, user);
    }

    if (input.saving) {
      paramsUpdate.id = input.saving.id;
      const contractSaving: ContractSavingInput = {
        precentage: input.saving.precentage,
        minimumProfit: input.saving.minimumProfit,
        uom: UOM_CONTRACT.PERCENT,
        refContractId: id,
      };

      await this.contractSavingDAO.update(paramsUpdate, contractSaving, user);
    }

    if (input.deductionDueToFarmingCycleLoss) {
      paramsUpdate.id = input.deductionDueToFarmingCycleLoss.id;
      const contractDeductionFc: ContractDeductionFcInput = {
        precentage: input.deductionDueToFarmingCycleLoss?.precentage,
        minimumProfit: input.deductionDueToFarmingCycleLoss?.minimumProfit,
        uom: UOM_CONTRACT.PERCENT,
        refContractId: id,
      };

      await this.contractDeductionFcDAO.update(paramsUpdate, contractDeductionFc, user);
    }

    if (input.contractMarketInsentive) {
      paramsUpdate.id = input.contractMarketInsentive.id;
      const contractMarketInsentive: Partial<ContractMarketInsentiveInput> = {
        rangeIp: input.contractMarketInsentive.rangeIp,
        insentivePrecentage: input.contractMarketInsentive?.insentivePrecentage,
        refContractId: id,
      };

      await this.contractMarketInsentiveDAO.update(paramsUpdate, contractMarketInsentive, user);
    }

    await this.contractHistoryDAO.createOne(
      {
        refContractId: id,
        changedItems: input,
        modifiedBy: user.id,
        modifiedDate: now,
      },
      user,
    );

    return this.contractMitraGaransiDAO.getOneMitraGaransi(id);
  }

  async getConstraintContract(params: string) {
    try {
      const mitraGaransi = await this.contractMitraGaransiDAO.getDetailMitraGaransi(params);
      return mitraGaransi;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_CONTRACT_NOT_FOUND();
      }

      throw error;
    }
  }

  async getOneStrict(params: string) {
    return this.contractMitraGaransiDAO.getOneMitraGaransi(params);
  }
}
