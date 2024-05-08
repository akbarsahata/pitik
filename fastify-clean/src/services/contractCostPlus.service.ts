import { Inject, Service } from 'fastify-decorators';
import { IsNull, Not } from 'typeorm';
import env from '../config/env';
import { ContractDAO } from '../dao/contract.dao';
import { ContractBopDAO } from '../dao/contractBop.dao';
import { ContractCostPlusDAO } from '../dao/contractCostPlus.dao';
import { ContractDeductionFcBopDAO } from '../dao/contractDeductionFcBop.dao';
import { ContractInsentiveDealsDAO } from '../dao/contractInsentiveDeals.dao';
import { ContractMarketInsentiveDAO } from '../dao/contractMarketInsentive.dao';
import { ContractSapronakDAO } from '../dao/contractSapronak.dao';
import { ContractTypeDAO } from '../dao/contractType.dao';
import { CoopDAO } from '../dao/coop.dao';
import { ErpContractDAO } from '../dao/erpContract.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { Contract } from '../datasources/entity/pgsql/Contract.entity';
import {
  ContractBOP,
  ContractDeductionFcBopInputDTO,
  ContractInsentiveDealsInput,
  ContractMarketInsentiveInput,
  ContractSapronakInput,
  ContractUpdateParams,
} from '../dto/contract.dto';
import { ContractCostPlusInput } from '../dto/contractCostPlus.dto';
import { CONTRACT_CODE, CONTRACT_TYPE, UOM_CONTRACT } from '../libs/constants';
import { ERR_CONTRACT_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';

@Service()
export class ContractCostPlusService {
  @Inject(ContractDAO)
  private contractDAO: ContractDAO;

  @Inject(ContractSapronakDAO)
  private contractSapronakDAO: ContractSapronakDAO;

  @Inject(ContractBopDAO)
  private contractBopDAO: ContractBopDAO;

  @Inject(ContractInsentiveDealsDAO)
  private contractInsentiveDealsDAO: ContractInsentiveDealsDAO;

  @Inject(ContractDeductionFcBopDAO)
  private contractDeductionFcBopDAO: ContractDeductionFcBopDAO;

  @Inject(ContractMarketInsentiveDAO)
  private contractMarketInsentiveDAO: ContractMarketInsentiveDAO;

  @Inject(ContractCostPlusDAO)
  private contractCostPlusDAO: ContractCostPlusDAO;

  @Inject(ContractTypeDAO)
  private contractTypeDAO: ContractTypeDAO;

  @Inject(CoopDAO)
  private coopDAO: CoopDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(ErpContractDAO)
  private erpContractDAO!: ErpContractDAO;

  async create(input: ContractCostPlusInput, user: RequestUser): Promise<Contract> {
    const contractType = await this.contractTypeDAO.getOneStrict({
      where: {
        contractName: CONTRACT_TYPE.COST_PLUS,
      },
    });

    const getOneCostPlus = await this.contractDAO.getOne({
      where: {
        id: Not(IsNull()),
      },
      order: { seqNo: 'DESC' },
    });

    const coop = await this.coopDAO.getOne({
      where: {
        farm: {
          branchId: input.branchId,
        },
      },
      relations: {
        farm: true,
      },
    });

    const payloadContract: Partial<ContractCostPlusInput> = {
      code: `${CONTRACT_CODE.COST_PLUS}${getOneCostPlus!.seqNo + 1}`,
      refContractTypeId: contractType.id,
      customize: input.customize,
      branchId: input.branchId,
      coopId: input.coopId || coop?.id,
      effectiveStartDate: input.effectiveStartDate,
      contractTag: CONTRACT_TYPE.COST_PLUS,
    };

    if (input.customize) {
      payloadContract.refContractParent = input.refContractParent;
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

    const bop: ContractBOP[] = [];

    if (input.bop) {
      input.bop.forEach((item) => {
        bop.push({
          preConditions: item.preConditions || 0,
          bop: item.bop,
          amount: item.amount,
          paymentTerm: item.paymentTerm,
          refContractId: id,
        });
      });

      await this.contractBopDAO.createMany(bop, user);
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

    const contractDeductionFcBop: ContractDeductionFcBopInputDTO[] = [];
    if (input.contractDeductionFcBop) {
      input.contractDeductionFcBop.forEach((item) => {
        contractDeductionFcBop.push({
          lossDeductionProfit: item.lossDeductionProfit || 0,
          lossDeductionBop: item.lossDeductionBop,
          uomLoss: UOM_CONTRACT.EKOR,
          uomBop: UOM_CONTRACT.KG,
          bop: item.bop,
          refContractId: id,
        });
      });

      await this.contractDeductionFcBopDAO.createMany(contractDeductionFcBop, user);
    }

    if (input.contractMarketInsentive) {
      const contractMarketInsentive: ContractMarketInsentiveInput = {
        rangeIp: input.contractMarketInsentive.rangeIp,
        insentivePrecentage: input.contractMarketInsentive.insentivePrecentage,
        refContractId: id,
      };

      await this.contractMarketInsentiveDAO.createOne(contractMarketInsentive, user);
    }

    if (env.USE_ERP && contract.customize) {
      const farmingCycleInfo = await this.farmingCycleDAO.getOne({
        where: {
          coopId: coop?.id,
        },
      });
      const payloadERP = await this.contractCostPlusDAO.payloadErpCostPlus(contract.id);

      await this.erpContractDAO.createContractCostPlus({
        ...payloadERP,
        farmingCycleCode: farmingCycleInfo?.farmingCycleCode || '',
        coopCode: coop?.coopCode || '',
        code: String(coop?.seqNo),
      });
    }

    return contract;
  }

  async update(contractId: string, input: Partial<ContractCostPlusInput>, user: RequestUser) {
    const getOneCostPlus = await this.contractDAO.getOne({
      where: {
        id: contractId,
        branchId: Not(IsNull()),
      },
      order: { seqNo: 'DESC' },
    });

    if (!getOneCostPlus) {
      throw ERR_CONTRACT_NOT_FOUND();
    }

    await this.contractDAO.update(
      contractId,
      {
        code: `${CONTRACT_CODE.COST_PLUS}${getOneCostPlus!.seqNo + 1}`,
        refContractTypeId: input.refContractTypeId,
        customize: false,
        branchId: input.branchId,
        effectiveStartDate: input.effectiveStartDate,
      },
      user,
    );

    const { id } = getOneCostPlus;
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
          refContractId: id,
        });
      });

      await this.contractSapronakDAO.updateMultiple(paramsUpdate, sapronak, user);
    }

    const bop: ContractBOP[] = [];
    if (input.bop) {
      input.bop.forEach((item) => {
        bop.push({
          id: item.id,
          preConditions: item.preConditions || 0,
          bop: item.bop,
          amount: item.amount,
          paymentTerm: item.paymentTerm,
          refContractId: id,
        });
      });

      await this.contractBopDAO.updateMultiple(paramsUpdate, bop, user);
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

    const contractDeductionFcBop: ContractDeductionFcBopInputDTO[] = [];
    if (input.contractDeductionFcBop) {
      input.contractDeductionFcBop.forEach((item) => {
        contractDeductionFcBop.push({
          id: item.id,
          lossDeductionProfit: item.lossDeductionProfit || 0,
          lossDeductionBop: item.lossDeductionBop,
          uomLoss: UOM_CONTRACT.EKOR,
          uomBop: UOM_CONTRACT.KG,
          bop: item.bop,
          refContractId: id,
        });
      });

      await this.contractDeductionFcBopDAO.updateMultiple(
        paramsUpdate,
        contractDeductionFcBop,
        user,
      );
    }

    if (input.contractMarketInsentive) {
      paramsUpdate.id = input.contractMarketInsentive.id;
      const contractMarketInsentive: ContractMarketInsentiveInput = {
        rangeIp: input.contractMarketInsentive.rangeIp,
        insentivePrecentage: input.contractMarketInsentive.insentivePrecentage,
        refContractId: id,
      };

      await this.contractMarketInsentiveDAO.update(paramsUpdate, contractMarketInsentive, user);
    }

    const costPlus = await this.contractCostPlusDAO.getOneCostPlus(contractId);
    return costPlus;
  }

  async getConstraintContract(params: string) {
    try {
      const mitraGaransi = await this.contractCostPlusDAO.getDetailCostPlus(params);
      return mitraGaransi;
    } catch (error) {
      throw ERR_CONTRACT_NOT_FOUND(error.message);
    }
  }

  async getOneStrict(params: string) {
    const costPlus = await this.contractCostPlusDAO.getOneCostPlus(params);
    return costPlus;
  }
}
