import { Service } from 'fastify-decorators';
import { HealthResponseItem } from '../dto/health.dto';
import { secondsToDurationText } from '../libs/utils/helpers';

@Service()
class HealthService {
  // eslint-disable-next-line class-methods-use-this
  getHealthInfo(): HealthResponseItem {
    const uptime = secondsToDurationText(process.uptime());

    return {
      uptime,
      date: new Date().toISOString(),
      status: 'ok',
    };
  }
}

export default HealthService;
