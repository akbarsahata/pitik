import { randomUUID } from 'crypto';
import { addDays, format, isAfter } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { DeepPartial, IsNull, Not, QueryRunner, Raw } from 'typeorm';
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
import { HarvestDeal } from '../datasources/entity/pgsql/HarvestDeal.entity';
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
import { HarvestRealizationSubmittedQueue } from '../jobs/queues/harvest-realization-submitted.queue';
import { HarvestRequestSubmittedQueue } from '../jobs/queues/harvest-request-submitted.queue';
import { DATE_SQL_FORMAT, DEFAULT_TIME_ZONE, GENERATED_DOCUMENT_MODULE } from '../libs/constants';
import {
  ERR_HARVEST_REALIZATION_CHICKIN_STOCK_EXCEEDED,
  ERR_HARVEST_REALIZATION_CHICKIN_STOCK_NOT_FOUND,
  ERR_HARVEST_REALIZATION_DO_EXIST,
  ERR_HARVEST_REALIZATION_INVALID_STATUS,
  ERR_HARVEST_REALIZATION_IS_NOT_EDITABLE,
  ERR_HARVEST_REALIZATION_QUANTITY,
  ERR_HARVEST_REALIZATION_WEIGHING_EXIST,
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
        status: status.number,
        statusText: status.text,
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

    return {
      ...harvestRealization,
      tonnage: Number(harvestRealization.tonnage.toFixed(2)),
      harvestRequestId: harvestRealization.harvestDeal.harvestRequestId,
      bakulName: harvestRealization.harvestDeal.bakulName,
      deliveryOrder: harvestRealization.harvestDeal.erpCode,
      minWeight: harvestRealization.harvestDeal.minWeight,
      maxWeight: harvestRealization.harvestDeal.maxWeight,
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
      const [existingRealization] = await Promise.all([
        this.dao.getOne({
          where: {
            weighingNumber: input.weighingNumber,
            status: Not(RealizationStatusEnum.DELETED),
          },
        }),
        this.validateHarvestQuantityFromDeal({
          farmingCycleId: input.farmingCycleId,
          quantity: sumInput.quantity,
        }),
      ]);

      if (existingRealization) throw ERR_HARVEST_REALIZATION_WEIGHING_EXIST();

      const harvestDeal =
        refHarvestDeal ||
        (await this.harvestDealDAO.getOneStrict(
          {
            where: {
              id: input.harvestDealId,
            },
          },
          queryRunner,
        ));

      const harvestRequest = await this.harvestRequestDAO.getOneStrict(
        {
          where: {
            id: harvestDeal.harvestRequestId,
          },
        },
        queryRunner,
      );

      const farmingCycle = await this.farmingCycleDAO.getOneStrict({
        where: {
          id: input.farmingCycleId,
        },
      });

      const curPopulation = await this.dailyMonitoringDAO.getRemainingPopulation(farmingCycle.id);

      if (sumInput.quantity > curPopulation + 0.02 * farmingCycle.initialPopulation) {
        throw ERR_HARVEST_REALIZATION_QUANTITY(
          `${curPopulation + 0.02 * farmingCycle.initialPopulation} ekor`,
        );
      }

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

      const harvestRealization = await this.dao.createOneWithTx(
        {
          farmingCycleId: input.farmingCycleId,
          harvestDealId: input.harvestDealId,
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
          status: input.status,
        },
        user,
        queryRunner,
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

      if (harvestRealization.status === RealizationStatusEnum.FINAL) {
        // TODO: submit to Odoo
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
      const [existingRealization] = await Promise.all([
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
          harvestDealId: realization.harvestDealId,
        }),
      ]);

      if (existingRealization) throw ERR_HARVEST_REALIZATION_WEIGHING_EXIST();

      const farmingCycle = await this.farmingCycleDAO.getOneStrict({
        where: {
          id: input.farmingCycleId,
        },
      });

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

      const curPopulation = await this.dailyMonitoringDAO.getRemainingPopulation(farmingCycle.id);

      const availablePopulation =
        curPopulation + harvestRealization.quantity + 0.02 * farmingCycle.initialPopulation;

      if (sumInput.quantity > availablePopulation) {
        throw ERR_HARVEST_REALIZATION_QUANTITY(`${availablePopulation} ekor`);
      }

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
          status: input.status || undefined,
        },
        user,
        queryRunner,
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

      if (harvestRealization.status === RealizationStatusEnum.FINAL) {
        // TODO: submit to Odoo
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
          status: true,
        },
      });

      if (existingDeal) throw ERR_HARVEST_REALIZATION_DO_EXIST();

      const harvestRequest = await this.harvestRequestDAO.getById(
        input.harvestRequestId,
        queryRunner,
      );

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
          status: true,
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
        status: true,
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
          status: true,
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
    const quantity = opts.body.records.reduce<number>((prev, item) => prev + item.quantity, 0);

    const qr = await this.dao.startTransaction();
    try {
      type MinMax = {
        min: number;
        max: number;
      };

      const weight = opts.body.records.reduce<MinMax>(
        (prev, item) => {
          const averageWeight = item.tonnage / item.quantity;
          const result = prev;

          if (prev.min === 0 || averageWeight < prev.min) {
            result.min = Number(averageWeight.toFixed(2));
          }

          if (averageWeight > prev.max) {
            result.max = Number(averageWeight.toFixed(2));
          }

          return result;
        },
        {
          min: 0,
          max: 0,
        },
      );

      const harvestRequest = await this.harvestRequestDAO.createOneWithTx(
        {
          farmingCycleId: opts.farmingCycleId,
          quantity,
          datePlanned: opts.body.date,
          isApproved: true,
          approvedBy: opts.user.id,
          approvedDate: format(utcToZonedTime(new Date(), DEFAULT_TIME_ZONE), DATE_SQL_FORMAT),
          approvalRemarks: 'auto-approve from FMS',
          minWeight: weight.min,
          maxWeight: weight.max,
        },
        opts.user,
        qr,
      );

      const input = {
        bakulName: opts.body.bakulName,
        deliveryOrder: opts.body.deliveryOrder,
        driver: opts.body.driver,
        farmingCycleId: opts.farmingCycleId,
        harvestDate: opts.body.date,
        harvestRequestId: harvestRequest.id,
        maxWeight: weight.max,
        minWeight: weight.min,
        records: opts.body.records.map((item) => ({
          quantity: item.quantity,
          tonnage: item.tonnage,
          averageWeight: Number((item.tonnage / item.quantity).toFixed(2)),
          weighingNumber: opts.body.weighingNumber,
        })),
        truckLicensePlate: opts.body.truckLicensePlate,
        weighingNumber: opts.body.weighingNumber,
        status: opts.body.status,
      } as HarvestRealizationDealInput;
      const realization = await this.createWithDeal(input, opts.user, qr);

      await this.dao.commitTransaction(qr);

      return this.getHarvestRealizationDetailFMS({
        farmingCycleId: opts.farmingCycleId,
        realizationId: realization.id!,
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
      type MinMax = {
        min: number;
        max: number;
      };

      const weight = opts.body.records.reduce<MinMax>(
        (prev, item) => {
          const averageWeight = item.tonnage / item.quantity;
          const result = prev;

          if (prev.min === 0 || averageWeight < prev.min) {
            result.min = Number(averageWeight.toFixed(2));
          }

          if (averageWeight > prev.max) {
            result.max = Number(averageWeight.toFixed(2));
          }

          return result;
        },
        {
          min: 0,
          max: 0,
        },
      );

      const input = {
        bakulName: opts.body.bakulName,
        deliveryOrder: opts.body.deliveryOrder,
        driver: opts.body.driver,
        farmingCycleId: opts.farmingCycleId,
        harvestDate: opts.body.date,
        maxWeight: weight.max,
        minWeight: weight.min,
        records: opts.body.records.map((item) => ({
          quantity: item.quantity,
          tonnage: item.tonnage,
          averageWeight: Number((item.tonnage / item.quantity).toFixed(2)),
          weighingNumber: opts.body.weighingNumber,
        })),
        truckLicensePlate: opts.body.truckLicensePlate,
        weighingNumber: opts.body.weighingNumber,
        status: opts.body.status,
      } as HarvestRealizationDealUpdate;
      await this.updateWithDeal(
        {
          harvestRealizationId: realization.id,
        },
        input,
        opts.user,
      );

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
      const realization = await this.dao.updateOneWithTx(
        {
          id: opts.realizationId,
          farmingCycleId: opts.farmingCycleId,
        },
        {
          status: RealizationStatusEnum.DELETED,
        },
        opts.user,
        qr,
      );

      // cancel harvest deal to release chick stock for another harvest requeset
      await this.harvestDealDAO.updateOneWithTx(
        {
          id: realization.harvestDealId,
        },
        {
          status: false,
        },
        opts.user,
        qr,
      );

      await this.dao.commitTransaction(qr);

      await this.calculateDailyMonitoringQueue.addJob({
        farmingCycleId: opts.farmingCycleId,
        date: realization.harvestDate,
      });
    } catch (error) {
      await this.dao.rollbackTransaction(qr);
      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private harvestRealizationStatus(hre: HarvestRealization): HarvestRealizationStatus {
    if (isAfter(new Date(), addDays(new Date(hre.harvestDate), 2)) || hre.status) {
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
  }) {
    // get latest daily monitoring calculation
    const dailyMonitorings = await this.dailyMonitoringDAO.getLatestMappedByFarmingCycleId([
      opts.farmingCycleId,
    ]);
    const latestDailyMonitoring = dailyMonitorings.get(opts.farmingCycleId);

    if (!latestDailyMonitoring) {
      throw ERR_HARVEST_REALIZATION_CHICKIN_STOCK_NOT_FOUND();
    }

    // sum harvest deal with status true
    const [harvestDeals] = await this.harvestDealDAO.getMany({
      where: {
        id: opts.harvestDealId && Not(opts.harvestDealId),
        status: true,
        farmingCycleId: opts.farmingCycleId,
      },
    });

    const currentChickstock =
      (latestDailyMonitoring.populationTotal || 0) -
      (latestDailyMonitoring.populationMortaled || 0) -
      harvestDeals.reduce((prev, deal) => prev + deal.quantity, 0);

    if (opts.quantity > currentChickstock) {
      throw ERR_HARVEST_REALIZATION_CHICKIN_STOCK_EXCEEDED(`Current stock is ${currentChickstock}`);
    }
  }
}
