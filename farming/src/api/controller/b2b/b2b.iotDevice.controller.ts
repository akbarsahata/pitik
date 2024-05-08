import { FastifyRequest } from 'fastify';
import { Controller, DELETE, GET, Inject } from 'fastify-decorators';
import {
  DeleteAllB2BIotDeviceParam,
  deleteAllB2BIotDeviceParamDTO,
  DeleteAllB2BIotDeviceResponse,
  deleteAllB2BIotDeviceResponseDTO,
  GetB2BIotDevicesQuery,
  getB2BIotDevicesQueryDTO,
  GetB2BIotDevicesResponse,
  getB2BIotDevicesResponseDTO,
} from '../../../dto/b2b/b2b.iotDevice.dto';
import { B2BIotDeviceService } from '../../../services/b2b/b2b.iotDevice.service';
import { verifyAccess } from '../../hooks/onRequest/verifyAccess';

@Controller({
  route: '/b2b/iot-devices',
  type: 0,
  tags: [{ name: 'b2b-iot-devices' }],
})
export class B2BIotDeviceController {
  @Inject(B2BIotDeviceService)
  private service!: B2BIotDeviceService;

  @GET({
    url: '/',
    options: {
      schema: {
        querystring: getB2BIotDevicesQueryDTO,
        response: {
          200: getB2BIotDevicesResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async getB2BIotDevices(
    req: FastifyRequest<{
      Querystring: GetB2BIotDevicesQuery;
    }>,
  ): Promise<GetB2BIotDevicesResponse> {
    const [data, count] = await this.service.getB2BIotDevices(req.query, req.user);

    return {
      code: 200,
      data,
      count,
    };
  }

  @DELETE({
    url: '/:deviceId/room/:roomId/remove',
    options: {
      schema: {
        params: deleteAllB2BIotDeviceParamDTO,
        response: {
          200: deleteAllB2BIotDeviceResponseDTO,
        },
      },
      onRequest: [verifyAccess],
    },
  })
  async deleteAllB2BIotDevice(
    req: FastifyRequest<{
      Params: DeleteAllB2BIotDeviceParam;
    }>,
  ): Promise<DeleteAllB2BIotDeviceResponse> {
    await this.service.deleteAllB2BIotDevice(req.params);

    return {
      code: 200,
      data: {
        message: 'OK',
      },
    };
  }
}
