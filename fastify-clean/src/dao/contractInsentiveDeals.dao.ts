import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, In } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Contract } from '../datasources/entity/pgsql/Contract.entity';
import { ContractInsentiveDeals } from '../datasources/entity/pgsql/ContractInsentiveDeals.entity';
import { ContractUpdateParams } from '../dto/contract.dto';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class ContractInsentiveDealsDAO extends BaseSQLDAO<ContractInsentiveDeals> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ContractInsentiveDeals);
  }

  async updateMultiple(
    contractParams: ContractUpdateParams,
    data: DeepPartial<ContractInsentiveDeals[]>,
    user: RequestUser,
  ): Promise<ContractInsentiveDeals[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await Promise.all([
      data.map(async (item: DeepPartial<ContractInsentiveDeals>) => {
        const criteria = {
          id: item.id,
          refContractId: contractParams.refContractId,
        };

        return this.repository.update(criteria, {
          ...item,
          modifiedBy: user.id,
          modifiedDate: now,
        });
      }),
      contractParams && contractParams.refContractId
        ? await this.updateRelatedInsentiveDeals(data, contractParams.refContractId)
        : null,
    ]);

    const results = await this.repository.find({
      where: {
        refContractId: contractParams.refContractId,
      },
    });
    return results;
  }

  async updateRelatedInsentiveDeals(
    data: DeepPartial<ContractInsentiveDeals[]>,
    idx: string,
  ): Promise<ContractInsentiveDeals[]> {
    const queryRunner = this.pSql.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const contract = await queryRunner.manager.findOne(Contract, {
        where: { id: idx },
        relations: {
          children: true,
        },
      });
      const ids = (contract?.children || []).map((c) => c.id);
      const incentive = await queryRunner.manager.find(ContractInsentiveDeals, {
        where: { refContractId: In(ids) },
        select: ['id', 'lowerIp', 'upperIp'],
      });

      await Promise.all(
        incentive.map(async (item: DeepPartial<ContractInsentiveDeals>) => {
          const row = data.find((el) => el.lowerIp === item.lowerIp && el.upperIp === item.upperIp);
          if (row && item.id) {
            await queryRunner.manager.update(ContractInsentiveDeals, item.id, {
              price: row.price,
            });
          }
        }),
      );
      await queryRunner.commitTransaction();
      return incentive;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return [];
    } finally {
      await queryRunner.release();
    }
  }
}
