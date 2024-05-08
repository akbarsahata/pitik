import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, In } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Contract } from '../datasources/entity/pgsql/Contract.entity';
import { ContractMarketInsentive } from '../datasources/entity/pgsql/ContractMarketInsentive.entity';
import { ContractUpdateParams } from '../dto/contract.dto';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class ContractMarketInsentiveDAO extends BaseSQLDAO<ContractMarketInsentive> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ContractMarketInsentive);
  }

  async update(
    contractParams: ContractUpdateParams,
    data: DeepPartial<ContractMarketInsentive>,
    user: RequestUser,
  ): Promise<ContractMarketInsentive | null> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const criteria = {
      id: contractParams.id,
      refContractId: contractParams.refContractId,
    };

    await this.updateRelatedMarketIncentive(contractParams, data);
    await this.repository.update(criteria, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    return this.repository.findOne({
      where: {
        id: criteria.id,
      },
    });
  }

  async updateRelatedMarketIncentive(
    contractParams: ContractUpdateParams,
    data: DeepPartial<ContractMarketInsentive>,
  ): Promise<ContractMarketInsentive[] | null> {
    const queryRunner = this.pSql.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const contract = await queryRunner.manager.findOne(Contract, {
        where: { id: contractParams.refContractId },
        relations: {
          children: true,
        },
      });
      const ids = (contract?.children || []).map((c) => c.id);
      const marketIncentive = await queryRunner.manager.find(ContractMarketInsentive, {
        where: { refContractId: In(ids) },
        select: ['id', 'rangeIp'],
      });

      await Promise.all(
        marketIncentive.map(async (item: DeepPartial<ContractMarketInsentive>) => {
          if (item.id) {
            await queryRunner.manager.update(ContractMarketInsentive, item.id, {
              insentivePrecentage: data.insentivePrecentage,
              rangeIp: data.rangeIp,
            });
          }
        }),
      );
      await queryRunner.commitTransaction();
      return marketIncentive;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return [];
    } finally {
      await queryRunner.release();
    }
  }
}
