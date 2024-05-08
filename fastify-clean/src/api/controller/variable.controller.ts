import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  CreateVariableBody,
  createVariableBodyDTO,
  CreateVariableResponse,
  createVariableResponseDTO,
  GetVariableByIdParams,
  getVariableByIdParamsDTO,
  GetVariableByIdResponse,
  getVariableByIdResponseDTO,
  GetVariableQuery,
  getVariableQueryDTO,
  GetVariableResponse,
  getVariableResponseDTO,
  UpdateVariableBody,
  updateVariableBodyDTO,
  UpdateVariableParams,
  updateVariableParamsDTO,
  UpdateVariableResponse,
  updateVariableResponseDTO,
} from '../../dto/variable.dto';
import { VariableService } from '../../services/variable.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

type createVariableRequest = FastifyRequest<{
  Body: CreateVariableBody;
}>;

@Controller({
  route: '/variables',
  type: 0,
  tags: [{ name: 'variables' }],
})
export class VariableController {
  @Inject(VariableService)
  private service: VariableService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getVariableQueryDTO,
        response: {
          200: getVariableResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async get(
    request: FastifyRequest<{
      Querystring: GetVariableQuery;
    }>,
  ): Promise<GetVariableResponse> {
    const [variables, count] = await this.service.getMany(request.query);
    return {
      code: 200,
      count,
      data: variables.map((variable) => ({
        ...variable,
        modifiedDate: variable.modifiedDate && variable.modifiedDate.toISOString(),
        modifiedBy: variable.userModifier?.fullName || variable.modifiedBy,
      })),
    };
  }

  @GET({
    url: '/:id',
    options: {
      schema: {
        params: getVariableByIdParamsDTO,
        response: {
          200: getVariableByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getById(
    request: FastifyRequest<{
      Params: GetVariableByIdParams;
    }>,
  ): Promise<GetVariableByIdResponse> {
    const variable = await this.service.getById(request.params.id);

    return {
      code: 200,
      data: {
        ...variable,
        modifiedDate: variable.modifiedDate && variable.modifiedDate.toISOString(),
      },
    };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: createVariableBodyDTO,
        response: {
          201: createVariableResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async create(
    request: createVariableRequest,
    reply: FastifyReply,
  ): Promise<CreateVariableResponse> {
    const variable = await this.service.create(request.body, request.user);

    reply.code(201);

    return {
      code: 201,
      data: {
        ...variable,
        createdDate: variable.createdDate.toISOString(),
      },
    };
  }

  @PUT({
    url: '/:id',
    options: {
      schema: {
        params: updateVariableParamsDTO,
        body: updateVariableBodyDTO,
        response: {
          200: updateVariableResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async update(
    request: FastifyRequest<{
      Params: UpdateVariableParams;
      Body: UpdateVariableBody;
    }>,
  ): Promise<UpdateVariableResponse> {
    const target = await this.service.update(
      request.params.id,
      { ...request.body, id: request.params.id },
      request.user,
    );

    return {
      code: 200,
      data: {
        ...target,
        modifiedDate: target.modifiedDate.toISOString(),
      },
    };
  }
}
