import { Service } from 'fastify-decorators';

@Service()
class HealthService {
  // eslint-disable-next-line class-methods-use-this
  getHealthInfo(): Object {
    return {
      uptime: process.uptime(),
      date: new Date(),
      status: 'ok',
    };
  }
}

export default HealthService;
