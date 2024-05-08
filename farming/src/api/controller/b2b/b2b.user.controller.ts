import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
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
  UpdateUserByIdBody,
  updateUserByIdBodyDTO,
  UpdateUserByIdParam,
  updateUserByIdParamDTO,
  UpdateUserByIdResponse,
  updateUserByIdResponseDTO,
} from '../../../dto/b2b/b2b.user.dto';
import { B2BUserService } from '../../../services/b2b/b2b.user.service';
import { verifyAccess } from '../../hooks/onRequest/verifyAccess';

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

@Controller({
  route: '/b2b/users',
  type: 0,
  tags: [{ name: 'users' }],
})
export class B2BUserController {
  @Inject(B2BUserService)
  private b2bUserService: B2BUserService;

  @POST({
    url: '/',
    options: {
      schema: {
        body: createUserBodyDTO,
        response: {
          201: createUserResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async createUser(request: createUserRequest): Promise<CreateUserResponse> {
    const user = await this.b2bUserService.createUser(request.body, request.user);
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
    const [users, count] = await this.b2bUserService.getUsers(request.query);

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
    const user = await this.b2bUserService.getUserById(request.params.userId);

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
    const user = await this.b2bUserService.getUserMe(request.user.id);

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
    const data = await this.b2bUserService.updateUserById(
      request.params.userId,
      request.body,
      request.user,
    );

    return {
      code: 200,
      data,
    };
  }
}
