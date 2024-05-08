import { hoursToMilliseconds } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { DeepPartial } from 'typeorm';
import { esEnv } from '../../config/datasource';
import { ElasticSearchConnection } from '../../datasources/connection/elasticsearch.connection';
import { IOTSensorData } from '../../datasources/entity/elasticsearch/IOTSensorData.entity';
import { IotDeviceDAO } from '../IotDevice.dao';

@Service()
export class SmartMonitorDAO {
  @Inject(ElasticSearchConnection)
  private es!: ElasticSearchConnection;

  @Inject(IotDeviceDAO)
  private iotDeviceDAO!: IotDeviceDAO;

  async saveToElasticSearch(mac: string, sensors: DeepPartial<IOTSensorData>): Promise<any> {
    let coopCode = null;
    const device = await this.iotDeviceDAO.getOne({
      relations: {
        room: true,
      },
      where: {
        mac,
      },
      cache: hoursToMilliseconds(1),
    });

    if (device?.coopCode) {
      const tempCoop = device?.coopCode;
      coopCode = `f${tempCoop?.substring(tempCoop.length - 4, tempCoop.length)}`;
    }

    const params: DeepPartial<IOTSensorData> = {
      ...sensors,
      coopCode: coopCode || '',
      mac,
      roomCode: device?.room.roomCode || '',
    };
    const result = await this.es.client.index({
      index: esEnv.ES_IDX_IOT,
      body: params,
    });
    return result;
  }
}
