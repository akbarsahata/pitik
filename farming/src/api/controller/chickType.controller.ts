import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  CreateChickTypeBody,
  createChickTypeBodyDTO,
  CreateChickTypeResponse,
  createChickTypeResponseDTO,
  GetChickTypeByIdParams,
  getChickTypeByIdParamsDTO,
  GetChickTypeByIdResponse,
  getChickTypeByIdResponseDTO,
  getChickTypeResponseDTO,
  GetChickTypesQuery,
  getChickTypesQueryDTO,
  GetChickTypesResponse,
  UpdateChickTypeByIdBody,
  updateChickTypeByIdBodyDTO,
  UpdateChickTypeByIdParams,
  updateChickTypeByIdParamsDTO,
  UpdateChickTypeByIdResponnse,
  updateChickTypeByIdResponnseDTO,
} from '../../dto/chickType.dto';
import { ChickTypeUsecase } from '../../usecases/chickType.usecase';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

type createChickTypeRequest = FastifyRequest<{
  Body: CreateChickTypeBody;
}>;

type getChickTypesRequest = FastifyRequest<{
  Querystring: GetChickTypesQuery;
}>;

type getChickTypeByIdRequest = FastifyRequest<{
  Params: GetChickTypeByIdParams;
}>;

type updateChickTypeByIdRequest = FastifyRequest<{
  Params: UpdateChickTypeByIdParams;
  Body: UpdateChickTypeByIdBody;
}>;

@Controller({
  route: '/chick-types',
  type: 0,
  tags: [{ name: 'chick-types' }],
})
export class ChickTypeController {
  @Inject(ChickTypeUsecase)
  private chickTypeUsecase: ChickTypeUsecase;

  @POST({
    url: '/',
    options: {
      schema: {
        body: createChickTypeBodyDTO,
        response: {
          '2xx': createChickTypeResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async create(request: createChickTypeRequest, reply: FastifyReply) {
    const chickType = await this.chickTypeUsecase.create(request.body, request.user);

    const responseBody: CreateChickTypeResponse = {
      code: 201,
      data: {
        ...chickType,
        createdDate: chickType.createdDate.toISOString(),
        modifiedDate: chickType.modifiedDate.toISOString(),
      },
    };
    return reply.code(201).send(responseBody);
  }

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getChickTypesQueryDTO,
        response: {
          200: getChickTypeResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async get(request: getChickTypesRequest): Promise<GetChickTypesResponse> {
    const [chickTypes, count] = await this.chickTypeUsecase.get(request.query);

    return {
      code: 200,
      count,
      data: chickTypes.map((chickType) => ({
        ...chickType,
        createdDate: chickType.createdDate.toISOString(),
        modifiedDate: chickType.modifiedDate.toISOString(),
        modifiedBy: chickType.userModifier?.fullName || chickType.modifiedBy,
      })),
    };
  }

  @GET({
    url: '/:id',
    options: {
      schema: {
        params: getChickTypeByIdParamsDTO,
        response: {
          200: getChickTypeByIdResponseDTO,
        },
      },
    },
  })
  async getById(request: getChickTypeByIdRequest): Promise<GetChickTypeByIdResponse> {
    const chickType = await this.chickTypeUsecase.getById(request.params.id);

    return {
      code: 200,
      data: {
        ...chickType,
        createdDate: chickType.createdDate.toISOString(),
        modifiedDate: chickType.modifiedDate.toISOString(),
      },
    };
  }

  @PUT({
    url: '/:id',
    options: {
      schema: {
        params: updateChickTypeByIdParamsDTO,
        body: updateChickTypeByIdBodyDTO,
        response: {
          200: updateChickTypeByIdResponnseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async update(request: updateChickTypeByIdRequest): Promise<UpdateChickTypeByIdResponnse> {
    const updatedChickType = await this.chickTypeUsecase.update(
      request.params.id,
      { ...request.body, id: request.params.id },
      request.user,
    );

    return {
      code: 200,
      data: {
        ...updatedChickType,
        createdDate: updatedChickType.createdDate.toISOString(),
        modifiedDate: updatedChickType.modifiedDate.toISOString(),
      },
    };
  }
}
