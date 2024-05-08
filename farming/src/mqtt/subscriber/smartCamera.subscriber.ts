import { getInstanceByToken, Inject, Service } from 'fastify-decorators';
import env from '../../config/env';
import { IotCameraESDAO } from '../../dao/es/iotCamera.es.dao';
import { SlackDAO } from '../../dao/external/slack.dao';
import { IotDeviceDAO } from '../../dao/IotDevice.dao';
import { SmartCameraJobDAO } from '../../dao/smartCameraJob.dao';
import { IotSensor } from '../../datasources/entity/pgsql/IotSensor.entity';
import { SMART_CAMERA_UPLOAD_IMAGE_STATE } from '../../libs/constants';
import { MAC_LENGTH } from '../../libs/constants/mqttMessage';
import { getDateTimeString, topicToMac } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { extractMqttHeader } from '../../libs/utils/mqttParser';
import { base, smartcamera } from '../../proto/bundle';

@Service()
export class SmartCameraSubscriber {
  @Inject(SmartCameraJobDAO)
  private smartCameraJobDAO: SmartCameraJobDAO;

  @Inject(Logger)
  private logger: Logger;

  @Inject(IotCameraESDAO)
  private cameraEs: IotCameraESDAO;

  @Inject(SlackDAO)
  private slackDAO!: SlackDAO;

  @Inject(IotDeviceDAO)
  private iotDeviceDAO!: IotDeviceDAO;

  async updateState(payloadBuffer: Buffer) {
    const payloadBufferWithoutCRC = payloadBuffer.slice(0, payloadBuffer.length - 2);
    const payload = smartcamera.Cam.decode(payloadBufferWithoutCRC);

    let state: SMART_CAMERA_UPLOAD_IMAGE_STATE;
    switch (payload.state) {
      case smartcamera.DeviceImageState.DONE:
        state = SMART_CAMERA_UPLOAD_IMAGE_STATE.DONE;
        break;
      case smartcamera.DeviceImageState.ERROR_CAPTURE_IMAGE:
        state = SMART_CAMERA_UPLOAD_IMAGE_STATE.ERROR_CAPTURE_IMAGE;
        break;
      case smartcamera.DeviceImageState.ERROR_UPLOAD_IMAGE:
        state = SMART_CAMERA_UPLOAD_IMAGE_STATE.ERROR_UPLOAD_IMAGE;
        break;
      default:
        this.logger.error(payload, 'unhandled upload state');
        return;
    }

    await this.smartCameraJobDAO.upsertOne({
      item: {
        id: payload.jobId,
        uploadState: state,
      },
    });
  }

  static async updateStateWraper(_topic: string, payload: Buffer) {
    const self = getInstanceByToken<SmartCameraSubscriber>(SmartCameraSubscriber);
    await self.updateState(payload);
  }

  // eslint-disable-next-line class-methods-use-this
  decodeSmartCameraPayload(payloadBuffer: Buffer) {
    const payloadBufferWithoutCRC = payloadBuffer.slice(0, payloadBuffer.length - 2);
    const decoded = smartcamera.Cam.decode(payloadBufferWithoutCRC);

    return decoded;
  }

  // eslint-disable-next-line class-methods-use-this
  decodeSmartCameraMeta(topic: string, payloadBuffer: Buffer) {
    const basePayload = base.BasePayload.decode(payloadBuffer.slice(0, payloadBuffer.length - 2));
    const meta = extractMqttHeader(Buffer.from(basePayload.meta));
    const timestamp = getDateTimeString(meta.timestamp);
    const deviceId = topic.split('/').pop() as string;
    const mac = topicToMac(deviceId.substring(2, MAC_LENGTH));

    return {
      timestamp,
      deviceId,
      mac,
    };
  }

  static async diagnosticsDataWrapper(topic: string, payload: Buffer) {
    const self = getInstanceByToken<SmartCameraSubscriber>(SmartCameraSubscriber);
    await self.parseDiagnosticsData(topic, payload);
  }

  async parseDiagnosticsData(topic: string, payloadBuffer: Buffer) {
    // decode protobuf message
    const decode = this.decodeSmartCameraPayload(payloadBuffer);
    const meta = this.decodeSmartCameraMeta(topic, payloadBuffer);

    // parse protobuf payload
    const data: any = {};
    if (decode.diagnosticsData) {
      data.cpuUsage = {};
      data.cpuUsage.timestampUnix = Number(decode.diagnosticsData.cpuUsage?.timestampUnix!);
      data.cpuUsage.cpuUsagePercentage = decode.diagnosticsData.cpuUsage?.cpuUsagePercentage!;

      data.cpuTemperature = {};
      data.cpuTemperature.timestampUnix = Number(
        decode.diagnosticsData.cpuTemperature?.timestampUnix!,
      );
      data.cpuTemperature.cpuTemperatureCelcius =
        decode.diagnosticsData.cpuTemperature?.cpuTemperatureCelcius!;

      data.diskStats = {};
      data.diskStats.timestampUnix = Number(decode.diagnosticsData.diskStats?.timestampUnix!);
      data.diskStats.diskUsed_KB = decode.diagnosticsData.diskStats?.diskUsed_KB!;
      data.diskStats.diskAvailable_KB = decode.diagnosticsData.diskStats?.diskAvailable_KB!;
      data.diskStats.diskUsedPercentage = decode.diagnosticsData.diskStats?.diskUsedPercentage!;

      data.memoryStats = {};
      data.memoryStats.timestampUnix = Number(decode.diagnosticsData.memoryStats?.timestampUnix!);
      data.memoryStats.memoryUsed_MiB = decode.diagnosticsData.memoryStats?.memoryUsed_MiB!;
      data.memoryStats.memoryAvailable_MiB = decode.diagnosticsData.memoryStats?.memoryUsed_MiB!;

      data.networkStats = {};
      data.networkStats.timestampUnix = Number(decode.diagnosticsData.networkStats?.timestampUnix!);
      data.networkStats.pingMillis = decode.diagnosticsData.networkStats?.pingMillis!;
    }

    // send data to elastic
    try {
      await this.cameraEs.saveDiagnosticsToElastic(meta.mac, data, meta.timestamp);
    } catch (error) {
      this.logger.error(error);
    }
  }

  static async cameraOfflineWrapper(topic: string, payload: Buffer) {
    const self = getInstanceByToken<SmartCameraSubscriber>(SmartCameraSubscriber);
    await self.parseCameraOffline(topic, payload);
  }

  async parseCameraOffline(topic: string, payloadBuffer: Buffer) {
    // decode protobuf message
    const decode = this.decodeSmartCameraPayload(payloadBuffer);
    const meta = this.decodeSmartCameraMeta(topic, payloadBuffer);

    // parse protobuf payload
    const data: any = {};
    if (decode.alertCameraOffline) {
      data.alertCameraOffline = {};
      data.alertCameraOffline.sensorCode = decode.alertCameraOffline?.sensorCode!;

      // get device & sensor info
      const device = await this.iotDeviceDAO.getOne({
        relations: {
          coop: {
            farm: {
              branch: true,
            },
          },
          building: true,
          room: {
            roomType: true,
          },
          sensors: {
            room: {
              roomType: true,
            },
          },
        },
        where: {
          mac: meta.mac.toLowerCase(),
        },
      });

      if (device) {
        // find offline sensors
        const offlineSensors: IotSensor[] = [];
        device.sensors.forEach((item: any) => {
          if (data.alertCameraOffline.sensorCode.includes(item.sensorCode)) {
            offlineSensors.push(item);
          }
        });

        // send notification to slack
        await this.slackDAO.sendIotAlert(
          env.IOT_ALERTS_WEBHOOK,
          'CAMERA OFFLINE',
          { ...device, sensors: offlineSensors },
          data,
          env.IOT_ALERTS_SLACK_ID,
        );
      }
    }

    // send data to elastic
    try {
      await this.cameraEs.saveAlertToElastic(meta.mac, data, meta.timestamp);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
