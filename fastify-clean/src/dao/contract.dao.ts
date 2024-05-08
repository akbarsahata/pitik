import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, EntityNotFoundError, FindOneOptions } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Contract } from '../datasources/entity/pgsql/Contract.entity';
import { ContractInput } from '../dto/contract.dto';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { ERR_CONTRACT_NOT_FOUND } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class ContractDAO extends BaseSQLDAO<Contract> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(Contract);
  }

  async getOneStrict(params: FindOneOptions<Contract>): Promise<Contract> {
    try {
      const contract = await this.repository.findOneOrFail(params);

      return contract;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw ERR_CONTRACT_NOT_FOUND(error.message);
      }
      throw error;
    }
  }

  async update(
    contractId: string,
    data: DeepPartial<Contract>,
    user: RequestUser,
  ): Promise<Contract | null> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const contract: Partial<ContractInput> = {
      customize: data.customize,
      refContractTypeId: data.refContractTypeId,
      branchId: data.branchId,
      effectiveStartDate: data.effectiveStartDate,
      coopId: data.coopId || undefined,
    };
    await this.repository.update(
      { id: contractId },
      {
        ...contract,
        modifiedBy: user.id,
        modifiedDate: now,
      },
    );

    return this.repository.findOne({
      where: {
        id: contractId,
      },
    });
  }
}
