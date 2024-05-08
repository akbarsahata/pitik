import { Service } from 'fastify-decorators';
// import { FarmingCycleDAO } from '../../dao/farmingCycle.dao';
import { TaskThreshold } from '../../dto/task.dto';

@Service()
export class ThresholdGenerator {
  // @Inject(FarmingCycleDAO)
  // private farmingCycleDAO: FarmingCycleDAO

  private rules: {
    [key: string]: TaskThreshold; // |((farmingCycleId: string) => Promise<TaskThreshold>)
  } = {
    TEPK: {
      min: 0,
      max: 50,
      strict: false,
    },
    TEKO: {
      min: 0,
      max: 50,
      strict: false,
    },
    'Tembolok Penuh Bulat': {
      min: 0,
      max: 50,
      strict: false,
    },
    TEMPERATURE: {
      min: 15,
      max: 50,
      strict: true,
    },
    RH: {
      min: 0,
      max: 100,
      strict: true,
    },
  };

  async generate(variableCode: string): Promise<TaskThreshold> {
    return this.rules[variableCode] || {};
  }
}
