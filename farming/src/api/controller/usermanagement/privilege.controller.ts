import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  createPrivilegeItemRequestBodyDTO,
  CreatePrivilegeRequestBody,
  CreatePrivilegeResponse,
  createPrivilegeResponseDTO,
  GetPrivilegeByIdResponse,
  getPrivilegeByIdResponseDTO,
  GetPrivilegeParams,
  getPrivilegeParamsDTO,
  GetPrivilegesQuery,
  getPrivilegesQueryDTO,
  GetPrivilegesResponse,
  getPrivilegesResponseDTO,
  UpdatePrivilegeBody,
  updatePrivilegeBodyDTO,
  UpdatePrivilegeParams,
  updatePrivilegeParamsDTO,
  UpdatePrivilegeResponse,
  updatePrivilegeResponseDTO,
} from '../../../dto/usermanagement/privilege.dto';
import { PrivilegeService } from '../../../services/usermanagement/privilege.service';
import { verifyAdmin } from '../../hooks/onRequest/verifyAdmin';
import { verifyToken } from '../../hooks/onRequest/verifyToken';

type CreatePrivilegeRequest = FastifyRequest<{
  Body: CreatePrivilegeRequestBody;
}>;

type GetPrivilegesRequest = FastifyRequest<{
  Querystring: GetPrivilegesQuery;
}>;

type GetPrivilegeByIdRequest = FastifyRequest<{
  Params: GetPrivilegeParams;
}>;

type UpdatePrivilegeRequest = FastifyRequest<{
  Params: UpdatePrivilegeParams;
  Body: UpdatePrivilegeBody;
}>;

@Controller({
  route: '/privileges',
  type: 0,
  tags: [{ name: 'privileges' }],
})
export class PrivilegeController {
  @Inject(PrivilegeService)
  private service!: PrivilegeService;

  @POST({
    url: '/',
    options: {
      schema: {
        body: createPrivilegeItemRequestBodyDTO,
        response: {
          201: createPrivilegeResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async create(
    request: CreatePrivilegeRequest,
    reply: FastifyReply,
  ): Promise<CreatePrivilegeResponse> {
    const privilege = await this.service.create(request.body, request.user);

    reply.code(201);

    return {
      code: 201,
      data: privilege,
    };
  }

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getPrivilegesQueryDTO,
        response: {
          200: getPrivilegesResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async get(request: GetPrivilegesRequest): Promise<GetPrivilegesResponse> {
    const [privileges, count] = await this.service.getMany(request.query);

    return {
      code: 200,
      count,
      data: privileges,
    };
  }

  @GET({
    url: '/:privilegeId',
    options: {
      schema: {
        params: getPrivilegeParamsDTO,
        response: {
          200: getPrivilegeByIdResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async getById(request: GetPrivilegeByIdRequest): Promise<GetPrivilegeByIdResponse> {
    const privilege = await this.service.getById(request.params.privilegeId);

    return {
      code: 200,
      data: privilege,
    };
  }

  @PUT({
    url: '/:privilegeId',
    options: {
      schema: {
        params: updatePrivilegeParamsDTO,
        body: updatePrivilegeBodyDTO,
        response: {
          200: updatePrivilegeResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async update(request: UpdatePrivilegeRequest): Promise<UpdatePrivilegeResponse> {
    const privilege = await this.service.update(
      request.user,
      request.body,
      request.params.privilegeId,
    );

    return {
      code: 200,
      data: privilege,
    };
  }
}
