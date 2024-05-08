import { FastifyRequest } from 'fastify';
import { Controller, GET, Inject, POST } from 'fastify-decorators';
import {
  CreateCoopJobParams,
  createCoopJobParamsDTO,
  CreateJobRequestBody,
  createJobRequestBodyDTO,
  CreateJobResponse,
  createJobResponseDTO,
  EvaluateImageBody,
  evaluateImageBodyDTO,
  EvaluateImageParams,
  evaluateImageParamsDTO,
  EvaluateImageResponse,
  evaluateImageResponseDTO,
  GetCameraResponse,
  getCameraResponseDTO,
  GetCamerasParam,
  getCamerasParamDTO,
  GetRecordImagesBySensorIdParams,
  getRecordImagesBySensorIdParamsDTO,
  GetRecordImagesBySensorIdQuery,
  getRecordImagesBySensorIdQueryDTO,
  GetRecordImagesBySensorIdResponse,
  getRecordImagesBySensorIdResponseDTO,
  GetRecordImagesParams,
  getRecordImagesParamsDTO,
  GetRecordImagesQuery,
  getRecordImagesQueryDTO,
  GetRecordImagesResponse,
  getRecordImagesResponseDTO,
  GetSmartCameraDayRecordsParams,
  getSmartCameraDayRecordsParamsDTO,
  GetSmartCameraDayRecordsResponse,
  getSmartCameraDayRecordsResponseDTO,
} from '../../dto/smartCamera.dto';
import { SmartCameraService } from '../../services/smartCamera.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';
import { verifyIotSecurityKey } from '../hooks/preHandler/verifyIotSecurityKey';

@Controller({
  route: '/',
  type: 0,
  tags: [{ name: 'smart-camera' }],
})
export class SmartCameraController {
  @Inject(SmartCameraService)
  private service!: SmartCameraService;

  @POST({
    url: '/internal/smart-camera/jobs',
    options: {
      schema: {
        tags: ['internal'],
        body: createJobRequestBodyDTO,
        response: {
          200: createJobResponseDTO,
        },
      },
      preHandler: [verifyIotSecurityKey],
    },
  })
  async createJob(
    req: FastifyRequest<{
      Body: CreateJobRequestBody;
    }>,
  ): Promise<CreateJobResponse> {
    const { createJobItem } = await this.service.createJob({
      jobId: req.body.jobId,
      sensorCode: req.body.sensorCode,
    });

    return {
      code: 200,
      data: createJobItem,
    };
  }

  @GET({
    url: '/smart-camera/:coopId/records',
    options: {
      schema: {
        params: getSmartCameraDayRecordsParamsDTO,
        response: {
          200: getSmartCameraDayRecordsResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getRecords(
    req: FastifyRequest<{
      Params: GetSmartCameraDayRecordsParams;
    }>,
  ): Promise<GetSmartCameraDayRecordsResponse> {
    const [records, count] = await this.service.getDayRecords({
      coopId: req.params.coopId,
      user: req.user,
    });

    return {
      code: 200,
      count,
      data: records,
    };
  }

  @GET({
    url: '/smart-camera/:coopId/records/:day',
    options: {
      schema: {
        params: getRecordImagesParamsDTO,
        querystring: getRecordImagesQueryDTO,
        response: {
          200: getRecordImagesResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getRecordImages(
    req: FastifyRequest<{
      Params: GetRecordImagesParams;
      Querystring: GetRecordImagesQuery;
    }>,
  ): Promise<GetRecordImagesResponse> {
    const [images, count] = await this.service.getRecordImages({
      coopId: req.params.coopId,
      day: req.params.day,
      limit: req.query.$limit,
      page: req.query.$page,
      user: req.user,
      sensorId: req.query.sensorId,
    });

    return {
      code: 200,
      count,
      data: images,
    };
  }

  @GET({
    url: '/smart-camera/:coopId/records/:day/:sensorId',
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
    return this.service.getRecordingImagesBySensorId({
      coopId: req.params.coopId,
      day: req.params.day,
      limit: req.query.$limit,
      page: req.query.$page,
      user: req.user,
      sensorId: req.params.sensorId,
    });
  }

  @POST({
    url: '/smart-camera/jobs/:coopId',
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

  @POST({
    url: '/smart-camera/:jobId/evaluate',
    options: {
      schema: {
        params: evaluateImageParamsDTO,
        body: evaluateImageBodyDTO,
        response: {
          200: evaluateImageResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async evaluateImage(
    req: FastifyRequest<{
      Params: EvaluateImageParams;
      Body: EvaluateImageBody;
    }>,
  ): Promise<EvaluateImageResponse> {
    const result = await this.service.evaluateImage({
      body: req.body,
      jobId: req.params.jobId,
      user: req.user,
    });

    return {
      code: 200,
      data: result,
    };
  }

  @GET({
    url: '/smart-camera/:coopId/cameras/:day',
    options: {
      schema: {
        params: getCamerasParamDTO,
        response: {
          200: getCameraResponseDTO,
        },
      },
      onRequest: verifyAccess,
    },
  })
  async getCameras(
    request: FastifyRequest<{
      Params: GetCamerasParam;
    }>,
  ): Promise<GetCameraResponse> {
    return this.service.getCameras({
      coopId: request.params.coopId,
      day: request.params.day,
      user: request.user,
    });
  }
}
