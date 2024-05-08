import { Inject, Service } from 'fastify-decorators';
import { OrderIssueCategoryDAO } from '../../dao/sales/orderIssueCategory.dao';
import { SalesOrderIssueCategory } from '../../datasources/entity/pgsql/sales/OrderIssueCategory.entity';

@Service()
export class OrderIssueCategoryService {
  @Inject(OrderIssueCategoryDAO)
  private dao: OrderIssueCategoryDAO;

  async categories(): Promise<[SalesOrderIssueCategory[], number]> {
    const results = await this.dao.getMany({});

    return results;
  }
}
