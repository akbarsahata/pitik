import { Inject, Service } from 'fastify-decorators';
import { minutesToMilliseconds } from 'date-fns';
import { ControllerType } from '../datasources/entity/pgsql/ControllerType.entity';
import { GetControllerTypesQuery } from '../dto/controllerType.dto';
import { ControllerTypeDAO } from '../dao/controllerType.dao';

@Service()
export class ControllerTypeService {
  @Inject(ControllerTypeDAO)
  private controllerTypeDAO: ControllerTypeDAO;

  async get(filter: GetControllerTypesQuery): Promise<ControllerType[]> {
    const [controllerTypes] = await this.controllerTypeDAO.getMany({
      where: {
        isActive: filter.isActive !== undefined ? filter.isActive : true,
      },
      cache: minutesToMilliseconds(5),
    });

    return controllerTypes;
  }
}
