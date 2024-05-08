import { Initializer, Inject, Service } from 'fastify-decorators';
import { EntityNotFoundError, IsNull, Not, Repository } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Contract } from '../datasources/entity/pgsql/Contract.entity';
import { ContractBop } from '../datasources/entity/pgsql/ContractBop.entity';
import { ContractChickenPrice } from '../datasources/entity/pgsql/ContractChickenPrice.entity';
import { ContractDeductionFcBop } from '../datasources/entity/pgsql/ContractDeductionFcBop.entity';
import { ContractInsentiveDeals } from '../datasources/entity/pgsql/ContractInsentiveDeals.entity';
import { ContractMarketInsentive } from '../datasources/entity/pgsql/ContractMarketInsentive.entity';
import { ContractSapronak } from '../datasources/entity/pgsql/ContractSapronak.entity';
import { Coop } from '../datasources/entity/pgsql/Coop.entity';
import { CONTRACT_TYPE } from '../libs/constants';
import { ERR_CONTRACT_NOT_FOUND } from '../libs/constants/errors';
import { extractNumbersFromString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class ContractCostPlusDAO extends BaseSQLDAO<Contract> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  private repositorySapronak: Repository<ContractSapronak>;

  private repositoryInsentiveDeals: Repository<ContractInsentiveDeals>;

  private repositoryDeductionFcBop: Repository<ContractDeductionFcBop>;

  private repositoryMarketInsentive: Repository<ContractMarketInsentive>;

  private repositoryBop: Repository<ContractBop>;

  private repositoryCoop: Repository<Coop>;

  private repositoryChickenPrice: Repository<ContractChickenPrice>;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(Contract);
    this.repositorySapronak = this.pSql.connection.getRepository(ContractSapronak);
    this.repositoryInsentiveDeals = this.pSql.connection.getRepository(ContractInsentiveDeals);
    this.repositoryDeductionFcBop = this.pSql.connection.getRepository(ContractDeductionFcBop);
    this.repositoryMarketInsentive = this.pSql.connection.getRepository(ContractMarketInsentive);
    this.repositoryBop = this.pSql.connection.getRepository(ContractBop);
    this.repositoryCoop = this.pSql.connection.getRepository(Coop);
    this.repositoryChickenPrice = this.pSql.connection.getRepository(ContractChickenPrice);
  }

  async getOneCostPlus(contractId: string) {
    try {
      const getOneCostPlus = await this.repository.findOneOrFail({
        where: {
          id: contractId,
        },
        order: { seqNo: 'DESC' },
      });

      const [sapronak, insentiveDeals, contractDeductionFcBop] = await Promise.all([
        await this.repositorySapronak.find({
          where: {
            refContractId: contractId,
          },
        }),
        await this.repositoryInsentiveDeals.find({
          where: {
            refContractId: contractId,
          },
        }),

        await this.repositoryDeductionFcBop.find({
          where: {
            refContractId: contractId,
          },
        }),
      ]);

      const contractMarketInsentive = await this.repositoryMarketInsentive.findOne({
        where: {
          refContractId: contractId,
        },
      });

      const bop = await this.repositoryBop.find({
        where: {
          refContractId: contractId,
        },
      });

      return {
        ...getOneCostPlus,
        sapronak,
        insentiveDeals,
        contractDeductionFcBop,
        contractMarketInsentive,
        bop: bop.filter((item) => !item.bopParent && !item.minIp && !item.maxIp),
        bop3: bop
          .filter((item) => item.bopParent === '3')
          .map((elm) => ({
            id: elm.id,
            bop: elm.bop,
            amount: elm.amount,
            minIp: elm.minIp,
            maxIp: elm.maxIp,
          })),
      };
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_CONTRACT_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getDetailCostPlus(branchId: string) {
    try {
      const getContractCostPlus = await this.repository.find({
        where: {
          branchId,
          contractTag: CONTRACT_TYPE.COST_PLUS,
          refContractParent: Not(IsNull()),
        },
        relations: {
          contractType: true,
          children: true,
        },
        order: { seqNo: 'DESC' },
      });

      const getCoopByBranch = await this.repositoryCoop.findOneOrFail({
        where: {
          farm: {
            branchId,
          },
        },
        relations: {
          farm: true,
          contract: true,
        },
        order: { seqNo: 'DESC' },
      });

      const results = getContractCostPlus.map((item) => ({
        id: item.id,
        coopName: getCoopByBranch.coopName,
        startDate: item.effectiveStartDate,
        contractType: item.contractType.contractName,
        customize: item.customize,
      }));

      return results;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return [];
      }

      throw error;
    }
  }

  async payloadErpCostPlus(contractId: string) {
    try {
      const { branch, code, effectiveStartDate, contractType, customize, status } =
        await this.repository.findOneOrFail({
          where: {
            id: contractId,
          },
          order: { seqNo: 'DESC' },
          relations: {
            branch: {
              area: true,
            },
            contractType: true,
            coop: true,
          },
        });

      const [sapronak, insentiveDeals, bop, chickenPrice] = await Promise.all([
        await this.repositorySapronak.find({
          where: {
            refContractId: contractId,
          },
        }),
        await this.repositoryInsentiveDeals.find({
          where: {
            refContractId: contractId,
          },
        }),
        await this.repositoryBop.find({
          where: {
            refContractId: contractId,
          },
        }),
        await this.repositoryChickenPrice.find({
          where: {
            refContractId: contractId,
          },
        }),
      ]);

      const { lossDeductionProfit } = await this.repositoryDeductionFcBop.findOneOrFail({
        where: {
          refContractId: contractId,
        },
      });

      const { insentivePrecentage, rangeIp } = await this.repositoryMarketInsentive.findOneOrFail({
        where: {
          refContractId: contractId,
        },
      });

      return {
        active: status.toLowerCase() === 'active',
        branchCode: branch.code,
        customContract: customize,
        contractCode: code,
        areaCode: branch.area.code,
        polaCode: contractType.contractName,
        startDate: effectiveStartDate,
        endDate: effectiveStartDate,
        savingPercent: 0,
        minimumProfit: 0,
        insentifPasarPercent: insentivePrecentage,
        insentifPasarMinIP: extractNumbersFromString(rangeIp as string),
        sapronak: sapronak
          .filter((elm) => elm.subcategoryCode !== 'DOC+VACCINE')
          .map((item) => ({
            categoryCode: item.categoryCode,
            subcategoryCode: item.subcategoryCode,
            price: item.categoryCode === 'OVK' ? 0 : item.price,
            margin: item.categoryCode === 'OVK' ? item.price : undefined,
          })),
        chickenPrice: chickenPrice.map((item) => ({
          lowerRange: item.lowerRange,
          upperRange: item.upperRange,
          price: item.price,
        })),
        incentive: insentiveDeals.map((item) => ({
          lowerIp: item.lowerIp,
          upperIp: item.upperIp,
          price: item.price,
        })),
        bop: bop
          .filter((item) => !item.bopParent && !item.minIp && !item.maxIp)
          .map((elm) => ({
            dayAfterChickInDate: Number(elm.paymentTerm.slice(1)),
            minIp: elm.preConditions,
            bopNo: elm.bop,
            price: elm.amount,
          })),
        bop3: bop
          .filter((item) => item.bopParent === '3')
          .map((elm) => ({
            bopNo: elm.bop,
            price: elm.amount,
            minIp: elm.minIp,
            maxIp: elm.maxIp,
          })),
        deductionPercent: lossDeductionProfit,
      };
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_CONTRACT_NOT_FOUND(error.message);
      }

      throw error;
    }
  }
}
