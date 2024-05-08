import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject } from 'fastify-decorators';
import {
  GetB2BOrganizationQuery,
  getB2BOrganizationQueryDTO,
  GetB2BOrganizationResponse,
  getB2BOrganizationResponseDTO,
} from '../../../dto/b2b/b2b.organization.dto';
import { B2BOrganizationService } from '../../../services/b2b/b2b.organization.service';
import { verifyAccess } from '../../hooks/onRequest/verifyAccess';

@Controller({
  route: '/b2b/organizations',
  type: 0,
  tags: [{ name: 'b2b-organizations' }],
})
export class B2BOrganizationController {
  @Inject(B2BOrganizationService)
  private service!: B2BOrganizationService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getB2BOrganizationQueryDTO,
        response: {
          200: getB2BOrganizationResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getMany(
    req: FastifyRequest<{
      Querystring: GetB2BOrganizationQuery;
    }>,
  ): Promise<GetB2BOrganizationResponse> {
    const [organizations, count] = await this.service.get(req.query);

    return {
      code: 200,
      count,
      data: organizations,
    };
  }
}
