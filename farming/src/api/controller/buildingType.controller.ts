import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject } from 'fastify-decorators';
import {
  GetBuildingTypesQuery,
  getBuildingTypesQueryDTO,
  GetBuildingTypesResponse,
  getBuildingTypesResponseDTO,
} from '../../dto/buildingType.dto';
import { BuildingTypeService } from '../../services/buildingType.service';

@Controller({
  route: '/building-types',
  type: 0,
  tags: [{ name: 'building-types' }],
})
export class BuildingTypeController {
  @Inject(BuildingTypeService)
  private service: BuildingTypeService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getBuildingTypesQueryDTO,
        response: {
          200: getBuildingTypesResponseDTO,
        },
      },
    },
  })
  async get(
    req: FastifyRequest<{
      Querystring: GetBuildingTypesQuery;
    }>,
  ): Promise<GetBuildingTypesResponse> {
    const buildingTypes = await this.service.get(req.query);

    return {
      code: 200,
      data: buildingTypes,
    };
  }
}
