import { Inject, Service } from 'fastify-decorators';
import { RoleRankDAO } from '../../dao/usermanagement/roleRank.dao';
import {
  CreateRoleRankItemResponse,
  CreateRoleRankRequestBody,
  GetRoleRankResponse,
  GetRoleRanksQuery,
  UpdateRoleRankBody,
  UpdateRoleRankItemResponse,
} from '../../dto/usermanagement/roleRank.dto';
import { RequestUser } from '../../libs/types/index.d';

@Service()
export class RoleRankService {
  @Inject(RoleRankDAO)
  private dao!: RoleRankDAO;

  async create(
    input: CreateRoleRankRequestBody,
    user: RequestUser,
  ): Promise<CreateRoleRankItemResponse> {
    const roleRank = await this.dao.createOne(input, user);

    return {
      id: roleRank.id,
      rank: roleRank.rank,
      context: roleRank.context,
      roleId: roleRank.roleId,
      createdBy: roleRank.createdBy,
      createdDate: roleRank.createdDate.toISOString(),
    };
  }

  async getMany(filter: GetRoleRanksQuery): Promise<[GetRoleRankResponse[], number]> {
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;

    const [roleRanks, count] = await this.dao.getMany({
      where: {
        rank: filter.rank ? filter.rank : undefined,
        context: filter.context ? filter.context : undefined,
      },
      take: (filter.$limit !== 0 && limit) || undefined,
      skip,
      order: {
        createdDate: 'DESC',
      },
    });

    return [
      roleRanks.map<GetRoleRankResponse>((roleRank) => ({
        id: roleRank.id,
        rank: roleRank.rank,
        context: roleRank.context,
        roleId: roleRank.roleId,
        createdBy: roleRank.createdBy,
        createdDate: roleRank.createdDate?.toISOString(),
        modifiedBy: roleRank.modifiedBy,
        modifiedDate: roleRank.modifiedDate?.toISOString() || '',
      })),
      count,
    ];
  }

  async getById(roleRankId: string): Promise<GetRoleRankResponse> {
    const roleRank = await this.dao.getOneStrict({
      where: {
        id: roleRankId,
      },
    });

    return {
      id: roleRank.id,
      rank: roleRank.rank,
      context: roleRank.context,
      roleId: roleRank.roleId,
      createdBy: roleRank.createdBy,
      createdDate: roleRank.createdDate?.toISOString(),
      modifiedBy: roleRank.modifiedBy,
      modifiedDate: roleRank.modifiedDate?.toISOString() || '',
    };
  }

  async update(
    user: RequestUser,
    input: UpdateRoleRankBody,
    roleRankId?: string,
  ): Promise<UpdateRoleRankItemResponse> {
    const upsertedRoleRank = await this.dao.upsertOne(user, {
      ...input,
      id: roleRankId,
    });

    const updatedRoleRank = await this.getById(upsertedRoleRank.id);

    return {
      id: updatedRoleRank.id,
      rank: updatedRoleRank.rank,
      context: updatedRoleRank.context,
      roleId: updatedRoleRank.roleId,
      createdBy: updatedRoleRank.createdBy,
      createdDate: updatedRoleRank.createdDate,
      modifiedBy: updatedRoleRank.modifiedBy || '',
      modifiedDate: updatedRoleRank.modifiedDate || '',
    };
  }
}
