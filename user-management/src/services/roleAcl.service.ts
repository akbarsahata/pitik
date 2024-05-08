import { Inject, Service } from 'fastify-decorators';
import { ApiDAO } from '../dao/api.dao';
import { RoleAclDAO } from '../dao/roleAcl.dao';
import { RedisConnection } from '../datasources/connection/redis.connection';
import {
  CreateRoleAclItemResponse,
  CreateRoleAclRequestBody,
  DeleteRoleAclItemResponse,
  GetRoleAclResponse,
  GetRoleAclValidateQuery,
  GetRoleAclsQuery,
  UpdateRoleAclBody,
  UpdateRoleAclItemResponse,
} from '../dto/roleAcl.dto';
import { CACHE_KEY_AUTH_VERIFY } from '../libs/constants';
import { RequestUser } from '../libs/types/index.d';

@Service()
export class RoleAclService {
  @Inject(RoleAclDAO)
  private roleAclDAO!: RoleAclDAO;

  @Inject(ApiDAO)
  private apiDAO!: ApiDAO;

  @Inject(RedisConnection)
  private redisConnection: RedisConnection;

  async create(
    input: CreateRoleAclRequestBody,
    user: RequestUser,
  ): Promise<CreateRoleAclItemResponse> {
    const roleAcl = await this.roleAclDAO.createOne(input, user);

    const delCache: string = `${CACHE_KEY_AUTH_VERIFY.ROLE_ACL}:${roleAcl.apiId}:*`;

    const keys = await this.redisConnection.connection.keys(delCache);

    await Promise.all(keys.map(async (key) => this.redisConnection.connection.del(key)));

    return {
      id: roleAcl.id,
      roleId: roleAcl.roleId,
      apiId: roleAcl.apiId,
      createdBy: roleAcl.createdBy,
      createdDate: roleAcl.createdDate.toISOString(),
    };
  }

  async getMany(filter: GetRoleAclsQuery): Promise<[GetRoleAclResponse[], number]> {
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;

    const [roleAcls, count] = await this.roleAclDAO.getMany({
      where: {
        roleId: filter.roleId ? filter.roleId : undefined,
        apiId: filter.apiId ? filter.apiId : undefined,
      },
      take: (filter.$limit !== 0 && limit) || undefined,
      skip,
      order: {
        createdDate: 'DESC',
      },
    });

    return [
      roleAcls.map<GetRoleAclResponse>((roleAcl) => ({
        id: roleAcl.id,
        roleId: roleAcl.roleId,
        apiId: roleAcl.apiId,
        createdBy: roleAcl.createdBy,
        createdDate: roleAcl.createdDate?.toISOString(),
        modifiedBy: roleAcl.modifiedBy,
        modifiedDate: roleAcl.modifiedDate?.toISOString() || '',
      })),
      count,
    ];
  }

  async getById(roleAclId: string): Promise<GetRoleAclResponse> {
    const roleAcl = await this.roleAclDAO.getOneStrict({
      where: {
        id: roleAclId,
      },
    });

    return {
      id: roleAcl.id,
      roleId: roleAcl.roleId,
      apiId: roleAcl.apiId,
      createdBy: roleAcl.createdBy,
      createdDate: roleAcl.createdDate?.toISOString(),
      modifiedBy: roleAcl.modifiedBy,
      modifiedDate: roleAcl.modifiedDate?.toISOString() || '',
    };
  }

  async getRoleAclValidate(input: GetRoleAclValidateQuery, user: RequestUser): Promise<boolean> {
    const apis = await this.apiDAO.getOne({
      where: {
        name: input.name,
        method: input.method,
      },
    });

    if (!apis) return false;

    const roleAcls = await this.roleAclDAO.getOne({
      where: {
        apiId: apis.id,
        roleId: user.role,
      },
    });

    return !!roleAcls;
  }

  async update(
    user: RequestUser,
    input: UpdateRoleAclBody,
    roleAclId?: string,
  ): Promise<UpdateRoleAclItemResponse> {
    const upsertedRoleAcl = await this.roleAclDAO.upsertOne(user, {
      ...input,
      id: roleAclId,
    });

    const updatedRoleAcl = await this.getById(upsertedRoleAcl.id);

    const delCache: string = `${CACHE_KEY_AUTH_VERIFY.ROLE_ACL}:${updatedRoleAcl.apiId}:*`;

    const keys = await this.redisConnection.connection.keys(delCache);

    await Promise.all(
      keys.map(async (key) => {
        await this.redisConnection.connection.del(key);
      }),
    );

    return {
      id: updatedRoleAcl.id,
      roleId: updatedRoleAcl.roleId,
      apiId: updatedRoleAcl.apiId,
      createdBy: updatedRoleAcl.createdBy,
      createdDate: updatedRoleAcl.createdDate,
      modifiedBy: updatedRoleAcl.modifiedBy || '',
      modifiedDate: updatedRoleAcl.modifiedDate || '',
    };
  }

  async delete(roleAclId: string): Promise<DeleteRoleAclItemResponse> {
    const roleAcl = await this.roleAclDAO.getOneStrict({
      where: {
        id: roleAclId,
      },
    });

    const delCache: string = `${CACHE_KEY_AUTH_VERIFY.ROLE_ACL}:${roleAcl.apiId}:*`;

    const keys = await this.redisConnection.connection.keys(delCache);

    await Promise.all(
      keys.map(async (key) => {
        await this.redisConnection.connection.del(key);
      }),
    );

    await this.roleAclDAO.deleteOne({ id: roleAclId });

    return {
      id: roleAcl.id,
      roleId: roleAcl.roleId,
      apiId: roleAcl.apiId,
    };
  }
}
