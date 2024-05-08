import { Inject, Service } from 'fastify-decorators';
import { FirmwareDAO } from '../../dao/firmware.dao';
import { SmartCameraJobDAO } from '../../dao/smartCameraJob.dao';
import { MqttConnection } from '../../datasources/connection/mqtt.connection';
import { SMART_CAMERA_UPLOAD_IMAGE_STATE } from '../../libs/constants';
import {
  MQTT_DEVICE_TYPE,
  MQTT_MESSAGE_CODE,
  MQTT_MESSAGE_TYPE,
} from '../../libs/constants/mqttMessage';
import { DOWNLOAD_GLOBAL_TOPIC } from '../../libs/constants/mqttTopic';
import { sleep } from '../../libs/utils/helpers';
import { Logger } from '../../libs/utils/logger';
import { appendCRC, constructMeta } from '../../libs/utils/mqttParser';
import { smartcamera } from '../../proto/bundle';

type CaptureImageCommandParam = {
  delayInSeconds?: number;
  deviceId: string;
  jobId: string;
  sensorCode: string;
};

type RegisterCameraCommandParam = {
  delayInSeconds?: number;
  deviceId: string;
  sensorCode: string;
  ipCamera: string;
};

type AssignOtaCameraParam = {
  delayInSeconds?: number;
  deviceId: string;
  firmwareId: string;
};

@Service()
export class SmartCameraPublisher {
  @Inject(SmartCameraJobDAO)
  private smartCameraJobDAO: SmartCameraJobDAO;

  @Inject(FirmwareDAO)
  private firmwareDAO: FirmwareDAO;

  @Inject(Logger)
  private logger: Logger;

  @Inject(MqttConnection)
  private mqttConnection: MqttConnection;

  async sendCaptureImageCommand(param: CaptureImageCommandParam) {
    if (param.delayInSeconds) {
      await sleep(param.delayInSeconds * 1000);
    }

    const meta = constructMeta({
      messageType: MQTT_MESSAGE_TYPE.COMMAND,
      messageCode: MQTT_MESSAGE_CODE.COMMAND_CAPTURE_IMAGE,
    });

    const commandPayload = smartcamera.Cam.create({
      meta,
      jobId: param.jobId,
      sensorCode: param.sensorCode,
    });

    const msg = smartcamera.Cam.encode(commandPayload).finish();

    const payload = appendCRC(msg);

    const deviceId = Array.from(param.deviceId);
    deviceId.splice(1, 0, MQTT_DEVICE_TYPE.SMART_CAMERA);

    const topic = DOWNLOAD_GLOBAL_TOPIC.replace('+', deviceId.join(''));

    this.mqttConnection.client.publish(
      topic,
      payload,
      {
        qos: 1,
      },
      async (error) => {
        if (error) {
          await this.smartCameraJobDAO.upsertOne({
            item: {
              id: param.jobId,
              uploadState: SMART_CAMERA_UPLOAD_IMAGE_STATE.ERROR_SEND_COMMAND,
            },
          });
          this.logger.error({
            error,
            topic,
            payload: payload.toString('hex'),
          });

          return;
        }

        await this.smartCameraJobDAO.upsertOne({
          item: {
            id: param.jobId,
            uploadState: SMART_CAMERA_UPLOAD_IMAGE_STATE.COMMAND_RECEIVED_IN_DEVICE,
          },
        });
      },
    );
  }

  async sendRegisterCameraCommand(param: RegisterCameraCommandParam) {
    if (param.delayInSeconds) {
      await sleep(param.delayInSeconds * 1000);
    }

    const meta = constructMeta({
      messageType: MQTT_MESSAGE_TYPE.COMMAND,
      messageCode: MQTT_MESSAGE_CODE.COMMAND_REGISTER_CAMERA,
    });

    const commandPayload = smartcamera.Cam.create({
      meta,
      setCam: smartcamera.SetCam.create({
        setParam: smartcamera.SetParam.create({
          sensorCode: param.sensorCode,
          ipCam: param.ipCamera,
        }),
      }),
    });

    const msg = smartcamera.Cam.encode(commandPayload).finish();

    const payload = appendCRC(msg);

    const deviceId = Array.from(param.deviceId);
    deviceId.splice(1, 0, MQTT_DEVICE_TYPE.SMART_CAMERA);

    const topic = DOWNLOAD_GLOBAL_TOPIC.replace('+', deviceId.join(''));

    this.mqttConnection.client.publish(topic, payload, {
      qos: 1,
    });
  }

  async sendAssignOtaCameraCommand(param: AssignOtaCameraParam) {
    if (param.delayInSeconds) {
      await sleep(param.delayInSeconds * 1000);
    }

    const firmware = await this.firmwareDAO.getOneStrict({
      where: {
        id: param.firmwareId,
      },
    });

    const meta = constructMeta({
      messageType: MQTT_MESSAGE_TYPE.COMMAND,
      messageCode: MQTT_MESSAGE_CODE.SET_CAMERA_OTA,
    });

    const commandPayload = smartcamera.Cam.create({
      meta,
      setCam: smartcamera.SetCam.create({
        setOta: smartcamera.SetOta.create({
          fileName: firmware.fileName,
          fileLink: firmware.fileName,
        }),
      }),
    });

    const msg = smartcamera.Cam.encode(commandPayload).finish();

    const payload = appendCRC(msg);

    const deviceId = Array.from(param.deviceId);
    deviceId.splice(1, 0, MQTT_DEVICE_TYPE.SMART_CAMERA);

    const topic = DOWNLOAD_GLOBAL_TOPIC.replace('+', deviceId.join(''));

    this.mqttConnection.client.publish(topic, payload, {
      qos: 1,
    });
  }
}
