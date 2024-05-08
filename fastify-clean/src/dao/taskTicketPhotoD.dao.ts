import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { DeepPartial, FindManyOptions, In, Repository } from 'typeorm';
import { RequestUser } from '../libs/types/index.d';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { TaskTicketPhotoD } from '../datasources/entity/pgsql/TaskTicketPhotoD.entity';
import { TaskMedia } from '../dto/task.dto';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { randomHexString } from '../libs/utils/helpers';

@Service()
export class TaskTicketPhotoDDAO {
  @Inject(PostgreSQLConnection)
  private pSql!: PostgreSQLConnection;

  private repository: Repository<TaskTicketPhotoD>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(TaskTicketPhotoD);
  }

  async createMany(
    data: TaskMedia[],
    taskTicketDetailId: string,
    user: RequestUser,
  ): Promise<TaskTicketPhotoD[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const videos = this.repository.create(
      data.map<Partial<TaskTicketPhotoD>>((d) => ({
        taskTicketDetailId,
        id: randomHexString(),
        imageUrl: d.url,
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

  async getMany(params: FindManyOptions<TaskTicketPhotoD>): Promise<TaskTicketPhotoD[]> {
    return this.repository.find(params);
  }

  async upsertMany(
    user: RequestUser,
    items: DeepPartial<TaskTicketPhotoD>[],
  ): Promise<TaskTicketPhotoD[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);
    const upserItems = items.map((item) => ({
      ...item,
      id: item.id || randomHexString(),
      createdBy: user.id,
      createdDate: now,
      modifiedBy: user.id,
      modifiedDate: now,
    }));

    await this.repository
      .createQueryBuilder()
      .insert()
      .into(TaskTicketPhotoD)
      .values(upserItems)
      .orUpdate(['modified_by', 'modified_date', 'image_url', 'executed_date'], ['id'])
      .execute();

    return this.getMany({
      where: {
        id: In(upserItems.map((item) => item.id)),
      },
    });
  }
}
