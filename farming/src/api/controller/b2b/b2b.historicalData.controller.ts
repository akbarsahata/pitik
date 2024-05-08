import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject } from 'fastify-decorators';
import {
  GetB2BHistoricalDataQuery,
  getB2BHistoricalDataQueryDTO,
  GetB2BHistoricalDataResponse,
  getB2BHistoricalDataResponseDTO,
} from '../../../dto/b2b/b2b.historicalData.dto';
import { B2BHistoricalDataService } from '../../../services/b2b/b2b.historicalData.service';
import { verifyAccess } from '../../hooks/onRequest/verifyAccess';

@Controller({
  route: '/b2b/historical-data',
  type: 0,
  tags: [{ name: 'b2b-iot-devices' }],
})
export class B2BHistoricalDataController {
  @Inject(B2BHistoricalDataService)
  private service!: B2BHistoricalDataService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getB2BHistoricalDataQueryDTO,
        response: {
          200: getB2BHistoricalDataResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getB2BHistoricalData(
    req: FastifyRequest<{
      Querystring: GetB2BHistoricalDataQuery;
    }>,
  ): Promise<GetB2BHistoricalDataResponse> {
    const data = await this.service.getB2BHistoricalData(req.query);

    return {
      code: 200,
      data,
    };
  }
}
