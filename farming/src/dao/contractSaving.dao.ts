import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, In } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Contract } from '../datasources/entity/pgsql/Contract.entity';
import { ContractSaving } from '../datasources/entity/pgsql/ContractSaving.entity';
import { ContractUpdateParams } from '../dto/contract.dto';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class ContractSavingDAO extends BaseSQLDAO<ContractSaving> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ContractSaving);
  }

  async update(
    contractParams: ContractUpdateParams,
    data: DeepPartial<ContractSaving>,
    user: RequestUser,
  ) {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const criteria = {
      id: contractParams.id,
      refContractId: contractParams.refContractId,
    };

    this.updateRelatedSaving(contractParams, data);
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

  async updateRelatedSaving(
    contractParams: ContractUpdateParams,
    data: DeepPartial<ContractSaving>,
  ): Promise<ContractSaving[]> {
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
      const saving = await queryRunner.manager.find(ContractSaving, {
        where: { refContractId: In(ids) },
        select: ['id', 'precentage', 'minimumProfit'],
      });

      if (!contract?.customize) {
        await Promise.all(
          saving.map(async (item: DeepPartial<ContractSaving>) => {
            if (item.id) {
              await queryRunner.manager.update(ContractSaving, item.id, {
                precentage: data.precentage,
                minimumProfit: data.minimumProfit,
              });
            }
          }),
        );
      }
      await queryRunner.commitTransaction();
      return saving;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return [];
    } finally {
      await queryRunner.release();
    }
  }
}
