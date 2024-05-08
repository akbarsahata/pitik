import { randomUUID } from 'crypto';
import { addDays, differenceInDays, isAfter } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { DeepPartial, ILike, In, IsNull, Not, QueryRunner, Raw } from 'typeorm';
import env from '../config/env';
import { DailyMonitoringDAO } from '../dao/dailyMonitoring.dao';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { FarmingCycleChickStockDDAO } from '../dao/farmingCycleChickStockD.dao';
import { HarvestDealDAO } from '../dao/harvestDeal.dao';
import { HarvestRealizationDAO } from '../dao/harvestRealization.dao';
import { HarvestRealizationRecordDAO } from '../dao/harvestRealizationRecord.dao';
import { HarvestRecordPhotoDAO } from '../dao/harvestRecordPhoto.dao';
import { HarvestRequestDAO } from '../dao/harvestRequest.dao';
import { SmartScaleWeighingDAO } from '../dao/smartScaleWeighing.dao';
import { SmartScaleWeighingDDAO } from '../dao/smartScaleWeighingD.dao';
import { Document } from '../datasources/entity/pgsql/Document.entity';
import { FarmingCycleChickStockD } from '../datasources/entity/pgsql/FarmingCycleChickStockD.entity';
import { HarvestDeal, HarvestDealStatusEnum } from '../datasources/entity/pgsql/HarvestDeal.entity';
import {
  HarvestRealization,
  RealizationStatusEnum,
} from '../datasources/entity/pgsql/HarvestRealization.entity';
import { HarvestRealizationRecord } from '../datasources/entity/pgsql/HarvestRealizationRecord.entity';
import { HarvestRecordPhoto } from '../datasources/entity/pgsql/HarvestRecordPhoto.entity';
import { HarvestRequest } from '../datasources/entity/pgsql/HarvestRequest.entity';
import { SmartScaleWeighing } from '../datasources/entity/pgsql/SmartScaleWeighing.entity';
import { SmartScaleWeighingD } from '../datasources/entity/pgsql/SmartScaleWeighingD.entity';
import {
  CreateRealizationBody,
  HarvestRealizationDetailItem,
  UpdateRealizationBody,
} from '../dto/harvest.dto';
import {
  AdditionalRequestInput,
  HarvestRealizationDealInput,
  HarvestRealizationDealUpdate,
  HarvestRealizationDetail,
  HarvestRealizationDetailParams,
  HarvestRealizationInput,
  HarvestRealizationItem,
  HarvestRealizationList,
  HarvestRealizationListParams,
  HarvestRealizationUpdate,
  HarvestRealizationUpdateParams,
  HarvestRecordInput,
  HarvestRecordItem,
} from '../dto/harvestRealization.dto';
import { CalculateDailyMonitoringQueue } from '../jobs/queues/calculate-daily-monitoring.queue';
import { GenerateDocumentQueue } from '../jobs/queues/generate-document.queue';
import { HarvestRealizationCreateOdooQueue } from '../jobs/queues/harvest-realization-create-odoo.queue';
import { HarvestRealizationSubmittedQueue } from '../jobs/queues/harvest-realization-submitted.queue';
import { HarvestRequestSubmittedQueue } from '../jobs/queues/harvest-request-submitted.queue';
import { GENERATED_DOCUMENT_MODULE, USER_SYSTEM_CRON } from '../libs/constants';
import {
  ERR_HARVEST_DEAL_FOR_REALIZATION_NOT_AVAILABLE,
  ERR_HARVEST_DEAL_UPON_REALIZATION_NOT_FOUND,
  ERR_HARVEST_REALIZATION_CHICKIN_STOCK_NOT_FOUND,
  ERR_HARVEST_REALIZATION_DEAL_REJECTED,
  ERR_HARVEST_REALIZATION_DO_EXIST,
  ERR_HARVEST_REALIZATION_INVALID_STATUS,
  ERR_HARVEST_REALIZATION_IS_NOT_EDITABLE,
  ERR_HARVEST_REALIZATION_QUANTITY,
  ERR_HARVEST_REALIZATION_WEIGHING_EXIST,
  ERR_HARVEST_REALIZATION_WEIGHING_REQUIRED,
} from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';

interface HarvestRealizationStatus {
  number: 0 | 1;
  text: 'Terealisasi' | 'Selesai';
}

interface HarvestRealizationWeighingRecordData {
  section: number;
  totalCount: number;
  totalWeight: number;
}

interface HarvestRealizationWeighingRecord {
  tonnage: number;
  quantity: number;
  averageWeight: number;
  weighingNumber?: string;
  details?: HarvestRealizationWeighingRecordData[] | null;
}

@Service()
export class HarvestRealizationService {
  @Inject(DailyMonitoringDAO)
  private dailyMonitoringDAO: DailyMonitoringDAO;

  @Inject(HarvestRealizationDAO)
  private dao: HarvestRealizationDAO;

  @Inject(HarvestDealDAO)
  private harvestDealDAO: HarvestDealDAO;

  @Inject(HarvestRequestDAO)
  private harvestRequestDAO: HarvestRequestDAO;

  @Inject(HarvestRealizationRecordDAO)
  private harvestRecordDAO: HarvestRealizationRecordDAO;

  @Inject(HarvestRecordPhotoDAO)
  private harvestRecordPhotoDAO: HarvestRecordPhotoDAO;

  @Inject(FarmingCycleChickStockDDAO)
  private farmingCycleChickStockDDAO: FarmingCycleChickStockDDAO;

  @Inject(FarmingCycleDAO)
  private farmingCycleDAO: FarmingCycleDAO;

  @Inject(SmartScaleWeighingDAO)
  private smartScaleWeighingDAO: SmartScaleWeighingDAO;

  @Inject(SmartScaleWeighingDDAO)
  private smartScaleWeighingDDAO: SmartScaleWeighingDDAO;

  @Inject(CalculateDailyMonitoringQueue)
  private calculateDailyMonitoringQueue: CalculateDailyMonitoringQueue;

  @Inject(HarvestRequestSubmittedQueue)
  private harvestRequestSubmittedQueue: HarvestRequestSubmittedQueue;

  @Inject(HarvestRealizationSubmittedQueue)
  private harvestRealizationSubmittedQueue: HarvestRealizationSubmittedQueue;

  @Inject(GenerateDocumentQueue)
  private documentGeneratedQueue: GenerateDocumentQueue;

  @Inject(HarvestRealizationCreateOdooQueue)
  private harvestRealizationCreateOdooQueue: HarvestRealizationCreateOdooQueue;

  async getHarvestRealizationList(
    params: HarvestRealizationListParams,
  ): Promise<HarvestRealizationList> {
    const [harvestRealizations] = await this.dao.getMany({
      where: {
        farmingCycleId: params.farmingCycleId,
        smartScaleWeighingId: params.isUseSmartScale ? Not(IsNull()) : undefined,
        status: Raw((alias) => `(${alias} is null OR ${alias} != :deleted)`, {
          deleted: RealizationStatusEnum.DELETED,
        }),
      },
      relations: {
        harvestDeal: {
          harvestRequest: true,
        },
        additionalRequests: {
          farmingCycle: {
            coop: true,
          },
        },
        harvestRealizationRecords: {
          harvestRecordPhoto: true,
        },
        smartScaleWeighing: true,
      },
      order: {
        createdDate: 'DESC',
      },
    });

    return harvestRealizations.map((hr) => {
      const status = this.harvestRealizationStatus(hr);

      const record = hr.harvestRealizationRecords.reduce<HarvestRealizationRecord>(
        (prev, item) =>
          ({
            ...item,
            tonnage: (prev.tonnage || 0) + item.tonnage,
            quantity: (prev.quantity || 0) + item.quantity,
            image: item.harvestRecordPhoto?.imageUrl,
          } as HarvestRealizationRecord),
        {} as HarvestRealizationRecord,
      );

      record.averageWeight = Number((record.tonnage / record.quantity).toFixed(2));

      return {
        ...hr,
        tonnage: Number(hr.tonnage.toFixed(2)),
        harvestRequestId: hr.harvestDeal.harvestRequestId,
        bakulName: hr.harvestDeal.bakulName,
        deliveryOrder: hr.harvestDeal.erpCode,
        minWeight: hr.harvestDeal.minWeight,
        maxWeight: hr.harvestDeal.maxWeight,
        averageChickenWeighed: record.averageWeight,
        status: status.number,
        statusText: status.text,
        harvestRequestDate: hr.harvestDeal.harvestRequest.datePlanned,
        weighingTime: hr.weighingTime ? hr.weighingTime.slice(0, -3) : '00:00',
        truckDepartingTime: hr.truckDepartingTime ? hr.truckDepartingTime.slice(0, -3) : '00:00',
        records: [record],
        additionalRequests: hr.additionalRequests.map((hreq) => ({
          coopId: hreq.farmingCycle.coopId,
          farmingCycleId: hreq.farmingCycle.id,
          coopName: hreq.farmingCycle.coop.coopName,
          quantity: hreq.quantity,
        })),
        smartScaleWeighingId: hr.smartScaleWeighingId,
        weighingNumber: hr.smartScaleWeighing?.weighingNumber || '',
      };
    });
  }

  async getHarvestRealizationDetail(
    params: HarvestRealizationDetailParams,
  ): Promise<HarvestRealizationDetail> {
    let harvestRealization = await this.dao.getOneStrict({
      where: {
        id: params.harvestRealizationId,
      },
      relations: {
        farmingCycle: {
          farm: true,
          coop: true,
        },
        harvestRealizationRecords: true,
        harvestDeal: {
          harvestRequest: true,
        },
        additionalRequests: {
          farmingCycle: {
            coop: true,
          },
        },
      },
    });

    let [harvestRecords] = await this.harvestRecordDAO.getMany({
      where: {
        harvestRealizationId: harvestRealization.id,
      },
      relations: {
        harvestRecordPhoto: true,
      },
      order: {
        createdDate: 'DESC',
      },
    });

    const status = this.harvestRealizationStatus(harvestRealization);

    const ssWeighingId = harvestRealization.smartScaleWeighingId;
    if (ssWeighingId) {
      harvestRecords = await this.getHarvestWithSmartScaleWeighingData(
        harvestRecords,
        ssWeighingId,
      );

      const totalWeighedChicken = harvestRecords.reduce(
        (accumulator, current) => Number(accumulator) + Number(current.quantity),
        0,
      );
      const totalWeighedTonnage = harvestRecords.reduce(
        (accumulator, current) => Number(accumulator) + Number(current.tonnage),
        0,
      );
      const averageChickenWeighed = Number(totalWeighedTonnage / totalWeighedChicken).toFixed(2);

      const { weighingNumber } = harvestRecords[0];

      const additionalInfo = {
        totalWeighedChicken,
        totalWeighedTonnage: totalWeighedTonnage.toFixed(2),
        averageChickenWeighed,
        weighingNumber,
        harvestRequestDate: harvestRealization.harvestDeal?.harvestRequest.datePlanned || '',
        harvestRequestQuantity: harvestRealization.harvestDeal?.harvestRequest.quantity,
        reason: harvestRealization.harvestDeal?.harvestRequest.reason || '',
      };
      harvestRealization = { ...harvestRealization, ...additionalInfo };
    }

    const record = harvestRecords.reduce<HarvestRealizationRecord>(
      (prev, item) =>
        ({
          id: item.id,
          weighingNumber: item.weighingNumber,
          tonnage: (prev.tonnage || 0) + item.tonnage,
          quantity: (prev.quantity || 0) + item.quantity,
        } as HarvestRealizationRecord),
      {} as HarvestRealizationRecord,
    );

    record.averageWeight = Number((record.tonnage / record.quantity).toFixed(2));

    return {
      ...harvestRealization,
      tonnage: Number(harvestRealization.tonnage.toFixed(2)),
      harvestRequestId: harvestRealization.harvestDeal.harvestRequestId,
      bakulName: harvestRealization.harvestDeal.bakulName,
      deliveryOrder: harvestRealization.harvestDeal.erpCode,
      minWeight: harvestRealization.harvestDeal.minWeight,
      maxWeight: harvestRealization.harvestDeal.maxWeight,
      harvestRequestDate: harvestRealization.harvestDeal.harvestRequest.datePlanned,
      weighingTime: harvestRealization.weighingTime
        ? harvestRealization.weighingTime.slice(0, -3)
        : '00:00',
      truckDepartingTime: harvestRealization.truckDepartingTime
        ? harvestRealization.truckDepartingTime.slice(0, -3)
        : '00:00',
      status: status.number,
      statusText: status.text,
      records: harvestRecords.map((hrec) => ({
        ...hrec,
        image: hrec.harvestRecordPhoto?.imageUrl || '',
      })),
      additionalRequests: harvestRealization.additionalRequests.map((hreq) => ({
        coopId: hreq.farmingCycle.coopId,
        farmingCycleId: hreq.farmingCycle.id,
        coopName: hreq.farmingCycle.coop.coopName,
        quantity: hreq.quantity,
      })),
      addressName: harvestRealization.farmingCycle.farm.addressName,
      coopName: harvestRealization.farmingCycle.coop.coopName,
      createdDate: harvestRealization.createdDate.toISOString(),
    };
  }

  async create(
    input: HarvestRealizationInput,
    user: RequestUser,
    refQueryRunner?: QueryRunner,
    refHarvestDeal?: HarvestDeal,
  ): Promise<HarvestRealizationItem> {
    const sumInput = input.records.reduce(
      (sum, cur) => ({
        tonnage: sum.tonnage + cur.tonnage,
        quantity: sum.quantity + cur.quantity,
      }),
      {
        tonnage: 0,
        quantity: 0,
      },
    );

    const queryRunner = refQueryRunner || (await this.dao.startTransaction());

    try {
      // validate weighing number uniqueness & chickstock
      const weighingNumber =
        input.weighingNumber || (input.records.length ? input.records[0].weighingNumber : '');

      if (!weighingNumber) throw ERR_HARVEST_REALIZATION_WEIGHING_REQUIRED();

      const [farmingCycle, existingRealization] = await Promise.all([
        this.farmingCycleDAO.getOneStrict({
          where: {
            id: input.farmingCycleId,
          },
        }),
        this.dao.getOne({
          where: [
            {
              weighingNumber: weighingNumber && ILike(weighingNumber),
              status: Not(RealizationStatusEnum.DELETED),
            },
            {
              harvestDealId: input.harvestDealId,
              status: Not(RealizationStatusEnum.DELETED),
            },
          ],
        }),
        this.validateHarvestQuantityFromDeal({
          farmingCycleId: input.farmingCycleId,
          quantity: sumInput.quantity,
          harvestDealId: input.harvestDealId,
          isCreate: true,
        }),
      ]);

      if (existingRealization) throw ERR_HARVEST_REALIZATION_WEIGHING_EXIST();

      const harvestDeal =
        refHarvestDeal ||
        (await this.harvestDealDAO.getOne({
          where: {
            id: input.harvestDealId,
            status: HarvestDealStatusEnum.AVAILABLE,
          },
        }));
      if (!harvestDeal) {
        throw ERR_HARVEST_DEAL_UPON_REALIZATION_NOT_FOUND();
      }

      const harvestRequest = await this.harvestRequestDAO.getOneStrict(
        {
          where: {
            id: harvestDeal.harvestRequestId,
          },
        },
        queryRunner,
      );

      let smartScaleHarvestId: string | undefined;
      if (this.isCreateHarvestRealizationWithSmartScale(input.records)) {
        const ssRecord = await this.createWeighingRecord(input, input.records, user, queryRunner);

        if (ssRecord) {
          smartScaleHarvestId = ssRecord.id;
          input.records.forEach((record) => {
            // eslint-disable-next-line no-param-reassign
            record.weighingNumber = input.weighingNumber;
          });
        }
      }

      let realizationStatus: string = input.status || RealizationStatusEnum.DRAFT;
      if (isAfter(new Date(), addDays(new Date(input.harvestDate), 2))) {
        realizationStatus = HarvestDealStatusEnum.FINAL;
      }

      const harvestRealization = await this.dao.createOneWithTx(
        {
          farmingCycleId: input.farmingCycleId,
          harvestDealId: input.harvestDealId,
          harvestDate: input.harvestDate,
          tonnage: sumInput.tonnage,
          quantity: sumInput.quantity,
          weighingTime: input.weighingTime as string,
          truckDepartingTime: input.truckDepartingTime,
          driver: input.driver,
          truckLicensePlate: input.truckLicensePlate,
          smartScaleWeighingId: smartScaleHarvestId,
          witnessName: input.witnessName || undefined,
          receiverName: input.receiverName || undefined,
          weigherName: input.weigherName || undefined,
          weighingNumber:
            input.weighingNumber || (input.records.length ? input.records[0].weighingNumber : ''),
          status: realizationStatus as RealizationStatusEnum,
        },
        user,
        queryRunner,
      );

      await this.updateHarvestDealStatusUponRealization(
        harvestRealization,
        user,
        queryRunner,
        realizationStatus,
      );

      const harvestRecords = await this.createRecords(
        input.records,
        harvestRealization,
        user,
        queryRunner,
      );

      const additionalRequests = await this.createAdditionalRequests(
        input.additionalRequests,
        harvestRealization,
        harvestRequest,
        user,
        queryRunner,
      );

      additionalRequests.forEach((ar) => {
        this.harvestRequestSubmittedQueue.addJob(ar);
      });

      await this.updateChickStock(harvestRealization, user, queryRunner);

      if (!refQueryRunner) {
        await this.dao.commitTransaction(queryRunner);
      }

      const status = this.harvestRealizationStatus(harvestRealization);

      await this.harvestRealizationSubmittedQueue.addJob(harvestRealization);

      await this.calculateDailyMonitoringQueue.addJob({
        farmingCycleId: input.farmingCycleId,
        farmingCycleCode: farmingCycle.farmingCycleCode,
        date: input.harvestDate,
      });

      if (smartScaleHarvestId) {
        const generatedDocumentPayload: DeepPartial<Document> = {
          identifierKey: GENERATED_DOCUMENT_MODULE.HARVEST_REALIZATION,
          identifierValue: harvestRealization.id,
          createdBy: harvestRealization.createdBy,
        };
        await this.documentGeneratedQueue.addJob(generatedDocumentPayload);
      }

      return {
        ...harvestRealization,
        harvestRequestId: harvestDeal.harvestRequestId,
        bakulName: harvestDeal.bakulName,
        deliveryOrder: harvestDeal.erpCode,
        minWeight: harvestDeal.minWeight,
        maxWeight: harvestDeal.maxWeight,
        status: status.number,
        statusText: status.text,
        records: harvestRecords,
        additionalRequests: input.additionalRequests,
      };
    } catch (error) {
      if (!refQueryRunner) {
        await this.dao.rollbackTransaction(queryRunner);
      }

      throw error;
    }
  }

  async update(
    params: HarvestRealizationUpdateParams,
    input: HarvestRealizationUpdate,
    user: RequestUser,
    refQueryRunner?: QueryRunner,
  ): Promise<HarvestRealizationItem> {
    const realization = await this.dao.getOneStrict({
      where: {
        id: params.harvestRealizationId,
      },
    });

    if (
      realization.status === RealizationStatusEnum.FINAL ||
      realization.status === RealizationStatusEnum.DELETED
    ) {
      throw ERR_HARVEST_REALIZATION_IS_NOT_EDITABLE();
    }

    const queryRunner = refQueryRunner || (await this.dao.startTransaction());
    const sumInput = input.records.reduce(
      (sum, cur) => ({
        tonnage: sum.tonnage + cur.tonnage,
        quantity: sum.quantity + cur.quantity,
      }),
      {
        tonnage: 0,
        quantity: 0,
      },
    );

    try {
      // validate weighing number uniqueness & chickstock
      const weighingNumber =
        input.weighingNumber ||
        input.records.find((record) => record.weighingNumber)!.weighingNumber;
      const [farmingCycle, existingRealization] = await Promise.all([
        this.farmingCycleDAO.getOneStrict({
          where: {
            id: input.farmingCycleId,
          },
        }),
        this.dao.getOne({
          where: {
            id: Not(realization.id),
            weighingNumber,
            status: Not(RealizationStatusEnum.DELETED),
          },
        }),
        this.validateHarvestQuantityFromDeal({
          farmingCycleId: input.farmingCycleId,
          quantity: sumInput.quantity,
          harvestDealId: input.harvestDealId,
          isCreate: false,
        }),
      ]);

      if (existingRealization) throw ERR_HARVEST_REALIZATION_WEIGHING_EXIST();

      let smartScaleHarvestId: string | undefined;
      if (this.isCreateHarvestRealizationWithSmartScale(input.records) && input.isReweighing) {
        const ssRecord = await this.createWeighingRecord(input, input.records, user, queryRunner);
        if (ssRecord) {
          smartScaleHarvestId = ssRecord.id;
          input.records.forEach((record) => {
            // eslint-disable-next-line no-param-reassign
            record.weighingNumber = input.weighingNumber;
          });
        }
      }

      const [harvestDeal, harvestRealization] = await Promise.all([
        this.harvestDealDAO.getOneStrict({
          where: {
            id: input.harvestDealId,
          },
          relations: {
            harvestRequest: true,
          },
        }),
        this.dao.getOneStrict({
          where: {
            id: params.harvestRealizationId,
          },
        }),
      ]);

      const updatedHarvestRealization = await this.dao.updateOneWithTx(
        {
          id: harvestRealization.id,
        },
        {
          harvestDate: input.harvestDate,
          tonnage: sumInput.tonnage,
          quantity: sumInput.quantity,
          weighingTime: input.weighingTime,
          truckDepartingTime: input.truckDepartingTime,
          driver: input.driver,
          truckLicensePlate: input.truckLicensePlate,
          smartScaleWeighingId: smartScaleHarvestId,
          witnessName: input.witnessName || undefined,
          receiverName: input.receiverName || undefined,
          weigherName: input.weigherName || undefined,
          weighingNumber: input.weighingNumber,
          status: input.status || harvestRealization.status,
        },
        user,
        queryRunner,
      );

      await this.updateHarvestDealStatusUponRealization(
        updatedHarvestRealization,
        user,
        queryRunner,
        input.status as string,
      );

      await this.harvestRecordDAO.deleteMany({
        harvestRealizationId: updatedHarvestRealization.id,
      });

      await this.harvestRequestDAO.deleteMany({
        requestReferral: harvestDeal.harvestRequest.id,
      });

      const harvestRecords = await this.createRecords(
        input.records,
        harvestRealization,
        user,
        queryRunner,
      );

      await this.createAdditionalRequests(
        input.additionalRequests,
        harvestRealization,
        harvestDeal.harvestRequest,
        user,
        queryRunner,
      );

      await this.updateChickStock(harvestRealization, user, queryRunner);

      if (!refQueryRunner) {
        await this.dao.commitTransaction(queryRunner);
      }

      const status = this.harvestRealizationStatus(harvestRealization);

      await this.calculateDailyMonitoringQueue.addJob({
        farmingCycleId: input.farmingCycleId,
        farmingCycleCode: farmingCycle.farmingCycleCode,
        date: input.harvestDate,
      });

      if (input.isReweighing || input.isRegenerateDoc) {
        const generatedDocumentPayload: DeepPartial<Document> = {
          identifierKey: GENERATED_DOCUMENT_MODULE.HARVEST_REALIZATION,
          identifierValue: harvestRealization.id,
          createdBy: harvestRealization.createdBy,
        };
        await this.documentGeneratedQueue.addJob(generatedDocumentPayload);
      }

      if (updatedHarvestRealization.status === RealizationStatusEnum.FINAL) {
        await this.harvestRealizationCreateOdooQueue.addJob({
          ...updatedHarvestRealization,
          farmingCycleCode: farmingCycle.farmingCycleCode,
        });
      }

      return {
        ...updatedHarvestRealization,
        harvestRequestId: harvestDeal.harvestRequestId,
        bakulName: harvestDeal.bakulName,
        deliveryOrder: harvestDeal.erpCode,
        minWeight: harvestDeal.minWeight,
        maxWeight: harvestDeal.maxWeight,
        status: status.number,
        statusText: status.text,
        records: harvestRecords,
        additionalRequests: input.additionalRequests,
      };
    } catch (error) {
      if (!refQueryRunner) {
        await this.dao.rollbackTransaction(queryRunner);
      }

      throw error;
    }
  }

  async createWithDeal(
    input: HarvestRealizationDealInput,
    user: RequestUser,
    refQueryRunner?: QueryRunner,
  ): Promise<HarvestRealizationItem> {
    const queryRunner = refQueryRunner || (await this.dao.startTransaction());

    try {
      // validate DO number uniqueness
      const existingDeal = await this.harvestDealDAO.getOne({
        where: {
          erpCode: input.deliveryOrder,
        },
      });

      if (existingDeal) throw ERR_HARVEST_REALIZATION_DO_EXIST();

      const [farmingCycle, harvestRequest] = await Promise.all([
        this.farmingCycleDAO.getOneStrict({
          where: {
            id: input.farmingCycleId,
          },
        }),
        this.harvestRequestDAO.getById(input.harvestRequestId, queryRunner),
      ]);

      const quantity = input.records.reduce<number>((sum, cur) => sum + cur.quantity, 0);

      const harvestDeal = await this.harvestDealDAO.createOneWithTx(
        {
          harvestRequestId: harvestRequest.id,
          farmingCycleId: harvestRequest.farmingCycleId,
          erpCode: input.deliveryOrder,
          datePlanned: input.harvestDate,
          bakulName: input.bakulName,
          minWeight: input.minWeight,
          maxWeight: input.maxWeight,
          quantity,
          status: HarvestDealStatusEnum.AVAILABLE,
        },
        user,
        queryRunner,
      );

      const harvestRealization = await this.create(
        {
          ...input,
          harvestDealId: harvestDeal.id,
          status: input.status || undefined,
          weighingNumber:
            input.weighingNumber || (input.records.length ? input.records[0].weighingNumber : ''),
        },
        user,
        queryRunner,
        harvestDeal,
      );

      await this.calculateDailyMonitoringQueue.addJob({
        farmingCycleId: input.farmingCycleId,
        farmingCycleCode: farmingCycle.farmingCycleCode,
        date: input.harvestDate,
      });

      if (!refQueryRunner) {
        await this.dao.commitTransaction(queryRunner);
      }

      return harvestRealization;
    } catch (error) {
      if (!refQueryRunner) {
        await this.dao.rollbackTransaction(queryRunner);
      }

      throw error;
    }
  }

  async updateWithDeal(
    params: HarvestRealizationUpdateParams,
    input: HarvestRealizationDealUpdate,
    user: RequestUser,
    refQueryRunner?: QueryRunner,
  ): Promise<HarvestRealizationItem> {
    const realization = await this.dao.getOneStrict({
      where: {
        id: params.harvestRealizationId,
      },
    });

    if (
      realization.status === RealizationStatusEnum.FINAL ||
      realization.status === RealizationStatusEnum.DELETED
    ) {
      throw ERR_HARVEST_REALIZATION_IS_NOT_EDITABLE();
    }

    // validate DO number uniqueness
    const existingDeal = await this.harvestDealDAO.getOne({
      where: {
        id: Not(realization.harvestDealId),
        erpCode: input.deliveryOrder,
      },
    });

    if (existingDeal) throw ERR_HARVEST_REALIZATION_DO_EXIST();

    const queryRunner = refQueryRunner || (await this.dao.startTransaction());

    try {
      const quantity = input.records.reduce<number>((sum, cur) => sum + cur.quantity, 0);

      const harvestRealization = await this.dao.getOneStrict({
        where: {
          id: params.harvestRealizationId,
        },
        relations: {
          harvestDeal: true,
        },
      });

      const updatedHarvestDeal = await this.harvestDealDAO.updateOneWithTx(
        {
          id: harvestRealization.harvestDealId,
        },
        {
          erpCode: input.deliveryOrder,
          datePlanned: input.harvestDate,
          bakulName: input.bakulName,
          minWeight: input.minWeight,
          maxWeight: input.maxWeight,
          quantity,
          status: HarvestDealStatusEnum.DRAFT,
        },
        user,
        queryRunner,
      );

      const updatedHarvestRealization = await this.update(
        params,
        {
          ...input,
          harvestDealId: updatedHarvestDeal.id,
        },
        user,
        queryRunner,
      );

      if (!refQueryRunner) {
        await this.dao.commitTransaction(queryRunner);
      }

      return updatedHarvestRealization;
    } catch (error) {
      if (!refQueryRunner) {
        await this.dao.rollbackTransaction(queryRunner);
      }

      throw error;
    }
  }

  async createFromFMS(opts: {
    body: CreateRealizationBody;
    farmingCycleId: string;
    user: RequestUser;
  }): Promise<HarvestRealizationDetailItem> {
    const harvestDeal = await this.harvestDealDAO.getOne({
      where: {
        id: opts.body.harvestDealId,
        status: HarvestDealStatusEnum.AVAILABLE,
      },
    });

    if (!harvestDeal) {
      throw ERR_HARVEST_DEAL_FOR_REALIZATION_NOT_AVAILABLE();
    }

    const qr = await this.dao.startTransaction();

    try {
      const newInput = {
        farmingCycleId: opts.farmingCycleId,
        harvestDealId: opts.body.harvestDealId,
        harvestDate: opts.body.date,
        driver: opts.body.driver,
        truckLicensePlate: opts.body.truckLicensePlate,
        status: opts.body.status || RealizationStatusEnum.DRAFT,
        records: opts.body.records.map((item) => ({
          quantity: item.quantity,
          tonnage: item.tonnage,
          averageWeight: Number((item.tonnage / item.quantity).toFixed(2)),
          weighingNumber: opts.body.weighingNumber,
        })),
      } as HarvestRealizationInput;
      const newRealization = await this.create(newInput, opts.user, qr);

      await this.dao.commitTransaction(qr);

      return this.getHarvestRealizationDetailFMS({
        farmingCycleId: opts.farmingCycleId,
        realizationId: newRealization.id!,
      });
    } catch (error) {
      await this.dao.rollbackTransaction(qr);

      throw error;
    }
  }

  async updateFromFMS(opts: {
    body: UpdateRealizationBody;
    farmingCycleId: string;
    realizationId: string;
    user: RequestUser;
  }): Promise<HarvestRealizationDetailItem> {
    const realization = await this.dao.getOneStrict({
      where: {
        id: opts.realizationId,
        farmingCycleId: opts.farmingCycleId,
      },
      relations: {
        harvestRealizationRecords: true,
        harvestDeal: {
          harvestRequest: true,
        },
      },
    });

    if (
      realization.status === RealizationStatusEnum.FINAL ||
      realization.status === RealizationStatusEnum.DELETED
    ) {
      throw ERR_HARVEST_REALIZATION_IS_NOT_EDITABLE();
    }

    if (opts.body.status === RealizationStatusEnum.DELETED) {
      throw ERR_HARVEST_REALIZATION_INVALID_STATUS();
    }

    const qr = await this.dao.startTransaction();
    try {
      const input = {
        farmingCycleId: opts.farmingCycleId,
        harvestDealId: opts.body.harvestDealId,
        harvestDate: opts.body.date,
        truckLicensePlate: opts.body.truckLicensePlate,
        driver: opts.body.driver,
        weighingNumber: opts.body.weighingNumber,
        records: opts.body.records.map((item) => ({
          quantity: item.quantity,
          tonnage: item.tonnage,
          averageWeight: Number((item.tonnage / item.quantity).toFixed(2)),
          weighingNumber: opts.body.weighingNumber,
        })),
        status: opts.body.status,
      } as HarvestRealizationUpdate;

      await this.update({ harvestRealizationId: realization.id }, input, opts.user, qr);

      await this.dao.commitTransaction(qr);
    } catch (error) {
      await this.dao.rollbackTransaction(qr);
      throw error;
    }

    return this.getHarvestRealizationDetailFMS({
      farmingCycleId: opts.farmingCycleId,
      realizationId: opts.realizationId,
    });
  }

  async createRecords(
    records: DeepPartial<HarvestRecordInput>[],
    harvestRealization: HarvestRealization,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<HarvestRecordItem[]> {
    const recordData = records?.map<any>((hre) => ({
      ...hre,
      id: randomUUID(),
    }));

    const harvestRecords = await this.harvestRecordDAO.createManyWithTx(
      recordData.map<DeepPartial<HarvestRealizationRecord>>((hrec) => ({
        id: hrec.id,
        harvestRealizationId: harvestRealization.id,
        weighingNumber: hrec.weighingNumber,
        tonnage: hrec.tonnage,
        averageWeight: Number((hrec.tonnage / hrec.quantity).toFixed(2)),
        quantity: hrec.quantity,
      })),
      user,
      queryRunner,
    );

    const recordPhotos = recordData.reduce<DeepPartial<HarvestRecordPhoto>[]>((prev, item) => {
      if (item.image) {
        prev.push({
          id: item.id,
          harvestRecordId: item.id,
          imageUrl: item.image,
        });
      }
      return prev;
    }, []);

    await this.harvestRecordPhotoDAO.createManyWithTx(recordPhotos, user, queryRunner);

    return harvestRecords;
  }

  async createAdditionalRequests(
    inputs: AdditionalRequestInput[],
    harvestRealization: HarvestRealization,
    harvestRequest: HarvestRequest,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<HarvestRequest[]> {
    if (!inputs || inputs.length === 0) return [];

    return this.harvestRequestDAO.createManyWithTx(
      inputs.map<DeepPartial<HarvestRequest>>((input) => ({
        farmingCycleId: input.farmingCycleId,
        reason: harvestRequest.reason,
        minWeight: harvestRequest.minWeight,
        maxWeight: harvestRequest.maxWeight,
        quantity: input.quantity,
        datePlanned: harvestRequest.datePlanned,
        requestReferral: harvestRequest.id,
        realizationReferral: harvestRealization.id,
      })),
      user,
      queryRunner,
    );
  }

  async updateChickStock(
    hre: HarvestRealization,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<FarmingCycleChickStockD> {
    return this.farmingCycleChickStockDDAO.upsertOneWithTx(
      {
        farmingCycleId: hre.farmingCycleId,
        transactionDate: new Date(hre.harvestDate),
        notes: 'harvested',
      },
      {
        farmingCycleId: hre.farmingCycleId,
        notes: 'harvested',
        operator: '-',
        qty: hre.quantity,
        transactionDate: new Date(hre.harvestDate),
        userId: user.id,
      },
      user,
      queryRunner,
    );
  }

  async getHarvestRealizationDetailFMS(opts: {
    farmingCycleId: string;
    realizationId: string;
  }): Promise<HarvestRealizationDetailItem> {
    const realization = await this.dao.getOneStrict({
      where: {
        id: opts.realizationId,
        farmingCycleId: opts.farmingCycleId,
      },
      relations: {
        harvestDeal: true,
        harvestRealizationRecords: true,
      },
    });

    const record = (realization.harvestRealizationRecords.length &&
      realization.harvestRealizationRecords[0]) || {
      weighingNumber: '',
    };

    return {
      harvestDealId: realization.harvestDeal.id,
      bakulName: realization.harvestDeal.bakulName,
      createdDate: realization.createdDate.toISOString(),
      date: realization.harvestDate,
      deliveryOrder: realization.harvestDeal.erpCode,
      driver: realization.driver,
      id: realization.id,
      status: realization.status || RealizationStatusEnum.DRAFT,
      truckLicensePlate: realization.truckLicensePlate,
      weighingNumber: record?.weighingNumber,
      records: realization.harvestRealizationRecords,
      total: {
        quantity: realization.quantity,
        tonnage: realization.tonnage,
      },
    };
  }

  async deleteRealizationFMS(opts: {
    user: RequestUser;
    farmingCycleId: string;
    realizationId: string;
  }): Promise<void> {
    const qr = await this.dao.startTransaction();

    try {
      const [realization, farmingCycle] = await Promise.all([
        this.dao.updateOneWithTx(
          {
            id: opts.realizationId,
            farmingCycleId: opts.farmingCycleId,
          },
          {
            status: RealizationStatusEnum.DELETED,
          },
          opts.user,
          qr,
        ),
        this.farmingCycleDAO.getOneStrict({
          where: {
            id: opts.farmingCycleId,
          },
        }),
      ]);

      // cancel harvest deal to release chick stock for another harvest requeset
      await this.harvestDealDAO.updateOneWithTx(
        {
          id: realization.harvestDealId,
        },
        {
          status: HarvestDealStatusEnum.REJECTED,
        },
        opts.user,
        qr,
      );

      await this.dao.commitTransaction(qr);

      await this.calculateDailyMonitoringQueue.addJob({
        farmingCycleId: opts.farmingCycleId,
        farmingCycleCode: farmingCycle.farmingCycleCode,
        date: realization.harvestDate,
      });
    } catch (error) {
      await this.dao.rollbackTransaction(qr);
      throw error;
    }
  }

  async setHarvestRealizationStatus() {
    const [hrDetails] = await this.dao.getMany({
      where: {
        status: RealizationStatusEnum.DRAFT,
        erpCode: IsNull(),
        harvestDate: Not(IsNull()),
        harvestDealId: Not(IsNull()),
      },
      relations: {
        farmingCycle: true,
      },
      take: env.HARVEST_REALIZATION_QUERY_TAKE_LIMIT,
    });

    // List of HarvestRealization Ids
    const hrToBeUpdated = hrDetails
      .filter((hr) => Math.abs(differenceInDays(new Date(hr.createdDate), new Date())) >= 2)
      .map((hr) => hr.id.toString());

    const harvestRealizations = await this.dao.updateMany(
      { id: In(hrToBeUpdated) },
      { status: RealizationStatusEnum.FINAL },
      { id: USER_SYSTEM_CRON.id, role: USER_SYSTEM_CRON.role },
    );

    // List of HarvestDeal Ids
    const hdToBeUpdated = hrDetails
      .filter((hr) => Math.abs(differenceInDays(new Date(hr.createdDate), new Date())) >= 2)
      .map((hr) => hr.harvestDealId);

    await this.harvestDealDAO.updateMany(
      { id: In(hdToBeUpdated) },
      { status: HarvestDealStatusEnum.FINAL },
      { id: USER_SYSTEM_CRON.id, role: USER_SYSTEM_CRON.role },
    );

    if (harvestRealizations.length > 0) {
      await harvestRealizations.reduce(async (prev, hr) => {
        await prev;

        const farmingCycle = await this.farmingCycleDAO.getOneById(hr.farmingCycleId);

        await this.harvestRealizationCreateOdooQueue.addJob({
          ...hr,
          farmingCycleCode: farmingCycle.farmingCycleCode,
        });
      }, Promise.resolve());
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private harvestRealizationStatus(hre: HarvestRealization): HarvestRealizationStatus {
    const isAfterCutoffDate = isAfter(new Date(), addDays(new Date(hre.harvestDate), 2));

    if (isAfterCutoffDate || hre.status === RealizationStatusEnum.FINAL) {
      return { number: 1, text: 'Selesai' };
    }

    return { number: 0, text: 'Terealisasi' };
  }

  // eslint-disable-next-line class-methods-use-this
  private isCreateHarvestRealizationWithSmartScale(
    weighRecordingData: HarvestRealizationWeighingRecord[],
  ): boolean {
    let isRealizationWithSmartScale: boolean = false;

    weighRecordingData.forEach((record) => {
      const withWeighingRecord = record.details;
      if (withWeighingRecord && withWeighingRecord.length > 0) {
        isRealizationWithSmartScale = true;
      }
    });

    return isRealizationWithSmartScale;
  }

  // eslint-disable-next-line class-methods-use-this
  private async getHarvestWithSmartScaleWeighingData(
    data: HarvestRealizationRecord[],
    smartScaleWeighingId: string,
  ): Promise<HarvestRealizationRecord[]> {
    const [ssWeighingChildRecords] = await this.smartScaleWeighingDDAO.getMany({
      where: {
        smartScaleWeighingId,
      },
    });

    const paginatedSsWeighingChildRecords =
      this.paginateSsWeighingChildRecords(ssWeighingChildRecords);

    const results = data.map((elm, idx) => ({
      ...elm,
      ...paginatedSsWeighingChildRecords[idx],
    }));

    return results;
  }

  // eslint-disable-next-line class-methods-use-this
  private paginateSsWeighingChildRecords(records: SmartScaleWeighingD[]): any[] {
    const paginatedRecords: any[] = [];

    const totalPage = Math.ceil(records.length / 10);

    for (let i = 0; i < totalPage; i += 1) {
      const pageNumber = i + 1;
      const startIndex = (pageNumber - 1) * 10;
      const endIndex = startIndex + 10;

      const details = records.slice(startIndex, endIndex);
      const qty = details.reduce(
        (accumulator, current) => Number(accumulator) + Number(current.totalCount),
        0,
      );
      const tonnage = details.reduce(
        (accumulator, current) => Number(accumulator) + Number(current.totalWeight),
        0,
      );

      const paginatedRecord = {
        page: pageNumber,
        details: details.map((detail) => ({
          ...detail,
          totalWeight: detail.totalWeight.toFixed(2),
          section: detail.section - i * 10,
        })),
        quantity: qty,
        tonnage: tonnage.toFixed(2),
      };
      paginatedRecords.push(paginatedRecord);
    }
    return paginatedRecords;
  }

  private async createWeighingRecord(
    input: HarvestRealizationInput,
    records: HarvestRealizationWeighingRecord[],
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<SmartScaleWeighing | undefined> {
    const weighingRecord = records.length > 0;

    if (weighingRecord) {
      const ssWeighingId = randomHexString();
      let totalAllCount: number = 0;
      let totalAllWeight: number = 0;

      const ssWeighingDetailPayloads: DeepPartial<SmartScaleWeighingD>[] = [];
      if (records.length > 0) {
        records.forEach((record, index) => {
          if (record.details && record.details.length > 0) {
            record.details.forEach((elm) => {
              const payload: Partial<SmartScaleWeighingD> = {
                smartScaleWeighingId: ssWeighingId,
                section: index * 10 + elm.section,
                totalCount: elm.totalCount,
                totalWeight: elm.totalWeight,
              };

              totalAllCount += elm.totalCount;
              totalAllWeight += elm.totalWeight;
              ssWeighingDetailPayloads.push(payload);
            });
          }
        });
      }

      const ssWeighingPayload = {
        id: ssWeighingId,
        farmingCycleId: input.farmingCycleId,
        executedDate: new Date(),
        weighingNumber: input.weighingNumber,
        totalCount: totalAllCount,
        avgWeight: totalAllWeight / totalAllCount,
      };

      const ssWeighingData = await this.smartScaleWeighingDAO.createOneWithTx(
        ssWeighingPayload,
        user,
        queryRunner,
      );

      await this.smartScaleWeighingDDAO.createManyWithTx(
        ssWeighingDetailPayloads,
        user,
        queryRunner,
      );

      return ssWeighingData;
    }
    return undefined;
  }

  private async validateHarvestQuantityFromDeal(opts: {
    farmingCycleId: string;
    quantity: number;
    harvestDealId?: string;
    isCreate: boolean;
  }) {
    // get latest daily monitoring calculation
    const dailyMonitorings = await this.dailyMonitoringDAO.getLatestMappedByFarmingCycleId([
      opts.farmingCycleId,
    ]);
    const latestDailyMonitoring = dailyMonitorings.get(opts.farmingCycleId);

    if (!latestDailyMonitoring) {
      throw ERR_HARVEST_REALIZATION_CHICKIN_STOCK_NOT_FOUND();
    }

    // sum harvest realization
    const [harvestRealizations] = await this.dao.getMany({
      where: {
        harvestDealId: opts.harvestDealId,
        farmingCycleId: opts.farmingCycleId,
      },
    });
    const totalRealization: number = harvestRealizations.reduce(
      (prev, realization) => prev + realization.quantity,
      0,
    );

    const currentChickstock =
      (latestDailyMonitoring.populationTotal || 0) -
      (latestDailyMonitoring.populationMortaled || 0) -
      totalRealization;

    const farmingCycle = await this.farmingCycleDAO.getOneStrict({
      where: {
        id: opts.farmingCycleId,
      },
    });

    if (opts.quantity > currentChickstock + 0.02 * farmingCycle.initialPopulation) {
      throw ERR_HARVEST_REALIZATION_QUANTITY(
        `${currentChickstock + 0.02 * farmingCycle.initialPopulation} ekor`,
      );
    }

    // New validation related to Harvest - Odoo Integration
    if (opts.harvestDealId) {
      const harvestDeal: HarvestDeal = await this.harvestDealDAO.getOneStrict({
        where: {
          id: opts.harvestDealId,
        },
      });

      // Validate status if deal is rejected, then it shouldn't be able to be realized
      if (harvestDeal.status === HarvestDealStatusEnum.REJECTED) {
        throw ERR_HARVEST_REALIZATION_DEAL_REJECTED();
      }
    }
  }

  private async updateHarvestDealStatusUponRealization(
    harvestRealization: HarvestRealization,
    user: RequestUser,
    queryRunner: QueryRunner,
    latestHarvestRealizationStatus: string,
  ): Promise<void> {
    let status: string = HarvestDealStatusEnum.DRAFT;
    if (
      isAfter(new Date(), addDays(new Date(harvestRealization.harvestDate), 2)) ||
      latestHarvestRealizationStatus === RealizationStatusEnum.FINAL
    ) {
      status = HarvestDealStatusEnum.FINAL;
    }

    await this.harvestDealDAO.updateOneWithTx(
      { id: harvestRealization.harvestDealId },
      { status: status as HarvestDealStatusEnum },
      user,
      queryRunner,
    );
  }
}
