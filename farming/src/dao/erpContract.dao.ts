/* eslint-disable class-methods-use-this */
import { Service } from 'fastify-decorators';
import {
  ContractCostPlusPayload,
  ContractMitragaransiPayload,
  ContractOwnFarmPayload,
} from '../datasources/entity/erp/ERPProduct';
import { ContractChickenPriceInput, ContractInsentiveDealsInput } from '../dto/contract.dto';
import { CONTRACT_CHICKEN_PRICE, CONTRACT_INCENTIVE } from '../libs/constants';
import { ErpDAO } from './erp.dao';

@Service()
export class ErpContractDAO extends ErpDAO {
  async createContractMitraGaransi(body: ContractMitragaransiPayload) {
    const chickenPrice = body.chickenPrice.map(
      (item: Partial<ContractChickenPriceInput>): Partial<ContractChickenPriceInput> => {
        const row = { ...item };
        if (item.lowerRange === CONTRACT_CHICKEN_PRICE.LOWER_RANGE) {
          row.lowerRange = CONTRACT_CHICKEN_PRICE.LOWER_RANGE_VALUE;
        }

        if (item.upperRange === CONTRACT_CHICKEN_PRICE.UPPER_RANGE) {
          row.upperRange = CONTRACT_CHICKEN_PRICE.UPPER_RANGE_VALUE;
        }

        return row;
      },
    );

    const incentive = body.incentive.map(
      (item: Partial<ContractInsentiveDealsInput>): Partial<ContractInsentiveDealsInput> => {
        const row = { ...item };
        if (item.lowerIp === CONTRACT_INCENTIVE.LOWER_IP) {
          row.lowerIp = CONTRACT_INCENTIVE.LOWER_IP_VALUE;
        }

        if (item.upperIp === CONTRACT_INCENTIVE.UPPER_IP) {
          row.upperIp = CONTRACT_INCENTIVE.UPPER_IP_VALUE;
        }

        return row;
      },
    );

    const result = await ErpContractDAO.post('/contract_mitra_garansi', {
      active: body.active,
      contractCode: body.contractCode,
      areaCode: body.areaCode,
      code: body.code,
      coopCode: body.coopCode,
      state: body.state,
      customContract: body.customContract,
      branchCode: body.branchCode,
      polaCode: body.polaCode.toUpperCase(),
      startDate: body.startDate,
      endDate: body.endDate,
      savingPercent: body.savingPercent,
      minimumProfit: body.minimumProfit,
      deductionPercent: body.deductionPercent,
      insentifPasarPercent: body.insentifPasarPercent || 0,
      insentifPasarMinIP: body.insentifPasarMinIP,
      sapronak: body.sapronak,
      chickenPrice,
      incentive,
    });
    return result;
  }

  async createContractCostPlus(body: ContractCostPlusPayload) {
    const chickenPrice = body.chickenPrice.map(
      (item: Partial<ContractChickenPriceInput>): Partial<ContractChickenPriceInput> => {
        const row = { ...item };
        if (item.lowerRange === CONTRACT_CHICKEN_PRICE.LOWER_RANGE) {
          row.lowerRange = CONTRACT_CHICKEN_PRICE.LOWER_RANGE_VALUE;
        }

        if (item.upperRange === CONTRACT_CHICKEN_PRICE.UPPER_RANGE) {
          row.upperRange = CONTRACT_CHICKEN_PRICE.UPPER_RANGE_VALUE;
        }

        return row;
      },
    );

    const incentive = body.incentive.map(
      (item: Partial<ContractInsentiveDealsInput>): Partial<ContractInsentiveDealsInput> => {
        const row = { ...item };
        if (item.lowerIp === CONTRACT_INCENTIVE.LOWER_IP) {
          row.lowerIp = CONTRACT_INCENTIVE.LOWER_IP_VALUE;
        }

        if (item.upperIp === CONTRACT_INCENTIVE.UPPER_IP) {
          row.upperIp = CONTRACT_INCENTIVE.UPPER_IP_VALUE;
        }

        return row;
      },
    );

    const bop = body.bop.map((item) => {
      const row = {
        bopNo: item.bopNo,
        dayAfterChickInDate: item.dayAfterChickInDate,
        minIp: item.minIp,
        price: item.price,
      };

      return row;
    });

    const bodyPayload = {
      active: body.active,
      contractCode: body.contractCode,
      areaCode: body.areaCode,
      code: body.code,
      coopCode: body.coopCode || '',
      customContract: body.customContract,
      branchCode: body.branchCode,
      polaCode: body.polaCode.toUpperCase(),
      startDate: body.startDate,
      endDate: body.endDate,
      savingPercent: body.savingPercent,
      minimumProfit: body.minimumProfit,
      deductionPercent: body.deductionPercent || 0,
      insentifPasarPercent: body.insentifPasarPercent || 0,
      insentifPasarMinIP: body.insentifPasarMinIP,
      sapronak: body.sapronak,
      chickenPrice,
      incentive,
      bop,
      bop3: body.bop3?.length > 0 ? body.bop3 : undefined,
    };

    const result = await ErpContractDAO.post('/contract_cost_plus', bodyPayload);

    return result;
  }

  async createContractOwnFarm(body: ContractOwnFarmPayload) {
    const bop = body.bop.map((item) => {
      const row = {
        bopNo: item.bopNo ?? '',
        dayAfterChickInDate: item.dayAfterChickInDate ?? 0,
        minIp: item.minIp ?? 0,
        price: item.price ?? 0,
      };

      return row;
    });

    const result = await ErpContractDAO.post('/contract_own_farm', {
      active: body.active,
      contractCode: body.contractCode,
      areaCode: body.areaCode,
      code: body.code,
      coopCode: body.coopCode,
      state: body.state,
      customContract: body.customContract,
      branchCode: body.branchCode,
      farmingCycleCode: body.farmingCycleCode,
      polaCode: body.polaCode.toUpperCase(),
      startDate: body.startDate,
      endDate: body.endDate,
      savingPercent: body.savingPercent,
      minimumProfit: body.minimumProfit,
      deductionPercent: body.deductionPercent,
      insentifPasarPercent: body.insentifPasarPercent || 0,
      insentifPasarMinIP: body.insentifPasarMinIP,
      bop,
    });
    return result;
  }
}
