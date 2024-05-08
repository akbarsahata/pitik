import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject } from 'fastify-decorators';
import {
  GetProvinceResponse,
  GetProvincesQuery,
  getProvincesQueryDTO,
  getProvincesResponseDTO,
  ProvinceItem,
} from '../../dto/province.dto';
import { ProvinceService } from '../../services/province.service';

@Controller({
  route: '/provinces',
  type: 0,
  tags: [{ name: 'provinces' }],
})
export class ProvinceController {
  @Inject(ProvinceService)
  private service!: ProvinceService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getProvincesQueryDTO,
        response: {
          200: getProvincesResponseDTO,
        },
      },
    },
  })
  async get(req: FastifyRequest<{ Querystring: GetProvincesQuery }>): Promise<GetProvinceResponse> {
    const data = await this.service.get(req.query);
    return {
      data: data.map<ProvinceItem>((province) => ({
        id: province.id,
        provinceName: province.provinceName,
      })),
    };
  }
}
