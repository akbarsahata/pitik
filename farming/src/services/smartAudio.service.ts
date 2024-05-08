import { randomUUID } from 'crypto';
import { format } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { IsNull } from 'typeorm';
import env from '../config/env';
import { AiSmartAudioJobDAO } from '../dao/aiSmartAudioJob.dao';
import { CoopDAO } from '../dao/coop.dao';
import { SensorESDAO } from '../dao/es/sensor.es.dao';
import { IOTSensorDAO } from '../dao/iotSensor.dao';
import { AiSmartAudioJob } from '../datasources/entity/pgsql/AiSmartAudioJob.entity';
import { IotSensor } from '../datasources/entity/pgsql/IotSensor.entity';
import { CreateJobResponseItem } from '../dto/smartAudio.dto';
import { SMART_AUDIO_DATE_TIME_FORMAT, SMART_AUDIO_UPLOAD_FILE_STATE } from '../libs/constants';
import { ERR_SMART_AUDIO_COOP_NOT_AVAILABLE } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { GcpCloudStorage } from '../libs/utils/gcpCloudStorage';
import { Logger } from '../libs/utils/logger';

type CreateJob = {
  job: AiSmartAudioJob;
  createJobItem: CreateJobResponseItem;
  sensor: IotSensor;
  mac: string;
};

@Service()
export class SmartAudioService {
  @Inject(Logger)
  private logger: Logger;

  @Inject(AiSmartAudioJobDAO)
  protected aiAiSmartAudioJobDAO: AiSmartAudioJobDAO;

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
      ? format(new Date(opts.capturedAt), SMART_AUDIO_DATE_TIME_FORMAT)
      : format(new Date(), SMART_AUDIO_DATE_TIME_FORMAT);
    const jobId = opts.jobId || randomUUID();
    const filePath = `${now}_job_${jobId}.mp3`;

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
      throw ERR_SMART_AUDIO_COOP_NOT_AVAILABLE();
    }

    let job: AiSmartAudioJob;
    const qr = await this.aiAiSmartAudioJobDAO.startTransaction();
    try {
      job = await this.aiAiSmartAudioJobDAO.upsertOne({
        user: opts.user,
        item: {
          id: jobId,
          bucket: env.AI_BUCKET,
          sensorId: sensor.id,
          coopId,
          roomId: roomId || undefined,
          filePath,
          createdAt: opts.createdAt,
          uploadState: opts.user?.id
            ? SMART_AUDIO_UPLOAD_FILE_STATE.COMMAND_RECEIVED_IN_SERVER
            : SMART_AUDIO_UPLOAD_FILE_STATE.PRESIGN_REQUESTED,
        },
        qr,
      });
    } catch (error) {
      await this.aiAiSmartAudioJobDAO.rollbackTransaction(qr);
      this.logger.logError(error);
      throw error;
    }

    // generate a presigned url for the request coming from the device
    const pathFile = `${env.SMART_AUDIO_FOLDER}/chicken-sickness/coop_${coopId}/room_${roomId}/mic_${job.sensorId}/${job.filePath}`;
    let presignedUrl = '';
    if (!opts.user) {
      try {
        presignedUrl = await this.cloudStorage.generateV4UploadSignedUrl({
          bucket: job.bucket,
          fileName: pathFile,
          acl: job.bucket === env.AI_PUBLIC_BUCKET ? 'public-read' : undefined,
        });
        job = await this.aiAiSmartAudioJobDAO.upsertOne({
          qr,
          item: {
            id: job.id,
            uploadState: SMART_AUDIO_UPLOAD_FILE_STATE.UPLOADING_PROCESS_IN_DEVICE,
          },
        });
      } catch (error) {
        job = await this.aiAiSmartAudioJobDAO.upsertOne({
          qr,
          item: {
            id: job.id,
            uploadState: SMART_AUDIO_UPLOAD_FILE_STATE.ERROR_CREATE_PRESIGN_URL,
          },
        });
        await this.aiAiSmartAudioJobDAO.commitTransaction(qr);
        throw new Error(SMART_AUDIO_UPLOAD_FILE_STATE.ERROR_CREATE_PRESIGN_URL);
      }
    }

    await this.aiAiSmartAudioJobDAO.commitTransaction(qr);
    return {
      sensor,
      mac: sensor.iotDevice.mac,
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
