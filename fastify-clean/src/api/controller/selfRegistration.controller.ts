import { FastifyRequest } from 'fastify';
import { Controller, Inject, POST } from 'fastify-decorators';
import {
  SelfRegisCoopOperatorBody,
  selfRegisCoopOperatorBodyDTO,
  SelfRegisCoopOperatorResponse,
  selfRegisCoopOperatorResponseDTO,
  SelfRegisterOwnerActionBody,
  selfRegisterOwnerActionBodyDTO,
  SelfRegisterOwnerActionParams,
  selfRegisterOwnerActionParamsDTO,
  selfRegisterOwnerActionResponseDTO,
  SelfRegisterOwnerBody,
  selfRegisterOwnerBodyDTO,
  SelfRegisterOwnerResponse,
  selfRegisterOwnerResponseDTO,
} from '../../dto/selfRegistration.dto';
import { SelfRegistrationService } from '../../services/selfRegistration.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

type SelfRegisterOwnerRequest = FastifyRequest<{
  Body: SelfRegisterOwnerBody;
}>;

type SelfRegisterOwnerActionRequest = FastifyRequest<{
  Params: SelfRegisterOwnerActionParams;
  Body: SelfRegisterOwnerActionBody;
}>;

type RegisterCoopOperatorRequest = FastifyRequest<{
  Body: SelfRegisCoopOperatorBody;
}>;

@Controller({
  route: '/self-registration',
  type: 0,
  tags: [{ name: 'self-registration' }],
})
export class SelfRegistrationController {
  @Inject(SelfRegistrationService)
  private service!: SelfRegistrationService;

  @POST({
    url: '/register-owner',
    options: {
      schema: {
        body: selfRegisterOwnerBodyDTO,
        response: {
          200: selfRegisterOwnerResponseDTO,
        },
      },
    },
  })
  async registerOwner(request: SelfRegisterOwnerRequest): Promise<SelfRegisterOwnerResponse> {
    const newOwner = await this.service.selfRegisterOwner(request.body);

    return {
      code: 200,
      data: newOwner,
    };
  }

  @POST({
    url: '/register-owner/:registerId/:action',
    options: {
      schema: {
        params: selfRegisterOwnerActionParamsDTO,
        body: selfRegisterOwnerActionBodyDTO,
        response: {
          200: selfRegisterOwnerActionResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async registerOwnerAction(
    request: SelfRegisterOwnerActionRequest,
  ): Promise<SelfRegisterOwnerResponse> {
    const newUser = await this.service.selfRegisterOwnerAction(
      request.params,
      request.body,
      request.user,
    );

    return {
      code: 200,
      data: newUser,
    };
  }

  @POST({
    url: '/coop-operator',
    options: {
      schema: {
        body: selfRegisCoopOperatorBodyDTO,
        response: {
          200: selfRegisCoopOperatorResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async registerCoopWorker(
    request: RegisterCoopOperatorRequest,
  ): Promise<SelfRegisCoopOperatorResponse> {
    const newCoopOperator = await this.service.registerCoopOperator(request.body, request.user.id);

    return {
      data: newCoopOperator,
    };
  }
}
