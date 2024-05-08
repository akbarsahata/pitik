import { utcToZonedTime, format as formatTZ } from 'date-fns-tz';
import { Initializer, Inject, Service } from 'fastify-decorators';
import { Repository } from 'typeorm';
import { PostgreSQLConnection } from '../datasources/connection/postgresql.connection';
import { AutoNumbering } from '../datasources/entity/pgsql/AutoNumbering.entity';
import { FarmingCycle } from '../datasources/entity/pgsql/FarmingCycle.entity';
import { Issue } from '../datasources/entity/pgsql/Issue.entity';
import { User } from '../datasources/entity/pgsql/User.entity';
import { IssueStatusEnum } from '../dto/issue.dto';
import { AUTO_NUMBERING_TRX_TYPE, DATE_SQL_FORMAT, DEFAULT_TIME_ZONE } from '../libs/constants';
import { generateIssueNumber, randomHexString } from '../libs/utils/helpers';

@Service()
export class IssueDAO {
  @Inject(PostgreSQLConnection)
  private pSql!: PostgreSQLConnection;

  private repository: Repository<Issue>;

  @Initializer([PostgreSQLConnection])
  async init() {
    this.repository = this.pSql.connection.getRepository(Issue);
  }

  async getListAndCount(farmingCycleId: string, skip = 0, limit = 5): Promise<[Issue[], number]> {
    return this.repository
      .createQueryBuilder('i')
      .leftJoinAndSelect('i.farmingCycle', 'fc', 'i.ref_farmingcycle_id = fc.id')
      .leftJoinAndSelect('i.farmingCycleAlert', 'fca', 'i.ref_farmingcyclealert_id = fca.id')
      .leftJoinAndSelect('i.photos', 'p', 'p.ref_issue_id = i.id')
      .where('i.ref_farmingcycle_id = :farmingCycleId', { farmingCycleId })
      .orderBy('i.seq_no', 'DESC')
      .offset(skip)
      .limit(limit)
      .getManyAndCount();
  }

  async createOne(data: Partial<Issue>, user: User): Promise<Issue> {
    const queryRunner = this.pSql.connection.createQueryRunner();

    try {
      await queryRunner.connect();

      await queryRunner.startTransaction();

      const [farmingCycle, issueNumbering] = await Promise.all([
        queryRunner.manager.findOneOrFail(FarmingCycle, {
          where: {
            id: data.farmingCycleId,
          },
          relations: {
            farm: {
              owner: true,
            },
          },
          relationLoadStrategy: 'join',
        }),
        queryRunner.manager.findOneOrFail(AutoNumbering, {
          where: {
            transactionType: AUTO_NUMBERING_TRX_TYPE.ISSUE,
          },
        }),
      ]);

      const now = utcToZonedTime(new Date(), DEFAULT_TIME_ZONE);

      const issue = queryRunner.manager.create(Issue, {
        id: randomHexString(),
        code: generateIssueNumber(
          issueNumbering.lastNumber,
          issueNumbering.digitCount,
          issueNumbering.prefix,
          farmingCycle.farm.owner.userCode,
        ),
        farmingCycleId: data.farmingCycleId,
        farmingCycleAlertId: data.farmingCycleAlertId,
        status: true,
        issueStatus: IssueStatusEnum.NEW,
        otherIssue: !data.farmingCycleAlertId,
        date: formatTZ(new Date(), DATE_SQL_FORMAT, { timeZone: DEFAULT_TIME_ZONE }),
        description: data.description,
        createdBy: user.fullName,
        createdDate: now,
        modifiedBy: user.fullName,
        modifiedDate: now,
      });

      await queryRunner.manager.save(Issue, issue);

      await queryRunner.manager.update(AutoNumbering, issueNumbering.id, {
        lastNumber: () => 'last_number + 1',
      });

      await queryRunner.commitTransaction();

      return issue;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
