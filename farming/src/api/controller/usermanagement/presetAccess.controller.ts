import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  applyPresetAccessBodyDTO,
  applyPresetAccessParamsDTO,
  ApplyPresetAccessRequestBody,
  ApplyPresetAccessRequestParams,
  ApplyPresetAccessResponse,
  applyPresetAccessResponseDTO,
  createPresetAccessItemRequestBodyDTO,
  CreatePresetAccessRequestBody,
  CreatePresetAccessResponse,
  createPresetAccessResponseDTO,
  GetPresetAccessByIdResponse,
  getPresetAccessByIdResponseDTO,
  GetPresetAccessParams,
  getPresetAccessParamsDTO,
  GetPresetAccesssQuery,
  getPresetAccesssQueryDTO,
  GetPresetAccesssResponse,
  getPresetAccesssResponseDTO,
  UpdatePresetAccessBody,
  updatePresetAccessBodyDTO,
  UpdatePresetAccessParams,
  updatePresetAccessParamsDTO,
  UpdatePresetAccessResponse,
  updatePresetAccessResponseDTO,
} from '../../../dto/usermanagement/presetAcccess.dto';
import { PresetAccessService } from '../../../services/usermanagement/presetAccess.service';
import { verifyAdmin } from '../../hooks/onRequest/verifyAdmin';
import { verifyToken } from '../../hooks/onRequest/verifyToken';

type CreatePresetAccessRequest = FastifyRequest<{
  Body: CreatePresetAccessRequestBody;
}>;

type GetPresetAccesssRequest = FastifyRequest<{
  Querystring: GetPresetAccesssQuery;
}>;

type GetPresetAccessByIdRequest = FastifyRequest<{
  Params: GetPresetAccessParams;
}>;

type UpdatePresetAccessRequest = FastifyRequest<{
  Params: UpdatePresetAccessParams;
  Body: UpdatePresetAccessBody;
}>;

type ApplyPresetAccessRequest = FastifyRequest<{
  Params: ApplyPresetAccessRequestParams;
  Body: ApplyPresetAccessRequestBody;
}>;

@Controller({
  route: '/preset-access',
  type: 0,
  tags: [{ name: 'preset-access' }],
})
export class PresetAccessController {
  @Inject(PresetAccessService)
  private service!: PresetAccessService;

  @POST({
    url: '/',
    options: {
      schema: {
        body: createPresetAccessItemRequestBodyDTO,
        response: {
          201: createPresetAccessResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async create(
    request: CreatePresetAccessRequest,
    reply: FastifyReply,
  ): Promise<CreatePresetAccessResponse> {
    const presetAccess = await this.service.create(request.body, request.user);

    reply.code(201);

    return {
      code: 201,
      data: presetAccess,
    };
  }

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getPresetAccesssQueryDTO,
        response: {
          200: getPresetAccesssResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async get(request: GetPresetAccesssRequest): Promise<GetPresetAccesssResponse> {
    const [presetAccesss, count] = await this.service.getMany(request.query);

    return {
      code: 200,
      count,
      data: presetAccesss,
    };
  }

  @GET({
    url: '/:presetAccessId',
    options: {
      schema: {
        params: getPresetAccessParamsDTO,
        response: {
          200: getPresetAccessByIdResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async getById(request: GetPresetAccessByIdRequest): Promise<GetPresetAccessByIdResponse> {
    const presetAccess = await this.service.getById(request.params.presetAccessId);

    return {
      code: 200,
      data: presetAccess,
    };
  }

  @PUT({
    url: '/:presetAccessId',
    options: {
      schema: {
        params: updatePresetAccessParamsDTO,
        body: updatePresetAccessBodyDTO,
        response: {
          200: updatePresetAccessResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async update(request: UpdatePresetAccessRequest): Promise<UpdatePresetAccessResponse> {
    const presetAccess = await this.service.update(
      request.user,
      request.body,
      request.params.presetAccessId,
    );

    return {
      code: 200,
      data: presetAccess,
    };
  }

  @POST({
    url: '/:presetAccessId/apply-preset-access',
    options: {
      schema: {
        params: applyPresetAccessParamsDTO,
        body: applyPresetAccessBodyDTO,
        response: {
          200: applyPresetAccessResponseDTO,
        },
      },
      onRequest: [verifyToken, verifyAdmin],
    },
  })
  async applyPresetAccess(request: ApplyPresetAccessRequest): Promise<ApplyPresetAccessResponse> {
    const appliedPresetAccess = await this.service.applyPresetAccess(
      request.params.presetAccessId,
      request.body,
      request.user,
    );

    return {
      code: 200,
      data: appliedPresetAccess,
    };
  }
}
