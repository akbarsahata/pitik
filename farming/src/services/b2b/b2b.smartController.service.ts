import { Inject, Service } from 'fastify-decorators';
import { IsNull } from 'typeorm';
import { B2BFarmInfrastructureDAO } from '../../dao/b2b/b2b.farmInfrastructure.dao';
import { B2BIotDeviceDAO } from '../../dao/b2b/b2b.iotDevice.dao';
import {
  CreateB2BSmartControllerBody,
  CreateB2BSmartControllerItemResponse,
  EditB2BSmartControllerBody,
  EditB2BSmartControllerItemResponse,
  EditB2BSmartControllerParam,
} from '../../dto/b2b/b2b.smartController.dto';
import { DEVICE_TYPE } from '../../libs/constants';
import {
  ERR_B2B_IOT_DEVICE_ALREADY_REGISTERED,
  ERR_B2B_NOT_AN_ORGANIZATION_MEMBER,
} from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { b2bGenerateDefaultDeviceName, toSensorCode } from '../../libs/utils/helpers';
import { SmartControllerService } from '../smartController.service';

@Service()
export class B2BSmartControllerService extends SmartControllerService {
  @Inject(B2BIotDeviceDAO)
  private b2bIotDeviceDAO: B2BIotDeviceDAO;

  @Inject(B2BFarmInfrastructureDAO)
  private b2bFarmInfraDAO: B2BFarmInfrastructureDAO;

  async createSmartController(
    body: CreateB2BSmartControllerBody,
    user: RequestUser,
  ): Promise<CreateB2BSmartControllerItemResponse> {
    if (!user.organizationId) {
      throw ERR_B2B_NOT_AN_ORGANIZATION_MEMBER();
    }

    const iotDevice = await this.iotDeviceDAO.getOne({
      where: {
        mac: body.mac,
        status: true,
        deletedDate: IsNull(),
        roomId: body.roomId,
      },
    });

    if (iotDevice) {
      throw ERR_B2B_IOT_DEVICE_ALREADY_REGISTERED();
    }

    const queryRunner = await this.iotDeviceDAO.startTransaction();

    try {
      const farmInfra = await this.b2bFarmInfraDAO.getOneStrict({
        where: {
          coopId: body.coopId,
          organizationId: user.organizationId,
        },
      });

      const newDevice = await this.iotDeviceDAO.createOneWithTx(
        {
          status: true,
          isOnline: true,
          mac: body.mac.slice(-17),
          deviceType: DEVICE_TYPE.SMART_CONTROLLER.value as keyof typeof DEVICE_TYPE,
          farmId: farmInfra.farmId,
          buildingId: farmInfra.buildingId,
          coopId: farmInfra.coopId,
          roomId: body.roomId,
          deviceId: body.mac.slice(-17),
        },
        user,
        queryRunner,
      );

      await this.b2bIotDeviceDAO.createOneWithTx(
        {
          b2bDeviceName: b2bGenerateDefaultDeviceName(newDevice.deviceType),
          farmInfrastructureId: farmInfra.id,
          deviceId: newDevice.id,
        },
        user,
        queryRunner,
      );

      await this.iotDeviceDAO.commitTransaction(queryRunner);

      this.smartControllerPublisher.sendSmartControllerGetSettingsCommand({
        macAddress: body.mac,
      });

      return {
        id: newDevice.id,
        roomId: body.roomId,
        coopId: body.coopId,
        mac: body.mac,
      };
    } catch (error) {
      await this.iotDeviceDAO.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async renameB2BSmartController(
    param: EditB2BSmartControllerParam,
    input: EditB2BSmartControllerBody,
    user: RequestUser,
  ): Promise<EditB2BSmartControllerItemResponse> {
    const queryRunner = await this.b2bIotDeviceDAO.startTransaction();

    try {
      await this.b2bIotDeviceDAO.updateOneWithTx(
        { deviceId: param.deviceId },
        { b2bDeviceName: input.deviceName },
        user,
        queryRunner,
      );

      await this.b2bIotDeviceDAO.commitTransaction(queryRunner);

      return {
        deviceId: param.deviceId,
        ...input,
      };
    } catch (error) {
      await this.b2bIotDeviceDAO.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async getB2BSmartControllerDeviceSummary(coopId: string, mac: string): Promise<any> {
    const controller = await this.iotDeviceDAO.getOneStrict({
      where: {
        mac,
        coopId,
        deviceType: 'SMART_CONTROLLER',
      },
      relations: {
        coop: true,
      },
    });

    const report = await this.getCoopControllerLatestCondition(
      controller.coopId as string,
      controller.mac,
    );

    return {
      id: controller.id,
      coopCodeId: toSensorCode(controller.coop.coopCode),
      deviceId: controller.mac,
      temperature: {
        value: Number(report.temperature?.toFixed(2) ?? 0),
        uom: '°C',
        status: report.temperature > 32 ? 'bad' : 'good',
      },
      relativeHumidity: {
        value: Number(report.humidity?.toFixed(2) ?? 0),
        uom: '%',
        status: 'good',
      },
    };
  }
}
