import { endOfDay, startOfDay } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { Repository, Between } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { GamificationPointHistory } from '../datasources/entity/pgsql/GamificationPointHistory.entity';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { randomHexString } from '../libs/utils/helpers';

@Service()
export class GamificationPointHistoryDAO {
  @Inject(PostgreSQLConnection)
  private pSql!: PostgreSQLConnection;

  private repository: Repository<GamificationPointHistory>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(GamificationPointHistory);
  }

  async createOne(
    data: Partial<GamificationPointHistory>,
    userId: string,
  ): Promise<GamificationPointHistory> {
    const existingHistory = await this.repository.findOne({
      where: {
        taskTicketId: data.taskTicketId,
      },
    });

    if (existingHistory) {
      return existingHistory;
    }

    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const history = this.repository.create({
      ...data,
      id: randomHexString(),
      createdBy: userId,
      createdDate: now,
      modifiedBy: userId,
      modifiedDate: now,
    });

    await this.repository.save(history);

    return history;
  }

  async getFarmingCyclePointHistory(
    farmingCycleId: string,
    date?: Date,
  ): Promise<GamificationPointHistory[]> {
    let historyDateFrom = startOfDay(new Date());
    let historyDateTo = endOfDay(new Date());

    historyDateFrom = utcToZonedTime(historyDateFrom, DEFAULT_TIME_ZONE);
    historyDateTo = utcToZonedTime(historyDateTo, DEFAULT_TIME_ZONE);

    if (date) {
      historyDateFrom = utcToZonedTime(startOfDay(date), DEFAULT_TIME_ZONE);

      historyDateTo = utcToZonedTime(endOfDay(date), DEFAULT_TIME_ZONE);
    }

    const histories = await this.repository.find({
      where: {
        farmingCycleId,
        createdDate: Between(historyDateFrom, historyDateTo),
      },
      relations: {
        taskTicket: true,
      },
    });

    return histories;
  }
}
