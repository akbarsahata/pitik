import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindOptionsWhere, In, Not } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Contract } from '../datasources/entity/pgsql/Contract.entity';
import { ContractPaymentTerm } from '../datasources/entity/pgsql/ContractPaymentTerm.entity';
import { ContractUpdateParams } from '../dto/contract.dto';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_CONTRACT_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class ContractPaymentTermDAO extends BaseSQLDAO<ContractPaymentTerm> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(ContractPaymentTerm);
  }

  async updateMultiple(
    contractParams: ContractUpdateParams,
    data: DeepPartial<ContractPaymentTerm[]>,
    user: RequestUser,
  ): Promise<ContractPaymentTerm[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    await Promise.all([
      data.map(async (item: DeepPartial<ContractPaymentTerm>) => {
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
        ? await this.updateRelatedPaymentTerm(data, contractParams.refContractId)
        : null,
    ]);
    return this.repository.find({
      where: {
        id: contractParams.id,
      },
    });
  }

  async upsert(data: DeepPartial<ContractPaymentTerm>[], user: RequestUser): Promise<Boolean[]> {
    return Promise.all(
      data.map(async (item): Promise<boolean> => {
        if (!item.id && item.id === undefined) {
          const toBeEntity = {
            ...item,
            id: randomHexString(),
            createdBy: user.id,
            createdDate: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
          };

          const entity = this.repository.create(toBeEntity);
          await this.repository.save(entity);
        } else {
          await this.repository.update({ id: item.id }, item);
        }

        return true;
      }),
    );
  }

  async deleteBulk(id: string[], contractId: string): Promise<boolean> {
    const opts: FindOptionsWhere<ContractPaymentTerm> = {
      id: Not(In(id)),
      refContractId: contractId,
    };
    const ids = await this.repository.findBy(opts);

    try {
      const deleteQy = await this.repository.delete({ id: In(ids.map((row): string => row.id)) });
      if (!deleteQy.affected) {
        return false;
      }
      return true;
    } catch (error) {
      throw ERR_CONTRACT_NOT_FOUND();
    }
  }

  async updateRelatedPaymentTerm(
    data: DeepPartial<ContractPaymentTerm[]>,
    idx: string,
  ): Promise<ContractPaymentTerm[]> {
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
      const paymentTerm = await queryRunner.manager.find(ContractPaymentTerm, {
        where: { refContractId: In(ids) },
        select: ['id', 'paymentTerm'],
      });

      await Promise.all(
        paymentTerm.map(async (item: DeepPartial<ContractPaymentTerm>) => {
          const row = data.find((el) => el.paymentTerm === item.paymentTerm);
          if (row && item.id) {
            await queryRunner.manager.update(ContractPaymentTerm, item.id, {
              amount: row.amount,
            });
          }
        }),
      );
      await queryRunner.commitTransaction();
      return paymentTerm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return [];
    } finally {
      await queryRunner.release();
    }
  }
}
