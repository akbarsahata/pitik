import { randomUUID } from 'crypto';
import { format } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { IsNull } from 'typeorm';
import env from '../config/env';
import { CoopDAO } from '../dao/coop.dao';
import { SensorESDAO } from '../dao/es/sensor.es.dao';
import { IOTSensorDAO } from '../dao/iotSensor.dao';
import { SmartRecorderJobDAO } from '../dao/smartRecorderJob.dao';
import { IotSensor } from '../datasources/entity/pgsql/IotSensor.entity';
import { SmartRecorderJob } from '../datasources/entity/pgsql/SmartRecorderJob.entity';
import { CreateJobResponseItem } from '../dto/smartRecorder.dto';
import { SMART_RECORDER_DATE_TIME_FORMAT, SMART_RECORDER_UPLOAD_STATE } from '../libs/constants';
import { ERR_SMART_RECORDER_COOP_NOT_AVAILABLE } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { GcpCloudStorage } from '../libs/utils/gcpCloudStorage';
import { Logger } from '../libs/utils/logger';

type CreateJob = {
  job: SmartRecorderJob;
  createJobItem: CreateJobResponseItem;
  sensor: IotSensor;
  deviceId: string;
};

@Service()
export class SmartRecorderService {
  @Inject(Logger)
  private logger: Logger;

  @Inject(SmartRecorderJobDAO)
  protected smartRecorderJobDAO: SmartRecorderJobDAO;

  @Inject(GcpCloudStorage)
  private cloudStorage: GcpCloudStorage;

  @Inject(IOTSensorDAO)
  protected iotSensorDAO: IOTSensorDAO;

  @Inject(CoopDAO)
  protected coopDAO: CoopDAO;

  @Inject(SensorESDAO)
  protected sensorESDAO: SensorESDAO;

  async createJob(opts: {
    createdAt?: Date;
    jobId?: string;
    sensorCode: string;
    user?: RequestUser;
    capturedAt?: string;
  }): Promise<CreateJob> {
    const now = opts.capturedAt
      ? format(new Date(opts.capturedAt), SMART_RECORDER_DATE_TIME_FORMAT)
      : format(new Date(), SMART_RECORDER_DATE_TIME_FORMAT);
    const jobId = opts.jobId || randomUUID();
    const path = `${now}_job_${jobId}.wav`;
    const sensor = await this.iotSensorDAO.getOneStrict({
      where: {
        sensorCode: opts.sensorCode,
        iotDevice: {
          deletedDate: IsNull(),
        },
      },
      relations: {
        room: {
          roomType: true,
          building: true,
          coop: true,
        },
        iotDevice: true,
      },
    });

    const {
      roomId,
      room: { coopId },
    } = sensor;

    if (!coopId) {
      throw ERR_SMART_RECORDER_COOP_NOT_AVAILABLE();
    }

    let job: SmartRecorderJob;
    const qr = await this.smartRecorderJobDAO.startTransaction();
    try {
      job = await this.smartRecorderJobDAO.upsertOne({
        user: opts.user,
        item: {
          id: jobId,
          bucket: opts.user ? env.AI_PUBLIC_BUCKET : env.AI_BUCKET,
          sensorId: sensor.id,
          coopId,
          floorId: roomId || undefined,
          path,
          createdAt: opts.createdAt,
          uploadState: opts.user?.id
            ? SMART_RECORDER_UPLOAD_STATE.COMMAND_RECEIVED_IN_SERVER
            : SMART_RECORDER_UPLOAD_STATE.PRESIGN_REQUESTED,
        },
        qr,
      });
    } catch (error) {
      await this.smartRecorderJobDAO.rollbackTransaction(qr);
      this.logger.logError(error);
      throw error;
    }

    // generating presign url for request coming from device
    const pathFile = `${env.SMART_RECORDER_FOLDER}/chicken-sickness/coop_${coopId}/room_${roomId}/cam_${job.sensorId}/${job.path}`;
    let presignedUrl = '';
    if (!opts.user) {
      try {
        presignedUrl = await this.cloudStorage.generateV4UploadSignedUrl({
          bucket: job.bucket,
          fileName: pathFile,
          acl: job.bucket === env.AI_PUBLIC_BUCKET ? 'public-read' : undefined,
        });
        job = await this.smartRecorderJobDAO.upsertOne({
          qr,
          item: {
            id: job.id,
            uploadState: SMART_RECORDER_UPLOAD_STATE.UPLOADING_PROCESS_IN_DEVICE,
          },
        });
      } catch (error) {
        job = await this.smartRecorderJobDAO.upsertOne({
          qr,
          item: {
            id: job.id,
            uploadState: SMART_RECORDER_UPLOAD_STATE.ERROR_CREATE_PRESIGN_URL,
          },
        });
        await this.smartRecorderJobDAO.commitTransaction(qr);
        throw new Error(SMART_RECORDER_UPLOAD_STATE.ERROR_CREATE_PRESIGN_URL);
      }
    }

    await this.smartRecorderJobDAO.commitTransaction(qr);
    return {
      sensor,
      deviceId: `o${sensor.iotDevice.mac.replace(/:/g, '')}`,
      job,
      createJobItem: {
        jobId: job.id,
        bucket: job.bucket,
        httpMethod: 'PUT',
        pathFile,
        presignedUrl,
      },
    };
  }
}
