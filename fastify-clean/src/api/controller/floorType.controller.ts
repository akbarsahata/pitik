import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject } from 'fastify-decorators';
import {
  GetFloorTypesQuery,
  getFloorTypesQueryDTO,
  GetFloorTypesResponse,
  getFloorTypesResponseDTO,
} from '../../dto/floorType.dto';
import { FloorTypeService } from '../../services/floorType.service';

@Controller({
  route: '/floor-types',
  type: 0,
  tags: [{ name: 'floor-types' }],
})
export class FloorTypeController {
  @Inject(FloorTypeService)
  private service: FloorTypeService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getFloorTypesQueryDTO,
        response: {
          200: getFloorTypesResponseDTO,
        },
      },
    },
  })
  async get(
    req: FastifyRequest<{
      Querystring: GetFloorTypesQuery;
    }>,
  ): Promise<GetFloorTypesResponse> {
    const floorTypes = await this.service.get(req.query);

    return {
      code: 200,
      data: floorTypes,
    };
  }
}
