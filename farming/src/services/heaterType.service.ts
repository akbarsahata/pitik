import { Inject, Service } from 'fastify-decorators';
import { minutesToMilliseconds } from 'date-fns';
import { GetHeaterTypesQuery } from '../dto/heaterType.dto';
import { HeaterType } from '../datasources/entity/pgsql/HeaterType.entity';
import { HeaterTypeDAO } from '../dao/heaterType.dao';

@Service()
export class HeaterTypeService {
  @Inject(HeaterTypeDAO)
  private heaterTypeDAO: HeaterTypeDAO;

  async get(filter: GetHeaterTypesQuery): Promise<HeaterType[]> {
    const [heaterTypes] = await this.heaterTypeDAO.getMany({
      where: {
        isActive: filter.isActive !== undefined ? filter.isActive : true,
      },
      cache: minutesToMilliseconds(5),
    });

    return heaterTypes;
  }
}
