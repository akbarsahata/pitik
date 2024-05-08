import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject } from 'fastify-decorators';
import {
  GetCitiesQuery,
  getCitiesQueryDTO,
  GetCitiesResponse,
  getCitiesResponseDTO,
} from '../../dto/city.dto';
import { CityService } from '../../services/city.service';

@Controller({
  route: '/cities',
  type: 0,
  tags: [{ name: 'cities' }],
})
export class CityController {
  @Inject(CityService)
  private service!: CityService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getCitiesQueryDTO,
        response: {
          200: getCitiesResponseDTO,
        },
      },
    },
  })
  async get(
    req: FastifyRequest<{
      Querystring: GetCitiesQuery;
    }>,
  ): Promise<GetCitiesResponse> {
    const cities = await this.service.get(req.query);
    return {
      data: cities,
    };
  }
}
