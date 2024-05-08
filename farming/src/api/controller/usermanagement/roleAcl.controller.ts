import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, DELETE, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  createRoleAclItemRequestBodyDTO,
  CreateRoleAclRequestBody,
  CreateRoleAclResponse,
  createRoleAclResponseDTO,
  DeleteRoleAclParams,
  deleteRoleAclParamsDTO,
  DeleteRoleAclResponse,
  deleteRoleAclResponseDTO,
  GetRoleAclByIdResponse,
  getRoleAclByIdResponseDTO,
  GetRoleAclParams,
  getRoleAclParamsDTO,
  GetRoleAclsQuery,
  getRoleAclsQueryDTO,
  GetRoleAclsResponse,
  getRoleAclsResponseDTO,
  GetRoleAclValidateQuery,
  getRoleAclValidateQueryDTO,
  GetRoleAclValidateResponse,
  getRoleAclValidateResponseDTO,
  UpdateRoleAclBody,
  updateRoleAclBodyDTO,
  UpdateRoleAclParams,
  updateRoleAclParamsDTO,
  UpdateRoleAclResponse,
  updateRoleAclResponseDTO,
} from '../../../dto/usermanagement/roleAcl.dto';
import { RoleAclService } from '../../../services/usermanagement/roleAcl.service';
import { verifyAdmin } from '../../hooks/onRequest/verifyAdmin';
import { verifyToken } from '../../hooks/onRequest/verifyToken';

type CreateRoleAclRequest = FastifyRequest<{
  Body: CreateRoleAclRequestBody;
}>;

type GetRoleAclsRequest = FastifyRequest<{
  Querystring: GetRoleAclsQuery;
}>;

type GetRoleAclByIdRequest = FastifyRequest<{
  Params: GetRoleAclParams;
}>;

type GetRoleAclValidateRequest = FastifyRequest<{
  Querystring: GetRoleAclValidateQuery;
}>;

type UpdateRoleAclRequest = FastifyRequest<{
  Params: UpdateRoleAclParams;
  Body: UpdateRoleAclBody;
}>;

type DeleteRoleAclRequest = FastifyRequest<{
  Params: DeleteRoleAclParams;
}>;

@Controller({
  route: '/roles/acl',
  type: 0,
  tags: [{ name: 'roles-acl' }],
})
export class RoleAclController {
  @Inject(RoleAclService)
  private service!: RoleAclService;

  @POST({
    url: '/',
    options: {
      schema: {
        body: createRoleAclItemRequestBodyDTO,
        response: {
          201: createRoleAclResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async create(request: CreateRoleAclRequest, reply: FastifyReply): Promise<CreateRoleAclResponse> {
    const roleAcl = await this.service.create(request.body, request.user);

    reply.code(201);

    return {
      code: 201,
      data: roleAcl,
    };
  }

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getRoleAclsQueryDTO,
        response: {
          200: getRoleAclsResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async get(request: GetRoleAclsRequest): Promise<GetRoleAclsResponse> {
    const [roles, count] = await this.service.getMany(request.query);

    return {
      code: 200,
      count,
      data: roles,
    };
  }

  @GET({
    url: '/:roleAclId',
    options: {
      schema: {
        params: getRoleAclParamsDTO,
        response: {
          200: getRoleAclByIdResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async getById(request: GetRoleAclByIdRequest): Promise<GetRoleAclByIdResponse> {
    const role = await this.service.getById(request.params.roleAclId);

    return {
      code: 200,
      data: role,
    };
  }

  @GET({
    url: '/validate',
    options: {
      schema: {
        querystring: getRoleAclValidateQueryDTO,
        response: {
          200: getRoleAclValidateResponseDTO,
        },
      },
      onRequest: [verifyToken],
    },
  })
  async getRoleAclValidate(
    request: GetRoleAclValidateRequest,
  ): Promise<GetRoleAclValidateResponse> {
    const roleAclValidate = await this.service.getRoleAclValidate(request.query, request.user);

    return {
      code: 200,
      data: {
        isAllowed: roleAclValidate,
      },
    };
  }

  @PUT({
    url: '/:roleAclId',
    options: {
      schema: {
        params: updateRoleAclParamsDTO,
        body: updateRoleAclBodyDTO,
        response: {
          200: updateRoleAclResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async update(request: UpdateRoleAclRequest): Promise<UpdateRoleAclResponse> {
    const role = await this.service.update(request.user, request.body, request.params.roleAclId);

    return {
      code: 200,
      data: role,
    };
  }

  @DELETE({
    url: '/:roleAclId',
    options: {
      schema: {
        params: deleteRoleAclParamsDTO,
        response: {
          200: deleteRoleAclResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async delete(request: DeleteRoleAclRequest): Promise<DeleteRoleAclResponse> {
    const result = await this.service.delete(request.params.roleAclId);

    return {
      code: 200,
      data: result,
    };
  }
}
