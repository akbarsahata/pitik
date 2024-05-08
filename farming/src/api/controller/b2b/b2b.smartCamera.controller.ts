import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, Inject, PATCH, POST } from 'fastify-decorators';
import {
  CreateB2BSmartCameraBody,
  createB2BSmartCameraBodyDTO,
  CreateB2BSmartCameraResponse,
  createB2BSmartCameraResponseDTO,
  CreateCoopJobParams,
  createCoopJobParamsDTO,
  EditSmartCameraBody,
  editSmartCameraBodyDTO,
  EditSmartCameraParams,
  editSmartCameraParamsDTO,
  EditSmartCameraResponse,
  editSmartCameraResponseDTO,
  GetRecordImagesBySensorIdParams,
  getRecordImagesBySensorIdParamsDTO,
  GetRecordImagesBySensorIdQuery,
  getRecordImagesBySensorIdQueryDTO,
  GetRecordImagesBySensorIdResponse,
  getRecordImagesBySensorIdResponseDTO,
  GetRecordImagesResponse,
  getRecordImagesResponseDTO,
  GetSmartCameraRecordsParams,
  getSmartCameraRecordsParamsDTO,
  GetSmartCameraRecordsQueryDTO,
  getSmartCameraRecordsQueryDTO,
  GetSmartCameraRecordsResponse,
  getSmartCameraRecordsResponseDTO,
  RenameSmartCameraBody,
  renameSmartCameraBodyDTO,
  RenameSmartCameraParams,
  renameSmartCameraParamsDTO,
  RenameSmartCameraResponse,
  renameSmartCameraResponseDTO,
} from '../../../dto/b2b/b2b.smartCamera.dto';
import { B2BSmartCameraService } from '../../../services/b2b/b2b.smartCamera.service';
import { verifyAccess } from '../../hooks/onRequest/verifyAccess';

@Controller({
  route: '/b2b/iot-devices/smart-camera',
  type: 0,
  tags: [{ name: 'b2b-iot-devices-smart-camera' }],
})
export class B2BSmartCameraController {
  @Inject(B2BSmartCameraService)
  private service!: B2BSmartCameraService;

  @POST({
    url: '/register',
    options: {
      schema: {
        body: createB2BSmartCameraBodyDTO,
        response: {
          '2xx': createB2BSmartCameraResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async createB2BSmartMonitoring(
    req: FastifyRequest<{
      Body: CreateB2BSmartCameraBody;
    }>,
    reply: FastifyReply,
  ): Promise<CreateB2BSmartCameraResponse> {
    const data = await this.service.createSmartCamera({
      body: req.body,
      user: req.user,
    });

    reply.code(201);

    return {
      code: 201,
      data,
    };
  }

  @GET({
    url: '/:coopId/records',
    options: {
      schema: {
        params: getSmartCameraRecordsParamsDTO,
        querystring: getSmartCameraRecordsQueryDTO,
        response: {
          200: getSmartCameraRecordsResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getRecords(
    req: FastifyRequest<{
      Querystring: GetSmartCameraRecordsQueryDTO;
      Params: GetSmartCameraRecordsParams;
    }>,
  ): Promise<GetSmartCameraRecordsResponse> {
    const [records, count] = await this.service.getCameraRecords({
      coopId: req.params.coopId,
      user: req.user,
      query: req.query,
    });

    return {
      code: 200,
      count,
      data: records,
    };
  }

  @GET({
    url: '/:coopId/records/:sensorId',
    options: {
      schema: {
        params: getRecordImagesBySensorIdParamsDTO,
        querystring: getRecordImagesBySensorIdQueryDTO,
        response: {
          200: getRecordImagesBySensorIdResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getRecordImagesBySensorId(
    req: FastifyRequest<{
      Params: GetRecordImagesBySensorIdParams;
      Querystring: GetRecordImagesBySensorIdQuery;
    }>,
  ): Promise<GetRecordImagesBySensorIdResponse> {
    return this.service.getB2BRecordingImagesBySensorId({
      endDate: req.query.endDate,
      coopId: req.params.coopId,
      limit: req.query.$limit,
      page: req.query.$page,
      user: req.user,
      sensorId: req.params.sensorId,
    });
  }

  @POST({
    url: '/jobs/:coopId',
    options: {
      schema: {
        params: createCoopJobParamsDTO,
        response: {
          200: getRecordImagesResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async createJobByCoop(
    req: FastifyRequest<{
      Params: CreateCoopJobParams;
    }>,
  ): Promise<GetRecordImagesResponse> {
    // TODO: verify coop ownership

    const [result, count] = await this.service.createJobByCoop({
      coopId: req.params.coopId,
      user: req.user,
    });

    return {
      code: 200,
      count,
      data: result,
    };
  }

  @PATCH({
    url: '/:deviceId/rename',
    options: {
      schema: {
        params: renameSmartCameraParamsDTO,
        body: renameSmartCameraBodyDTO,
        response: {
          200: renameSmartCameraResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async renameSmartCamera(
    req: FastifyRequest<{
      Params: RenameSmartCameraParams;
      Body: RenameSmartCameraBody;
    }>,
  ): Promise<RenameSmartCameraResponse> {
    const result = await this.service.renameSmartCameraDevice(req.params, req.body, req.user);

    return result;
  }

  @PATCH({
    url: '/:deviceId/edit',
    options: {
      schema: {
        params: editSmartCameraParamsDTO,
        body: editSmartCameraBodyDTO,
        response: {
          200: editSmartCameraResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async editSmartCamera(
    req: FastifyRequest<{
      Params: EditSmartCameraParams;
      Body: EditSmartCameraBody;
    }>,
  ): Promise<EditSmartCameraResponse> {
    const data = await this.service.editSmartCameraDevice({
      deviceId: req.params.deviceId,
      body: req.body,
      user: req.user,
    });

    return {
      code: 200,
      data,
    };
  }
}
