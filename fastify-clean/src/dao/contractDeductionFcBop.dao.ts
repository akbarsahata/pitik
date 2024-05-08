import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, In } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Contract } from '../datasources/entity/pgsql/Contract.entity';
import { ContractDeductionFcBop } from '../datasources/entity/pgsql/ContractDeductionFcBop.entity';
import { ContractUpdateParams } from '../dto/contract.dto';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class ContractDeductionFcBopDAO extends BaseSQLDAO<ContractDeductionFcBop> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ContractDeductionFcBop);
  }

  async updateMultiple(
    contractParams: ContractUpdateParams,
    data: DeepPartial<ContractDeductionFcBop[]>,
    user: RequestUser,
  ): Promise<ContractDeductionFcBop[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    await Promise.all([
      data.map(async (item: DeepPartial<ContractDeductionFcBop>) => {
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
        ? await this.updateRelatedDeductionBOP(data, contractParams.refContractId)
        : null,
    ]);

    return this.repository.find({
      where: {
        refContractId: contractParams.refContractId,
      },
    });
  }

  async updateRelatedDeductionBOP(
    data: DeepPartial<ContractDeductionFcBop[]>,
    idx: string,
  ): Promise<ContractDeductionFcBop[]> {
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
      const deductionFC = await queryRunner.manager.find(ContractDeductionFcBop, {
        where: { refContractId: In(ids) },
        select: ['id', 'bop'],
      });

      await Promise.all(
        deductionFC.map(async (item: DeepPartial<ContractDeductionFcBop>) => {
          const row = data.find((el) => el.bop === item.bop);
          if (row && item.id) {
            await queryRunner.manager.update(ContractDeductionFcBop, item.id, {
              lossDeductionProfit: row.lossDeductionProfit,
              lossDeductionBop: row.lossDeductionBop,
            });
          }
        }),
      );
      await queryRunner.commitTransaction();
      return deductionFC;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return [];
    } finally {
      await queryRunner.release();
    }
  }
}
