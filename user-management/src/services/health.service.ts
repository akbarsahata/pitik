import { hoursToSeconds, minutesToSeconds, secondsToHours, secondsToMinutes } from 'date-fns';
import { Service } from 'fastify-decorators';
import { HealthResponseItem } from '../dto/health.dto';

@Service()
class HealthService {
  // eslint-disable-next-line class-methods-use-this
  getHealthInfo(): HealthResponseItem {
    let seconds = process.uptime();
    const hours = secondsToHours(seconds);
    const minutes = secondsToMinutes(seconds - hoursToSeconds(hours));
    seconds = seconds - hoursToSeconds(hours) - minutesToSeconds(minutes);

    const uptime = `${hours} hours ${minutes} minutes ${seconds.toFixed(0)} seconds`;

    return {
      uptime,
      date: new Date().toISOString(),
      status: 'ok',
    };
  }
}

export default HealthService;
