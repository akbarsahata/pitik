import { Inject, Service } from 'fastify-decorators';
import { ILike } from 'typeorm';
import { DistrictDAO } from '../dao/district.dao';
import { District } from '../datasources/entity/pgsql/District.entity';
import { GetDistrictsQuery } from '../dto/district.dto';

@Service()
export class DistrictService {
  @Inject(DistrictDAO)
  private districtDAO!: DistrictDAO;

  async get(filter: GetDistrictsQuery): Promise<District[]> {
    const [districts] = await this.districtDAO.getMany({
      where: {
        districtName: filter.name ? ILike(`%${filter.name}%`) : undefined,
        cityId: filter.cityId || undefined,
      },
    });

    return districts;
  }
}
