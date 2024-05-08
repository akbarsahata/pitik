import { Inject, Service } from 'fastify-decorators';
import { DeepPartial, Like } from 'typeorm';
import { AlertPresetD } from '../datasources/entity/pgsql/AlertPresetD.entity';
import { AlertPresetDAO } from '../dao/alertPreset.dao';
import { AlertPresetDDAO } from '../dao/alertPresetD.dao';
import { AlertPreset } from '../datasources/entity/pgsql/AlertPreset.entity';
import {
  CreateAlertPresetBody,
  GetAlertPresetQuery,
  UpdateAlertPresetBody,
} from '../dto/alertPreset.dto';
import { ERR_ALERT_PRESET_NOT_FOUND, ERR_ALERT_PRESET_CODE_EXIST } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';

@Service()
export class AlertPresetService {
  @Inject(AlertPresetDAO)
  private alertPresetDAO: AlertPresetDAO;

  @Inject(AlertPresetDDAO)
  private alertPresetDDAO: AlertPresetDDAO;

  async getMany(filter: GetAlertPresetQuery): Promise<[AlertPreset[], number]> {
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;

    return this.alertPresetDAO.getMany({
      where: {
        alertPresetCode: filter.alertPresetCode,
        alertPresetName: filter.alertPresetName ? Like(`%${filter.alertPresetName}%`) : undefined,
        coopTypeId: filter.coopTypeId,
        status: filter.status,
      },
      select: {
        coopType: {
          id: true,
          coopTypeCode: true,
          coopTypeName: true,
        },
      },
      relations: {
        coopType: true,
        userModifier: true,
      },
      take: limit,
      skip,
      order: {
        createdDate: 'DESC',
      },
    });
  }

  async getById(id: string): Promise<AlertPreset> {
    const alertPreset = await this.alertPresetDAO.getOne({
      where: {
        id,
      },
      select: {
        alerts: {
          id: true,
          alert: {
            id: true,
            alertCode: true,
            alertName: true,
            alertDescription: true,
            eligibleManual: true,
            status: true,
            remarks: true,
          },
        },
        coopType: {
          id: true,
          coopTypeCode: true,
          coopTypeName: true,
        },
      },
      relations: {
        alerts: {
          alert: true,
        },
        coopType: true,
      },
    });

    if (!alertPreset) throw ERR_ALERT_PRESET_NOT_FOUND();

    return alertPreset;
  }

  async create(input: CreateAlertPresetBody, user: RequestUser): Promise<AlertPreset> {
    const queryRunner = await this.alertPresetDAO.startTransaction();

    try {
      const existingAlertPreset = await this.alertPresetDAO.getOne({
        where: {
          alertPresetCode: input.alertPresetCode,
        },
      });
      if (existingAlertPreset) {
        throw ERR_ALERT_PRESET_CODE_EXIST();
      }

      const transactionHooks: Function[] = [];
      if (input.alertIds) {
        input.alertIds.forEach((alertId) => {
          transactionHooks.push(this.alertPresetDDAO.wrapUpsertHook(alertId, user.id));
        });
      }

      const alertPreset = await this.alertPresetDAO.createOneWithTx(
        input,
        user,
        queryRunner,
        transactionHooks,
      );

      await this.alertPresetDAO.commitTransaction(queryRunner);

      return this.getById(alertPreset.id);
    } catch (error) {
      await this.alertPresetDAO.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async update(id: string, input: UpdateAlertPresetBody, user: RequestUser): Promise<AlertPreset> {
    const queryRunner = await this.alertPresetDAO.startTransaction();

    try {
      await this.alertPresetDDAO.deleteWithTx(
        {
          alertPresetId: id,
        },
        queryRunner,
      );

      await this.alertPresetDDAO.createManyWithTx(
        input.alertIds.map<DeepPartial<AlertPresetD>>((alertId) => ({
          alertPresetId: id,
          alertId,
        })),
        user,
        queryRunner,
      );

      await this.alertPresetDAO.updateOneWithTx(
        { id },
        {
          alertPresetCode: input.alertPresetCode,
          alertPresetName: input.alertPresetName,
          coopTypeId: input.coopTypeId,
          status: input.status,
          remarks: input.remarks,
        },
        user,
        queryRunner,
      );

      await this.alertPresetDAO.commitTransaction(queryRunner);

      const alertPreset = await this.alertPresetDAO.getOneStrict({
        where: {
          id,
        },
      });

      return alertPreset;
    } catch (error) {
      await this.alertPresetDAO.rollbackTransaction(queryRunner);

      throw error;
    }
  }
}
