import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject } from 'fastify-decorators';
import {
  GetFeedbrandQuery,
  getFeedbrandQueryDTO,
  GetFeedbrandResponse,
  getFeedbrandResponseDTO,
} from '../../dto/feedbrand.dto';
import { FeedbrandService } from '../../services/feedbrand.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

@Controller({
  route: '/feed-brands',
  type: 0,
  tags: [{ name: 'feed-brands' }],
})
export class FeedbrandController {
  @Inject(FeedbrandService)
  private service: FeedbrandService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getFeedbrandQueryDTO,
        response: {
          200: getFeedbrandResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async get(
    request: FastifyRequest<{
      Querystring: GetFeedbrandQuery;
    }>,
  ): Promise<GetFeedbrandResponse> {
    const [feedbrands, count] = await this.service.getMany(request.query);

    return {
      code: 200,
      count,
      data: feedbrands.map((feedbrand) => ({
        ...feedbrand,
        modifiedDate: feedbrand.modifiedDate && feedbrand.modifiedDate.toISOString(),
      })),
    };
  }
}
