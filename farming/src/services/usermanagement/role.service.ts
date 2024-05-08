import { Inject, Service } from 'fastify-decorators';
import { FindManyOptions, Like } from 'typeorm';
import { RoleDAO } from '../../dao/usermanagement/role.dao';
import {
  CreateRoleItemResponse,
  CreateRoleRequestBody,
  DeleteRoleItemResponse,
  GetRoleResponse,
  GetRolesQuery,
  UpdateRoleBody,
  UpdateRoleItemResponse,
} from '../../dto/usermanagement/role.dto';
import { RequestUser } from '../../libs/types/index.d';

@Service()
export class RoleService {
  @Inject(RoleDAO)
  private dao!: RoleDAO;

  async create(input: CreateRoleRequestBody, user: RequestUser): Promise<CreateRoleItemResponse> {
    const role = await this.dao.createOne(input, user);

    return {
      id: role.id,
      name: role.name,
      createdBy: role.createdBy,
      createdDate: role.createdDate.toISOString(),
    };
  }

  async getMany(filter: GetRolesQuery): Promise<[GetRoleResponse[], number]> {
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;

    const query: FindManyOptions = {
      where: {
        name: filter.name ? Like(`%${filter.name}%`) : undefined,
      },
      relations: {
        roleRank: true,
      },
      take: (filter.$limit !== 0 && limit) || undefined,
      skip,
      order: {
        createdDate: 'DESC',
      },
    };

    if (filter.context) {
      query.where = { ...query.where, roleRank: { context: filter.context } };
      query.order = { roleRank: { rank: 'ASC' }, ...query.order };
    }

    const [roles, count] = await this.dao.getMany(query);

    return [
      roles.map<GetRoleResponse>((role) => ({
        id: role.id,
        name: role.name,
        roleRanks: role.roleRank.length > 0 ? role.roleRank[0] : undefined,
        createdBy: role.createdBy,
        createdDate: role.createdDate?.toISOString(),
        modifiedBy: role.modifiedBy,
        modifiedDate: role.modifiedDate?.toISOString() || '',
      })),
      count,
    ];
  }

  async getById(roleId: string): Promise<GetRoleResponse> {
    const role = await this.dao.getOneStrict({
      where: {
        id: roleId,
      },
      order: {
        createdDate: 'DESC',
      },
      select: {
        id: true,
        name: true,
        createdBy: true,
        createdDate: true,
        modifiedBy: true,
        modifiedDate: true,
        roleAcl: {
          id: true,
          api: {
            name: true,
            endpoint: true,
            method: true,
          },
        },
      },
      relations: {
        roleAcl: {
          api: true,
        },
      },
      relationLoadStrategy: 'join',
    });

    return {
      id: role.id,
      name: role.name,
      createdBy: role.createdBy,
      createdDate: role.createdDate?.toISOString(),
      modifiedBy: role.modifiedBy,
      modifiedDate: role.modifiedDate?.toISOString() || '',
      roleAcl: role.roleAcl,
    };
  }

  async update(
    user: RequestUser,
    input: UpdateRoleBody,
    roleId?: string,
  ): Promise<UpdateRoleItemResponse> {
    const upsertedRole = await this.dao.upsertOne(user, {
      ...input,
      id: roleId,
    });

    const updatedRole = await this.getById(upsertedRole.id);

    return {
      id: updatedRole.id,
      name: updatedRole.name,
      createdBy: updatedRole.createdBy,
      createdDate: updatedRole.createdDate,
      modifiedBy: updatedRole.modifiedBy || '',
      modifiedDate: updatedRole.modifiedDate || '',
      roleAcl: updatedRole.roleAcl,
    };
  }

  async delete(roleId: string): Promise<DeleteRoleItemResponse> {
    const role = await this.dao.getOneStrict({
      where: {
        id: roleId,
      },
    });

    await this.dao.deleteOne({ id: roleId });

    return {
      id: role.id,
      name: role.name,
    };
  }
}
