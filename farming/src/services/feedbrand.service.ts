import { Inject, Service } from 'fastify-decorators';
import { ILike } from 'typeorm';
import { FeedbrandDAO } from '../dao/feedbrand.dao';
import { FeedBrand } from '../datasources/entity/pgsql/FeedBrand.entity';
import { GetFeedbrandQuery } from '../dto/feedbrand.dto';

@Service()
export class FeedbrandService {
  @Inject(FeedbrandDAO)
  private feedbrandDAO: FeedbrandDAO;

  async getMany(filter: GetFeedbrandQuery): Promise<[FeedBrand[], number]> {
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;

    return this.feedbrandDAO.getMany({
      where: {
        feedbrandCode: filter.feedbrandCode,
        feedbrandName: filter.feedbrandName ? ILike(`%${filter.feedbrandName}%`) : undefined,
        status: filter.status,
      },
      take: (filter.$limit !== 0 && limit) || undefined,
      skip,
      order: {
        createdDate: 'DESC',
      },
    });
  }
}
