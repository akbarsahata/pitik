import { FastifyRequest } from 'fastify';
import { Controller, DELETE, GET, Inject, POST } from 'fastify-decorators';
import {
  deleteFirmwareParamDTO,
  DeleteFirmwareParams,
  DeleteFirmwareResponse,
  deleteFirmwareResponseDTO,
  FirmwareBody,
  firmwareBodyDTO,
  firmwareResponseDTO,
  GetFirmwareQuery,
  getFirmwareQueryDTO,
  getFirmwareResponseDTO,
} from '../../dto/firmware.dto';
import { FirmwareService } from '../../services/firmware.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

type DeleteDevicesSensorsRequest = FastifyRequest<{
  Params: DeleteFirmwareParams;
}>;

@Controller({
  route: '/firmware',
  type: 0,
  tags: [{ name: 'firmware' }],
})
export class FirmwareController {
  @Inject(FirmwareService)
  private service: FirmwareService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getFirmwareQueryDTO,
        response: {
          200: getFirmwareResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async get(
    req: FastifyRequest<{
      Querystring: GetFirmwareQuery;
    }>,
  ) {
    const [firmware, count] = await this.service.get(req.query);

    return {
      code: 200,
      count,
      data: firmware,
    };
  }

  @POST({
    url: '/',
    options: {
      schema: {
        body: firmwareBodyDTO,
        response: { 200: firmwareResponseDTO },
      },
      onRequest: [verifyAccess],
    },
  })
  async create(
    request: FastifyRequest<{
      Body: FirmwareBody;
    }>,
  ) {
    const firmware = await this.service.createOne(request.body, request.user);

    return {
      code: 200,
      data: firmware,
    };
  }

  @DELETE({
    url: '/:id',
    options: {
      schema: {
        params: deleteFirmwareParamDTO,
        response: {
          200: deleteFirmwareResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async deleteDevicesSensors(
    request: DeleteDevicesSensorsRequest,
  ): Promise<DeleteFirmwareResponse> {
    const firmware = await this.service.deleteFirmware(request.params.id, request.user);

    return {
      code: 200,
      data: {
        id: firmware.id,
        deletedDate: firmware.deletedDate.toISOString(),
      },
    };
  }
}
