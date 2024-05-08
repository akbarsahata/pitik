import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject, PATCH, POST, PUT } from 'fastify-decorators';
import {
  CreateUserBody,
  createUserBodyDTO,
  CreateUserResponse,
  createUserResponseDTO,
  GetUserByIdParam,
  getUserByIdParamDTO,
  GetUserByIdResponse,
  getUserByIdResponseDTO,
  GetUserMeItemResponse,
  getUserMeResponseDTO,
  GetUsersQueryString,
  getUsersQueryStringDTO,
  GetUsersResponse,
  getUsersResponseDTO,
  PatchMeRequestBody,
  patchMeRequestBodyDTO,
  UpdateUserBranchByIdBody,
  updateUserBranchByIdBodyDTO,
  UpdateUserBranchByIdParam,
  updateUserBranchByIdParamDTO,
  UpdateUserBranchByIdResponse,
  updateUserBranchByIdResponseDTO,
  UpdateUserByIdBody,
  updateUserByIdBodyDTO,
  UpdateUserByIdParam,
  updateUserByIdParamDTO,
  UpdateUserByIdResponse,
  updateUserByIdResponseDTO,
} from '../../dto/user.dto';
import { UserService } from '../../services/user.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

type createUserRequest = FastifyRequest<{
  Body: CreateUserBody;
}>;

type getUsersRequest = FastifyRequest<{
  Querystring: GetUsersQueryString;
}>;

type getUserByIdRequest = FastifyRequest<{
  Params: GetUserByIdParam;
}>;

type updateUserByIdRequest = FastifyRequest<{
  Params: UpdateUserByIdParam;
  Body: UpdateUserByIdBody;
}>;

type patchMeRequest = FastifyRequest<{
  Body: PatchMeRequestBody;
}>;

type updateUserBranchByIdRequest = FastifyRequest<{
  Params: UpdateUserBranchByIdParam;
  Body: UpdateUserBranchByIdBody;
}>;

@Controller({
  route: '/users',
  type: 0,
  tags: [{ name: 'users' }],
})
export class UserController {
  @Inject(UserService)
  private userService: UserService;

  @POST({
    url: '/',
    options: {
      schema: {
        body: createUserBodyDTO,
        response: {
          '2xx': createUserResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async createUser(request: createUserRequest): Promise<CreateUserResponse> {
    const user = await this.userService.createUser(request.body, request.user);
    return {
      code: 201,
      data: {
        ...user,
      },
    };
  }

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getUsersQueryStringDTO,
        response: {
          200: getUsersResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getUsers(request: getUsersRequest): Promise<GetUsersResponse> {
    const [users, count] = await this.userService.getUsers(request.query);

    return {
      code: 200,
      count,
      data: users,
    };
  }

  @GET({
    url: '/:userId',
    options: {
      schema: {
        params: getUserByIdParamDTO,
        response: {
          200: getUserByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getUserById(request: getUserByIdRequest): Promise<GetUserByIdResponse> {
    const user = await this.userService.getUserById(request.params.userId);

    return {
      code: 200,
      data: user,
    };
  }

  @GET({
    url: '/me',
    options: {
      schema: {
        response: {
          200: getUserMeResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getUserMe(request: any): Promise<GetUserMeItemResponse> {
    const user = await this.userService.getUserMe(request.user.id);

    return {
      code: 200,
      data: user,
    };
  }

  @PUT({
    url: '/:userId',
    options: {
      schema: {
        params: updateUserByIdParamDTO,
        body: updateUserByIdBodyDTO,
        response: {
          200: updateUserByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async updateUserById(request: updateUserByIdRequest): Promise<UpdateUserByIdResponse> {
    const data = await this.userService.updateUserById(
      request.params.userId,
      request.body,
      request.user,
    );

    return {
      code: 200,
      data,
    };
  }

  @PATCH({
    url: '/me',
    options: {
      schema: {
        body: patchMeRequestBodyDTO,
        response: {
          200: updateUserByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async patchMeUpdate(request: patchMeRequest): Promise<UpdateUserByIdResponse> {
    const data = await this.userService.patchMeUpdate(request.body, request.user);

    return {
      code: 200,
      data,
    };
  }

  @PUT({
    url: '/:userId/branch',
    options: {
      schema: {
        params: updateUserBranchByIdParamDTO,
        body: updateUserBranchByIdBodyDTO,
        response: {
          200: updateUserBranchByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async updateUserBranchById(
    request: updateUserBranchByIdRequest,
  ): Promise<UpdateUserBranchByIdResponse> {
    await this.userService.updateUserBranchById(request.params.userId, request.body, request.user);

    return {
      code: 200,
      data: {
        message: 'OK',
      },
    };
  }
}
