import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, DELETE, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  createRoleItemRequestBodyDTO,
  CreateRoleRequestBody,
  CreateRoleResponse,
  createRoleResponseDTO,
  DeleteRoleParams,
  deleteRoleParamsDTO,
  DeleteRoleResponse,
  deleteRoleResponseDTO,
  GetRoleByIdResponse,
  getRoleByIdResponseDTO,
  GetRoleParams,
  getRoleParamsDTO,
  GetRolesQuery,
  getRolesQueryDTO,
  GetRolesResponse,
  getRolesResponseDTO,
  UpdateRoleBody,
  updateRoleBodyDTO,
  UpdateRoleParams,
  updateRoleParamsDTO,
  UpdateRoleResponse,
  updateRoleResponseDTO,
} from '../../../dto/usermanagement/role.dto';
import { RoleService } from '../../../services/usermanagement/role.service';
import { verifyAdmin } from '../../hooks/onRequest/verifyAdmin';
import { verifyToken } from '../../hooks/onRequest/verifyToken';

type CreateRoleRequest = FastifyRequest<{
  Body: CreateRoleRequestBody;
}>;

type GetRolesRequest = FastifyRequest<{
  Querystring: GetRolesQuery;
}>;

type GetRoleByIdRequest = FastifyRequest<{
  Params: GetRoleParams;
}>;

type UpdateRoleRequest = FastifyRequest<{
  Params: UpdateRoleParams;
  Body: UpdateRoleBody;
}>;

type DeleteRoleRequest = FastifyRequest<{
  Params: DeleteRoleParams;
}>;

@Controller({
  route: '/roles',
  type: 0,
  tags: [{ name: 'roles' }],
})
export class RoleController {
  @Inject(RoleService)
  private service!: RoleService;

  @POST({
    url: '/',
    options: {
      schema: {
        body: createRoleItemRequestBodyDTO,
        response: {
          201: createRoleResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async create(request: CreateRoleRequest, reply: FastifyReply): Promise<CreateRoleResponse> {
    const role = await this.service.create(request.body, request.user);

    reply.code(201);

    return {
      code: 201,
      data: role,
    };
  }

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getRolesQueryDTO,
        response: {
          200: getRolesResponseDTO,
        },
      },
      onRequest: [verifyToken],
    },
  })
  async get(request: GetRolesRequest): Promise<GetRolesResponse> {
    const [roles, count] = await this.service.getMany(request.query);

    return {
      code: 200,
      count,
      data: roles,
    };
  }

  @GET({
    url: '/:roleId',
    options: {
      schema: {
        params: getRoleParamsDTO,
        response: {
          200: getRoleByIdResponseDTO,
        },
      },
      onRequest: [verifyToken],
    },
  })
  async getById(request: GetRoleByIdRequest): Promise<GetRoleByIdResponse> {
    const role = await this.service.getById(request.params.roleId);

    return {
      code: 200,
      data: role,
    };
  }

  @PUT({
    url: '/:roleId',
    options: {
      schema: {
        params: updateRoleParamsDTO,
        body: updateRoleBodyDTO,
        response: {
          200: updateRoleResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async update(request: UpdateRoleRequest): Promise<UpdateRoleResponse> {
    const role = await this.service.update(request.user, request.body, request.params.roleId);

    return {
      code: 200,
      data: role,
    };
  }

  @DELETE({
    url: '/:roleId',
    options: {
      schema: {
        params: deleteRoleParamsDTO,
        response: {
          200: deleteRoleResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async delete(request: DeleteRoleRequest): Promise<DeleteRoleResponse> {
    const result = await this.service.delete(request.params.roleId);

    return {
      code: 200,
      data: result,
    };
  }
}
