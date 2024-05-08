import { Inject, Service } from 'fastify-decorators';
import { Like } from 'typeorm';
import { generateApiName } from '../libs/utils/helpers';
import { Api } from '../datasources/entity/pgsql/Api.entity';
import { ApiDAO } from '../dao/api.dao';
import {
  CreateApiItemResponse,
  CreateApiRequestBody,
  DeleteApiItemResponse,
  GetApiResponse,
  GetApisQuery,
  UpdateApiBody,
  UpdateApiItemResponse,
} from '../dto/api.dto';
import { RequestUser } from '../libs/types/index.d';
import { RedisConnection } from '../datasources/connection/redis.connection';
import { CACHE_KEY_AUTH_VERIFY } from '../libs/constants';

@Service()
export class ApiService {
  @Inject(ApiDAO)
  private dao!: ApiDAO;

  @Inject(RedisConnection)
  private redisConnection!: RedisConnection;

  async create(input: CreateApiRequestBody, user: RequestUser): Promise<CreateApiItemResponse> {
    const payload: Partial<Api> = {
      ...input,
      name: input.name ? input.name : generateApiName(input.endpoint),
    };

    const api = await this.dao.createOne(payload, user);

    const delCache: string = `${CACHE_KEY_AUTH_VERIFY.API}:${api.method}:${api.endpoint}`;

    await this.redisConnection.connection.del(delCache);

    return {
      id: api.id,
      groupName: api.groupName,
      name: api.name,
      endpoint: api.endpoint,
      method: api.method,
      createdBy: api.createdBy,
      createdDate: api.createdDate.toISOString(),
    };
  }

  async getMany(filter: GetApisQuery): Promise<[GetApiResponse[], number]> {
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;

    const [apis, count] = await this.dao.getMany({
      where: {
        name: filter.name ? Like(`%${filter.name}%`) : undefined,
      },
      take: (filter.$limit !== 0 && limit) || undefined,
      skip,
      order: {
        createdDate: 'DESC',
      },
    });

    return [
      apis.map<GetApiResponse>((api) => ({
        id: api.id,
        groupName: api.groupName,
        name: api.name,
        endpoint: api.endpoint,
        method: api.method,
        createdBy: api.createdBy,
        createdDate: api.createdDate?.toISOString(),
        modifiedBy: api.modifiedBy,
        modifiedDate: api.modifiedDate?.toISOString() || '',
      })),
      count,
    ];
  }

  async getById(apiId: string): Promise<GetApiResponse> {
    const api = await this.dao.getOneStrict({
      where: {
        id: apiId,
      },
      relations: {
        roleAcl: true,
      },
    });

    return {
      id: api.id,
      groupName: api.groupName,
      name: api.name,
      endpoint: api.endpoint,
      method: api.method,
      createdBy: api.createdBy,
      createdDate: api.createdDate?.toISOString(),
      modifiedBy: api.modifiedBy,
      modifiedDate: api.modifiedDate?.toISOString() || '',
    };
  }

  async update(
    user: RequestUser,
    input: UpdateApiBody,
    roleId?: string,
  ): Promise<UpdateApiItemResponse> {
    const upsertedRole = await this.dao.upsertOne(user, {
      ...input,
      id: roleId,
    });

    const updatedApi = await this.getById(upsertedRole.id);

    const delCache: string = `${CACHE_KEY_AUTH_VERIFY.API}:${updatedApi.method}:${updatedApi.endpoint}`;

    await this.redisConnection.connection.del(delCache);

    return {
      id: updatedApi.id,
      groupName: updatedApi.groupName,
      name: updatedApi.name,
      endpoint: updatedApi.endpoint,
      method: updatedApi.method,
      createdBy: updatedApi.createdBy,
      createdDate: updatedApi.createdDate,
      modifiedBy: updatedApi.modifiedBy || '',
      modifiedDate: updatedApi.modifiedDate || '',
    };
  }

  async delete(apiId: string): Promise<DeleteApiItemResponse> {
    const api = await this.dao.getOneStrict({
      where: {
        id: apiId,
      },
    });

    const delCache: string = `${CACHE_KEY_AUTH_VERIFY.API}:${api.method}:${api.endpoint}`;

    await this.redisConnection.connection.del(delCache);

    await this.dao.deleteOne({ id: apiId });

    return {
      id: api.id,
      groupName: api.groupName,
      name: api.name,
    };
  }
}
