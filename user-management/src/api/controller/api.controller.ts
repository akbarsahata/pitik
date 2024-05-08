import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, DELETE, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  createApiItemRequestBodyDTO,
  CreateApiRequestBody,
  CreateApiResponse,
  createApiResponseDTO,
  DeleteApiParams,
  deleteApiParamsDTO,
  DeleteApiResponse,
  deleteApiResponseDTO,
  GetApiByIdResponse,
  getApiByIdResponseDTO,
  GetApiParams,
  getApiParamsDTO,
  GetApisQuery,
  getApisQueryDTO,
  GetApisResponse,
  getApisResponseDTO,
  UpdateApiBody,
  updateApiBodyDTO,
  UpdateApiParams,
  updateApiParamsDTO,
  UpdateApiResponse,
  updateApiResponseDTO,
} from '../../dto/api.dto';
import { ApiService } from '../../services/api.service';
import { verifyAdmin } from '../hooks/onRequest/verifyAdmin';
import { verifyToken } from '../hooks/onRequest/verifyToken';

type CreateApiRequest = FastifyRequest<{
  Body: CreateApiRequestBody;
}>;

type GetApisRequest = FastifyRequest<{
  Querystring: GetApisQuery;
}>;

type GetApiByIdRequest = FastifyRequest<{
  Params: GetApiParams;
}>;

type UpdateApiRequest = FastifyRequest<{
  Params: UpdateApiParams;
  Body: UpdateApiBody;
}>;

type DeleteApiRequest = FastifyRequest<{
  Params: DeleteApiParams;
}>;

@Controller({
  route: '/apis',
  type: 0,
  tags: [{ name: 'apis' }],
})
export class ApiController {
  @Inject(ApiService)
  private service!: ApiService;

  @POST({
    url: '/',
    options: {
      schema: {
        body: createApiItemRequestBodyDTO,
        response: {
          201: createApiResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async create(request: CreateApiRequest, reply: FastifyReply): Promise<CreateApiResponse> {
    const api = await this.service.create(request.body, request.user);

    reply.code(201);

    return {
      code: 201,
      data: api,
    };
  }

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getApisQueryDTO,
        response: {
          200: getApisResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async get(request: GetApisRequest): Promise<GetApisResponse> {
    const [roles, count] = await this.service.getMany(request.query);

    return {
      code: 200,
      count,
      data: roles,
    };
  }

  @GET({
    url: '/:apiId',
    options: {
      schema: {
        params: getApiParamsDTO,
        response: {
          200: getApiByIdResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async getById(request: GetApiByIdRequest): Promise<GetApiByIdResponse> {
    const api = await this.service.getById(request.params.apiId);

    return {
      code: 200,
      data: api,
    };
  }

  @PUT({
    url: '/:apiId',
    options: {
      schema: {
        params: updateApiParamsDTO,
        body: updateApiBodyDTO,
        response: {
          200: updateApiResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async update(request: UpdateApiRequest): Promise<UpdateApiResponse> {
    const api = await this.service.update(request.user, request.body, request.params.apiId);

    return {
      code: 200,
      data: api,
    };
  }

  @DELETE({
    url: '/:apiId',
    options: {
      schema: {
        params: deleteApiParamsDTO,
        response: {
          200: deleteApiResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async delete(request: DeleteApiRequest): Promise<DeleteApiResponse> {
    const result = await this.service.delete(request.params.apiId);

    return {
      code: 200,
      data: result,
    };
  }
}
