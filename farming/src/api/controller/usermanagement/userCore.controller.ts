import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, PATCH, POST, PUT } from 'fastify-decorators';
import {
  createUserItemRequestBodyDTO,
  CreateUserRequestBody,
  CreateUserResponse,
  createUserResponseDTO,
  GetSubordinatesQuery,
  getSubordinatesQueryDTO,
  GetSubordinatesResponse,
  getSubordinatesResponseDTO,
  GetUserByIdResponse,
  getUserByIdResponseDTO,
  GetUserParams,
  getUserParamsDTO,
  GetUserRolesResponse,
  getUserRolesResponseDTO,
  GetUsersQuery,
  getUsersQueryDTO,
  GetUsersResponse,
  getUsersResponseDTO,
  GetUserSupervisorChainListParams,
  getUserSupervisorChainListParamsDTO,
  GetUserSupervisorChainListResponse,
  getUserSupervisorChainListResponseDTO,
  GetUserSupervisorQuery,
  getUserSupervisorQueryDTO,
  GetUserSupervisorResponse,
  getUserSupervisorResponseDTO,

  // TODO: Please remove CustomController Once userManagementDAO in Farming is updated
  patchUserBodyDTO,
  PatchUserRequestBody,
  SearchUserIdsQuery,
  searchUserIdsQueryDTO,
  SearchUserIdsResponse,
  searchUserIdsResponseDTO,
  SearchUsersBody,
  searchUsersBodyDTO,
  UpdateUserBody,
  updateUserBodyDTO,
  UpdateUserParams,
  updateUserParamsDTO,
  UpdateUserResponse,
  updateUserResponseDTO,
} from '../../../dto/usermanagement/userCore.dto';
import { UserService } from '../../../services/usermanagement/userCore.service';
import { verifyToken } from '../../hooks/onRequest/verifyToken';

type CreateUserRequest = FastifyRequest<{
  Body: CreateUserRequestBody;
}>;

type GetUsersRequest = FastifyRequest<{
  Querystring: GetUsersQuery;
}>;

type GetUserByIdRequest = FastifyRequest<{
  Params: GetUserParams;
}>;

type GetUserSupervisorRequest = FastifyRequest<{
  Querystring: GetUserSupervisorQuery;
}>;

type GetUserSupervisorChainListRequest = FastifyRequest<{
  Params: GetUserSupervisorChainListParams;
}>;

type UpdateUserRequest = FastifyRequest<{
  Params: UpdateUserParams;
  Body: UpdateUserBody;
}>;

/**
 * TODO: This type is used only to unblock farming integration
 * Please remove once userManagement.dao.ts in farming is updated
 */
type PatchUserRequest = FastifyRequest<{
  Params: UpdateUserParams;
  Body: PatchUserRequestBody;
}>;

@Controller({
  route: '/user-management',
  type: 0,
  tags: [{ name: 'user-management' }],
})
export class UserCoreController {
  @Inject(UserService)
  private userService!: UserService;

  @POST({
    url: '/',
    options: {
      schema: {
        body: createUserItemRequestBodyDTO,
        response: {
          201: createUserResponseDTO,
        },
      },
      onRequest: [verifyToken],
    },
  })
  async create(request: CreateUserRequest, reply: FastifyReply): Promise<CreateUserResponse> {
    const user = await this.userService.create(request.body, request.user);

    reply.code(201);

    return {
      code: 201,
      data: user,
    };
  }

  @POST({
    url: '/registration',
    options: {
      schema: {
        body: createUserItemRequestBodyDTO,
        response: {
          201: createUserResponseDTO,
        },
      },
    },
  })
  async register(request: CreateUserRequest, reply: FastifyReply): Promise<CreateUserResponse> {
    const user = await this.userService.register(request.body);

    reply.code(201);

    return {
      code: 201,
      data: user,
    };
  }

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getUsersQueryDTO,
        response: {
          200: getUsersResponseDTO,
        },
      },
      onRequest: [verifyToken],
    },
  })
  async get(request: GetUsersRequest): Promise<GetUsersResponse> {
    const [users, count] = await this.userService.getMany(request.query);

    return {
      code: 200,
      count,
      data: users,
    };
  }

  @POST({
    url: '/search',
    options: {
      schema: {
        body: searchUsersBodyDTO,
        response: {
          200: getUsersResponseDTO,
        },
      },
      onRequest: [verifyToken],
    },
  })
  async search(
    request: FastifyRequest<{
      Body: SearchUsersBody;
    }>,
  ): Promise<GetUsersResponse> {
    const [users, count] = await this.userService.search(request.body);

    return {
      code: 200,
      count,
      data: users,
    };
  }

  @GET({
    url: '/search-ids',
    options: {
      schema: {
        querystring: searchUserIdsQueryDTO,
        response: {
          200: searchUserIdsResponseDTO,
        },
      },
      onRequest: [verifyToken],
    },
  })
  async searchUserIds(
    request: FastifyRequest<{
      Querystring: SearchUserIdsQuery;
    }>,
  ): Promise<SearchUserIdsResponse> {
    const [users, count] = await this.userService.searchUserIds(request.query);

    return {
      code: 200,
      count,
      data: users,
    };
  }

  @GET({
    url: '/me',
    options: {
      schema: {
        response: {
          200: getUserByIdResponseDTO,
        },
      },
      onRequest: [verifyToken],
    },
  })
  async getMe(request: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    const userMe = await this.userService.getById(request.user.id);

    return {
      code: 200,
      data: userMe,
    };
  }

  @GET({
    url: '/:userId',
    options: {
      schema: {
        params: getUserParamsDTO,
        response: {
          200: getUserByIdResponseDTO,
        },
      },
      onRequest: [verifyToken],
    },
  })
  async getById(request: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    const user = await this.userService.getById(request.params.userId);

    return {
      code: 200,
      data: user,
    };
  }

  @GET({
    url: '/supervisor',
    options: {
      schema: {
        querystring: getUserSupervisorQueryDTO,
        response: {
          200: getUserSupervisorResponseDTO,
        },
      },
      onRequest: [verifyToken],
    },
  })
  async getUserSupervisor(request: GetUserSupervisorRequest): Promise<GetUserSupervisorResponse> {
    const [userSupervisors, count] = await this.userService.getUserSupervisor(request.query);

    return {
      code: 200,
      count,
      data: userSupervisors,
    };
  }

  @GET({
    url: '/supervisor/:idCms/chain-list',
    options: {
      schema: {
        params: getUserSupervisorChainListParamsDTO,
        response: {
          200: getUserSupervisorChainListResponseDTO,
        },
      },
      onRequest: [verifyToken],
    },
  })
  async getUserSupervisorChainList(
    request: GetUserSupervisorChainListRequest,
  ): Promise<GetUserSupervisorChainListResponse> {
    const [chainList, count] = await this.userService.getUserSupervisorChainList(
      request.params.idCms,
    );

    return {
      code: 200,
      count,
      data: chainList,
    };
  }

  @PUT({
    url: '/:userId',
    options: {
      schema: {
        params: updateUserParamsDTO,
        body: updateUserBodyDTO,
        response: {
          200: updateUserResponseDTO,
        },
      },
      onRequest: [verifyToken],
    },
  })
  async update(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    const user = await this.userService.update(request.user, request.body, request.params.userId);

    return {
      code: 200,
      data: user,
    };
  }

  /**
   * TODO: This function is used only to unblock farming integration
   * Please remove once userManagement.dao.ts in farming is updated
   */
  @PATCH({
    url: '/:userId',
    options: {
      schema: {
        params: updateUserParamsDTO,
        body: patchUserBodyDTO,
        response: {
          200: updateUserResponseDTO,
        },
      },
      onRequest: [verifyToken],
    },
  })
  async patch(request: PatchUserRequest): Promise<UpdateUserResponse> {
    const user = await this.userService.patch(request.body, request.params.userId);

    return {
      code: 200,
      data: user,
    };
  }

  @GET({
    url: '/:userId/roles',
    options: {
      schema: {
        params: getUserParamsDTO,
        response: {
          200: getUserRolesResponseDTO,
        },
      },
    },
  })
  async getUserRoles(request: GetUserByIdRequest): Promise<GetUserRolesResponse> {
    const [roles, count] = await this.userService.getUserRoles(request.params.userId);

    return {
      code: 200,
      count,
      data: roles,
    };
  }

  @GET({
    url: '/:userId/subordinates',
    options: {
      schema: {
        params: getUserParamsDTO,
        querystring: getSubordinatesQueryDTO,
        response: {
          200: getSubordinatesResponseDTO,
        },
      },
    },
  })
  async getSubordinates(
    request: FastifyRequest<{
      Querystring: GetSubordinatesQuery;
      Params: GetUserParams;
    }>,
  ): Promise<GetSubordinatesResponse> {
    const [subordinates, count] = await this.userService.getSubordinates(request);

    return {
      code: 200,
      count,
      data: subordinates,
    };
  }
}
