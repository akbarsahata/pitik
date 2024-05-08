import { randomUUID } from 'crypto';
import {
  add,
  differenceInDays,
  differenceInSeconds,
  eachDayOfInterval,
  format,
  isFuture,
  set,
} from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { Between, In, IsNull, MoreThanOrEqual, Not } from 'typeorm';
import env from '../config/env';
import { AiCrowdManualCheckingDAO } from '../dao/aiCrowdManualChecking.dao';
import { CoopDAO } from '../dao/coop.dao';
import { SensorESDAO } from '../dao/es/sensor.es.dao';
import { IOTSensorDAO } from '../dao/iotSensor.dao';
import { SmartCameraJobDAO } from '../dao/smartCameraJob.dao';
import { RedisConnection } from '../datasources/connection/redis.connection';
import { AiCrowdManualChecking } from '../datasources/entity/pgsql/AiCrowdManualChecking.entity';
import { IotSensor, IotSensorTypeEnum } from '../datasources/entity/pgsql/IotSensor.entity';
import { SmartCameraJob } from '../datasources/entity/pgsql/SmartCameraJob.entity';
import {
  CreateJobResponseItem,
  EvaluateImageBody,
  GetCameraResponse,
  GetRecordImagesBySensorIdResponse,
  ImageDataItem,
  RecordImagesItem,
  SmartCameraDayRecordsItem,
} from '../dto/smartCamera.dto';
import {
  DATE_SQL_FORMAT,
  DEFAULT_TIME_ZONE,
  SMART_CAMERA_DATE_TIME_FORMAT,
  SMART_CAMERA_UPLOAD_IMAGE_STATE,
} from '../libs/constants';
import {
  ERR_IMAGE_REQUEST_QUOTA_EXCEEDED,
  ERR_SMART_CAMERA_COOP_NOT_AVAILABLE,
} from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { GcpCloudStorage } from '../libs/utils/gcpCloudStorage';
import { Logger } from '../libs/utils/logger';
import { SmartCameraPublisher } from '../mqtt/publisher/smartCamera.publisher';

type CreateJob = {
  job: SmartCameraJob;
  createJobItem: CreateJobResponseItem;
  sensor: IotSensor;
  deviceId: string;
};

@Service()
export class SmartCameraService {
  @Inject(Logger)
  private logger: Logger;

  @Inject(SmartCameraJobDAO)
  protected smartCameraJobDAO: SmartCameraJobDAO;

  @Inject(AiCrowdManualCheckingDAO)
  private crowdManualCheckingDAO: AiCrowdManualCheckingDAO;

  @Inject(SmartCameraPublisher)
  protected smartCameraPublisher: SmartCameraPublisher;

  @Inject(RedisConnection)
  private redis: RedisConnection;

  @Inject(GcpCloudStorage)
  private cloudStorage: GcpCloudStorage;

  @Inject(IOTSensorDAO)
  protected iotSensorDAO: IOTSensorDAO;

  @Inject(CoopDAO)
  protected coopDAO: CoopDAO;

  @Inject(SensorESDAO)
  protected sensorESDAO: SensorESDAO;

  async getDayRecords(opts: {
    coopId: string;
    user: RequestUser;
  }): Promise<[SmartCameraDayRecordsItem[], number]> {
    const coop = await this.coopDAO.getOneStrict({
      where: { id: opts.coopId },
      relations: {
        activeFarmingCycle: true,
      },
    });

    if (!coop.activeFarmingCycle || !coop.activeFarmingCycle.farmingCycleStartDate) {
      return [[], 0];
    }

    const { farmingCycleStartDate } = coop.activeFarmingCycle;

    const [sensors] = await this.iotSensorDAO.getMany({
      where: {
        deletedDate: IsNull(),
        sensorType: IotSensorTypeEnum.CAMERA,
        room: {
          coop: {
            id: opts.coopId,
          },
        },
      },
    });

    const sensorIds = sensors.map((sensor) => sensor.id);
    const isInternal =
      opts.user.roleRank && opts.user.roleRank.internal && opts.user.roleRank.internal !== 99;
    const [jobs] = await this.smartCameraJobDAO.getMany({
      where: {
        sensorId: In(sensorIds),
        createdAt: MoreThanOrEqual(farmingCycleStartDate),
        requestedBy: (!isInternal && Not(IsNull())) || undefined,
        crowdResults:
          (isInternal && {
            crowdProbability: MoreThanOrEqual(env.SMART_CAMERA_CROWD_PROBABILITY_THRESHOLD),
          }) ||
          undefined,
      },
      relations: {
        crowdResults: true,
      },
    });

    const dateIntervals = eachDayOfInterval({
      start: new Date(farmingCycleStartDate),
      end: utcToZonedTime(new Date(), DEFAULT_TIME_ZONE),
    });

    return [
      dateIntervals.reduce<SmartCameraDayRecordsItem[]>((prev, date) => {
        const records = jobs.filter(
          (record) =>
            format(utcToZonedTime(record.createdAt, DEFAULT_TIME_ZONE), DATE_SQL_FORMAT).indexOf(
              format(date, DATE_SQL_FORMAT),
            ) !== -1,
        );
        prev.push({
          date: format(date, DATE_SQL_FORMAT),
          day: differenceInDays(date, farmingCycleStartDate),
          recordCount: records.length,
        });
        return prev;
      }, []),
      dateIntervals.length,
    ];
  }

  async getRecordImages(opts: {
    coopId: string;
    day: number;
    endDate?: string;
    limit?: number;
    page?: number;
    sensorId?: string;
    startDate?: string;
    user: RequestUser;
  }): Promise<[RecordImagesItem | null, number]> {
    const coop = await this.coopDAO.getOneStrict({
      where: { id: opts.coopId },
      relations: {
        activeFarmingCycle: true,
      },
    });

    if (!coop.activeFarmingCycle || !coop.activeFarmingCycle.farmingCycleStartDate) {
      throw new Error('invalid farming cycle');
    }

    const { farmingCycleStartDate } = coop.activeFarmingCycle;

    // NOTE: looking at the current data, it was saved in UTC+7 format
    const currentFarmingCycleDate = add(farmingCycleStartDate, { days: opts.day });

    if (isFuture(currentFarmingCycleDate)) {
      return [null, 0];
    }

    const [sensors] = await this.iotSensorDAO.getMany({
      where: {
        id: opts.sensorId,
        deletedDate: IsNull(),
        sensorType: IotSensorTypeEnum.CAMERA,
        room: {
          coop: {
            id: opts.coopId,
          },
        },
      },
    });

    const sensorIds = sensors.map((sensor) => sensor.id);
    const isInternal =
      opts.user.roleRank && opts.user.roleRank.internal && opts.user.roleRank.internal !== 99;
    const dateFilter = {
      min: currentFarmingCycleDate,
      max: add(currentFarmingCycleDate, { days: 1 }),
    };

    if (opts.startDate) {
      dateFilter.min = new Date(opts.startDate);
    }

    if (opts.endDate) {
      dateFilter.max = new Date(opts.endDate);
    }

    const [records, count] = await this.smartCameraJobDAO.getMany({
      where: {
        sensorId: In(sensorIds),
        createdAt: Between(dateFilter.min, dateFilter.max),
        requestedBy: (!isInternal && Not(IsNull())) || undefined,
        crowdResults:
          (isInternal && {
            crowdProbability: MoreThanOrEqual(env.SMART_CAMERA_CROWD_PROBABILITY_THRESHOLD),
          }) ||
          undefined,
      },
      relations: {
        sensor: {
          room: {
            roomType: true,
            building: true,
          },
        },
        crowdResults: true,
        manualChecking: true,
      },
      take: opts.limit,
      skip: opts.limit && opts.page ? opts.limit * (opts.page - 1) : undefined,
      order: {
        createdAt: 'DESC',
      },
    });

    const result: ImageDataItem[] = [];

    await Promise.all(
      records.map(async (record) => {
        const resultData = {
          sensor: record.sensor,
          temperature: null,
          humidity: null,
          link: `${env.AI_URL}${record.bucket}/${env.SMART_CAMERA_FOLDER}/chicken-behavior/coop_${record.coopId}/room_${record.floorId}/cam_${record.sensorId}/${record.imagePath}`,
          createdAt: record.createdAt.toISOString(),
        };

        const { temperature, humidity } =
          await this.sensorESDAO.getRelativeTemperatureHumidityByCoopCode({
            coopCode: coop.coopCode,
            timestamp: zonedTimeToUtc(record.createdAt, DEFAULT_TIME_ZONE),
          });

        const { pplActualProbability } = record.manualChecking || {};
        result.push({
          ...resultData,
          createdAt: zonedTimeToUtc(record.createdAt, DEFAULT_TIME_ZONE).toISOString(),
          temperature,
          humidity,
          jobId: record.id,
          isCrowded:
            pplActualProbability !== undefined && pplActualProbability !== null
              ? pplActualProbability === 100
              : null,
          remarks: record.manualChecking?.pplRemarks || '',
        });
      }),
    );

    return [
      {
        date: format(utcToZonedTime(currentFarmingCycleDate, DEFAULT_TIME_ZONE), DATE_SQL_FORMAT),
        records: result
          .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
          .map((record, index) => ({
            ...record,
            seqNo: count - index - (opts.limit || 0) * (opts.page ? opts.page - 1 : 0),
          })),
      },
      count,
    ];
  }

  async getRecordingImagesBySensorId(opts: {
    coopId: string;
    day: number;
    endDate?: string;
    limit?: number;
    page?: number;
    sensorId: string;
    startDate?: string;
    user: RequestUser;
  }): Promise<GetRecordImagesBySensorIdResponse> {
    const sensor = await this.iotSensorDAO.getOneStrict({
      where: {
        id: opts.sensorId,
      },
      relations: {
        room: {
          roomType: true,
          building: true,
        },
      },
    });

    const [result, count] = await this.getRecordImages(opts);

    return {
      code: 200,
      count,
      data: {
        buildingName: sensor.room.building.name,
        roomTypeName: sensor.room.roomType.name,
        date: result?.date || null,
        records: result?.records || null,
      },
    };
  }

  async createJob(opts: {
    createdAt?: Date;
    jobId?: string;
    sensorCode: string;
    user?: RequestUser;
    capturedAt?: string;
  }): Promise<CreateJob> {
    const now = opts.capturedAt
      ? format(new Date(opts.capturedAt), SMART_CAMERA_DATE_TIME_FORMAT)
      : format(new Date(), SMART_CAMERA_DATE_TIME_FORMAT);
    const jobId = opts.jobId || randomUUID();
    const imagePath = `${now}_job_${jobId}.jpg`;
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
      throw ERR_SMART_CAMERA_COOP_NOT_AVAILABLE();
    }

    let job: SmartCameraJob;
    const qr = await this.smartCameraJobDAO.startTransaction();
    try {
      job = await this.smartCameraJobDAO.upsertOne({
        user: opts.user,
        item: {
          id: jobId,
          bucket: opts.user ? env.AI_PUBLIC_BUCKET : env.AI_BUCKET,
          sensorId: sensor.id,
          coopId,
          floorId: roomId || undefined,
          imagePath,
          createdAt: opts.createdAt,
          uploadState: opts.user?.id
            ? SMART_CAMERA_UPLOAD_IMAGE_STATE.COMMAND_RECEIVED_IN_SERVER
            : SMART_CAMERA_UPLOAD_IMAGE_STATE.PRESIGN_REQUESTED,
        },
        qr,
      });
    } catch (error) {
      await this.smartCameraJobDAO.rollbackTransaction(qr);
      this.logger.logError(error);
      throw error;
    }

    // generating presign url for request coming from device
    const pathFile = `${env.SMART_CAMERA_FOLDER}/chicken-behavior/coop_${coopId}/room_${roomId}/cam_${job.sensorId}/${job.imagePath}`;
    let presignedUrl = '';
    if (!opts.user) {
      try {
        presignedUrl = await this.cloudStorage.generateV4UploadSignedUrl({
          bucket: job.bucket,
          fileName: pathFile,
          acl: job.bucket === env.AI_PUBLIC_BUCKET ? 'public-read' : undefined,
        });
        job = await this.smartCameraJobDAO.upsertOne({
          qr,
          item: {
            id: job.id,
            uploadState: SMART_CAMERA_UPLOAD_IMAGE_STATE.UPLOADING_PROCESS_IN_DEVICE,
          },
        });
      } catch (error) {
        job = await this.smartCameraJobDAO.upsertOne({
          qr,
          item: {
            id: job.id,
            uploadState: SMART_CAMERA_UPLOAD_IMAGE_STATE.ERROR_CREATE_PRESIGN_URL,
          },
        });
        await this.smartCameraJobDAO.commitTransaction(qr);
        throw new Error(SMART_CAMERA_UPLOAD_IMAGE_STATE.ERROR_CREATE_PRESIGN_URL);
      }
    }

    await this.smartCameraJobDAO.commitTransaction(qr);
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

  async createJobByCoop(opts: {
    coopId: string;
    user?: RequestUser;
  }): Promise<[RecordImagesItem, number]> {
    const redisKey = 'manual-capture-image-by-coop-:id'.replace(':id', opts.coopId);
    const attempt = await this.redis.connection.incr(redisKey);
    await this.redis.connection.setex(
      redisKey,
      differenceInSeconds(
        set(add(new Date(), { hours: 1 }), { minutes: 0, seconds: 0 }),
        new Date(),
      ),
      attempt,
    );

    // FIXME: set limit to 5 before deploy to prod
    if (attempt > 500) throw ERR_IMAGE_REQUEST_QUOTA_EXCEEDED();

    const [sensors] = await this.iotSensorDAO.getMany({
      where: {
        sensorType: IotSensorTypeEnum.CAMERA,
        deletedDate: IsNull(),
        room: {
          coopId: opts.coopId,
        },
        iotDevice: {
          deviceType: 'SMART_CAMERA',
        },
      },
    });

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const promises = sensors.map((sensor) =>
      this.createJob({
        createdAt: now,
        sensorCode: sensor.sensorCode,
        user: opts.user,
      }),
    );

    const results = await Promise.all(promises);

    for (let index = 0; index < results.length; index += 1) {
      this.smartCameraPublisher.sendCaptureImageCommand({
        deviceId: results[index].deviceId,
        jobId: results[index].job.id,
        sensorCode: results[index].sensor.sensorCode,
        delayInSeconds: index * 5,
      });
    }

    const records: ImageDataItem[] = [];

    await Promise.all(
      results.map(async (result, idx, arr) => {
        const resultData = {
          sensor: result.sensor,
          temperature: null,
          humidity: null,
          link: `${env.AI_URL}${result.job.bucket}/${result.createJobItem.pathFile}`,
          createdAt: result.job.createdAt.toISOString(),
        };

        const { temperature, humidity } =
          await this.sensorESDAO.getRelativeTemperatureHumidityByCoopCode({
            coopCode: result.sensor.room.coop?.coopCode,
            timestamp: new Date(),
          });

        records.push({
          ...resultData,
          createdAt: zonedTimeToUtc(resultData.createdAt, DEFAULT_TIME_ZONE).toISOString(),
          temperature,
          humidity,
          jobId: result.job.id,
          isCrowded: null,
          seqNo: arr.length - idx,
        });
      }),
    );

    return [
      {
        date: format(utcToZonedTime(new Date(), DEFAULT_TIME_ZONE), DATE_SQL_FORMAT),
        records: records.sort((a, b) => b.seqNo! - a.seqNo!),
      },
      records.length,
    ];
  }

  async evaluateImage(opts: {
    user: RequestUser;
    body: EvaluateImageBody;
    jobId: string;
  }): Promise<EvaluateImageBody> {
    const manualChecking =
      (await this.crowdManualCheckingDAO.getOne({
        where: {
          jobId: opts.jobId,
        },
      })) || new AiCrowdManualChecking();

    if (!manualChecking.id) {
      manualChecking.jobId = opts.jobId;
      manualChecking.createdAt = new Date();
      manualChecking.updatedAt = new Date();
    }

    manualChecking.pplCheckedBy = opts.user.id;
    manualChecking.pplActualProbability = opts.body.isCrowded ? 100 : 0;
    manualChecking.pplRemarks = opts.body.remarks || undefined;

    await this.crowdManualCheckingDAO.upsertOne({
      item: manualChecking,
    });

    return {
      isCrowded: manualChecking.pplActualProbability === 100,
      remarks: manualChecking.pplRemarks,
    };
  }

  async getCameras(opts: {
    coopId: string;
    day: number;
    user: RequestUser;
  }): Promise<GetCameraResponse> {
    const coop = await this.coopDAO.getOneStrict({
      where: { id: opts.coopId },
      relations: {
        activeFarmingCycle: true,
      },
    });

    const { farmingCycleStartDate } = coop.activeFarmingCycle;

    const currentFarmingCycleDate = zonedTimeToUtc(
      add(farmingCycleStartDate, { days: opts.day }),
      DEFAULT_TIME_ZONE,
    );

    const [sensors, count] = await this.iotSensorDAO.getMany({
      where: {
        deletedDate: IsNull(),
        sensorType: IotSensorTypeEnum.CAMERA,
        room: {
          coop: {
            id: opts.coopId,
          },
        },
      },
      relations: {
        room: {
          roomType: true,
          building: true,
          coop: true,
        },
      },
      order: {
        createdDate: 'DESC',
      },
    });

    const isInternal =
      opts.user.roleRank && opts.user.roleRank.internal && opts.user.roleRank.internal !== 99;

    const [jobs] = await this.smartCameraJobDAO.getMany({
      where: {
        sensorId: In(sensors.map((sensor) => sensor.id)),
        createdAt: Between(currentFarmingCycleDate, add(currentFarmingCycleDate, { days: 1 })),
        requestedBy: (!isInternal && Not(IsNull())) || undefined,
        crowdResults:
          (isInternal && {
            crowdProbability: MoreThanOrEqual(env.SMART_CAMERA_CROWD_PROBABILITY_THRESHOLD),
          }) ||
          undefined,
      },
    });

    const counter = jobs.reduce((prev, item) => {
      const val = prev.get(item.sensorId) || 0;

      prev.set(item.sensorId, val + 1);
      return prev;
    }, new Map<string, number>());

    return {
      code: 200,
      count,
      data: sensors.map((sensor) => ({
        ...sensor,
        recordCount: counter.get(sensor.id) || 0,
      })),
    };
  }
}
