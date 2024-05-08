import { Controller, GET, Inject } from 'fastify-decorators';
import {
  GetOrderIssueCategoriesResponse,
  getOrderIssueCategoriesResponseDTO,
} from '../../../dto/sales/orderIssueCategory.dto';
import { OrderIssueCategoryService } from '../../../services/sales/orderIssueCategory.sales.service';

@Controller({
  route: '/sales/order-issue-categories',
  type: 0,
  tags: [{ name: 'sales-order-issue-categories' }],
})
export class OrderIssueCategoryController {
  @Inject(OrderIssueCategoryService)
  service: OrderIssueCategoryService;

  @GET({
    url: '/',
    options: {
      schema: {
        response: {
          200: getOrderIssueCategoriesResponseDTO,
        },
      },
    },
  })
  async categories(): Promise<GetOrderIssueCategoriesResponse> {
    const [orderIssueCategories, count] = await this.service.categories();

    return {
      code: 200,
      count,
      data: orderIssueCategories,
    };
  }
}
