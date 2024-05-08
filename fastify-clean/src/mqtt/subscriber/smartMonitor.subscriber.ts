import { getInstanceByToken, Inject, Service } from 'fastify-decorators';
import { IsNull } from 'typeorm';
import { IotDeviceDAO } from '../../dao/IotDevice.dao';
import { RedisConnection } from '../../datasources/connection/redis.connection';
import { StatsdConnection } from '../../datasources/connection/statsd.connection';
import { MAC_LENGTH, MQTT_MONITOR_STATUS } from '../../libs/constants/mqttMessage';
import { topicToMac } from '../../libs/utils/helpers';
import { smartmonitor } from '../../proto/bundle';

@Service()
export class SmartMonitorSubscriber {
  @Inject(StatsdConnection)
  private statsdConnection: StatsdConnection;

  @Inject(RedisConnection)
  private redisConnection: RedisConnection;

  @Inject(IotDeviceDAO)
  private IotDeviceDAO: IotDeviceDAO;

  async updatePeriodic(topic: string) {
    // TODO: replace with Rusdi's code
    const deviceId = topic.split('/').pop() as string;

    const mac = topicToMac(deviceId.substring(2, MAC_LENGTH));

    // check for anomaly
    const device = await this.IotDeviceDAO.getOne({
      where: {
        mac,
        deletedDate: IsNull(),
      },
    });

    if (device && device.status) {
      const REDIS_PREFIX = 'iot:';

      const metricName = `${deviceId}_electricity`;

      const self = getInstanceByToken<SmartMonitorSubscriber>(SmartMonitorSubscriber);

      const prev = await self.redisConnection.connection.get(REDIS_PREFIX + metricName);

      const now = Date.now();

      self.redisConnection.connection.set(REDIS_PREFIX + metricName, now);

      const maxTimeDiff = 20 * 1 * 1000;

      if (prev && now - Number(prev) > maxTimeDiff) {
        self.sendGauge(metricName, 0);
      }
    }
  }

  static async updatePeriodicWraper(topic: string) {
    const self = getInstanceByToken<SmartMonitorSubscriber>(SmartMonitorSubscriber);

    await self.updatePeriodic(topic);
  }

  async sendGauge(name: string, value: number) {
    this.statsdConnection.client.gauge(name, value);
  }

  static async sendMetricWrapper(topic: string, payload: Buffer) {
    // reprocess payload, without checking CRC
    const payloadWithoutCRC = payload.slice(0, payload.length - 2);

    const content = smartmonitor.MonitorContent.decode(payloadWithoutCRC);

    // process the status bits
    const deviceId = topic.split('/').pop() as string;

    const self = getInstanceByToken<SmartMonitorSubscriber>(SmartMonitorSubscriber);

    MQTT_MONITOR_STATUS.forEach((monitorStatus, i) => {
      const metricName = `${deviceId}_${monitorStatus}`;

      if (content.monitorStatus?.status) {
        const { status } = content.monitorStatus;

        const shift = 2 ** i;

        const bitset = (status / shift) % 2 !== 0;

        self.sendGauge(metricName, bitset ? 1 : 0);
      }
    });
  }
}
