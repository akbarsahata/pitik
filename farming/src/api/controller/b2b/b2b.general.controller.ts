import { Controller, GET, Inject } from 'fastify-decorators';
import {
  b2bGetCoopListResponseDTO,
  b2bGetFarmListResponseDTO,
  GetB2BCoopListResponse,
  GetB2BFarmListResponse,
} from '../../../dto/b2b/b2b.farmInfrastructure.dto';
import {
  b2bOrganizationMemberInfoResponseDTO,
  GetB2BOrganizationMemberInfoResponse,
} from '../../../dto/b2b/b2b.organizationMember.dto';
import { B2BFarmInfrastructureService } from '../../../services/b2b/b2b.farmInfrastructure.service';
import { B2BOrganizationMemberService } from '../../../services/b2b/b2b.organizationMember.service';
import { verifyAccess } from '../../hooks/onRequest/verifyAccess';

@Controller({
  route: '/b2b',
  type: 0,
  tags: [{ name: 'b2b-general' }],
})
export class B2BGeneralController {
  @Inject(B2BOrganizationMemberService)
  private b2bOrganizationMemberService!: B2BOrganizationMemberService;

  @Inject(B2BFarmInfrastructureService)
  private b2bFarmInfrastructureService!: B2BFarmInfrastructureService;

  @GET({
    url: '/member-info',
    options: {
      schema: {
        response: {
          200: b2bOrganizationMemberInfoResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getB2BUserInfo(req: any): Promise<GetB2BOrganizationMemberInfoResponse> {
    const userInfo = await this.b2bOrganizationMemberService.getMemberInfo(req.user.id);

    return {
      code: 200,
      data: userInfo,
    };
  }

  @GET({
    url: '/farms',
    options: {
      schema: {
        response: {
          200: b2bGetFarmListResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getB2BFarmList(req: any): Promise<GetB2BFarmListResponse> {
    const farmList = await this.b2bFarmInfrastructureService.getB2BFarmList(req.user);

    return {
      code: 200,
      data:
        farmList.map((farm) => ({
          farmId: farm.id,
          farmCode: farm.farmCode,
          farmName: farm.farmName,
        })) || [],
    };
  }

  @GET({
    url: '/coops',
    options: {
      schema: {
        response: {
          200: b2bGetCoopListResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getB2BCoopList(req: any): Promise<GetB2BCoopListResponse> {
    const coopList = await this.b2bFarmInfrastructureService.getB2BCoopList(req.user);

    return {
      code: 200,
      data:
        coopList?.map((coop) => ({
          coopId: coop.id,
          coopCode: coop.coopCode,
          coopName: coop.coopName,
        })) || [],
    };
  }
}
