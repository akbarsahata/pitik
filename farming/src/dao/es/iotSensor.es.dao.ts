import { ApiResponse } from '@elastic/elasticsearch';
import { hoursToMilliseconds } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { IsNull } from 'typeorm';
import { esEnv } from '../../config/datasource';
import { ElasticSearchConnection } from '../../datasources/connection/elasticsearch.connection';
import { CACHE_KEY_PREFIX } from '../../libs/constants';
import { IotDeviceDAO } from '../IotDevice.dao';

@Service()
export class IotSensorESDAO {
  @Inject(ElasticSearchConnection)
  private es!: ElasticSearchConnection;

  @Inject(IotDeviceDAO)
  private iotDeviceDAO!: IotDeviceDAO;

  async saveDataToElastic<T>(
    mac: string,
    data: T,
    timestamp: string,
  ): Promise<ApiResponse<Record<string, any>, unknown>> {
    const deviceLocation = await this.getDeviceLocationInfo(mac);

    const result = await this.es.client.index({
      index: esEnv.ES_IDX_IOT,
      body: {
        created: timestamp,
        sensors: data,
        paths: [mac, deviceLocation.coopCode, deviceLocation.roomCode],
      },
    });
    return result;
  }

  async saveDiagnosticsToElastic<T>(
    mac: string,
    data: T,
    timestamp: string,
  ): Promise<ApiResponse<Record<string, any>, unknown>> {
    const deviceLocation = await this.getDeviceLocationInfo(mac);

    // send to elasticsearch
    const result = await this.es.client.index({
      index: esEnv.ES_IDX_IOT,
      body: {
        created: timestamp,
        diagnostics: data,
        paths: [mac, deviceLocation.coopCode, deviceLocation.roomCode],
      },
    });
    return result;
  }

  async saveReplyDeviceToElastic<T>(
    mac: string,
    data: T,
    timestamp: string,
  ): Promise<ApiResponse<Record<string, any>, unknown>> {
    const deviceLocation = await this.getDeviceLocationInfo(mac);

    // send to elasticsearch
    const result = await this.es.client.index({
      index: esEnv.ES_IDX_IOT,
      body: {
        created: timestamp,
        replys: data,
        paths: [mac, deviceLocation.coopCode, deviceLocation.roomCode],
      },
    });
    return result;
  }

  async getDeviceLocationInfo(mac: string) {
    let coopCode;
    const device = await this.iotDeviceDAO.getOne({
      relations: {
        room: true,
        coop: true,
      },
      where: {
        mac,
        deletedDate: IsNull(),
      },
      cache: {
        id: `${CACHE_KEY_PREFIX.GET_ONE_IOT_DEVICE}:${mac}`,
        milliseconds: hoursToMilliseconds(1),
      },
    });

    if (device && device.coop.coopCode) {
      const tempCoop = device.coop.coopCode;
      coopCode = `f${tempCoop?.substring(tempCoop.length - 4, tempCoop.length)}`;
    }

    return {
      coopCode,
      roomCode: device?.room.roomCode,
    };
  }
}
