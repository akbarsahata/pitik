import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, DELETE, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  CreateCoopBody,
  createCoopBodyDTO,
  CreateCoopResponse,
  createCoopResponseDTO,
  DeleteCoopImageParam,
  deleteCoopImageParamDTO,
  GetActiveCoopQuery,
  getActiveCoopQueryDTO,
  GetActiveCoopsResponse,
  getActiveCoopsResponseDTO,
  GetAvailableCoopQuery,
  getAvailableCoopQueryDTO,
  GetAvailableCoopResponse,
  getAvailableCoopResponseDTO,
  GetCoopByIdParams,
  getCoopByIdParamsDTO,
  GetCoopByIdResponse,
  getCoopByIdResponseDTO,
  GetCoopsQuery,
  getCoopsQueryDTO,
  GetCoopsResponse,
  getCoopsResponseDTO,
  GetIdleCoopQuery,
  getIdleCoopQueryDTO,
  GetIdleCoopsResponse,
  getIdleCoopsResponseDTO,
  UpdateCoopBody,
  updateCoopBodyDTO,
  UpdateCoopParams,
  updateCoopParamsDTO,
  UpdateCoopResponse,
  updateCoopResponseDTO,
} from '../../dto/coop.dto';
import { USER_TYPE } from '../../libs/constants';
import { CoopService } from '../../services/coop.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

@Controller({
  route: '/coops',
  type: 0,
  tags: [{ name: 'coops' }],
})
export class CoopController {
  @Inject(CoopService)
  private service: CoopService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getCoopsQueryDTO,
        response: {
          200: getCoopsResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async get(
    request: FastifyRequest<{
      Querystring: GetCoopsQuery;
    }>,
  ): Promise<GetCoopsResponse> {
    const [coops, count] = await this.service.get(request.query);

    return {
      code: 200,
      count,
      data: coops.map((coop) => ({
        ...coop,
        createdDate: coop.createdDate.toISOString(),
        modifiedDate: coop.modifiedDate.toISOString(),
        leader: coop.coopMembers?.find((member) => member.isLeader)?.user,
        workers: coop.coopMembers
          ?.filter((member) => !member.isLeader && member.user.userType === USER_TYPE.AK)
          .map((member) => member.user),
        itSupport: null,
        iotEngineer: null,
        coopType: coop.coopType,
        chickType: coop.chickType || undefined,
        controllerType:
          (coop.controllerType && {
            name: coop.controllerType.name,
            status: coop.controllerType.isActive ? 'Y' : 'N',
          }) ||
          undefined,
        heaterType:
          (coop.heaterType && {
            name: coop.heaterType.name,
            status: coop.heaterType.isActive ? 'Y' : 'N',
          }) ||
          undefined,
        contractTypeId: coop.contract?.refContractTypeId || '',
        contractName: coop.contract?.contractType?.contractName || '',
        branchId: coop.farm?.branch?.id || '',
        branchName: coop.farm?.branch?.name || '',
        createdBy: coop.userCreator?.fullName || coop.createdBy,
        modifiedBy: coop.userModifier?.fullName || coop.modifiedBy,
      })),
    };
  }

  @GET({
    url: '/:id',
    options: {
      schema: {
        params: getCoopByIdParamsDTO,
        response: {
          200: getCoopByIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getById(
    request: FastifyRequest<{
      Params: GetCoopByIdParams;
    }>,
  ): Promise<GetCoopByIdResponse> {
    const coop = await this.service.getById(request.params.id);

    return {
      code: 200,
      data: coop,
    };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: createCoopBodyDTO,
        response: {
          '2xx': createCoopResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async create(
    request: FastifyRequest<{
      Body: CreateCoopBody;
    }>,
    reply: FastifyReply,
  ): Promise<CreateCoopResponse> {
    const coop = await this.service.create(request.body, request.user);
    reply.code(201);

    return {
      code: 201,
      data: coop,
    };
  }

  @PUT({
    url: '/:id',
    options: {
      schema: {
        body: updateCoopBodyDTO,
        params: updateCoopParamsDTO,
        response: {
          200: updateCoopResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async update(
    request: FastifyRequest<{
      Body: UpdateCoopBody;
      Params: UpdateCoopParams;
    }>,
  ): Promise<UpdateCoopResponse> {
    const coop = await this.service.update(
      request.params.id,
      {
        ...request.body,
        id: request.params.id,
      },
      request.user,
    );

    return {
      code: 200,
      data: {
        ...coop,
        createdDate: coop.createdDate.toISOString(),
        modifiedDate: coop.modifiedDate.toISOString(),
        leader: coop.coopMembers?.find((member) => member.isLeader)?.user,
        workers: coop.coopMembers
          ?.filter((member) => !member.isLeader)
          .map((member) => member.user),
        itSupport: null,
        iotEngineer: null,
        coopType: coop.coopType,
        chickType: coop.chickType,
        controllerType:
          (coop.controllerType && {
            name: coop.controllerType.name,
            status: coop.controllerType.isActive ? 'Y' : 'N',
          }) ||
          undefined,
        heaterType:
          (coop.heaterType && {
            name: coop.heaterType.name,
            status: coop.heaterType.isActive ? 'Y' : 'N',
          }) ||
          undefined,
      },
    };
  }

  @GET({
    url: '/idle',
    options: {
      schema: {
        querystring: getIdleCoopQueryDTO,
        response: {
          200: getIdleCoopsResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getIdleCoops(
    req: FastifyRequest<{
      Querystring: GetIdleCoopQuery;
    }>,
  ): Promise<GetIdleCoopsResponse> {
    const data = await this.service.getIdle(req.query, req.user);
    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/active',
    options: {
      schema: {
        querystring: getActiveCoopQueryDTO,
        response: {
          200: getActiveCoopsResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getActiveCoops(
    req: FastifyRequest<{
      Querystring: GetActiveCoopQuery;
    }>,
  ): Promise<GetActiveCoopsResponse> {
    const data = await this.service.getActive(req.query, req.user);
    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/available',
    options: {
      schema: {
        querystring: getAvailableCoopQueryDTO,
        response: {
          200: getAvailableCoopResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getAvailableCoops(
    request: FastifyRequest<{
      Querystring: GetAvailableCoopQuery;
    }>,
  ): Promise<GetAvailableCoopResponse> {
    const [availableCoops, count] = await this.service.getAvailable(request.query);

    return {
      code: 200,
      count,
      data: availableCoops,
    };
  }

  @DELETE({
    url: '/image/:id',
    options: {
      schema: {
        params: deleteCoopImageParamDTO,
      },
      onRequest: [verifyAccess],
    },
  })
  async deleteCoopImage(
    req: FastifyRequest<{
      Params: DeleteCoopImageParam;
    }>,
    reply: FastifyReply,
  ) {
    await this.service.deleteImage(req.params.id, req.user);
    return reply.status(200).send();
  }
}
