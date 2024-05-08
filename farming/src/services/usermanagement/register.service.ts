import { Inject, Service } from 'fastify-decorators';
import { QueryRunner } from 'typeorm';
import { RoleDAO } from '../../dao/usermanagement/role.dao';
import { UserCoreDAO } from '../../dao/usermanagement/userCore.dao';
import { UserRoleDAO } from '../../dao/usermanagement/userRole.dao';
import { UserSupervisorDAO } from '../../dao/usermanagement/userSupervisor.dao';
import { User } from '../../datasources/entity/pgsql/usermanagement/User.entity';
import {
  RegisterUserItemResponse,
  RegisterUserRequestBody,
} from '../../dto/usermanagement/register.dto';
import { ROLE_RANK_CONTEXT } from '../../libs/constants';
import {
  determinePrimaryRole,
  generateHashedPassword,
} from '../../libs/utils/userManagementHelper';

/**
 * TODO: This service is used only to unblock farming integration
 * Please remove once userManagement.dao.ts in farming is updated
 */
@Service()
export class RegisterService {
  @Inject(RoleDAO)
  private roleDAO!: RoleDAO;

  @Inject(UserSupervisorDAO)
  private userSupervisorDAO!: UserSupervisorDAO;

  @Inject(UserCoreDAO)
  private dao!: UserCoreDAO;

  @Inject(UserRoleDAO)
  private userRoleDAO: UserRoleDAO;

  async register(
    input: RegisterUserRequestBody,
    queryRunner?: QueryRunner,
  ): Promise<RegisterUserItemResponse> {
    const payload: Partial<User> = {
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      password: await generateHashedPassword(input.password),
      status: input.status,
      lang: input.lang || 'in',
      acceptTnc: 0,
      parentId: input.parentId,
      roleId: input.roleId,
      additional: input.additional,
      organizationId: input.organizationId || undefined,
    };

    // legacy client only sending parentId without supervisors
    if (payload.parentId) {
      input.supervisors?.push({
        context: ROLE_RANK_CONTEXT.internal,
        supervisorId: payload.parentId,
      });
    }

    // support legacy data, user.parentId is supervisor in internal context
    const internalSupervisor = input.supervisors?.find(
      (val) => val.context === ROLE_RANK_CONTEXT.internal,
    )?.supervisorId;
    if (!payload.parentId && internalSupervisor) {
      payload.parentId = internalSupervisor;
    }

    if (input.roleId) input.roleIds?.push(input.roleId);

    if (!input.roleId && input.role) {
      // Special case for self-registration (OWNER, AK & KK)
      const userRole = await this.roleDAO.getOneStrict({
        where: {
          name: input.role,
        },
      });
      payload.roleId = userRole.id;
      input.roleIds?.push(userRole.id);
    }

    const userCreatorInfo = { id: 'system', role: 'system' };
    if (input.createdBy) {
      const userCreator = await this.dao.getUserByIdCms(input.createdBy);
      userCreatorInfo.id = userCreator.id;
      userCreatorInfo.role = userCreator.roleId;
    }

    const qr = queryRunner || (await this.dao.startTransaction());
    try {
      let user = await this.dao.upsertOne(
        userCreatorInfo,
        {
          ...payload,
          email: payload.email?.toLowerCase(),
          roleId:
            payload.roleId ||
            (input.roleIds && input.roleIds.length > 0 && input.roleIds[0]) ||
            undefined,
        },
        {
          qr,
        },
      );

      const roleIds = [];
      if (input.roleIds && input.roleIds.length > 0) {
        const userRoles = await this.userRoleDAO.upsertMany(
          userCreatorInfo,
          input.roleIds
            ?.filter((roleId, idx, arr) => arr.indexOf(roleId) === idx)
            .map((roleId) => ({
              roleId,
              userId: user.id,
            })) || [],
          {
            qr,
          },
        );
        roleIds.push(...userRoles.map((ur) => ur.roleId));

        user = await this.dao.upsertOne(
          userCreatorInfo,
          {
            ...user,
            roleId: determinePrimaryRole(userRoles.map((ur) => ur.role)).id,
          },
          { qr },
        );
      }

      if (input.supervisors && input.supervisors.length > 0) {
        await this.userSupervisorDAO.deleteManyWithTx(
          {
            subordinateId: user.id,
          },
          qr,
        );

        await this.userSupervisorDAO.upsertMany(
          userCreatorInfo,
          input.supervisors.map((spv) => ({
            ...spv,
            subordinateId: user.id,
          })),
          {
            qr,
          },
        );
      }

      user = await this.dao.getOneWithTx(
        {
          where: { id: user.id },
          relations: {
            role: true,
          },
        },
        qr,
      );

      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        status: user.status,
        lang: user.lang,
        role: user.role.name,
        roleId: user.roleId,
        roleIds,
        organizationId: user.organizationId,
        createdDate: user.createdDate.toISOString(),
        createdBy: user.createdBy,
      };
    } catch (error) {
      await this.dao.rollbackTransaction(qr);
      throw error;
    }
  }
}
