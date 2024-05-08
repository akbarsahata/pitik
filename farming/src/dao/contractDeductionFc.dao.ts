import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, In } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Contract } from '../datasources/entity/pgsql/Contract.entity';
import { ContractDeductionFc } from '../datasources/entity/pgsql/ContractDeductionFc.entity';
import { ContractUpdateParams } from '../dto/contract.dto';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class ContractDeductionFcDAO extends BaseSQLDAO<ContractDeductionFc> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ContractDeductionFc);
  }

  async update(
    contractParams: ContractUpdateParams,
    data: DeepPartial<ContractDeductionFc>,
    user: RequestUser,
  ): Promise<ContractDeductionFc> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const criteria = {
      id: contractParams.id,
      refContractId: contractParams.refContractId,
    };
    await this.updateRelatedDeductionFC(contractParams, data);
    await this.repository.update(criteria, {
      ...data,
      modifiedBy: user.id,
      modifiedDate: now,
    });

    return this.repository.findOneOrFail({
      where: {
        id: contractParams.id,
      },
    });
  }

  async updateRelatedDeductionFC(
    contractParams: ContractUpdateParams,
    data: DeepPartial<ContractDeductionFc>,
  ): Promise<ContractDeductionFc[]> {
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
      const saving = await queryRunner.manager.find(ContractDeductionFc, {
        where: { refContractId: In(ids) },
        select: ['id', 'precentage', 'minimumProfit'],
      });

      if (!contract?.customize) {
        await Promise.all(
          saving.map(async (item: DeepPartial<ContractDeductionFc>) => {
            if (item.id) {
              await queryRunner.manager.update(ContractDeductionFc, item.id, {
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
