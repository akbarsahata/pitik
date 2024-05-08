import { differenceInCalendarDays, startOfDay } from 'date-fns';
import { format as formatTZ } from 'date-fns-tz';
import { Inject, Service } from 'fastify-decorators';
import { FarmingCycleAlertDDAO } from '../dao/farmingCycleAlertD.dao';
import { IssueDAO } from '../dao/issue.dao';
import { IssuePhotoDDAO } from '../dao/issuePhotoD.dao';
import { UserDAO } from '../dao/user.dao';
import { CreateIssueBody, IssueItem, IssuePhoto, IssueTypeItem } from '../dto/issue.dto';
import { IssueCreatedQueue } from '../jobs/queues/issue-created.queue';
import { DATE_SQL_FORMAT, DEFAULT_TIME_ZONE } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';

@Service()
export class IssueService {
  @Inject(IssueDAO)
  private dao!: IssueDAO;

  @Inject(IssuePhotoDDAO)
  private issuePhotoDDAO: IssuePhotoDDAO;

  @Inject(FarmingCycleAlertDDAO)
  private farmingCycleAlertDDAO!: FarmingCycleAlertDDAO;

  @Inject(UserDAO)
  private userDAO!: UserDAO;

  @Inject(IssueCreatedQueue)
  private issueCreatedQueue: IssueCreatedQueue;

  async getList(
    farmingCycleId: string,
    page: number,
    limit: number,
  ): Promise<[IssueItem[], number]> {
    const [list, count] = await this.dao.getListAndCount(farmingCycleId, (page - 1) * limit, limit);

    return [
      list.map<IssueItem>((l) => ({
        dayNum: differenceInCalendarDays(
          startOfDay(new Date(l.date)),
          startOfDay(l.farmingCycle.farmingCycleStartDate),
        ),
        date: l.createdDate.toISOString(),
        description: l.description,
        issueTypeId: l.farmingCycleAlert.id,
        issueTypeName: l.farmingCycleAlert.alertName,
        status: l.issueStatus,
        remarks: l.remarks,
        photoValue: l.photos.map<IssuePhoto>((p) => ({
          id: p.id,
          url: p.imageUrl,
        })),
      })),
      count,
    ];
  }

  async getListOfType(farmingCycleId: string): Promise<IssueTypeItem[]> {
    const types = await this.farmingCycleAlertDDAO.getManualTriggerAlerts(farmingCycleId);

    return types.map<IssueTypeItem>((t) => ({
      id: t.id,
      text: t.alertName,
    }));
  }

  async createIssue(data: CreateIssueBody, user: RequestUser): Promise<{ id: string }> {
    const userReporter = await this.userDAO.getOneById(user.id);

    const newIssue = await this.dao.createOne(
      {
        date: formatTZ(new Date(), DATE_SQL_FORMAT, { timeZone: DEFAULT_TIME_ZONE }),
        farmingCycleId: data.farmingCycleId,
        farmingCycleAlertId: data.issueTypeId,
        description: data.description,
      },
      userReporter,
    );

    await this.issueCreatedQueue.addJob(newIssue);

    await this.issuePhotoDDAO.createMany(data.photoValue, newIssue.id, userReporter);

    return {
      id: newIssue.id,
    };
  }
}
