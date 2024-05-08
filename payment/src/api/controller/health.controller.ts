import { Controller, GET } from 'fastify-decorators';
import { healthResponseDTO } from '../../dto/health.dto';

import HealthService from '../../services/health.service';

@Controller({ route: '/health' })
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
  async getHealthInfo(): Promise<Object> {
    const healthInfo = this.service.getHealthInfo();

    return healthInfo;
  }
}
