import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Branch } from '../datasources/entity/pgsql/Branch.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { randomHexString } from '../libs/utils/helpers';
import { BaseSQLDAO } from './base.dao';

@Service()
export class BranchDAO extends BaseSQLDAO<Branch> {
  @Inject(PostgreSQLConnection)
  protected pSql: PostgreSQLConnection;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(Branch);
  }

  async createOrUpdate(data: Partial<Branch>): Promise<Branch> {
    const branch = await this.repository.findOne({
      where: {
        code: data.code,
      },
    });

    if (!branch) {
      const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
      const newBranch = this.repository.create({
        id: randomHexString(),
        isActive: true,
        code: data.code,
        name: data.name,
        areaId: data.areaId,
        createdDate: now,
        modifiedDate: now,
      });

      await this.repository.save(newBranch);

      return newBranch;
    }

    if (
      branch.name !== data.name ||
      branch.isActive !== data.isActive ||
      branch.areaId !== data.areaId
    ) {
      if (data.name) branch.name = data.name;

      if (data.isActive !== undefined) branch.isActive = data.isActive;

      if (data.areaId) branch.areaId = data.areaId;

      await this.repository.update(
        {
          id: branch.id,
        },
        {
          ...(data.name && {
            name: data.name,
          }),
          ...(data.isActive !== undefined && {
            isActive: data.isActive,
          }),
          ...(data.areaId && {
            areaId: data.areaId,
          }),
        },
      );

      return branch;
    }

    return branch;
  }
}
