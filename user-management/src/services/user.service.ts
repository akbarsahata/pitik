import { Inject, Service } from 'fastify-decorators';
import { DeepPartial, In, LessThanOrEqual, Like, Not, Raw } from 'typeorm';
import { RoleDAO } from '../dao/role.dao';
import { RoleRankDAO } from '../dao/roleRank.dao';
import { UserDAO } from '../dao/user.dao';
import { UserRoleDAO } from '../dao/userRole.dao';
import { UserSupervisorDAO } from '../dao/userSupervisor.dao';
import { RedisConnection } from '../datasources/connection/redis.connection';
import { PlatformName } from '../datasources/entity/pgsql/Module.entity';
import { Role } from '../datasources/entity/pgsql/Role.entity';
import { RoleModule } from '../datasources/entity/pgsql/RoleModule.entity';
import { RoleRank } from '../datasources/entity/pgsql/RoleRank.entity';
import { User } from '../datasources/entity/pgsql/User.entity';
import { UserRole } from '../datasources/entity/pgsql/UserRole.entity';
import {
  CreateUserItemResponse,
  CreateUserRequestBody,
  GetSubordinatesQuery,
  GetSubordinatesResponseItem,
  GetUserParams,
  GetUserResponse,
  GetUserSupervisorItemResponse,
  GetUserSupervisorQuery,
  GetUsersQuery,
  PatchUserRequestBody,
  SearchUserIdsQuery,
  SearchUsersBody,
  UpdateUserBody,
  UpdateUserItemResponse,
} from '../dto/user.dto';
import {
  AUTH_ATTEMPT_COUNTER_KEY,
  CACHE_KEY_AUTH_VERIFY,
  MAX_USER_CHAIN_LIST,
  ROLE_ID,
  ROLE_RANK_CONTEXT,
} from '../libs/constants';
import { ERR_BAD_REQUEST, ERR_SELF_SUPERVISOR_EXCEPTION } from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { determinePrimaryRole, generateHashedPassword } from '../libs/utils/helpers';

@Service()
export class UserService {
  @Inject(UserDAO)
  private userDAO!: UserDAO;

  @Inject(RoleDAO)
  private roleDAO!: RoleDAO;

  @Inject(RoleRankDAO)
  private roleRankDAO!: RoleRankDAO;

  @Inject(RedisConnection)
  private redisConnection!: RedisConnection;

  @Inject(UserRoleDAO)
  private userRoleDAO: UserRoleDAO;

  @Inject(UserSupervisorDAO)
  private userSupervisorDAO!: UserSupervisorDAO;

  async register(input: CreateUserRequestBody): Promise<CreateUserItemResponse> {
    const idCmsCreator = input.createdBy as string;

    const userCreator = await this.userDAO.getUserByIdCms(idCmsCreator);

    const creator: RequestUser = {
      id: userCreator.id,
      role: userCreator.roleId,
    };

    return this.create(input, creator);
  }

  async create(
    input: CreateUserRequestBody,
    requestUser: RequestUser,
  ): Promise<CreateUserItemResponse> {
    const payload: Partial<User> = {
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      password: await generateHashedPassword(input.password),
      status: true,
      lang: input.lang || 'id',
      acceptTnc: 0,
      parentId: input.parentId,
      roleId: input.roleId,
      additional: input.additional,
    };

    const qr = await this.userDAO.startTransaction();
    try {
      let user = await this.userDAO.upsertOne(requestUser, payload, {
        qr,
      });

      const userRoles = await this.userRoleDAO.upsertMany(
        requestUser,
        input.roleIds.map((roleId) => ({
          roleId,
          userId: user.id,
        })),
        {
          qr,
        },
      );

      user = await this.userDAO.upsertOne(requestUser, {
        ...user,
        roleId: determinePrimaryRole(userRoles.map((ur) => ur.role)).id,
      });

      await this.userDAO.commitTransaction(qr);

      const roles = userRoles.map((ur) => ur.role);

      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        status: user.status,
        lang: user.lang,
        acceptTnc: user.acceptTnc,
        parentId: user.parentId,
        roleId: determinePrimaryRole(userRoles.map((ur) => ur.role)).id,
        roles,
        createdDate: user.createdDate.toISOString(),
        createdBy: user.createdBy,
      };
    } catch (error) {
      await this.userDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  async getMany(filter: GetUsersQuery): Promise<[GetUserResponse[], number]> {
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;

    const cmsIds =
      (filter.cmsIds && (typeof filter.cmsIds === 'string' ? [filter.cmsIds] : filter.cmsIds)) ||
      [];
    if (filter['additional.id_cms']) {
      cmsIds.push(filter['additional.id_cms']);
    }

    const [users, count] = await this.userDAO.getMany({
      where: {
        fullName: filter.name ? Like(`%${filter.name}%`) : undefined,
        additional:
          (cmsIds.length > 0 &&
            Raw((alias) => `${alias} ->> 'id_cms' IN (:...cmsIds)`, {
              cmsIds,
            })) ||
          undefined,
      },
      relations: {
        role: {
          roleModules: {
            module: true,
          },
        },
        userRoles: {
          role: {
            roleModules: {
              module: true,
            },
          },
        },
        supervisors: true,
      },
      take: (filter.$limit !== 0 && limit) || undefined,
      skip,
      order: {
        createdDate: 'DESC',
      },
    });

    return [
      users.map<GetUserResponse>((user) => {
        const modules = [
          ...user.role.roleModules,
          ...user.userRoles.reduce((prev, item) => {
            prev.push(...item.role.roleModules);
            return prev;
          }, [] as RoleModule[]),
        ];

        const mapPlatformToModule = modules.reduce((prev, item) => {
          const values = prev.get(item.module.platformName) || [];
          values.push(item.module.moduleName);
          prev.set(item.module.platformName, values);
          return prev;
        }, new Map<string, string[]>());

        return {
          id: user.id,
          cmsId: user.additional?.id_cms,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          status: user.status,
          lang: user.lang,
          acceptTnc: user.acceptTnc,
          parentId: user.parentId,
          roleId: user.roleId,
          roles: [user.role, ...user.userRoles.map((ur) => ur.role)].filter(
            (role, idx, arr) => arr.findIndex((val) => val.id === role.id) === idx,
          ),
          supervisors: user.supervisors.map((spv) => spv),
          roleName: user.role.name,
          createdDate: user.createdDate.toISOString(),
          createdBy: user.createdBy,
          modifiedBy: user.modifiedBy,
          modifiedDate: user.modifiedDate?.toISOString() || '',
          modules: {
            downstreamApp: (mapPlatformToModule.get(PlatformName.downstreamApp) || []).filter(
              (val, idx, arr) => arr.indexOf(val) === idx,
            ),
            fms: (mapPlatformToModule.get(PlatformName.fms) || []).filter(
              (val, idx, arr) => arr.indexOf(val) === idx,
            ),
            pplApp: (mapPlatformToModule.get(PlatformName.pplApp) || []).filter(
              (val, idx, arr) => arr.indexOf(val) === idx,
            ),
            ownerApp: (mapPlatformToModule.get(PlatformName.ownerApp) || []).filter(
              (val, idx, arr) => arr.indexOf(val) === idx,
            ),
          },
        };
      }),
      count,
    ];
  }

  async search(filter: SearchUsersBody): Promise<[GetUserResponse[], number]> {
    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;

    const cmsIds =
      (filter.cmsIds && (typeof filter.cmsIds === 'string' ? [filter.cmsIds] : filter.cmsIds)) ||
      [];

    const [users, count] = await this.userDAO.getMany({
      where: {
        additional:
          (cmsIds.length > 0 &&
            Raw((alias) => `${alias} ->> 'id_cms' IN (:...cmsIds)`, {
              cmsIds,
            })) ||
          undefined,
      },
      relations: {
        role: true,
        userRoles: {
          role: true,
        },
      },
      take: (filter.$limit !== 0 && limit) || undefined,
      skip,
      order: {
        createdDate: 'DESC',
      },
    });

    return [
      users.map<GetUserResponse>((user) => ({
        id: user.id,
        cmsId: user.additional?.id_cms,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        status: user.status,
        lang: user.lang,
        acceptTnc: user.acceptTnc,
        parentId: user.parentId,
        roleId: user.roleId,
        roles: [user.role, ...user.userRoles.map((ur) => ur.role)].filter(
          (role, idx, arr) => arr.findIndex((val) => val.id === role.id) === idx,
        ),
        roleName: user.role.name,
        createdDate: user.createdDate.toISOString(),
        createdBy: user.createdBy,
        modifiedBy: user.modifiedBy,
        modifiedDate: user.modifiedDate?.toISOString() || '',
      })),
      count,
    ];
  }

  async searchUserIds(filter: SearchUserIdsQuery): Promise<[string[], number]> {
    let roles: Role[] = [];
    if (filter.roleNames) {
      const roleNames = filter.roleNames.split(',');
      [roles] = await this.roleDAO.getMany({
        where: {
          name: In(roleNames),
        },
      });
    }

    const roleIds = roles.map((role) => role.id);

    if (filter.roleIds) {
      roleIds.push(...filter.roleIds.split(','));
    }

    const [users, count] = await this.userDAO.searchUserIds({
      roleIds,
    });

    return [users.map((user) => user.additional?.id_cms), count];
  }

  async getById(userId: string): Promise<GetUserResponse> {
    const user = await this.userDAO.getOneStrict({
      where: {
        id: userId,
      },
      relations: {
        role: {
          roleRank: true,
          roleModules: {
            module: true,
          },
        },
        userRoles: {
          role: {
            roleRank: true,
            roleModules: {
              module: true,
            },
          },
        },
      },
      relationLoadStrategy: 'join',
    });

    const roles = [...user.userRoles.map((ur) => ur.role), user.role];

    const primaryRole = determinePrimaryRole(roles);

    const modules = [
      ...user.role.roleModules,
      ...user.userRoles.reduce((prev, item) => {
        prev.push(...item.role.roleModules);
        return prev;
      }, [] as RoleModule[]),
    ];

    const mapPlatformToModule = modules.reduce((prev, item) => {
      const values = prev.get(item.module.platformName) || [];
      values.push(item.module.moduleName);
      prev.set(item.module.platformName, values);
      return prev;
    }, new Map<string, string[]>());

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      status: user.status,
      lang: user.lang,
      acceptTnc: user.acceptTnc,
      parentId: user.parentId,
      roleId: user.roleId || primaryRole.id,
      roles,
      roleName: user.role?.name || primaryRole.name,
      createdDate: user.createdDate.toISOString(),
      createdBy: user.createdBy,
      modifiedBy: user.modifiedBy,
      modifiedDate: user.modifiedDate?.toISOString() || '',
      modules: {
        downstreamApp: (mapPlatformToModule.get(PlatformName.downstreamApp) || []).filter(
          (val, idx, arr) => arr.indexOf(val) === idx,
        ),
        fms:
          mapPlatformToModule.get(PlatformName.fms) ||
          [].filter((val, idx, arr) => arr.indexOf(val) === idx),
        pplApp: (mapPlatformToModule.get(PlatformName.pplApp) || []).filter(
          (val, idx, arr) => arr.indexOf(val) === idx,
        ),
        ownerApp: (mapPlatformToModule.get(PlatformName.ownerApp) || []).filter(
          (val, idx, arr) => arr.indexOf(val) === idx,
        ),
      },
    };
  }

  async getUserSupervisor(
    filter: GetUserSupervisorQuery,
  ): Promise<[GetUserSupervisorItemResponse[], number]> {
    if (filter.cms_id) {
      const [members, count] = await this.getUserSupervisorChainList(filter.cms_id);

      return [members, count];
    }

    const limit = filter.$limit && filter.$limit > 0 ? filter.$limit : 10;
    const skip = !filter.$page || filter.$page < 1 ? 0 : (filter.$page - 1) * limit;

    const roleContext = filter.context || ROLE_RANK_CONTEXT.internal;

    const query = {
      where: {
        context: roleContext,
        rank: filter.rank ? filter.rank : filter['rank[$lte]'],
      },
      take: (filter.$limit !== 0 && limit) || undefined,
      skip,
    };

    if (filter['rank[$lte]']) {
      Object.assign(query.where, { rank: LessThanOrEqual(filter['rank[$lte]']) });
    }

    const [roleRank, rankCount] = await this.roleRankDAO.getMany(query);

    if (rankCount === 0) throw ERR_BAD_REQUEST(': invalid request');

    const roleIds = roleRank.map((item) => item.roleId);

    const [users, userCount] = await this.userDAO.getMany({
      where: [
        {
          roleId: In(roleIds),
          status: true,
        },
        {
          status: true,
          userRoles: {
            roleId: In(roleIds),
          },
        },
      ],
      relations: {
        role: true,
        userRoles: {
          role: {
            roleRank: true,
          },
        },
      },
      take: (filter.$limit !== 0 && limit) || undefined,
      skip,
      order: {
        fullName: 'ASC',
      },
    });

    const userSupervisors: GetUserSupervisorItemResponse[] = [];
    users.forEach((elm) => {
      let supervisorRole: Role = elm.role;
      const sortedUserRoles = elm.userRoles.sort((a, b) => {
        const leastRankA = a.role.roleRank.reduce((prev, rr) => {
          if (!rr.rank) return rr;
          if (prev.rank > rr.rank) return prev;
          return rr;
        }, {} as RoleRank);

        const leastRankB = b.role.roleRank.reduce((prev, rr) => {
          if (!rr.rank) return rr;
          if (prev.rank > rr.rank) return prev;
          return rr;
        }, {} as RoleRank);

        return leastRankB.rank - leastRankA.rank;
      });

      for (let i = 0; i < sortedUserRoles.length; i += 1) {
        const userRole = sortedUserRoles[i];

        if (
          (filter.rank &&
            userRole.role.roleRank.some(
              (rank) => rank.context === roleContext && rank.rank === filter.rank,
            )) ||
          (filter['rank[$lte]'] &&
            userRole.role.roleRank
              .sort((a, b) => b.rank - a.rank)
              .some((rank) => rank.context === roleContext && rank.rank <= filter['rank[$lte]']!))
        ) {
          supervisorRole = userRole.role;
          break;
        }
      }

      userSupervisors.push({
        id: elm.id,
        name: elm.fullName,
        email: elm.email,
        phone: elm.phone,
        role: supervisorRole.name,
        roleId: supervisorRole.id,
        parentId: elm.parentId,
        idCms: elm.additional?.id_cms,
      });
    });

    return [userSupervisors, userCount];
  }

  async getUserSupervisorChainList(
    idCms: string,
  ): Promise<[GetUserSupervisorItemResponse[], number]> {
    const targetUser = await this.userDAO.getUserByIdCms(idCms);

    const userChainList: User[] = [];
    userChainList.push(targetUser);

    let startUser: User = targetUser;

    // Prevent infinite loop in searching the chain-list
    for (let i = 0; i < MAX_USER_CHAIN_LIST; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const parentUser = await this.userDAO.getOne({
        where: {
          id: startUser.parentId,
        },
        relations: {
          role: true,
        },
      });

      if (parentUser) {
        userChainList.push(parentUser);
      }

      if (parentUser?.parentId) {
        startUser = parentUser as User;
      } else {
        break;
      }
    }

    // Remove first user which is the userSupervisor
    userChainList.shift();

    return [
      userChainList.map<GetUserSupervisorItemResponse>((user) => ({
        id: user.id,
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role.name,
        roleId: user.roleId,
        parentId: user.parentId,
        idCms: user.additional?.id_cms || '',
      })),
      userChainList.length,
    ];
  }

  async update(
    user: RequestUser,
    input: UpdateUserBody,
    userId: string,
  ): Promise<UpdateUserItemResponse> {
    const currentUsers = await this.userDAO.getOneStrict({
      where: {
        id: userId,
      },
    });

    let updatedPayload: DeepPartial<User> = {
      ...input,
    };

    if (input.password) {
      updatedPayload = {
        ...updatedPayload,
        password: input.password,
      };
    } else {
      updatedPayload = {
        ...updatedPayload,
        password: currentUsers.password,
      };
    }

    const roleIds = input.roleIds || [];

    if (input.roleId) {
      roleIds.push(input.roleId);
    }

    if (input.parentId === currentUsers.id) {
      throw ERR_SELF_SUPERVISOR_EXCEPTION;
    }

    const qr = await this.userDAO.startTransaction();
    try {
      let userRoles: UserRole[] = [];
      if (roleIds.length > 0) {
        const uniqueRoleIds = roleIds.filter((id, idx, arr) => arr.indexOf(id) === idx);
        await this.userRoleDAO.deleteManyWithTx({ userId, roleId: Not(ROLE_ID.SUPER_ADMIN) }, qr);

        userRoles = await this.userRoleDAO.upsertMany(
          user,
          uniqueRoleIds.map((roleId) => ({
            roleId,
            userId,
          })),
          {
            qr,
          },
        );
      }

      const roles = userRoles.map((ur) => ur.role);
      await this.userDAO.upsertOne(
        user,
        {
          ...updatedPayload,
          id: userId,
          roleId:
            (userRoles.length > 0 && determinePrimaryRole(roles).id) ||
            currentUsers.roleId ||
            undefined,
        },
        { qr },
      );

      if (input.supervisors && input.supervisors.length > 0) {
        await this.userSupervisorDAO.deleteManyWithTx(
          {
            subordinateId: currentUsers.id,
          },
          qr,
        );

        await this.userSupervisorDAO.upsertMany(
          user,
          input.supervisors.map((spv) => ({
            ...spv,
            subordinateId: currentUsers.id,
          })),
          {
            qr,
          },
        );
      }

      await this.userDAO.commitTransaction(qr);

      const updatedUser = await this.getById(userId);

      if (userId) {
        this.resetAuthAttempt(userId);
      }

      return {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        status: updatedUser.status,
        lang: updatedUser.lang,
        acceptTnc: updatedUser.acceptTnc,
        parentId: updatedUser.parentId,
        roleId: updatedUser.roleId,
        roles,
        supervisors: input.supervisors,
        roleName: updatedUser.roleName,
        createdDate: updatedUser.createdDate,
        createdBy: updatedUser.createdBy,
        modifiedDate: updatedUser.modifiedDate || '',
        modifiedBy: user.id,
      };
    } catch (error) {
      await this.userDAO.rollbackTransaction(qr);
      throw error;
    }
  }

  /**
   * TODO: This function used only to unblock farming integration
   * Please remove once userManagement.dao.ts in farming is updated
   */
  async patch(input: PatchUserRequestBody, userId: string): Promise<UpdateUserItemResponse> {
    const modifier = await this.userDAO.getUserByIdCms(input.modifiedBy);

    const requester: RequestUser = { id: modifier.id, role: modifier.roleId };

    const updatePayload: UpdateUserBody = {
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      roleIds: input.roleIds,
      supervisors: input.supervisors,
    };

    if (input.password) Object.assign(updatePayload, { password: input.password });
    if (input.roleId) Object.assign(updatePayload, { roleId: input.roleId });
    if (input.parentId) Object.assign(updatePayload, { parentId: input.parentId });
    if (input.acceptTnc) Object.assign(updatePayload, { acceptTnc: input.acceptTnc ? 1 : 0 });
    if (input.organizationId) {
      Object.assign(updatePayload, {
        organizationId: input.organizationId,
      });
    }

    return this.update(requester, updatePayload, userId);
  }

  async getUserRoles(userId: string): Promise<[Role[], number]> {
    const targetUser = await this.userDAO.getUserByIdCms(userId);

    const [userRoles, count] = await this.userRoleDAO.getMany({
      where: {
        userId: targetUser.id,
      },
      relations: {
        role: true,
      },
    });

    return [userRoles.map((ur) => ur.role), count];
  }

  async getSubordinates(opts: {
    query: GetSubordinatesQuery;
    params: GetUserParams;
  }): Promise<[GetSubordinatesResponseItem[], number]> {
    const limit = opts.query.$limit && opts.query.$limit > 0 ? opts.query.$limit : 10;
    const skip = !opts.query.$page || opts.query.$page < 1 ? 0 : (opts.query.$page - 1) * limit;

    const [subordinates, count] = await this.userDAO.getMany({
      where: [
        {
          parentId: opts.params.userId,
        },
        {
          supervisors: {
            supervisorId: opts.params.userId,
            context: opts.query.context,
          },
        },
      ],
      take: (opts.query.$limit !== 0 && limit) || undefined,
      skip,
    });

    return [
      subordinates.map((s) => ({
        ...s,
        cmsId: s.additional?.id_cms,
      })),
      count,
    ];
  }

  private resetAuthAttempt(userId: string) {
    const authAttemptCacheKey = AUTH_ATTEMPT_COUNTER_KEY.replace('$', userId);
    const authVerifyCacheKey = `${CACHE_KEY_AUTH_VERIFY.USER}:${userId}`;
    this.redisConnection.connection.del(authAttemptCacheKey, authVerifyCacheKey);
  }
}
