import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  CreateTargetBody,
  createTargetBodyDTO,
  CreateTargetResponse,
  createTargetResponseDTO,
  GetTargetByIdParams,
  getTargetByIdParamsDTO,
  GetTargetByIdResponse,
  getTargetByIdResponseDTO,
  GetTargetQuery,
  getTargetQueryDTO,
  GetTargetResponse,
  getTargetResponseDTO,
  UpdateTargetBody,
  updateTargetBodyDTO,
  UpdateTargetParams,
  updateTargetParamsDTO,
  UpdateTargetResponse,
  updateTargetResponseDTO,
} from '../../dto/target.dto';
import { TargetService } from '../../services/target.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

type createTargetRequest = FastifyRequest<{
  Body: CreateTargetBody;
}>;

@Controller({
  route: '/targets',
  type: 0,
  tags: [{ name: 'targets' }],
})
export class TargetController {
  @Inject(TargetService)
  private targetService: TargetService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getTargetQueryDTO,
        response: {
          200: getTargetResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async get(
    request: FastifyRequest<{
      Querystring: GetTargetQuery;
    }>,
  ): Promise<GetTargetResponse> {
    const [targets, count] = await this.targetService.get(request.query);

    return {
      code: 200,
      count,
      data: targets.map((target) => ({
        ...target,
        coopType: target.coopType,
        chickType: target.chickType,
        variable: target.variable,
        modifiedDate: target.modifiedDate.toISOString(),
        modifiedBy: target.userModifier?.fullName || target.modifiedBy,
      })),
    };
  }

  @GET({
    url: '/:id',
    options: {
      schema: {
        params: getTargetByIdParamsDTO,
        response: {
          200: getTargetByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getById(
    request: FastifyRequest<{
      Params: GetTargetByIdParams;
    }>,
  ): Promise<GetTargetByIdResponse> {
    const target = await this.targetService.getById(request.params.id);

    return {
      code: 200,
      data: {
        ...target,
        coopType: target.coopType,
        chickType: target.chickType,
        variable: target.variable,
        targetDays: target.targetDays.map((tdd) => tdd),
        modifiedDate: target.modifiedDate.toISOString(),
      },
    };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: createTargetBodyDTO,
        response: {
          '2xx': createTargetResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async create(request: createTargetRequest): Promise<CreateTargetResponse> {
    const target = await this.targetService.create(request.body, request.user);

    return {
      code: 201,
      data: {
        ...target,
        coopType: target.coopType,
        chickType: target.chickType,
        variable: target.variable,
        createdDate: target.createdDate.toISOString(),
      },
    };
  }

  @PUT({
    url: '/:id',
    options: {
      schema: {
        params: updateTargetParamsDTO,
        body: updateTargetBodyDTO,
        response: {
          200: updateTargetResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async update(
    request: FastifyRequest<{
      Params: UpdateTargetParams;
      Body: UpdateTargetBody;
    }>,
  ): Promise<UpdateTargetResponse> {
    const target = await this.targetService.update(
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
