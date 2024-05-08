import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject } from 'fastify-decorators';
import {
  GetB2BOrganizationMemberDetailResponse,
  getB2BOrganizationMemberDetailResponseDTO,
  GetB2BOrganizationMemberListQuery,
  getB2BOrganizationMemberListQueryDTO,
  GetB2BOrganizationMemberListResponse,
  getB2BOrganizationMemberListResponseDTO,
  getB2BOrganizationMemberParamDTO,
  GetB2BOrganizationMemberParams,
} from '../../../dto/b2b/b2b.organizationMember.dto';
import { B2BOrganizationMemberService } from '../../../services/b2b/b2b.organizationMember.service';
import { verifyAccess } from '../../hooks/onRequest/verifyAccess';

@Controller({
  route: '/b2b/organization-members',
  type: 0,
  tags: [{ name: 'b2b-organization-members' }],
})
export class B2BOrganizationMemberController {
  @Inject(B2BOrganizationMemberService)
  private service!: B2BOrganizationMemberService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getB2BOrganizationMemberListQueryDTO,
        response: {
          200: getB2BOrganizationMemberListResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getB2BOrganizationMemberList(
    req: FastifyRequest<{
      Querystring: GetB2BOrganizationMemberListQuery;
    }>,
  ): Promise<GetB2BOrganizationMemberListResponse> {
    const [organizationMembers, count] = await this.service.getB2BOrganizationMemberList(
      req.query,
      req.user,
    );

    return {
      code: 200,
      count,
      data: organizationMembers,
    };
  }

  @GET({
    url: '/:memberId',
    options: {
      schema: {
        params: getB2BOrganizationMemberParamDTO,
        response: {
          200: getB2BOrganizationMemberDetailResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getB2BOrganizationMemberDetail(
    req: FastifyRequest<{
      Params: GetB2BOrganizationMemberParams;
    }>,
  ): Promise<GetB2BOrganizationMemberDetailResponse> {
    const memberDetail = await this.service.getB2BOrganizationMemberDetail(req.params, req.user);

    return {
      code: 200,
      data: memberDetail,
    };
  }
}
