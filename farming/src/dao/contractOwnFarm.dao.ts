import { Initializer, Inject, Service } from 'fastify-decorators';
import { EntityNotFoundError, IsNull, Not, Repository } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Contract } from '../datasources/entity/pgsql/Contract.entity';
import { ContractBop } from '../datasources/entity/pgsql/ContractBop.entity';
import { ContractPaymentTerm } from '../datasources/entity/pgsql/ContractPaymentTerm.entity';
import { Coop } from '../datasources/entity/pgsql/Coop.entity';
import { CONTRACT_TYPE } from '../libs/constants';
import { ERR_CONTRACT_NOT_FOUND } from '../libs/constants/errors';
import { BaseSQLDAO } from './base.dao';

@Service()
export class ContractOwnFarmDAO extends BaseSQLDAO<Contract> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  private repositoryBop: Repository<ContractBop>;

  private repositoryPaymentTerms: Repository<ContractPaymentTerm>;

  private repositoryCoop: Repository<Coop>;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(Contract);
    this.repositoryBop = this.pSql.connection.getRepository(ContractBop);
    this.repositoryPaymentTerms = this.pSql.connection.getRepository(ContractPaymentTerm);
    this.repositoryCoop = this.pSql.connection.getRepository(Coop);
  }

  async getDetailOwnFarm(coopId: string) {
    try {
      const getContractOwnFarm = await this.repository.find({
        where: {
          coopId,
          contractTag: CONTRACT_TYPE.OWN_FARM,
          refContractParent: Not(IsNull()),
        },
        order: { seqNo: 'DESC' },
        relations: {
          contractType: true,
          children: true,
        },
      });

      const getCoopByBranch = await this.repositoryCoop.findOneOrFail({
        where: {
          id: coopId,
        },
        relations: {
          farm: true,
          contract: true,
        },
        order: { seqNo: 'DESC' },
      });

      const results = getContractOwnFarm.map((item) => ({
        id: item.id,
        coopName: getCoopByBranch.coopName,
        startDate: item.effectiveStartDate,
        contractType: item.contractType?.contractName,
        customize: item.customize,
      }));

      return results;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return [];
      }

      throw ERR_CONTRACT_NOT_FOUND();
    }
  }

  async getOneOwnFarm(contractId: string) {
    try {
      const getOneOwnFarm = await this.repository.findOneOrFail({
        where: {
          id: contractId,
        },
        order: { seqNo: 'DESC' },
      });

      const [paymentTerms, bop] = await Promise.all([
        await this.repositoryPaymentTerms.find({
          where: {
            refContractId: contractId,
          },
        }),
        await this.repositoryBop.find({
          where: {
            refContractId: contractId,
          },
        }),
      ]);

      return {
        ...getOneOwnFarm,
        bop,
        paymentTerms,
      };
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_CONTRACT_NOT_FOUND(error.message);
      }

      throw error;
    }
  }
}
