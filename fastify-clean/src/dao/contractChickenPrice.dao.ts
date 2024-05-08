import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, In } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Contract } from '../datasources/entity/pgsql/Contract.entity';
import { ContractChickenPrice } from '../datasources/entity/pgsql/ContractChickenPrice.entity';
import { ContractUpdateParams } from '../dto/contract.dto';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class ContractChickenPriceDAO extends BaseSQLDAO<ContractChickenPrice> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ContractChickenPrice);
  }

  async updateMultiple(
    contractParams: ContractUpdateParams,
    data: DeepPartial<ContractChickenPrice[]>,
    user: RequestUser,
  ): Promise<ContractChickenPrice[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    await Promise.all([
      data.map((item: DeepPartial<ContractChickenPrice>) => {
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
      contractParams && contractParams?.refContractId
        ? await this.updateRelatedChickenPrice(data, contractParams?.refContractId ?? '')
        : null,
    ]);

    return this.repository.find({
      where: {
        refContractId: contractParams.refContractId,
      },
    });
  }

  async updateRelatedChickenPrice(
    data: DeepPartial<ContractChickenPrice[]>,
    idx: string,
  ): Promise<ContractChickenPrice[]> {
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
      const chickenPrice = await queryRunner.manager.find(ContractChickenPrice, {
        where: { refContractId: In(ids) },
        select: ['id', 'upperRange', 'lowerRange'],
      });

      await Promise.all(
        chickenPrice.map(async (item: DeepPartial<ContractChickenPrice>) => {
          const row = data.find(
            (el) => el.upperRange === item.upperRange && el.lowerRange === item.lowerRange,
          );

          if (row && item.id) {
            await queryRunner.manager.update(ContractChickenPrice, item.id, {
              lowerRange: row.lowerRange,
              upperRange: row.upperRange,
              price: row.price,
            });
          }
        }),
      );

      await queryRunner.commitTransaction();

      return chickenPrice;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return [];
    } finally {
      await queryRunner.release();
    }
  }
}
