import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, DELETE, Inject, POST } from 'fastify-decorators';
import {
  DeviceBody,
  deviceBodyDTO,
  DeviceParams,
  deviceParamsDTO,
  DeviceResponse,
  deviceResponseDTO,
  DeviceResponsePaginated,
  deviceResponsePaginatedDTO,
} from '../../dto/device.dto';
import DeviceService from '../../services/device.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

export type CreateDeviceRequest = FastifyRequest<{
  Body: DeviceBody;
}>;

export type DeleteDeviceRequest = FastifyRequest<{
  Params: DeviceParams;
}>;

@Controller({
  route: '/devices',
  type: 0,
  tags: [{ name: 'devices' }],
})
export class DeviceController {
  @Inject(DeviceService)
  service!: DeviceService;

  @POST({
    url: '/',
    options: {
      schema: {
        body: deviceBodyDTO,
        response: { 200: deviceResponseDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async createDevice(
    request: CreateDeviceRequest,
    reply: FastifyReply,
  ): Promise<DeviceResponse | undefined> {
    try {
      return this.service.createDevice(request.body, request.user);
    } catch (error) {
      return reply.code(400).send(error.message);
    }
  }

  @DELETE({
    url: '/:id',
    options: {
      schema: {
        params: deviceParamsDTO,
        response: { 200: deviceResponseDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async deleteDeviceById(
    request: DeleteDeviceRequest,
    reply: FastifyReply,
  ): Promise<DeviceResponse | undefined> {
    try {
      return this.service.deleteDeviceById(request.params.id);
    } catch (error) {
      return reply.code(400).send(error.message);
    }
  }

  @DELETE({
    url: '/',
    options: {
      schema: {
        response: { 200: deviceResponsePaginatedDTO },
      },
      onRequest: verifyAccess,
    },
  })
  async deleteDeviceByUser(
    request: DeleteDeviceRequest,
    reply: FastifyReply,
  ): Promise<DeviceResponsePaginated | undefined> {
    try {
      return this.service.deleteDeviceByUserId(request.user.id);
    } catch (error) {
      return reply.code(400).send(error.message);
    }
  }
}
