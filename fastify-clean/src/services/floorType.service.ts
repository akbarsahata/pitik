import { Inject, Service } from 'fastify-decorators';
import { minutesToMilliseconds } from 'date-fns';
import { FloorType } from '../datasources/entity/pgsql/FloorType.entity';
import { GetFloorTypesQuery } from '../dto/floorType.dto';
import { FloorTypeDAO } from '../dao/floorType.dao';

@Service()
export class FloorTypeService {
  @Inject(FloorTypeDAO)
  private dao: FloorTypeDAO;

  async get(filter: GetFloorTypesQuery): Promise<FloorType[]> {
    const [floorTypes] = await this.dao.getMany({
      where: {
        isActive: filter.isActive !== undefined ? filter.isActive : true,
      },
      cache: minutesToMilliseconds(5),
    });

    return floorTypes;
  }
}
