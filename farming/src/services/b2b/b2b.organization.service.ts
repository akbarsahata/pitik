import { Inject, Service } from 'fastify-decorators';
import { ILike } from 'typeorm';
import { B2BOrganizationDAO } from '../../dao/b2b/b2b.organization.dao';
import { B2BOrganization } from '../../datasources/entity/pgsql/b2b/B2BOrganization.entity';
import { GetB2BOrganizationQuery } from '../../dto/b2b/b2b.organization.dto';

@Service()
export class B2BOrganizationService {
  @Inject(B2BOrganizationDAO)
  private dao!: B2BOrganizationDAO;

  async get(filter: GetB2BOrganizationQuery): Promise<[B2BOrganization[], number]> {
    const limit = (filter.$limit && filter.$limit > 0 && filter.$limit) || undefined;

    const skip =
      limit && filter.$page !== undefined && filter.$page > 0 ? (filter.$page - 1) * limit : 0;

    const [result, count] = await this.dao.getMany({
      where: {
        name: filter.name && ILike(`%${filter.name}`),
        code: filter.code,
      },
      order: {
        createdDate: 'DESC',
      },
      skip,
      take: limit,
    });

    return [result, count];
  }
}
