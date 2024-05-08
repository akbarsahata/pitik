import { Inject, Service } from 'fastify-decorators';
import { Like } from 'typeorm';
import { ProvinceDAO } from '../dao/province.dao';
import { Province } from '../datasources/entity/pgsql/Province.entity';
import { GetProvincesQuery } from '../dto/province.dto';

@Service()
export class ProvinceService {
  @Inject(ProvinceDAO)
  private provinceDAO: ProvinceDAO;

  async get(filter: GetProvincesQuery): Promise<Province[]> {
    const [provinces] = await this.provinceDAO.getMany({
      where: {
        provinceName: filter.name ? Like(`%${filter.name}%`) : undefined,
      },
    });

    return provinces;
  }
}
