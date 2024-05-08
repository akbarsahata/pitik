import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST } from 'fastify-decorators';
import { UserService } from '../../services/user.service';
import {
  GetUserSupervisorQuery,
  getUserSupervisorQueryDTO,
  GetUserSupervisorResponse,
  getUserSupervisorResponseDTO,
} from '../../dto/user.dto';
import { RegisterService } from '../../services/register.service';
import {
  registerUserItemRequestBodyDTO,
  RegisterUserRequestBody,
  RegisterUserResponse,
  registerUserResponseDTO,
} from '../../dto/register.dto';
import { verifyToken } from '../hooks/onRequest/verifyToken';

type RegisterUserRequest = FastifyRequest<{
  Body: RegisterUserRequestBody;
}>;

type GetUserSupervisorRequest = FastifyRequest<{
  Querystring: GetUserSupervisorQuery;
}>;

/**
 * TODO: This controller is used only to unblock farming integration
 * Please remove once userManagement.dao.ts in farming is updated
 */
@Controller({
  route: '/',
  type: 0,
  tags: [{ name: 'custom' }],
})
export class CustomController {
  @Inject(RegisterService)
  private service!: RegisterService;

  @Inject(UserService)
  private userService!: UserService;

  @POST({
    url: '/register',
    options: {
      schema: {
        body: registerUserItemRequestBodyDTO,
        response: {
          201: registerUserResponseDTO,
        },
      },
      onRequest: [verifyToken],
    },
  })
  async register(request: RegisterUserRequest, reply: FastifyReply): Promise<RegisterUserResponse> {
    const user = await this.service.register(request.body);

    reply.code(201);

    return {
      code: 201,
      data: user,
    };
  }

  @GET({
    url: '/users-supervisor',
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
  async getUsersSupervisor(request: GetUserSupervisorRequest): Promise<GetUserSupervisorResponse> {
    const [userSupervisors, count] = await this.userService.getUserSupervisor(request.query);

    return {
      code: 200,
      count,
      data: userSupervisors,
    };
  }
}
