/* eslint-disable class-methods-use-this */
import { randomUUID } from 'crypto';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindManyOptions, FindOptionsWhere, QueryRunner, Repository } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { IotTicketingDetails } from '../datasources/entity/pgsql/IotTicketingDetails.entity';
import { TicketingHistorypayloadDTO } from '../dto/iotTicketingHistory.dto';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { BaseSQLDAO } from './base.dao';

@Service()
export class IotTicketingHistoryDAO extends BaseSQLDAO<IotTicketingDetails> {
  @Inject(PostgreSQLConnection)
  protected pSql!: PostgreSQLConnection;

  protected repository: Repository<IotTicketingDetails>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(IotTicketingDetails);
  }

  async createManyWithTx(
    data: DeepPartial<IotTicketingDetails>[],
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<IotTicketingDetails[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const items = queryRunner.manager.create(
      IotTicketingDetails,
      data.map<DeepPartial<IotTicketingDetails>>((input) => ({
        ...input,
        id: input.id || randomUUID(),
        createdBy: user.id,
        createdDate: now,
        modifiedBy: user.id,
        modifiedDate: now,
      })),
    );

    const result = await queryRunner.manager.save(IotTicketingDetails, items);

    return result;
  }

  async getManyTicketingHistory(
    params: FindManyOptions<IotTicketingDetails>,
  ): Promise<IotTicketingDetails[]> {
    const results = await this.repository.find({
      ...params,
    });

    return results;
  }

  async updateOneIotTicketingHistory(
    input: TicketingHistorypayloadDTO,
    params: FindOptionsWhere<IotTicketingDetails>,
    user: RequestUser,
  ): Promise<IotTicketingDetails> {
    const result = await this.repository.update(params, {
      ...input,
      modifiedBy: user.id,
      modifiedDate: new Date(),
    });

    if (!result.affected) {
      throw new Error('Error update tickets');
    }

    const updated = await this.repository.findOneOrFail({
      where: {
        ...((params.id && {
          id: params.id,
        }) ||
          params),
      },
    });

    return updated;
  }
}
