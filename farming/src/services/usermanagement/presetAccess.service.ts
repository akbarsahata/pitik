import { randomUUID } from 'crypto';
import { Inject, Service } from 'fastify-decorators';
import { PresetAccessDAO } from '../../dao/usermanagement/presetAccess.dao';
import { PresetAccessDDAO } from '../../dao/usermanagement/presetAccessD.dao';
import { PrivilegeDAO } from '../../dao/usermanagement/privilege.dao';
import { RoleAclDAO } from '../../dao/usermanagement/roleAcl.dao';
import { PresetAccessD } from '../../datasources/entity/pgsql/usermanagement/PresetAccessD.entity';
import { Privilege } from '../../datasources/entity/pgsql/usermanagement/Privilege.entity';
import { RoleAcl } from '../../datasources/entity/pgsql/usermanagement/RoleAcl.entity';
import {
  ApplyPresetAccessItemResponse,
  ApplyPresetAccessRequestBody,
  CreatePresetAccessItemResponse,
  CreatePresetAccessRequestBody,
  GetPresetAccessResponse,
  GetPresetAccesssQuery,
  UpdatePresetAccessBody,
  UpdatePresetAccessItemResponse,
} from '../../dto/usermanagement/presetAcccess.dto';
import { ERR_BAD_REQUEST, ERR_RECORD_NOT_FOUND } from '../../libs/constants/errors';
import { PRESET_TYPE_ENUM } from '../../libs/enums/userManagement.enum';
import { RequestUser } from '../../libs/types/index.d';

@Service()
export class PresetAccessService {
  @Inject(PresetAccessDAO)
  private dao!: PresetAccessDAO;

  @Inject(PresetAccessDDAO)
  private presetAccessDDAO!: PresetAccessDDAO;

  @Inject(RoleAclDAO)
  private roleAclDAO!: RoleAclDAO;

  @Inject(PrivilegeDAO)
  private privilageDAO!: PrivilegeDAO;

  async create(
    input: CreatePresetAccessRequestBody,
    user: RequestUser,
  ): Promise<CreatePresetAccessItemResponse> {
    const presetAccess = await this.dao.createOne(input, user);

    if (input.presetAccessD?.length > 0) {
      const payloadPresetAccessD: Partial<PresetAccessD>[] = [];

      input.presetAccessD.forEach((elm) => {
        const payload = {
          id: randomUUID(),
          presetId: presetAccess.id,
          apiId: elm.apiId,
        };
        payloadPresetAccessD.push(payload);
      });

      await this.presetAccessDDAO.createMany(payloadPresetAccessD, user);
    }

    return {
      presetName: presetAccess.presetName,
      presetType: presetAccess.presetType,
      presetAccessD: presetAccess.presetAccessD,
      createdBy: presetAccess.createdBy,
      createdDate: presetAccess.createdDate.toISOString(),
    };
  }

  async getMany(filter: GetPresetAccesssQuery): Promise<[GetPresetAccessResponse[], number]> {
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;

    const [presetAccesses, count] = await this.dao.getMany({
      where: {
        presetName: filter.presetName ? filter.presetName : undefined,
        presetType: filter.presetType ? filter.presetType : undefined,
      },
      relations: {
        presetAccessD: true,
      },
      take: (filter.$limit !== 0 && limit) || undefined,
      skip,
      order: {
        createdDate: 'DESC',
      },
    });

    return [
      presetAccesses.map<GetPresetAccessResponse>((presetAccess) => ({
        id: presetAccess.id,
        presetName: presetAccess.presetName,
        presetType: presetAccess.presetType,
        presetAccessD: presetAccess.presetAccessD,
        createdBy: presetAccess.createdBy,
        createdDate: presetAccess.createdDate?.toISOString(),
        modifiedBy: presetAccess.modifiedBy,
        modifiedDate: presetAccess.modifiedDate?.toISOString() || '',
      })),
      count,
    ];
  }

  async getById(presetAccessId: string): Promise<GetPresetAccessResponse> {
    const presetAccess = await this.dao.getOneStrict({
      where: {
        id: presetAccessId,
      },
      relations: {
        presetAccessD: true,
      },
      relationLoadStrategy: 'join',
    });

    return {
      id: presetAccess.id,
      presetName: presetAccess.presetName,
      presetType: presetAccess.presetType,
      presetAccessD: presetAccess.presetAccessD,
      createdBy: presetAccess.createdBy,
      createdDate: presetAccess.createdDate?.toISOString(),
      modifiedBy: presetAccess.modifiedBy,
      modifiedDate: presetAccess.modifiedDate?.toISOString() || '',
    };
  }

  async update(
    user: RequestUser,
    input: UpdatePresetAccessBody,
    presetAccessId?: string,
  ): Promise<UpdatePresetAccessItemResponse> {
    const upsertedPresetAccess = await this.dao.upsertOne(user, {
      ...input,
      id: presetAccessId,
    });

    const updatedPresetAccess = await this.getById(upsertedPresetAccess.id);

    return {
      id: updatedPresetAccess.id,
      presetName: updatedPresetAccess.presetName,
      presetType: updatedPresetAccess.presetType,
      presetAccessD: updatedPresetAccess.presetAccessD,
      createdBy: updatedPresetAccess.createdBy,
      createdDate: updatedPresetAccess.createdDate,
      modifiedBy: updatedPresetAccess.modifiedBy || '',
      modifiedDate: updatedPresetAccess.modifiedDate || '',
    };
  }

  async applyPresetAccess(
    presetAccessId: string,
    input: ApplyPresetAccessRequestBody,
    requester: RequestUser,
  ): Promise<ApplyPresetAccessItemResponse> {
    const [presetAccessD, count] = await this.presetAccessDDAO.getMany({
      where: {
        presetId: presetAccessId,
      },
    });

    if (count === 0) throw ERR_RECORD_NOT_FOUND(': this presets dont have access data');

    if (input.presetType === PRESET_TYPE_ENUM.ROLE) {
      const roleAclPayloads: Partial<RoleAcl>[] = [];

      presetAccessD.forEach((presetAccess) => {
        const payload: Partial<RoleAcl> = {
          id: randomUUID(),
          apiId: presetAccess.apiId,
          roleId: input.roleId,
          createdBy: requester.id,
        };
        roleAclPayloads.push(payload);
      });

      await this.roleAclDAO.upsertMany(requester, roleAclPayloads);
    } else if (input.presetType === PRESET_TYPE_ENUM.PRIVILEGE) {
      const privilegePayloads: Partial<Privilege>[] = [];

      presetAccessD.forEach((presetAccess) => {
        const payload: Partial<Privilege> = {
          id: randomUUID(),
          userId: input.userId,
          apiId: presetAccess.apiId,
          expirationDate: input.expirationDate
            ? new Date(input.expirationDate).toISOString()
            : undefined,
          createdBy: requester.id,
        };
        privilegePayloads.push(payload);
      });

      await this.privilageDAO.upsertMany(requester, privilegePayloads);
    } else {
      throw ERR_BAD_REQUEST(': invalid preset type');
    }

    return {
      success: true,
      message: `Preset Access Has Been Applied to The ${
        input.presetType === PRESET_TYPE_ENUM.PRIVILEGE ? 'User' : 'Role'
      }`,
    };
  }
}
