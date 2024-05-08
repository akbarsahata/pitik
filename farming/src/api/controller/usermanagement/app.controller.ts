import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, DELETE, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  createAppItemRequestBodyDTO,
  CreateAppRequestBody,
  CreateAppResponse,
  createAppResponseDTO,
  DeleteAppParams,
  deleteAppParamsDTO,
  DeleteAppResponse,
  deleteAppResponseDTO,
  GetAppByIdResponse,
  getAppByIdResponseDTO,
  GetAppParams,
  getAppParamsDTO,
  GetAppsQuery,
  getAppsQueryDTO,
  GetAppsResponse,
  getAppsResponseDTO,
  UpdateAppBody,
  updateAppBodyDTO,
  UpdateAppParams,
  updateAppParamsDTO,
  UpdateAppResponse,
  updateAppResponseDTO,
} from '../../../dto/usermanagement/app.dto';
import { AppService } from '../../../services/usermanagement/app.service';
import { verifyAdmin } from '../../hooks/onRequest/verifyAdmin';
import { verifyToken } from '../../hooks/onRequest/verifyToken';

type CreateAppRequest = FastifyRequest<{
  Body: CreateAppRequestBody;
}>;

type GetAppsRequest = FastifyRequest<{
  Querystring: GetAppsQuery;
}>;

type GetAppByIdRequest = FastifyRequest<{
  Params: GetAppParams;
}>;

type UpdateAppRequest = FastifyRequest<{
  Params: UpdateAppParams;
  Body: UpdateAppBody;
}>;

type DeleteAppRequest = FastifyRequest<{
  Params: DeleteAppParams;
}>;

@Controller({
  route: '/apps',
  type: 0,
  tags: [{ name: 'apps' }],
})
export class AppController {
  @Inject(AppService)
  private service!: AppService;

  @POST({
    url: '/',
    options: {
      schema: {
        body: createAppItemRequestBodyDTO,
        response: {
          201: createAppResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async create(request: CreateAppRequest, reply: FastifyReply): Promise<CreateAppResponse> {
    const app = await this.service.create(request.body, request.user);

    reply.code(201);

    return {
      code: 201,
      data: app,
    };
  }

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getAppsQueryDTO,
        response: {
          200: getAppsResponseDTO,
        },
      },
      onRequest: [verifyToken],
    },
  })
  async get(request: GetAppsRequest): Promise<GetAppsResponse> {
    const [apps, count] = await this.service.getMany(request.query);

    return {
      code: 200,
      count,
      data: apps,
    };
  }

  @GET({
    url: '/:appId',
    options: {
      schema: {
        params: getAppParamsDTO,
        response: {
          200: getAppByIdResponseDTO,
        },
      },
      onRequest: [verifyToken],
    },
  })
  async getById(request: GetAppByIdRequest): Promise<GetAppByIdResponse> {
    const app = await this.service.getById(request.params.appId);

    return {
      code: 200,
      data: app,
    };
  }

  @PUT({
    url: '/:appId',
    options: {
      schema: {
        params: updateAppParamsDTO,
        body: updateAppBodyDTO,
        response: {
          200: updateAppResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async update(request: UpdateAppRequest): Promise<UpdateAppResponse> {
    const app = await this.service.update(request.user, request.body, request.params.appId);

    return {
      code: 200,
      data: app,
    };
  }

  @DELETE({
    url: '/:appId',
    options: {
      schema: {
        params: deleteAppParamsDTO,
        response: {
          200: deleteAppResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async delete(request: DeleteAppRequest): Promise<DeleteAppResponse> {
    const result = await this.service.delete(request.params.appId);

    return {
      code: 200,
      data: result,
    };
  }
}
