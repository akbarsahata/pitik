import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, DELETE, GET, Inject, POST, PUT } from 'fastify-decorators';
import {
  AssignDeviceOtasBody,
  assignDeviceOtasBodyDTO,
  AssignDeviceOtasResponse,
  assignDeviceOtasResponseDTO,
  createDeviceSensorsResponseDTO,
  CreateDevicesSensorsBody,
  createDevicesSensorsBodyDTO,
  CreateDevicesSensorsResponse,
  deleteDeviceSensorsResponseDTO,
  DeleteDevicesSensorsParam,
  deleteDevicesSensorsParamDTO,
  DeleteDevicesSensorsResponse,
  DeviceSensorsLocationQuery,
  deviceSensorsLocationQuery,
  deviceSensorsLocationResponseDTO,
  DevicesSensorsQuery,
  devicesSensorsQueryDTO,
  GetDeviceByMacParams,
  getDeviceByMacParamsDTO,
  GetDeviceByMacResponse,
  getDeviceByMacResponseDTO,
  GetDeviceReportsQuery,
  getDeviceReportsQueryDTO,
  GetDeviceReportsResponse,
  getDeviceReportsResponseDTO,
  getDeviceSensorsResponsePaginatedDTO,
  GetDevicesSensorsResponsePaginated,
  GetOneDevicesSensorsParam,
  getOneDevicesSensorsParamDTO,
  GetOneDevicesSensorsResponse,
  getOneDevicesSensorsResponseDTO,
  resetIdDevicesSensorsBodyDTO,
  ResetIdDevicesSensorsResponse,
  resetIdDevicesSensorsResponseDTO,
  SetDeviceAmmoniaSensorBody,
  setDeviceAmmoniaSensorBodyDTO,
  SetDeviceAmmoniaSensorResponse,
  SetIdDevicesSensorsBody,
  setIdDevicesSensorsBodyDTO,
  SetIdDevicesSensorsResponse,
  setIdDevicesSensorsResponseDTO,
  updateDeviceSensorsResponseDTO,
  UpdateDevicesSensorsBody,
  updateDevicesSensorsBodyDTO,
  UpdateDevicesSensorsParam,
  updateDevicesSensorsParamDTO,
  UpdateDevicesSensorsResponse,
} from '../../dto/devicesSensors.dto';
import {
  getOfflineTrackerResponseDTO,
  OfflineTrackerParams,
  offlineTrackerParamsDTO,
} from '../../dto/iotDeviceTracker.dto';
import { DeviceSensorsService } from '../../services/devicesSensors.service';
import { IotDeviceTrackerService } from '../../services/iotDeviceTracker.service';
import { removeHeaderAttributes } from '../hooks/onRequest/removeHeaderAttribute';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';
import { verifyInternalRequest } from '../hooks/onRequest/verifyInternalRequest';
import { verifyIotSecurityKey } from '../hooks/preHandler/verifyIotSecurityKey';

type GetOneDevicesSensorsRequest = FastifyRequest<{
  Params: GetOneDevicesSensorsParam;
}>;

type UpdateDevicesSensorsRequest = FastifyRequest<{
  Params: UpdateDevicesSensorsParam;
  Body: UpdateDevicesSensorsBody;
}>;

type DeleteDevicesSensorsRequest = FastifyRequest<{
  Params: DeleteDevicesSensorsParam;
}>;

@Controller({
  route: '/devices-sensor',
  type: 0,
  tags: [{ name: 'devices-sensor' }],
})
export class DeviceSensorsController {
  @Inject(DeviceSensorsService)
  private service!: DeviceSensorsService;

  @Inject(IotDeviceTrackerService)
  private trackerService!: IotDeviceTrackerService;

  @GET({
    url: '/:id',
    options: {
      schema: {
        params: getOneDevicesSensorsParamDTO,
        response: {
          200: getOneDevicesSensorsResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getOne(request: GetOneDevicesSensorsRequest): Promise<GetOneDevicesSensorsResponse> {
    const data = await this.service.getOne(request.params.id);

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/mac/:mac',
    options: {
      schema: {
        params: getDeviceByMacParamsDTO,
        response: {
          200: getDeviceByMacResponseDTO,
        },
      },
      preHandler: [verifyIotSecurityKey],
    },
  })
  async getDeviceByMac(
    request: FastifyRequest<{
      Params: GetDeviceByMacParams;
    }>,
  ): Promise<GetDeviceByMacResponse> {
    const device = await this.service.getByMac(request.params.mac);

    return {
      code: 200,
      data: device,
    };
  }

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: devicesSensorsQueryDTO,
        response: {
          200: getDeviceSensorsResponsePaginatedDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async get(
    req: FastifyRequest<{
      Querystring: DevicesSensorsQuery;
    }>,
  ): Promise<GetDevicesSensorsResponsePaginated> {
    const [data, count] = await this.service.getAll(req.query);

    return {
      code: 200,
      count,
      data,
    };
  }

  @GET({
    url: '/device-types',
    options: {
      onRequest: [verifyAccess],
    },
  })
  async getDeviceTypes() {
    const deviceTypes = this.service.getDeviceTypesArray();

    return {
      code: 200,
      data: deviceTypes,
    };
  }

  @GET({
    url: '/location',
    options: {
      schema: {
        querystring: deviceSensorsLocationQuery,
        response: {
          200: deviceSensorsLocationResponseDTO,
        },
      },
      onRequest: [verifyInternalRequest],
    },
  })
  async getDeviceCoopAndRoom(
    req: FastifyRequest<{
      Querystring: DeviceSensorsLocationQuery;
    }>,
  ) {
    const data = await this.service.getDeviceSensorLocation(req.query);

    return {
      code: 200,
      data,
    };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: createDevicesSensorsBodyDTO,
        response: { '2xx': createDeviceSensorsResponseDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async createDeviceSensors(
    request: FastifyRequest<{
      Body: CreateDevicesSensorsBody;
    }>,
    reply: FastifyReply,
  ): Promise<CreateDevicesSensorsResponse> {
    const data = await this.service.createDeviceSensors(request.body, request.user);

    reply.code(201);

    return {
      code: 201,
      data,
    };
  }

  @PUT({
    url: '/:id',
    options: {
      schema: {
        params: updateDevicesSensorsParamDTO,
        body: updateDevicesSensorsBodyDTO,
        response: {
          200: updateDeviceSensorsResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async updateDevicesSensors(
    request: UpdateDevicesSensorsRequest,
  ): Promise<UpdateDevicesSensorsResponse> {
    const data = await this.service.updateDeviceSensors(
      request.params.id,
      request.body,
      request.user,
    );

    return {
      code: 200,
      data,
    };
  }

  @DELETE({
    url: '/:id',
    options: {
      schema: {
        params: deleteDevicesSensorsParamDTO,
        response: {
          200: deleteDeviceSensorsResponseDTO,
        },
      },
      // TODO: remove removeHeaderAttribute method once fix from client is implemented
      onRequest: [removeHeaderAttributes('content-type', 'content-length'), verifyAccess],
    },
  })
  async deleteDevicesSensors(
    request: DeleteDevicesSensorsRequest,
  ): Promise<DeleteDevicesSensorsResponse> {
    const data = await this.service.deleteDeviceSensors(request.params.id, request.user);

    return {
      code: 200,
      data,
    };
  }

  @POST({
    url: '/setId',
    options: {
      schema: {
        body: setIdDevicesSensorsBodyDTO,
        response: { 200: setIdDevicesSensorsResponseDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async setIdDeviceSensors(
    request: FastifyRequest<{
      Body: SetIdDevicesSensorsBody;
    }>,
    reply: FastifyReply,
  ): Promise<SetIdDevicesSensorsResponse> {
    const data = await this.service.deviceSensorsSetId(request.body);

    reply.code(200);

    return {
      code: 200,
      data,
    };
  }

  @POST({
    url: '/assignOtas',
    options: {
      schema: {
        body: assignDeviceOtasBodyDTO,
        response: { 200: assignDeviceOtasResponseDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async assignDeviceOtas(
    request: FastifyRequest<{
      Body: AssignDeviceOtasBody;
    }>,
  ): Promise<AssignDeviceOtasResponse> {
    const data = await this.service.assignDeviceOtas(request.body, request.user);

    return {
      code: 200,
      data,
    };
  }

  @POST({
    url: '/resetId',
    options: {
      schema: {
        body: resetIdDevicesSensorsBodyDTO,
        response: { 200: resetIdDevicesSensorsResponseDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async resetIdDeviceSensors(
    request: FastifyRequest<{
      Body: SetIdDevicesSensorsBody;
    }>,
  ): Promise<ResetIdDevicesSensorsResponse> {
    const data = await this.service.deviceSensorResetId(request.body);

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/historical-report',
    options: {
      schema: {
        querystring: getDeviceReportsQueryDTO,
        response: { 200: getDeviceReportsResponseDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async getReports(
    request: FastifyRequest<{
      Querystring: GetDeviceReportsQuery;
    }>,
  ): Promise<GetDeviceReportsResponse> {
    const [data, count] = await this.service.getDeviceReports(request.query);

    return {
      code: 200,
      count,
      data,
    };
  }

  @GET({
    url: '/offline-tracker',
    options: {
      schema: {
        querystring: offlineTrackerParamsDTO,
        response: { 200: getOfflineTrackerResponseDTO },
      },
      onRequest: [verifyAccess],
    },
  })
  async getOfflineTracker(
    req: FastifyRequest<{
      Querystring: OfflineTrackerParams;
    }>,
  ) {
    const [offlineReports, count] = await this.trackerService.get(req.query);

    return {
      code: 200,
      count,
      data: offlineReports,
    };
  }

  @POST({
    url: '/offline-tracker/trigger',
    options: {
      schema: {
        querystring: offlineTrackerParamsDTO,
      },
      onRequest: [verifyAccess],
    },
  })
  async triggerOfflineTracker(
    req: FastifyRequest<{
      Querystring: OfflineTrackerParams;
    }>,
  ) {
    await this.trackerService.checkDeviceOffline(req.query.startDate, req.query.endDate);

    return {
      code: 200,
    };
  }

  @POST({
    url: '/setAmmonia',
    options: {
      schema: {
        body: setDeviceAmmoniaSensorBodyDTO,
      },
      onRequest: verifyAccess,
    },
  })
  async setDeviceAmmoniaSensor(
    request: FastifyRequest<{
      Body: SetDeviceAmmoniaSensorBody;
    }>,
  ): Promise<SetDeviceAmmoniaSensorResponse> {
    this.service.setDeviceAmmonia(request.body);

    return {
      code: 200,
      data: {
        macAddress: request.body.macAddress,
      },
    };
  }
}
