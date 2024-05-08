import { Service } from 'fastify-decorators';
import { Issue } from '../../datasources/entity/pgsql/Issue.entity';
import { QUEUE_ISSUE_CREATED } from '../../libs/constants/queue';
import { BaseQueue } from './base.queue';

@Service()
export class IssueCreatedQueue extends BaseQueue<Issue> {
  protected queueName = QUEUE_ISSUE_CREATED;
}
