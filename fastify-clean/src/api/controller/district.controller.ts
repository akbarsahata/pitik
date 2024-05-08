import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject } from 'fastify-decorators';
import {
  GetDistrictsQuery,
  getDistrictsQueryDTO,
  GetDistrictsResponse,
  getDistrictsResponseDTO,
} from '../../dto/district.dto';
import { DistrictService } from '../../services/district.service';

@Controller({
  route: '/districts',
  type: 0,
  tags: [{ name: 'districts' }],
})
export class DistrictController {
  @Inject(DistrictService)
  private service: DistrictService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getDistrictsQueryDTO,
        response: {
          200: getDistrictsResponseDTO,
        },
      },
    },
  })
  async get(
    req: FastifyRequest<{
      Querystring: GetDistrictsQuery;
    }>,
  ): Promise<GetDistrictsResponse> {
    const districts = await this.service.get(req.query);

    return {
      data: districts,
    };
  }
}
