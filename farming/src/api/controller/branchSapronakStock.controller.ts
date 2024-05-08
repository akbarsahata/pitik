import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject } from 'fastify-decorators';
import {
  GetBranchSapronakStockQuery,
  getBranchSapronakStockQueryDTO,
  GetBranchSapronakStockResponse,
  getBranchSapronakStockResponseDTO,
} from '../../dto/branchSapronakStock.dto';
import { BranchSapronakStockService } from '../../services/branchSapronakStock.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

@Controller({
  route: '/branch-sapronak-stocks',
  type: 0,
  tags: [{ name: 'branch-sapronak-stocks' }],
})
export class BranchSapronakStockController {
  @Inject(BranchSapronakStockService)
  private service: BranchSapronakStockService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getBranchSapronakStockQueryDTO,
        response: {
          200: getBranchSapronakStockResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getBranchSapronakStock(
    req: FastifyRequest<{
      Querystring: GetBranchSapronakStockQuery;
    }>,
  ): Promise<GetBranchSapronakStockResponse> {
    const [data, count] = await this.service.getBranchSapronakStock(req.query);

    return {
      code: 200,
      data,
      count,
    };
  }
}
