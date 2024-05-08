import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST } from 'fastify-decorators';
import {
  registerUserItemRequestBodyDTO,
  RegisterUserRequestBody,
  RegisterUserResponse,
  registerUserResponseDTO,
} from '../../../dto/usermanagement/register.dto';
import {
  GetUserSupervisorQuery,
  getUserSupervisorQueryDTO,
  GetUserSupervisorResponse,
  getUserSupervisorResponseDTO,
} from '../../../dto/usermanagement/userCore.dto';
import { RegisterService } from '../../../services/usermanagement/register.service';
import { UserService } from '../../../services/usermanagement/userCore.service';
import { verifyToken } from '../../hooks/onRequest/verifyToken';

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
  route: '/user-management',
  type: 0,
  tags: [{ name: 'user-management-custom' }],
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
