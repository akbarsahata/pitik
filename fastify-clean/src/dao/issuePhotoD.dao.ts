import { utcToZonedTime } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { Repository } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { IssuePhotoD } from '../datasources/entity/pgsql/IssuePhotoD.entity';
import { User } from '../datasources/entity/pgsql/User.entity';
import { IssuePhoto } from '../dto/issue.dto';
import { DEFAULT_TIME_ZONE } from '../libs/constants';
import { randomHexString } from '../libs/utils/helpers';

@Service()
export class IssuePhotoDDAO {
  @Inject(PostgreSQLConnection)
  private pSql!: PostgreSQLConnection;

  private repository: Repository<IssuePhotoD>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(IssuePhotoD);
  }

  async createMany(data: IssuePhoto[], issueId: string, user: User): Promise<IssuePhotoD[]> {
    const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

    const photos = this.repository.create(
      data.map<Partial<IssuePhotoD>>((d) => ({
        issueId,
        id: randomHexString(),
        imageUrl: d.url,
        createdDate: now,
        createdBy: user.email,
        modifiedDate: now,
        modifiedBy: user.email,
      })),
    );

    await this.repository.save(photos);

    return photos;
  }
}
