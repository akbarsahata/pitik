import { Initializer, Inject, Service } from 'fastify-decorators';
import { EntityNotFoundError, IsNull, Not, Repository } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Contract } from '../datasources/entity/pgsql/Contract.entity';
import { ContractChickenPrice } from '../datasources/entity/pgsql/ContractChickenPrice.entity';
import { ContractDeductionFc } from '../datasources/entity/pgsql/ContractDeductionFc.entity';
import { ContractInsentiveDeals } from '../datasources/entity/pgsql/ContractInsentiveDeals.entity';
import { ContractMarketInsentive } from '../datasources/entity/pgsql/ContractMarketInsentive.entity';
import { ContractSapronak } from '../datasources/entity/pgsql/ContractSapronak.entity';
import { ContractSaving } from '../datasources/entity/pgsql/ContractSaving.entity';
import { Coop } from '../datasources/entity/pgsql/Coop.entity';
import { CONTRACT_TYPE } from '../libs/constants';
import { ERR_CONTRACT_NOT_FOUND } from '../libs/constants/errors';
import { BaseSQLDAO } from './base.dao';

@Service()
export class ContractMitraGaransiDAO extends BaseSQLDAO<Contract> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  private repositorySapronak: Repository<ContractSapronak>;

  private repositoryChickenPrice: Repository<ContractChickenPrice>;

  private repositoryInsentiveDeals: Repository<ContractInsentiveDeals>;

  private repositorySaving: Repository<ContractSaving>;

  private repositoryDeductionDueToFarmingCycleLoss: Repository<ContractDeductionFc>;

  private repositoryMarketInsentive: Repository<ContractMarketInsentive>;

  private repositoryCoop: Repository<Coop>;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(Contract);
    this.repositorySapronak = this.pSql.connection.getRepository(ContractSapronak);
    this.repositoryChickenPrice = this.pSql.connection.getRepository(ContractChickenPrice);
    this.repositoryInsentiveDeals = this.pSql.connection.getRepository(ContractInsentiveDeals);
    this.repositorySaving = this.pSql.connection.getRepository(ContractSaving);
    this.repositoryDeductionDueToFarmingCycleLoss =
      this.pSql.connection.getRepository(ContractDeductionFc);
    this.repositoryMarketInsentive = this.pSql.connection.getRepository(ContractMarketInsentive);
    this.repositoryCoop = this.pSql.connection.getRepository(Coop);
  }

  async getOneMitraGaransi(contractId: string) {
    try {
      const getOneMitragaransi = await this.repository.findOneOrFail({
        where: {
          id: contractId,
        },
        relations: {
          coop: true,
        },
        order: { seqNo: 'DESC' },
      });

      const [sapronak, chickenPrice, insentiveDeals] = await Promise.all([
        await this.repositorySapronak.find({
          where: {
            refContractId: contractId,
          },
        }),
        await this.repositoryChickenPrice.find({
          where: {
            refContractId: contractId,
          },
        }),

        await this.repositoryInsentiveDeals.find({
          where: {
            refContractId: contractId,
          },
        }),
      ]);

      const saving = await this.repositorySaving.findOne({
        where: {
          refContractId: contractId,
        },
      });

      const deductionDueToFarmingCycleLoss =
        await this.repositoryDeductionDueToFarmingCycleLoss.findOne({
          where: {
            refContractId: contractId,
          },
        });

      const contractMarketInsentive = await this.repositoryMarketInsentive.findOne({
        where: {
          refContractId: contractId,
        },
      });
      return {
        ...getOneMitragaransi,
        sapronak,
        chickenPrice,
        insentiveDeals,
        saving,
        deductionDueToFarmingCycleLoss,
        contractMarketInsentive,
      };
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_CONTRACT_NOT_FOUND(error.message);
      }

      throw error;
    }
  }

  async getDetailMitraGaransi(branchId: string) {
    try {
      const getContractMitragaransi = await this.repository.find({
        where: {
          branchId,
          contractTag: CONTRACT_TYPE.MITRA_GARANSI,
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

      const results = getContractMitragaransi.map((item) => ({
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

  async payloadErpMitraGaransi(contractId: string) {
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

      const [sapronak, chickenPrice, insentiveDeals] = await Promise.all([
        this.repositorySapronak.find({
          where: {
            refContractId: contractId,
          },
        }),
        this.repositoryChickenPrice.find({
          where: {
            refContractId: contractId,
          },
        }),
        this.repositoryInsentiveDeals.find({
          where: {
            refContractId: contractId,
          },
        }),
      ]);

      const { precentage, minimumProfit } = await this.repositorySaving.findOneOrFail({
        where: {
          refContractId: contractId,
        },
      });

      const deductionPercent = await this.repositoryDeductionDueToFarmingCycleLoss.findOneOrFail({
        where: {
          refContractId: contractId,
        },
      });

      const contractMarketInsentive = await this.repositoryMarketInsentive.findOneOrFail({
        where: {
          refContractId: contractId,
        },
      });

      return {
        active: status.toLocaleLowerCase() === 'active',
        branchCode: branch.code,
        customContract: customize ? 1 : 0,
        areaCode: branch.area?.code || '',
        contractCode: code,
        polaCode: contractType.contractName,
        startDate: effectiveStartDate,
        endDate: effectiveStartDate,
        savingPercent: precentage,
        state: status.toLowerCase(),
        minimumProfit,
        insentifPasarPercent: contractMarketInsentive.insentivePrecentage || 0,
        insentifPasarMinIP: Number(contractMarketInsentive.rangeIp),
        sapronak: sapronak
          .filter((elm) => elm.subcategoryCode !== 'DOC+VACCINE')
          .map((item) => ({
            categoryCode: item.categoryCode,
            subcategoryCode: item.subcategoryCode,
            price: item.categoryCode === 'OVK' ? 0 : item.price,
            margin: item.categoryCode !== 'OVK' ? 0 : item.price,
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
        deductionPercent: deductionPercent.precentage,
      };
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_CONTRACT_NOT_FOUND(error.message);
      }

      throw error;
    }
  }
}
