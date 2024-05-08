import { Initializer, Inject, Service } from 'fastify-decorators';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { FarmingCyclePPLMember } from '../datasources/entity/pgsql/FarmingCyclePPLMember.entity';

@Service()
export class FarmingCyclePPLMemberDAO {
  @Inject(PostgreSQLConnection)
  private pSql!: PostgreSQLConnection;

  private repository!: Repository<FarmingCyclePPLMember>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(FarmingCyclePPLMember);
  }

  async getOne(
    params: FindOneOptions<FarmingCyclePPLMember>,
  ): Promise<FarmingCyclePPLMember | null> {
    return this.repository.findOne(params);
  }

  async getMany(params: FindManyOptions<FarmingCyclePPLMember>): Promise<FarmingCyclePPLMember[]> {
    return this.repository.find(params);
  }
}
