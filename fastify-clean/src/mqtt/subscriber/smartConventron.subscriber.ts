import { captureException } from '@sentry/node';
import { getInstanceByToken, Inject, Service } from 'fastify-decorators';
import { IotConventronESDAO } from '../../dao/es/iotConventron.es.dao';
import { PayloadConventronJob } from '../../dto/smartConventron.dto';
import { DIVIDER, TEMPTRON_TYPE } from '../../libs/constants/mqttMessage';
import {
  decodeTlvVersion,
  errorConv,
  getDateTimeString,
  hexToNumber,
  intermittentRelayData,
  relayStatus,
} from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';

@Service()
export class SmartConventronSubcriber {
  @Inject(Logger)
  private logger: Logger;

  @Inject(IotConventronESDAO)
  private conventronEs: IotConventronESDAO;

  async updatePeriodic(topic: string, payload: string) {
    const elastic: Partial<PayloadConventronJob> = {
      fwVersion: decodeTlvVersion(payload.substring(0, 4)),
      temptronVersion:
        parseInt(payload.substring(5, 6), 10) === 1 ? TEMPTRON_TYPE.T304 : TEMPTRON_TYPE.T607,
      hwVersion: decodeTlvVersion(payload.substring(6, 10)),
      created: getDateTimeString(Buffer.from(payload.substring(10, 18), 'hex')),
      relayInput: relayStatus(payload.substring(18, 22)),
      relayOutput: relayStatus(payload.substring(22, 26)),
      intermittentRelay: intermittentRelayData(payload.substring(26, 28)),
      t: {
        t1: Number(hexToNumber(payload.substring(28, 32))) / DIVIDER.GENERAL,
        t2: Number(hexToNumber(payload.substring(32, 36))) / DIVIDER.GENERAL,
        t3: Number(hexToNumber(payload.substring(36, 40))) / DIVIDER.GENERAL,
        t4: Number(hexToNumber(payload.substring(40, 44))) / DIVIDER.GENERAL,
        t5: Number(hexToNumber(payload.substring(44, 48))) / DIVIDER.GENERAL,
      },
      h: Number(hexToNumber(payload.substring(48, 52))) / DIVIDER.GENERAL,
      e: errorConv(payload.substring(52, 56)),
      raw: payload,
    };

    try {
      await this.conventronEs.saveToElastic(topic, elastic);
    } catch (error) {
      this.logger.error(error);
      captureException(error);
    }
  }

  static async updatePeriodicWraper(topic: string, payload: string) {
    const self = getInstanceByToken<SmartConventronSubcriber>(SmartConventronSubcriber);
    await self.updatePeriodic(topic, payload);
  }
}
