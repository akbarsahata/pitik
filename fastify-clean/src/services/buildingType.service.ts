import { Inject, Service } from 'fastify-decorators';
import { minutesToMilliseconds } from 'date-fns';
import { GetBuildingTypesQuery } from '../dto/buildingType.dto';
import { BuildingType } from '../datasources/entity/pgsql/BuildingType.entity';
import { BuildingTypeDAO } from '../dao/buildingType.dao';

@Service()
export class BuildingTypeService {
  @Inject(BuildingTypeDAO)
  private dao: BuildingTypeDAO;

  async get(filter: GetBuildingTypesQuery): Promise<BuildingType[]> {
    const [buildingTypes] = await this.dao.getMany({
      where: {
        isActive: filter.isActive !== undefined ? filter.isActive : true,
      },
      cache: minutesToMilliseconds(5),
    });

    return buildingTypes;
  }
}
