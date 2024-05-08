import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, In } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Contract } from '../datasources/entity/pgsql/Contract.entity';
import { ContractSapronak } from '../datasources/entity/pgsql/ContractSapronak.entity';
import { ContractUpdateParams } from '../dto/contract.dto';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class ContractSapronakDAO extends BaseSQLDAO<ContractSapronak> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ContractSapronak);
  }

  async updateMultiple(
    contractParams: ContractUpdateParams,
    data: DeepPartial<ContractSapronak[]>,
    user: RequestUser,
  ): Promise<ContractSapronak[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    await Promise.all([
      data.map(async (item: DeepPartial<ContractSapronak>) => {
        const criteria: any = {
          refContractId: contractParams.refContractId,
        };

        if (item.id) {
          criteria.id = item.id;
        }

        return this.repository.update(criteria, {
          ...item,
          modifiedBy: user.id,
          modifiedDate: now,
        });
      }),
      contractParams && contractParams?.refContractId
        ? await this.updateRelatedSapronak(data, contractParams?.refContractId)
        : null,
    ]);

    return this.repository.find({
      where: {
        refContractId: contractParams.refContractId,
      },
    });
  }

  async updateRelatedSapronak(
    data: DeepPartial<ContractSapronak[]>,
    idx: string,
  ): Promise<ContractSapronak[]> {
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
      const sapronak = await queryRunner.manager.find(ContractSapronak, {
        where: { refContractId: In(ids) },
        select: ['id', 'subcategoryCode'],
      });

      await Promise.all(
        sapronak.map(async (item: DeepPartial<ContractSapronak>) => {
          const row = data.find((el) => el.subcategoryCode === item.subcategoryCode);
          if (row && item.id) {
            await queryRunner.manager.update(ContractSapronak, item.id, {
              categoryCode: row.categoryCode,
              subcategoryCode: row.subcategoryCode,
              price: row.price,
            });
          }
        }),
      );
      await queryRunner.commitTransaction();
      return sapronak;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return [];
    } finally {
      await queryRunner.release();
    }
  }
}
