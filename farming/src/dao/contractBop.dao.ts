import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, In } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Contract } from '../datasources/entity/pgsql/Contract.entity';
import { ContractBop } from '../datasources/entity/pgsql/ContractBop.entity';
import { ContractUpdateParams } from '../dto/contract.dto';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class ContractBopDAO extends BaseSQLDAO<ContractBop> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ContractBop);
  }

  async updateMultiple(
    contractParams: ContractUpdateParams,
    data: DeepPartial<ContractBop[]>,
    user: RequestUser,
  ): Promise<ContractBop[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    await Promise.all([
      data.map(async (item: DeepPartial<ContractBop>) => {
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
        ? await this.updateRelatedBOP(data, contractParams.refContractId)
        : null,
    ]);

    return this.repository.find({
      where: {
        refContractId: contractParams.refContractId,
      },
    });
  }

  async upsert(data: DeepPartial<ContractBop>[], user: RequestUser): Promise<Boolean[]> {
    return Promise.all(
      data.map(async (item) => {
        if (!item.id) {
          const toBeEntity = {
            id: randomHexString(),
            createdBy: user.id,
            createdDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
            ...item,
          };

          const entity = this.repository.create(toBeEntity);
          await this.repository.save(entity);
        }

        await this.repository.update({ id: item.id }, item);
        return true;
      }),
    );
  }

  async updateRelatedBOP(data: DeepPartial<ContractBop[]>, idx: string): Promise<ContractBop[]> {
    try {
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
        const sapronak = await queryRunner.manager.find(ContractBop, {
          where: { refContractId: In(ids) },
          select: ['id', 'paymentTerm'],
        });

        await Promise.all(
          sapronak.map(async (item: DeepPartial<ContractBop>) => {
            const row = data.find((el) => el.paymentTerm === item.paymentTerm);
            if (row && item.id) {
              await queryRunner.manager.update(ContractBop, item.id, {
                amount: row.amount,
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
    } catch (error) {
      return [];
    }
  }
}
