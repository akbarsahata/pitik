import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject } from 'fastify-decorators';
import {
  GetHeaterTypesQuery,
  getHeaterTypesQueryDTO,
  GetHeaterTypesResponse,
  getHeaterTypesResponseDTO,
} from '../../dto/heaterType.dto';
import { HeaterTypeService } from '../../services/heaterType.service';

@Controller({
  route: '/heater-types',
  type: 0,
  tags: [{ name: 'heater-types' }],
})
export class HeaterTypeController {
  @Inject(HeaterTypeService)
  private service: HeaterTypeService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getHeaterTypesQueryDTO,
        response: {
          200: getHeaterTypesResponseDTO,
        },
      },
    },
  })
  async get(
    req: FastifyRequest<{
      Querystring: GetHeaterTypesQuery;
    }>,
  ): Promise<GetHeaterTypesResponse> {
    const heaterTypes = await this.service.get(req.query);

    return {
      code: 200,
      data: heaterTypes,
    };
  }
}
