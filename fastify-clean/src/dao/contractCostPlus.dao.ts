import { Initializer, Inject, Service } from 'fastify-decorators';
import { EntityNotFoundError, IsNull, MoreThan, Not, Repository } from 'typeorm';
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
        bop,
        insentiveDeals,
        contractDeductionFcBop,
        contractMarketInsentive,
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
          lossDeductionProfit: MoreThan(0),
        },
      });

      const { insentivePrecentage, rangeIp } = await this.repositoryMarketInsentive.findOneOrFail({
        where: {
          refContractId: contractId,
        },
      });

      return {
        branchCode: branch.code,
        customContract: customize ? 1 : 0,
        contractCode: code,
        areaCode: branch.area.code,
        state: status.toLowerCase(),
        polaCode: contractType.contractName,
        startDate: effectiveStartDate,
        endDate: effectiveStartDate,
        savingPercent: 0,
        minimumProfit: 0,
        insentifPasarPercent: insentivePrecentage,
        insentifPasarMinIP: Number(rangeIp),
        sapronak: sapronak.map((item) => ({
          categoryCode: item.categoryCode,
          subcategoryCode: item.subcategoryCode,
          price: item.price,
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
        bop: bop.map((item) => ({
          dayAfterChickInDate: Number(item.paymentTerm.substring(item.paymentTerm.length - 1)),
          minIp: item.preConditions,
          bopNo: item.bop,
          price: item.amount,
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
