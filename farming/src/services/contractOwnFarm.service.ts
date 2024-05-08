import { Inject, Service } from 'fastify-decorators';
import { IsNull, Not } from 'typeorm';
import { ContractDAO } from '../dao/contract.dao';
import { ContractBopDAO } from '../dao/contractBop.dao';
import { ContractOwnFarmDAO } from '../dao/contractOwnFarm.dao';
import { ContractPaymentTermDAO } from '../dao/contractPaymentTerm.dao';
import { ContractTypeDAO } from '../dao/contractType.dao';
import { CoopDAO } from '../dao/coop.dao';
import { Contract } from '../datasources/entity/pgsql/Contract.entity';
import { ContractBOP, ContractPaymentTerms, ContractUpdateParams } from '../dto/contract.dto';
import { ContractOwnFarmInput } from '../dto/contractOwnFarm.dto';
import { CONTRACT_CODE, CONTRACT_TYPE, UOM_CONTRACT } from '../libs/constants';
import { ERR_CONTRACT_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';

@Service()
export class ContractOwnFarmService {
  @Inject(ContractDAO)
  private contractDAO: ContractDAO;

  @Inject(ContractBopDAO)
  private contractBopDAO: ContractBopDAO;

  @Inject(ContractPaymentTermDAO)
  private contractPaymentTermDAO: ContractPaymentTermDAO;

  @Inject(ContractOwnFarmDAO)
  private contractOwnFarmDAO: ContractOwnFarmDAO;

  @Inject(ContractTypeDAO)
  private contractTypeDAO: ContractTypeDAO;

  @Inject(CoopDAO)
  private coopDAO: CoopDAO;

  async create(input: ContractOwnFarmInput, user: RequestUser): Promise<Contract> {
    const contractType = await this.contractTypeDAO.getOneStrict({
      where: {
        contractName: CONTRACT_TYPE.OWN_FARM,
      },
    });

    const coop = await this.coopDAO.getOne({
      where: {
        id: input.coopId,
      },
      relations: {
        farm: true,
      },
    });

    const getOneOwnFarm = await this.contractDAO.getOne({
      where: {
        id: Not(IsNull()),
      },
      order: { seqNo: 'DESC' },
    });

    const payloadContract: Partial<ContractOwnFarmInput> = {
      code: `${CONTRACT_CODE.OWN_FARM}${getOneOwnFarm!.seqNo + 1}`,
      refContractTypeId: contractType.id,
      customize: input.customize,
      coopId: input.coopId,
      branchId: coop?.farm.branchId,
      effectiveStartDate: input.effectiveStartDate,
      contractTag: CONTRACT_TYPE.OWN_FARM,
    };

    if (input.customize) {
      payloadContract.refContractParent = input.refContractParent;
    }

    const contract = await this.contractDAO.createOne(payloadContract, user);

    const { id } = contract;
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

    const paymentTerms: ContractPaymentTerms[] = [];
    if (input.paymentTerms) {
      input.paymentTerms.forEach((item) => {
        paymentTerms.push({
          paymentTerm: item.paymentTerm,
          amount: item.amount,
          uom: item.uom || UOM_CONTRACT.EKOR,
          refContractId: id,
        });
      });

      await this.contractPaymentTermDAO.createMany(paymentTerms, user);
    }

    return contract;
  }

  async update(contractId: string, input: Partial<ContractOwnFarmInput>, user: RequestUser) {
    const getOneOwnFarm = await this.contractDAO.getOne({
      where: {
        id: contractId,
        branchId: Not(IsNull()),
      },
      order: { seqNo: 'DESC' },
    });

    if (!getOneOwnFarm) {
      throw ERR_CONTRACT_NOT_FOUND();
    }

    await this.contractDAO.update(
      contractId,
      {
        code: `${CONTRACT_CODE.OWN_FARM}${getOneOwnFarm!.seqNo + 1}`,
        refContractTypeId: input.refContractTypeId,
        customize: false,
        coopId: input.coopId,
        effectiveStartDate: input.effectiveStartDate,
      },
      user,
    );

    const { id } = getOneOwnFarm;
    const paramsUpdate: Partial<ContractUpdateParams> = { refContractId: contractId };
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

    const paymentTerms: ContractPaymentTerms[] = [];
    if (input.paymentTerms) {
      const ids: string[] | undefined = [];
      input.paymentTerms.forEach((item) => {
        ids.push(item.id || '');
        paymentTerms.push({
          id: item.id,
          paymentTerm: item.paymentTerm,
          amount: item.amount,
          uom: item.uom || UOM_CONTRACT.EKOR,
          refContractId: id,
        });
      });
      const ID = ids.filter((x) => x);

      await this.contractPaymentTermDAO.deleteBulk(ID, id);

      await this.contractPaymentTermDAO.upsert(paymentTerms, user);
    }

    return this.contractOwnFarmDAO.getOneOwnFarm(contractId);
  }

  async getConstraintContract(params: string) {
    try {
      const detailOwnFarm = await this.contractOwnFarmDAO.getDetailOwnFarm(params);

      return detailOwnFarm;
    } catch (error) {
      throw ERR_CONTRACT_NOT_FOUND(error.message);
    }
  }

  async getOneStrict(params: string) {
    const ownFarm = await this.contractOwnFarmDAO.getOneOwnFarm(params);
    return ownFarm;
  }
}
