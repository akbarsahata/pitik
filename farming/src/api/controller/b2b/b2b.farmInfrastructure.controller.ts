import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, DELETE, GET, Inject, PATCH, POST } from 'fastify-decorators';
import {
  CreateB2BFarmInfrastructureCoopBody,
  createB2BFarmInfrastructureCoopBodyDTO,
  CreateB2BFarmInfrastructureCoopResponse,
  createB2BFarmInfrastructureCoopResponseDTO,
  DeleteB2BFarmInfrastructureCoopParam,
  deleteB2BFarmInfrastructureCoopParamDTO,
  DeleteB2BFarmInfrastructureCoopResponse,
  deleteB2BFarmInfrastructureCoopResponseDTO,
  GetB2BFarmInfrastructureCoopListResponse,
  getB2BFarmInfrastructureCoopListResponseDTO,
  GetB2BFarmInfraStructureCoopParam,
  getB2BFarmInfrastructureCoopParamDTO,
  GetB2BFarmInfrastructureCoopResponse,
  getB2BFarmInfrastructureCoopResponseDTO,
  GetB2BFarmInfrastructureCoopRoomParam,
  getB2BFarmInfrastructureCoopRoomParamDTO,
  GetB2BFarmInfrastructureCoopRoomResponse,
  getB2BFarmInfrastructureCoopRoomResponseDTO,
  GetB2BFarmInfrastructureHomeResponse,
  getB2BFarmInfrastructureHomeResponseDTO,
  PatchB2BFarmInfrastructureCoopBody,
  patchB2BFarmInfrastructureCoopBodyDTO,
  PatchB2BFarmInfrastructureCoopParam,
  patchB2BFarmInfrastructureCoopParamDTO,
  PatchB2BFarmInfrastructureCoopResponse,
  patchB2BFarmInfrastructureCoopResponseDTO,
  PatchB2BFarmInfrastructureCoopRoomBody,
  patchB2BFarmInfrastructureCoopRoomBodyDTO,
  PatchB2BFarmInfrastructureCoopRoomParam,
  patchB2BFarmInfrastructureCoopRoomParamDTO,
  PatchB2BFarmInfrastructureCoopRoomResponse,
  patchB2BFarmInfrastructureCoopRoomResponseDTO,
  PatchDeactivateB2BFarmInfrastructureCoopParam,
  patchDeactivateB2BFarmInfrastructureCoopParamDTO,
  PatchDeactivateB2BFarmInfrastructureCoopResponse,
  patchDeactivateB2BFarmInfrastructureCoopResponseDTO,
} from '../../../dto/b2b/b2b.farmInfrastructure.dto';
import { B2BFarmInfrastructureService } from '../../../services/b2b/b2b.farmInfrastructure.service';
import { B2BIotDeviceService } from '../../../services/b2b/b2b.iotDevice.service';
import { B2BSmartControllerService } from '../../../services/b2b/b2b.smartController.service';
import { verifyAccess } from '../../hooks/onRequest/verifyAccess';

@Controller({
  route: '/b2b/farm-infrastructure',
  type: 0,
  tags: [{ name: 'b2b-farm-infrastructure' }],
})
export class B2BFarmInfrastructureController {
  @Inject(B2BFarmInfrastructureService)
  private service!: B2BFarmInfrastructureService;

  @Inject(B2BIotDeviceService)
  private b2bIotDeviceService!: B2BIotDeviceService;

  @Inject(B2BSmartControllerService)
  private b2bSmartControllerService!: B2BSmartControllerService;

  @GET({
    url: '/home',
    options: {
      schema: {
        response: {
          200: getB2BFarmInfrastructureHomeResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getB2BFarmInfrastructureHome(
    req: FastifyRequest,
  ): Promise<GetB2BFarmInfrastructureHomeResponse> {
    const data = await this.service.getB2BFarmInfrastructureHome(req.user.id);

    return {
      code: 200,
      data,
    };
  }

  @GET({
    url: '/coops',
    options: {
      schema: {
        response: {
          200: getB2BFarmInfrastructureCoopListResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getB2BFarmInfrastructureCoopList(
    req: FastifyRequest,
  ): Promise<GetB2BFarmInfrastructureCoopListResponse> {
    const [coops, count] = await this.service.getB2BFarmInfrastructureCoopList(req.user);

    return {
      code: 200,
      data: coops,
      count,
    };
  }

  @POST({
    url: '/coops',
    options: {
      schema: {
        body: createB2BFarmInfrastructureCoopBodyDTO,
        response: {
          '2xx': createB2BFarmInfrastructureCoopResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async createB2BFarmInfrastructureCoop(
    req: FastifyRequest<{
      Body: CreateB2BFarmInfrastructureCoopBody;
    }>,
    reply: FastifyReply,
  ): Promise<CreateB2BFarmInfrastructureCoopResponse> {
    const coop = await this.service.createB2BFarmInfrastructureCoop(req.body, req.user);

    reply.code(201);

    return {
      code: 201,
      data: coop,
    };
  }

  @GET({
    url: '/coops/:coopId',
    options: {
      schema: {
        params: getB2BFarmInfrastructureCoopParamDTO,
        response: {
          200: getB2BFarmInfrastructureCoopResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getListB2BFarmInfrastructureCoops(
    req: FastifyRequest<{
      Params: GetB2BFarmInfraStructureCoopParam;
    }>,
  ): Promise<GetB2BFarmInfrastructureCoopResponse> {
    const coops = await this.service.getB2BFarmInfrastructureCoop(req.params);

    return {
      code: 200,
      data: coops,
    };
  }

  @GET({
    url: '/coops/:coopId/rooms/:roomId',
    options: {
      schema: {
        params: getB2BFarmInfrastructureCoopRoomParamDTO,
        response: {
          200: getB2BFarmInfrastructureCoopRoomResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getB2BFarmInfrastructureIotDevicesCoopRoom(
    req: FastifyRequest<{
      Params: GetB2BFarmInfrastructureCoopRoomParam;
    }>,
  ): Promise<GetB2BFarmInfrastructureCoopRoomResponse> {
    const iotDevices = await this.b2bIotDeviceService.getB2BFarmInfrastructureIotDevicesCoopRoom(
      req.params,
    );

    const iotDevicesDetail: any[] = [];

    await Promise.all(
      iotDevices.map(async (device) => {
        if (device.deviceType === 'SMART_MONITORING') {
          const latestCondition = await this.b2bIotDeviceService.getSmartMonitoringLatestCondition(
            { deviceId: device.deviceId },
            {},
            req.user,
          );
          iotDevicesDetail.push(Object.assign(device, { deviceSummary: latestCondition }));
        } else if (device.deviceType === 'SMART_CONTROLLER') {
          const deviceSummary =
            await this.b2bSmartControllerService.getB2BSmartControllerDeviceSummary(
              req.params.coopId,
              device.mac,
            );

          iotDevicesDetail.push(Object.assign(device, { deviceSummary }));
        } else {
          iotDevicesDetail.push(device);
        }
      }),
    );

    const coopRoom = await this.service.getB2BFarmInfrastructureCoopRoom(
      req.params,
      req.user,
      iotDevicesDetail,
    );

    return {
      code: 200,
      data: coopRoom,
    };
  }

  @PATCH({
    url: '/coops/:coopId/rooms/:roomId',
    options: {
      schema: {
        params: patchB2BFarmInfrastructureCoopRoomParamDTO,
        body: patchB2BFarmInfrastructureCoopRoomBodyDTO,
        response: {
          200: patchB2BFarmInfrastructureCoopRoomResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async patchB2BFarmInfrastructureCoopRoom(
    req: FastifyRequest<{
      Body: PatchB2BFarmInfrastructureCoopRoomBody;
      Params: PatchB2BFarmInfrastructureCoopRoomParam;
    }>,
  ): Promise<PatchB2BFarmInfrastructureCoopRoomResponse> {
    const coopRoom = await this.service.patchB2BFarmInfrastructureCoopRoom(
      req.params,
      req.body,
      req.user,
    );

    return {
      code: 200,
      data: coopRoom,
    };
  }

  @PATCH({
    url: '/coops/:coopId',
    options: {
      schema: {
        params: patchB2BFarmInfrastructureCoopParamDTO,
        body: patchB2BFarmInfrastructureCoopBodyDTO,
        response: {
          200: patchB2BFarmInfrastructureCoopResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async patchB2BFarmInfrastructureCoop(
    req: FastifyRequest<{
      Params: PatchB2BFarmInfrastructureCoopParam;
      Body: PatchB2BFarmInfrastructureCoopBody;
    }>,
  ): Promise<PatchB2BFarmInfrastructureCoopResponse> {
    const patchedCoop = await this.service.patchB2BFarmInfrastructureCoop(
      req.params,
      req.body,
      req.user,
    );

    return {
      code: 200,
      data: patchedCoop,
    };
  }

  @PATCH({
    url: '/coops/:coopId/:action',
    options: {
      schema: {
        params: patchDeactivateB2BFarmInfrastructureCoopParamDTO,
        response: {
          200: patchDeactivateB2BFarmInfrastructureCoopResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async patcDeactivatehB2BFarmInfrastructureCoop(
    req: FastifyRequest<{
      Params: PatchDeactivateB2BFarmInfrastructureCoopParam;
    }>,
  ): Promise<PatchDeactivateB2BFarmInfrastructureCoopResponse> {
    await this.service.patchDeactivateB2BFarmInfrastructureCoop(req.params, req.user);

    return {
      code: 200,
      data: {
        message: `Kandang berhasil di ${
          req.params.action === 'activate' ? 'Aktifkan' : 'Non-Aktifkan'
        }`,
      },
    };
  }

  @DELETE({
    url: '/coops/:coopId',
    options: {
      schema: {
        params: deleteB2BFarmInfrastructureCoopParamDTO,
        response: {
          200: deleteB2BFarmInfrastructureCoopResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async deleteB2BFarmInfrastructureCoop(
    req: FastifyRequest<{
      Params: DeleteB2BFarmInfrastructureCoopParam;
    }>,
  ): Promise<DeleteB2BFarmInfrastructureCoopResponse> {
    await this.service.deleteFarmInfrastructureCoop(req.params.coopId);

    return {
      code: 200,
      data: {
        message: 'Record is removed',
      },
    };
  }
}
