import { Inject, Service } from 'fastify-decorators';
import { ILike } from 'typeorm';
import { CityDAO } from '../dao/city.dao';
import { City } from '../datasources/entity/pgsql/City.entity';
import { GetCitiesQuery } from '../dto/city.dto';

@Service()
export class CityService {
  @Inject(CityDAO)
  private cityDAO: CityDAO;

  async get(filter: GetCitiesQuery): Promise<City[]> {
    const [cities] = await this.cityDAO.getMany({
      where: {
        cityName: filter.name ? ILike(`%${filter.name}%`) : undefined,
        provinceId: filter.provinceId || undefined,
      },
    });

    return cities;
  }
}
