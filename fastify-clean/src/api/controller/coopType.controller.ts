import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  CreateCoopTypeBody,
  createCoopTypeBodyDTO,
  CreateCoopTypeResponse,
  createCoopTypeResponseDTO,
  GetCoopTypeByIdParams,
  getCoopTypeByIdParamsDTO,
  GetCoopTypeByIdResponse,
  getCoopTypeByIdResponseDTO,
  GetCoopTypesQuery,
  getCoopTypesQueryDTO,
  GetCoopTypesResponse,
  getCoopTypesResponseDTO,
  UpdateCoopTypeBody,
  updateCoopTypeBodyDTO,
  UpdateCoopTypeParams,
  updateCoopTypeParamsDTO,
  UpdateCoopTypeResponse,
  updateCoopTypeResponseDTO,
} from '../../dto/coopType.dto';
import { CoopTypeService } from '../../services/coopType.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

@Controller({
  route: '/coop-types',
  type: 0,
  tags: [{ name: 'coop-types' }],
})
export class CoopTypeController {
  @Inject(CoopTypeService)
  private service: CoopTypeService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getCoopTypesQueryDTO,
        response: {
          200: getCoopTypesResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async get(
    request: FastifyRequest<{
      Querystring: GetCoopTypesQuery;
    }>,
  ): Promise<GetCoopTypesResponse> {
    const [coopTypes, count] = await this.service.get(request.query);

    return {
      code: 200,
      count,
      data: coopTypes.map((coopType) => ({
        ...coopType,
        createdDate: coopType.createdDate.toISOString(),
        modifiedDate: coopType.modifiedDate.toISOString(),
        modifiedBy: coopType.userModifier?.fullName || coopType.modifiedBy,
      })),
    };
  }

  @GET({
    url: '/:id',
    options: {
      schema: {
        params: getCoopTypeByIdParamsDTO,
        response: {
          200: getCoopTypeByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getById(
    request: FastifyRequest<{
      Params: GetCoopTypeByIdParams;
    }>,
  ): Promise<GetCoopTypeByIdResponse> {
    const coopType = await this.service.getById(request.params.id);

    return {
      code: 200,
      data: {
        ...coopType,
        createdDate: coopType.createdDate.toISOString(),
        modifiedDate: coopType.modifiedDate.toISOString(),
      },
    };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: createCoopTypeBodyDTO,
        response: {
          201: createCoopTypeResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async create(
    request: FastifyRequest<{
      Body: CreateCoopTypeBody;
    }>,
    reply: FastifyReply,
  ) {
    const coopType = await this.service.create(request.body, request.user);

    const responseBody: CreateCoopTypeResponse = {
      code: 201,
      data: {
        ...coopType,
        createdDate: coopType.createdDate.toISOString(),
        modifiedDate: coopType.modifiedDate.toISOString(),
      },
    };

    return reply.code(201).send(responseBody);
  }

  @PUT({
    url: '/:id',
    options: {
      schema: {
        params: updateCoopTypeParamsDTO,
        body: updateCoopTypeBodyDTO,
        response: {
          200: updateCoopTypeResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async update(
    request: FastifyRequest<{
      Params: UpdateCoopTypeParams;
      Body: UpdateCoopTypeBody;
    }>,
  ): Promise<UpdateCoopTypeResponse> {
    const coopType = await this.service.update(
      request.params.id,
      { ...request.body, id: request.params.id },
      request.user,
    );

    return {
      code: 200,
      data: {
        ...coopType,
        createdDate: coopType.createdDate.toISOString(),
        modifiedDate: coopType.modifiedDate.toISOString(),
      },
    };
  }
}
