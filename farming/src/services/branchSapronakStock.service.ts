import { Inject, Service } from 'fastify-decorators';
import { ILike, Raw } from 'typeorm';
import { BranchSapronakStockDAO } from '../dao/branchSapronakStock.dao';
import {
  GetBranchSapronakStockQuery,
  GetBranchSapronakStockResponseItem,
  GetBranchSapronakStockResponseList,
} from '../dto/branchSapronakStock.dto';
import { generateOrderQuery, omit } from '../libs/utils/helpers';

@Service()
export class BranchSapronakStockService {
  @Inject(BranchSapronakStockDAO)
  private dao!: BranchSapronakStockDAO;

  async getBranchSapronakStock(
    filter: GetBranchSapronakStockQuery,
  ): Promise<[GetBranchSapronakStockResponseList, number]> {
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;
    const order = filter.$order ? generateOrderQuery(filter.$order) : { productName: 'ASC' };
    const [stocks, count] = await this.dao.getMany({
      where: {
        categoryCode: filter.type.toUpperCase(),
        categoryName: filter.type.toUpperCase(),
        ...omit(filter, ['type', '$limit', '$page', '$order']),
        productName:
          filter.productName && filter.productName.length
            ? ILike(`%${filter.productName}%`)
            : undefined,
        quantity: Raw((alias) => `${alias} > booked_quantity`),
      },
      relations: {
        branch: true,
      },
      take: (filter.$limit !== 0 && limit) || undefined,
      skip,
      order,
    });

    const results = stocks.map<GetBranchSapronakStockResponseItem>((s) => ({
      ...s,
      branchName: s.branch.name,
      quantity: s.quantity - s.bookedQuantity,
    }));

    return [results, count];
  }
}
