import { format as formatTZ } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { IotTicketingHistoryDAO } from '../dao/iotTicketingHistory.dao';
import {
  TicketingHistoryItemsDTO,
  TicketingHistorypayloadDTO,
} from '../dto/iotTicketingHistory.dto';
import { DATETIME_SQL_FORMAT, DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';

@Service()
export class IotTicketingHistoryService {
  @Inject(IotTicketingHistoryDAO)
  private iotTicketingHistoryDAO!: IotTicketingHistoryDAO;

  async updateOne(
    input: TicketingHistorypayloadDTO,
    params: string,
    user: RequestUser,
  ): Promise<Partial<TicketingHistoryItemsDTO>> {
    const ticketing = await this.iotTicketingHistoryDAO.updateOneIotTicketingHistory(
      input,
      { id: params },
      user,
    );
    return {
      ...ticketing,
      timeAction: formatTZ(new Date(ticketing.timeAction), DATETIME_SQL_FORMAT, {
        timeZone: DEFAULT_TIME_ZONE,
      }),
      createdDate: formatTZ(new Date(ticketing.createdDate), DATETIME_SQL_FORMAT, {
        timeZone: DEFAULT_TIME_ZONE,
      }),
      modifiedDate: formatTZ(new Date(ticketing.modifiedDate), DATETIME_SQL_FORMAT, {
        timeZone: DEFAULT_TIME_ZONE,
      }),
    };
  }
}
