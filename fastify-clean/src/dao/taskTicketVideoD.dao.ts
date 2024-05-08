import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { Repository } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { TaskTicketVideoD } from '../datasources/entity/pgsql/TaskTicketVideoD.entity';
import { TaskMedia } from '../dto/task.dto';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';
import { randomHexString } from '../libs/utils/helpers';

@Service()
export class TaskTicketVideoDDAO {
  @Inject(PostgreSQLConnection)
  private pSql!: PostgreSQLConnection;

  private repository: Repository<TaskTicketVideoD>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(TaskTicketVideoD);
  }

  async createMany(
    data: TaskMedia[],
    taskTicketDetailId: string,
    user: RequestUser,
  ): Promise<TaskTicketVideoD[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const videos = this.repository.create(
      data.map<Partial<TaskTicketVideoD>>((d) => ({
        taskTicketDetailId,
        id: randomHexString(),
        videoUrl: d.url,
        executedDate: now,
        createdDate: now,
        createdBy: user.id,
        modifiedDate: now,
        modifiedBy: user.id,
      })),
    );

    await this.repository.save(videos);

    return videos;
  }
}
