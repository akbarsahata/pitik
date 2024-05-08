import { Inject, Service } from 'fastify-decorators';
import { Like } from 'typeorm';
import { AppDAO } from '../dao/app.dao';
import {
  CreateAppItemResponse,
  CreateAppRequestBody,
  DeleteAppItemResponse,
  GetAppResponse,
  GetAppsQuery,
  UpdateAppBody,
  UpdateAppItemResponse,
} from '../dto/app.dto';
import { RequestUser } from '../libs/types/index.d';

@Service()
export class AppService {
  @Inject(AppDAO)
  private dao!: AppDAO;

  async create(input: CreateAppRequestBody, user: RequestUser): Promise<CreateAppItemResponse> {
    const app = await this.dao.createOne(input, user);

    return {
      id: app.id,
      name: app.name,
      url: app.url,
      logo: app.logo,
      createdBy: app.createdBy,
      createdDate: app.createdDate.toISOString(),
    };
  }

  async getMany(filter: GetAppsQuery): Promise<[GetAppResponse[], number]> {
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;

    const [apps, count] = await this.dao.getMany({
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
      apps.map<GetAppResponse>((app) => ({
        id: app.id,
        name: app.name,
        url: app.url,
        logo: app.logo,
        key: app.key,
        about: app.about,
        createdBy: app.createdBy,
        createdDate: app.createdDate?.toISOString(),
        modifiedBy: app.modifiedBy,
        modifiedDate: app.modifiedDate?.toISOString() || '',
      })),
      count,
    ];
  }

  async getById(appId: string): Promise<GetAppResponse> {
    const app = await this.dao.getOneStrict({
      where: {
        id: appId,
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
      },
    });

    return {
      id: app.id,
      name: app.name,
      url: app.url,
      logo: app.logo,
      key: app.key,
      about: app.about,
      createdBy: app.createdBy,
      createdDate: app.createdDate?.toISOString(),
      modifiedBy: app.modifiedBy,
      modifiedDate: app.modifiedDate?.toISOString() || '',
    };
  }

  async update(
    user: RequestUser,
    input: UpdateAppBody,
    appId?: string,
  ): Promise<UpdateAppItemResponse> {
    const upsertedApp = await this.dao.upsertOne(user, {
      ...input,
      id: appId,
    });

    const updatedApp = await this.getById(upsertedApp.id);

    return {
      id: updatedApp.id,
      name: updatedApp.name,
      url: updatedApp.url,
      logo: updatedApp.logo,
      key: updatedApp.key,
      about: updatedApp.about,
      createdBy: updatedApp.createdBy,
      createdDate: updatedApp.createdDate,
      modifiedBy: updatedApp.modifiedBy || '',
      modifiedDate: updatedApp.modifiedDate || '',
    };
  }

  async delete(appId: string): Promise<DeleteAppItemResponse> {
    const app = await this.dao.getOneStrict({
      where: {
        id: appId,
      },
    });

    await this.dao.deleteOne({ id: appId });

    return {
      id: app.id,
      name: app.name,
    };
  }
}
