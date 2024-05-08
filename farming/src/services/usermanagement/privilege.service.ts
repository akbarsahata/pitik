import { Inject, Service } from 'fastify-decorators';
import { PrivilegeDAO } from '../../dao/usermanagement/privilege.dao';
import { RedisConnection } from '../../datasources/connection/redis.connection';
import {
  CreatePrivilegeItemResponse,
  CreatePrivilegeRequestBody,
  GetPrivilegeResponse,
  GetPrivilegesQuery,
  UpdatePrivilegeBody,
  UpdatePrivilegeItemResponse,
} from '../../dto/usermanagement/privilege.dto';
import { CACHE_KEY_AUTH_VERIFY } from '../../libs/constants/userManagement';
import { RequestUser } from '../../libs/types/index.d';

@Service()
export class PrivilegeService {
  @Inject(PrivilegeDAO)
  private dao!: PrivilegeDAO;

  @Inject(RedisConnection)
  private redisConnection!: RedisConnection;

  async create(
    input: CreatePrivilegeRequestBody,
    user: RequestUser,
  ): Promise<CreatePrivilegeItemResponse> {
    const privilege = await this.dao.createOne(input, user);

    return {
      userId: privilege.userId,
      apiId: privilege.apiId,
      expirationDate: privilege.expirationDate,
      createdBy: privilege.createdBy,
      createdDate: privilege.createdDate.toISOString(),
    };
  }

  async getMany(filter: GetPrivilegesQuery): Promise<[GetPrivilegeResponse[], number]> {
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;

    const [privileges, count] = await this.dao.getMany({
      where: {
        userId: filter.userId ? filter.userId : undefined,
        apiId: filter.apiId ? filter.apiId : undefined,
      },
      take: (filter.$limit !== 0 && limit) || undefined,
      skip,
      order: {
        createdDate: 'DESC',
      },
    });

    return [
      privileges.map<GetPrivilegeResponse>((privilege) => ({
        id: privilege.id,
        userId: privilege.userId,
        apiId: privilege.apiId,
        expirationDate: privilege.expirationDate,
        createdBy: privilege.createdBy,
        createdDate: privilege.createdDate?.toISOString(),
        modifiedBy: privilege.modifiedBy,
        modifiedDate: privilege.modifiedDate?.toISOString() || '',
      })),
      count,
    ];
  }

  async getById(privilegeId: string): Promise<GetPrivilegeResponse> {
    const privilege = await this.dao.getOneStrict({
      where: {
        id: privilegeId,
      },
    });

    return {
      id: privilege.id,
      userId: privilege.userId,
      apiId: privilege.apiId,
      expirationDate: privilege.expirationDate,
      createdBy: privilege.createdBy,
      createdDate: privilege.createdDate?.toISOString(),
      modifiedBy: privilege.modifiedBy,
      modifiedDate: privilege.modifiedDate?.toISOString() || '',
    };
  }

  async update(
    user: RequestUser,
    input: UpdatePrivilegeBody,
    privilegeId?: string,
  ): Promise<UpdatePrivilegeItemResponse> {
    const upsertedPrivilege = await this.dao.upsertOne(user, {
      ...input,
      id: privilegeId,
    });

    const updatedPrivilege = await this.getById(upsertedPrivilege.id);

    const delCache: string = `${CACHE_KEY_AUTH_VERIFY.PRIVILEGE}:${updatedPrivilege.apiId}:${updatedPrivilege.userId}`;

    await this.redisConnection.connection.del(delCache);

    return {
      id: updatedPrivilege.id,
      userId: updatedPrivilege.userId,
      apiId: updatedPrivilege.apiId,
      expirationDate: updatedPrivilege.expirationDate,
      createdBy: updatedPrivilege.createdBy,
      createdDate: updatedPrivilege.createdDate,
      modifiedBy: updatedPrivilege.modifiedBy || '',
      modifiedDate: updatedPrivilege.modifiedDate || '',
    };
  }
}
