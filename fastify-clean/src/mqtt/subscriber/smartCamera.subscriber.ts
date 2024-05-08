import { getInstanceByToken, Inject, Service } from 'fastify-decorators';
import { SmartCameraJobDAO } from '../../dao/smartCameraJob.dao';
import { SMART_CAMERA_UPLOAD_IMAGE_STATE } from '../../libs/constants';
import { Logger } from '../../libs/utils/logger';
import { smartcamera } from '../../proto/bundle';

@Service()
export class SmartCameraSubscriber {
  @Inject(SmartCameraJobDAO)
  private smartCameraJobDAO: SmartCameraJobDAO;

  @Inject(Logger)
  private logger: Logger;

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
}
