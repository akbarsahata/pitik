import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  createRoleRankItemRequestBodyDTO,
  CreateRoleRankRequestBody,
  CreateRoleRankResponse,
  createRoleRankResponseDTO,
  GetRoleRankByIdResponse,
  getRoleRankByIdResponseDTO,
  GetRoleRankParams,
  getRoleRankParamsDTO,
  GetRoleRanksQuery,
  getRoleRanksQueryDTO,
  GetRoleRanksResponse,
  getRoleRanksResponseDTO,
  UpdateRoleRankBody,
  updateRoleRankBodyDTO,
  UpdateRoleRankParams,
  updateRoleRankParamsDTO,
  UpdateRoleRankResponse,
  updateRoleRankResponseDTO,
} from '../../../dto/usermanagement/roleRank.dto';
import { RoleRankService } from '../../../services/usermanagement/roleRank.service';
import { verifyAdmin } from '../../hooks/onRequest/verifyAdmin';
import { verifyToken } from '../../hooks/onRequest/verifyToken';

type CreateRoleRankRequest = FastifyRequest<{
  Body: CreateRoleRankRequestBody;
}>;

type GetRoleRankRequest = FastifyRequest<{
  Querystring: GetRoleRanksQuery;
}>;

type GetRoleRankByIdRequest = FastifyRequest<{
  Params: GetRoleRankParams;
}>;

type UpdateRoleRankRequest = FastifyRequest<{
  Params: UpdateRoleRankParams;
  Body: UpdateRoleRankBody;
}>;

@Controller({
  route: '/role-ranks',
  type: 0,
  tags: [{ name: 'role-ranks' }],
})
export class RoleRankController {
  @Inject(RoleRankService)
  private service!: RoleRankService;

  @POST({
    url: '/',
    options: {
      schema: {
        body: createRoleRankItemRequestBodyDTO,
        response: {
          201: createRoleRankResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async create(
    request: CreateRoleRankRequest,
    reply: FastifyReply,
  ): Promise<CreateRoleRankResponse> {
    const roleRank = await this.service.create(request.body, request.user);

    reply.code(201);

    return {
      code: 201,
      data: roleRank,
    };
  }

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getRoleRanksQueryDTO,
        response: {
          200: getRoleRanksResponseDTO,
        },
      },
      onRequest: [verifyToken],
    },
  })
  async get(request: GetRoleRankRequest): Promise<GetRoleRanksResponse> {
    const [roleRanks, count] = await this.service.getMany(request.query);

    return {
      code: 200,
      count,
      data: roleRanks,
    };
  }

  @GET({
    url: '/:roleRankId',
    options: {
      schema: {
        params: getRoleRankParamsDTO,
        response: {
          200: getRoleRankByIdResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async getById(request: GetRoleRankByIdRequest): Promise<GetRoleRankByIdResponse> {
    const role = await this.service.getById(request.params.roleRankId);

    return {
      code: 200,
      data: role,
    };
  }

  @PUT({
    url: '/:roleRankId',
    options: {
      schema: {
        params: updateRoleRankParamsDTO,
        body: updateRoleRankBodyDTO,
        response: {
          200: updateRoleRankResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async update(request: UpdateRoleRankRequest): Promise<UpdateRoleRankResponse> {
    const role = await this.service.update(request.user, request.body, request.params.roleRankId);

    return {
      code: 200,
      data: role,
    };
  }
}
