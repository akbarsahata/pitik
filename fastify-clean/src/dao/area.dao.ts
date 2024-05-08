import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { FindManyOptions, Repository } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { Area } from '../datasources/entity/pgsql/Area.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { randomHexString } from '../libs/utils/helpers';

@Service()
export class AreaDAO {
  @Inject(PostgreSQLConnection)
  private pSql: PostgreSQLConnection;

  private repository!: Repository<Area>;

  @Initializer([PostgreSQLConnection])
  init() {
    this.repository = this.pSql.connection.getRepository(Area);
  }

  async createOrUpdate(data: Partial<Area>): Promise<Area> {
    const area = await this.repository.findOne({
      where: {
        code: data.code,
      },
    });

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    if (!area) {
      const newArea = this.repository.create({
        id: randomHexString(),
        isActive: true,
        code: data.code,
        name: data.name,
        createdDate: now,
        modifiedDate: now,
      });

      await this.repository.save(newArea);

      return newArea;
    }

    if (area.name !== data.name || area.isActive !== data.isActive) {
      if (data.name) area.name = data.name;

      if (data.isActive !== undefined) area.isActive = data.isActive;

      await this.repository.update(
        {
          id: area.id,
        },
        {
          ...(data.name && {
            name: data.name,
          }),
          ...(data.isActive !== undefined && {
            isActive: data.isActive,
          }),
        },
      );

      return area;
    }

    return area;
  }

  async getMany(params: FindManyOptions<Area>): Promise<Area[]> {
    const areas = await this.repository.find(params);

    return areas;
  }
}
