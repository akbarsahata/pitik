import { getUnixTime, isToday } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { Raw } from 'typeorm';
import { B2BSmartScaleWeighingDAO } from '../../dao/b2b/b2b.smartScaleWeighing.dao';
import { B2BSmartScaleWeighingDataDAO } from '../../dao/b2b/b2b.smartScaleWeighingData.dao';
import { RoomDAO } from '../../dao/room.dao';
import { B2BSmartScaleWeighing } from '../../datasources/entity/pgsql/b2b/B2BSmartScaleWeighings.entity';
import {
  CreateB2BSmartScaleWeighingBody,
  GetB2BSmartScaleWeighingDetailsParams,
  GetB2BSmartScaleWeighingResponseItem,
  GetB2BSmartScaleWeighingsQuery,
  UpdateB2BSmartScaleWeighingBody,
} from '../../dto/b2b/b2b.smartScaleWeighing.dto';
import { DEFAULT_TIME_ZONE } from '../../libs/constants';
import { ERR_B2B_SMART_SCALE_WEIGHING_FAILED_TO_UPSERT } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';

@Service()
export class B2BSmartScaleWeighingService {
  @Inject(B2BSmartScaleWeighingDAO)
  private b2bSmartScaleWeighingsDAO: B2BSmartScaleWeighingDAO;

  @Inject(RoomDAO)
  private roomDAO: RoomDAO;

  @Inject(B2BSmartScaleWeighingDataDAO)
  private b2bDataInSmartScaleWeighingDAO: B2BSmartScaleWeighingDataDAO;

  async getB2BSmartScaleWeighings(opts: {
    filter: GetB2BSmartScaleWeighingsQuery;
  }): Promise<GetB2BSmartScaleWeighingResponseItem[]> {
    const { filter } = opts;
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;

    const [results] = await this.b2bSmartScaleWeighingsDAO.getMany({
      where: {
        roomId: filter.roomId,
        executionDate: filter.date
          ? Raw(
              (executionDate) =>
                `${executionDate} < :date::timestamp + INTERVAL '1 day' AND ${executionDate} >= :date`,
              { date: filter.date },
            )
          : undefined,
      },
      relations: {
        room: {
          roomType: true,
        },
      },
      order: {
        executionDate: 'DESC',
      },
      skip,
      take: (filter.$limit !== 0 && limit) || undefined,
    });

    return results.map((item) => this.mapEntityToDTO(item));
  }

  async getB2BSmartScaleWeighingDetails(opts: {
    params: GetB2BSmartScaleWeighingDetailsParams;
  }): Promise<GetB2BSmartScaleWeighingResponseItem> {
    const { weighingId } = opts.params;

    const result = await this.b2bSmartScaleWeighingsDAO.getOneStrict({
      where: {
        id: weighingId,
      },
      relations: {
        b2bDataInSmartScaleWeighing: true,
        room: {
          roomType: true,
        },
      },
    });

    return this.mapEntityToDTO(result);
  }

  async createB2BSmartScaleWeighing(opts: {
    body: CreateB2BSmartScaleWeighingBody;
    user: RequestUser;
  }): Promise<GetB2BSmartScaleWeighingResponseItem> {
    const { body, user } = opts;

    const room = await this.roomDAO.getOneStrict({
      where: {
        id: body.roomId,
      },
    });

    if (!room.isActive) {
      throw ERR_B2B_SMART_SCALE_WEIGHING_FAILED_TO_UPSERT('lantai dalam kondisi nonaktif');
    }

    const executionDate = new Date(body.executionDate);
    const startDate = new Date(body.startDate);
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    if (getUnixTime(executionDate) > getUnixTime(now)) {
      throw ERR_B2B_SMART_SCALE_WEIGHING_FAILED_TO_UPSERT(
        'tanggal timbang tidak dapat berada di masa depan',
      );
    }

    const qr = await this.b2bSmartScaleWeighingsDAO.startTransaction();
    const totalWeight = body.records.reduce((sum, item) => sum + item.weight, 0);
    const totalCount = body.records.reduce((sum, item) => sum + item.count, 0);

    try {
      const weighing = await this.b2bSmartScaleWeighingsDAO.createOneWithTx(
        {
          ...body,
          executionDate,
          startDate,
          totalCount,
          averageWeight: totalWeight / totalCount,
        },
        user,
        qr,
      );

      await this.b2bDataInSmartScaleWeighingDAO.createManyWithTx(
        body.records.map((data) => ({
          ...data,
          weighingId: weighing.id,
        })),
        user,
        qr,
      );

      await this.b2bSmartScaleWeighingsDAO.commitTransaction(qr);

      return await this.getB2BSmartScaleWeighingDetails({ params: { weighingId: weighing.id } });
    } catch (error) {
      await this.b2bSmartScaleWeighingsDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  async updateB2BSmartScaleWeighing(opts: {
    weighingId: string;
    body: UpdateB2BSmartScaleWeighingBody;
    user: RequestUser;
  }): Promise<GetB2BSmartScaleWeighingResponseItem> {
    const { body, user, weighingId } = opts;

    const currentWeighing = await this.b2bSmartScaleWeighingsDAO.getOneStrict({
      where: {
        id: weighingId,
      },
    });

    const executionDate = new Date(body.executionDate);
    const startDate = new Date(body.startDate);
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    if (getUnixTime(executionDate) > getUnixTime(now)) {
      throw ERR_B2B_SMART_SCALE_WEIGHING_FAILED_TO_UPSERT(
        'tanggal timbang tidak dapat berada di masa depan',
      );
    }

    if (!isToday(currentWeighing.executionDate) && !body.isOfflineUpdate) {
      throw ERR_B2B_SMART_SCALE_WEIGHING_FAILED_TO_UPSERT(
        'data timbang terdahulu tidak dapat diubah',
      );
    }

    const room = await this.roomDAO.getOneStrict({
      where: {
        id: body.roomId,
      },
    });

    if (!room.isActive) {
      throw ERR_B2B_SMART_SCALE_WEIGHING_FAILED_TO_UPSERT('lantai dalam kondisi nonaktif');
    }

    const qr = await this.b2bSmartScaleWeighingsDAO.startTransaction();
    const totalWeight = body.records.reduce((sum, item) => sum + item.weight, 0);
    const totalCount = body.records.reduce((sum, item) => sum + item.count, 0);

    try {
      const weighing = await this.b2bSmartScaleWeighingsDAO.updateOneWithTx(
        { id: weighingId },
        {
          roomId: body.roomId,
          executionDate,
          startDate,
          totalCount,
          averageWeight: totalWeight / totalCount,
        },
        user,
        qr,
      );

      await this.b2bDataInSmartScaleWeighingDAO.deleteManyWithTx({ weighingId }, qr);

      await this.b2bDataInSmartScaleWeighingDAO.createManyWithTx(
        body.records.map((data) => ({
          ...data,
          weighingId: weighing.id,
        })),
        user,
        qr,
      );

      await this.b2bSmartScaleWeighingsDAO.commitTransaction(qr);

      return await this.getB2BSmartScaleWeighingDetails({ params: { weighingId: weighing.id } });
    } catch (error) {
      await this.b2bSmartScaleWeighingsDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private mapEntityToDTO(data: B2BSmartScaleWeighing): GetB2BSmartScaleWeighingResponseItem {
    return {
      ...data,
      records: data.b2bDataInSmartScaleWeighing,
      createdDate: data.createdDate.toISOString(),
      modifiedDate: data.modifiedDate.toISOString(),
      executionDate: data.executionDate.toISOString(),
      startDate: data.startDate.toISOString(),
    };
  }
}
