import { FastifyRequest, FastifyReply } from 'fastify';
import { Controller, GET } from 'fastify-decorators';
import { HealthResponse, healthResponseDTO } from '../../dto/health.dto';

import HealthService from '../../services/health.service';

@Controller({
  route: '/status',
  type: 0,
  tags: [{ name: 'status' }],
})
export class HealthController {
  private service: HealthService;

  constructor(service: HealthService) {
    this.service = service;
  }

  @GET({
    url: '/',
    options: {
      schema: {
        response: { 200: healthResponseDTO },
      },
    },
  })
  async getHealthInfo(_: FastifyRequest, reply: FastifyReply): Promise<HealthResponse> {
    const healthInfo = this.service.getHealthInfo();

    reply.header('content-type', 'application/json');
    reply.status(200);

    return {
      code: 200,
      data: healthInfo,
    };
  }
}
