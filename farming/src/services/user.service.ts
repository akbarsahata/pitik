import { minutesToMilliseconds } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { FindOptionsWhere, ILike, In, IsNull, Not, QueryRunner } from 'typeorm';
import { B2BFarmDAO } from '../dao/b2b/b2b.farm.dao';
import { B2BFarmMemberDAO } from '../dao/b2b/b2b.farmMember.dao';
import { B2BOrganizationMemberDAO } from '../dao/b2b/b2b.organizationMember.dao';
import { FarmDAO } from '../dao/farm.dao';
import { UserDAO } from '../dao/user.dao';
import { AutoNumbering } from '../datasources/entity/pgsql/AutoNumbering.entity';
import { User } from '../datasources/entity/pgsql/User.entity';
import { CreateB2BOrganizationMemberFms } from '../dto/b2b/b2b.organizationMember.dto';
import {
  CreateUserBody,
  GetUserByIdItemResponse,
  GetUserResponseItem,
  GetUsersQueryString,
  PatchMeRequestBody,
  UpdateUserBranchByIdBody,
  UpdateUserByIdBody,
  UpdateUserByIdResponseItem,
  UserItem,
  UserMeItem,
} from '../dto/user.dto';
import { GetUserManagementDetailResponse, UserManagementItem } from '../dto/userManagement.dto';
import { UserOwnerUpsertQueue } from '../jobs/queues/user-owner-upsert.queue';
import {
  AUTO_NUMBERING_TRX_TYPE,
  B2B_DEFAULT_ORG,
  B2B_FARM_DEFAULT_ADDRESS,
  USER_MANAGEMENT_WATCHED_FIELDS,
  USER_TYPE,
  USER_TYPE_B2B_EXTERNAL,
  USER_TYPE_B2B_EXTERNAL_APP_GROUP,
} from '../libs/constants';
import { DEFAULT_ORGANIZATION_PITIK } from '../libs/constants/b2bExternal';
import {
  ERR_B2B_POULTRY_WORKER_ASSIGNMENT_NEED_VALID_OWNER,
  ERR_EMAIL_EXIST,
  ERR_PHONE_NUMBER_EXIST,
  ERR_RESET_INVALID_OLD_PASSWORD,
  ERR_RESET_PASSWORD_NOT_MATCH,
  ERR_USER_CODE_EXIST,
  ERR_USER_CODE_UNEDITABLE,
  ERR_USER_OWNER_IN_USE,
  ERR_USER_TYPE_NOT_EXIST,
  ERR_WA_NUMBER_EXIST,
} from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import {
  comparePassword,
  generateB2BCode,
  generateHash,
  generateHashCMS,
} from '../libs/utils/helpers';
import { RegisterService } from './usermanagement/register.service';
import { UserService as UserCoreService } from './usermanagement/userCore.service';

@Service()
export class UserService {
  @Inject(UserDAO)
  private dao: UserDAO;

  @Inject(RegisterService)
  private registerService: RegisterService;

  @Inject(UserCoreService)
  private userCoreService: UserCoreService;

  @Inject(B2BOrganizationMemberDAO)
  private b2bOrganizationMemberDAO: B2BOrganizationMemberDAO;

  @Inject(UserOwnerUpsertQueue)
  private queue: UserOwnerUpsertQueue;

  @Inject(FarmDAO)
  private farmDAO: FarmDAO;

  @Inject(B2BFarmDAO)
  private b2bFarmDAO: B2BFarmDAO;

  @Inject(B2BFarmMemberDAO)
  private b2bFarmMemberDAO: B2BFarmMemberDAO;

  async createUser(body: CreateUserBody, user: RequestUser): Promise<UserItem> {
    const queryRunner = await this.dao.startTransaction();
    const { branch, ...input } = body;
    input.email = input.email?.toLowerCase();

    try {
      const existingUser = await this.dao.getOne({
        where: [
          {
            email: input.email,
          },
          {
            phoneNumber: input.phoneNumber,
          },
          {
            waNumber: input.waNumber,
          },
          {
            userCode: input.userCode,
          },
        ],
      });

      if (existingUser) {
        UserService.checkConflictAttribute(existingUser, input);
      }

      let newUser = await this.dao.createOneWithTx(input, user, queryRunner);

      const registeredUser = await this.registerService.register(
        {
          ...input,
          phone: input.phoneNumber,
          additional: {
            id_cms: newUser.id,
          },
        },
        queryRunner,
      );

      newUser = await this.dao.updateOneWithTx(
        { id: newUser.id },
        { userType: registeredUser?.role },
        user,
        queryRunner,
      );

      // Handle External App User's Creation from FMS
      if (USER_TYPE_B2B_EXTERNAL_APP_GROUP.includes(newUser.userType) && body.organizationId) {
        await this.upsertB2BRelationEntity(
          {
            userId: newUser.id,
            name: newUser.fullName,
            organizationId: body.organizationId,
            userType: newUser.userType,
            status: newUser.status,
            ownerId: newUser.ownerId,
          },
          user,
          queryRunner,
          'create',
        );
      }

      await this.dao.commitTransaction(queryRunner);

      if (newUser.userType === USER_TYPE.OWN) {
        await this.queue.addJob(newUser);
      }

      return { ...newUser, roles: [], branch: newUser.branch };
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async getUsers(filter: GetUsersQueryString): Promise<[GetUserResponseItem[], number]> {
    const limit = filter.$limit > 0 ? filter.$limit : undefined;
    const skip = limit !== undefined && filter.$page > 0 ? (filter.$page - 1) * limit : 0;
    const userTypes = [];
    if (filter.userType) {
      userTypes.push(filter.userType);
    }
    if (filter.userTypes) {
      userTypes.push(
        ...filter.userTypes.split(',').reduce<string[]>((prev, current) => {
          if (Object.entries(USER_TYPE).some((val) => val[1] === current)) {
            prev.push(current);
          } else {
            throw ERR_USER_TYPE_NOT_EXIST(`User type ${current} is unknown`);
          }
          return prev;
        }, []),
      );
    }

    const [idsList] = await this.userCoreService.searchUserIds({ roleNames: userTypes.join() });

    const [users, count] = await this.dao.getMany({
      where: {
        id: idsList.length > 0 ? In(idsList) : undefined,
        fullName: filter.name ? ILike(`%${filter.name}%`) : undefined,
        userCode: filter.userCode,
        email: filter.email,
        phoneNumber: filter.phoneNumber,
        waNumber: filter.waNumber,
        status: filter.status,
        ownerId: filter.ownerId,
        branchId: filter.branchId,
        owner:
          (filter.ownerName && {
            fullName: ILike(`%${filter.ownerName}%`),
          }) ||
          undefined,
        organization: {
          // eslint-disable-next-line no-nested-ternary
          organizationId: filter.organizationId
            ? filter.organizationId === B2B_DEFAULT_ORG.ID
              ? IsNull()
              : filter.organizationId
            : undefined,
        },
      },
      take: (filter.$limit !== 0 && limit) || undefined,
      skip,
      order: {
        createdDate: 'DESC',
      },
      relations: {
        owner: true,
        userModifier: true,
        organization: {
          organization: true,
        },
      },
      select: {
        owner: {
          fullName: true,
        },
      },
    });

    const userIds = users.map((user) => user.id);

    const [usersMgmt] = await this.userCoreService.search({ cmsIds: userIds });

    const mapUsersMgmt = usersMgmt.reduce((prev, item) => {
      prev.set(item.cmsId!, item);
      return prev;
    }, new Map<string, Partial<UserManagementItem>>());

    return [
      users.map<GetUserResponseItem>((user) => ({
        ...user,
        roles: mapUsersMgmt.get(user.id)?.roles || [],
        owner: user.owner ? user.owner : undefined,
        modifiedDate: user.modifiedDate?.toISOString(),
        modifiedBy: user.userModifier?.fullName || user.modifiedBy,
        organization: this.getOrganizationInfo(user.organization),
      })),
      count,
    ];
  }

  async getUserById(userId: string): Promise<GetUserByIdItemResponse> {
    const [user, [userMgt]] = await Promise.all<Promise<any>>([
      this.dao.getOne({
        where: {
          id: userId,
        },
        relations: {
          organization: {
            organization: true,
          },
          branch: true,
        },
      }) as Promise<User>,
      this.userCoreService.getMany({
        cmsIds: userId,
        $limit: 1,
      }) as Promise<Partial<GetUserManagementDetailResponse>>,
    ]);

    return {
      ...user,
      ...userMgt[0],
      organization: this.getOrganizationInfo(user.organization),
    };
  }

  async getUserMe(userId: string): Promise<UserMeItem> {
    const user = await this.dao.getOneStrict({
      where: { id: userId },
      relations: { organization: { organization: true }, branch: true },
      cache: minutesToMilliseconds(5),
    });

    const [userMgmt] = await this.userCoreService.getMany({ cmsIds: userId, $limit: 1 });

    return {
      id: user.id,
      userCode: user.userCode,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      waNumber: user.waNumber,
      userType: user.userType,
      roles: userMgmt[0].roles,
      status: user.status ? 1 : 0,
      acceptTnc: user.acceptTnc ? 1 : 0,
      createdDate: user.createdDate.toISOString(),
      organizationId: userMgmt[0].organizationId,
      modules: userMgmt[0].modules,
      organization: user.organization.length > 0 ? user.organization[0].organization : null,
      branch: user.branch || null,
    };
  }

  async updateUserById(
    id: string,
    input: UpdateUserByIdBody,
    user: RequestUser,
  ): Promise<UpdateUserByIdResponseItem> {
    const conflictConditions: FindOptionsWhere<User>[] = [];
    const { branch, ...body } = input;
    if (body.userCode) {
      conflictConditions.push({
        id: Not(id),
        userCode: body.userCode,
      });
    }
    if (body.email) {
      conflictConditions.push({
        id: Not(id),
        email: body.email,
      });
    }
    if (body.phoneNumber) {
      conflictConditions.push({
        id: Not(id),
        phoneNumber: body.phoneNumber,
      });
    }
    if (body.waNumber) {
      conflictConditions.push({
        id: Not(id),
        waNumber: body.waNumber,
      });
    }
    const [conflictIdentifier, newHashPassword, existingData, activeFarm] = await Promise.all([
      this.dao.getOne({
        where: conflictConditions,
      }),
      body.password ? generateHashCMS(body.password) : undefined,
      this.dao.getOneById(id),
      this.farmDAO.getOne({
        where: {
          status: true,
          userOwnerId: id,
        },
      }),
    ]);

    if (conflictIdentifier) {
      UserService.checkConflictAttribute(conflictIdentifier, body);
    }

    if (existingData.status && body.status === false && activeFarm) {
      throw ERR_USER_OWNER_IN_USE(`FARM CODE: ${activeFarm.farmCode}`);
    }

    if (body.userCode !== existingData.userCode) {
      throw ERR_USER_CODE_UNEDITABLE();
    }

    const bodyPayload = {
      ...body,
      password: newHashPassword,
      ownerId: body.ownerId ? body.ownerId : undefined,
    };

    if (Object.keys(body).some((item) => USER_MANAGEMENT_WATCHED_FIELDS.includes(item))) {
      return this.updateUserWithTx(id, bodyPayload, user);
    }
    const updatedUser = await this.dao.updateOne({ id }, bodyPayload, user);

    if (updatedUser.userType === USER_TYPE.OWN) {
      await this.queue.addJob(updatedUser);
    }

    return { ...updatedUser, modifiedDate: updatedUser.modifiedDate?.toISOString() };
  }

  /**
   * TODO: This is temporary migration of user-auth: (reset-password & update-tnc) apis
   * after v2 release and stable, please migrate all user auth update related
   * to be handled from user-management service
   */
  async patchMeUpdate(
    body: PatchMeRequestBody,
    requester: RequestUser,
  ): Promise<UpdateUserByIdResponseItem> {
    const userId = requester.id;

    let bodyPayload: Partial<UpdateUserByIdBody> = body;

    // For update password via /fms-users/me
    if (body.password && body.confirmPassword) {
      if (body.password !== body.confirmPassword) {
        throw ERR_RESET_PASSWORD_NOT_MATCH();
      }

      const [newHashPassword, currentUser] = await Promise.all([
        generateHash(body.password),
        this.dao.getOneById(userId),
      ]);

      const isOldPasswordMatch = await comparePassword(
        body.oldPassword as string,
        currentUser.password,
      );
      if (!isOldPasswordMatch) {
        throw ERR_RESET_INVALID_OLD_PASSWORD();
      }

      bodyPayload = { ...currentUser, password: newHashPassword };
    }

    // For update tnc only
    return this.updateUserWithTx(userId, bodyPayload, requester);
  }

  async updateUserWithTx(
    id: string,
    body: UpdateUserByIdBody,
    user: RequestUser,
  ): Promise<UpdateUserByIdResponseItem> {
    const queryRunner = await this.dao.startTransaction();
    const { roleId, roleIds, roles, parentId, supervisors, organizationId, ...restBody } = body;
    try {
      let updatedUser = await this.dao.updateOneWithTx(
        { id },
        {
          ...restBody,
        },
        user,
        queryRunner,
      );

      const [userCoreData] = await this.userCoreService.getMany({ cmsIds: id, $limit: 1 });

      const updatedBodyUserCore = {
        fullName: body.fullName || updatedUser.fullName,
        email: body.email || updatedUser.email,
        phone: body.phoneNumber || updatedUser.phoneNumber,
        modifiedBy: updatedUser.modifiedBy,
        roleIds: body.roleIds || [],
        supervisors: body.supervisors,
      };

      Object.assign(updatedBodyUserCore, {
        password: body.password ? updatedUser.password : undefined,
        role: body.roleId ? { userType: body.userType, roleId: body.roleId } : undefined,
        roleIds: body.roleIds,
        parentId: body.parentId && body.parentId.toLowerCase() === 'null' ? 'null' : body.parentId,
        // eslint-disable-next-line no-nested-ternary
        acceptTnc: 'acceptTnc' in body ? (body.acceptTnc ? 1 : 0) : updatedUser.acceptTnc ? 1 : 0,
        organizationId: body.organizationId ? body.organizationId : undefined,
      });

      const userMgmtUpdate = await this.userCoreService.update(
        user,
        updatedBodyUserCore,
        userCoreData[0].id,
      );

      await this.dao.commitTransaction(queryRunner, false);

      updatedUser = await this.dao.updateOneWithTx(
        { id },
        { userType: userMgmtUpdate?.roleName },
        user,
        queryRunner,
      );

      // Handle External App User's Creation from FMS
      if (USER_TYPE_B2B_EXTERNAL_APP_GROUP.includes(body.userType as string) && organizationId) {
        await this.upsertB2BRelationEntity(
          {
            userId: id,
            name: updatedUser.fullName,
            organizationId,
            userType: body.userType as string,
            status: updatedUser.status,
            ownerId: updatedUser.ownerId,
          },
          user,
          queryRunner,
          'update',
        );
      }

      await this.dao.commitTransaction(queryRunner);

      if (updatedUser.userType === USER_TYPE.OWN) {
        await this.queue.addJob(updatedUser);
      }

      return {
        ...updatedUser,
        roles: userMgmtUpdate?.roles,
        supervisors: userMgmtUpdate?.supervisors,
        modifiedDate: updatedUser.modifiedDate?.toISOString(),
      };
    } catch (error) {
      await this.dao.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  static checkConflictAttribute(existingUser: User, input: Partial<User>) {
    if (existingUser.email === input.email) {
      throw ERR_EMAIL_EXIST();
    }
    if (existingUser.phoneNumber === input.phoneNumber) {
      throw ERR_PHONE_NUMBER_EXIST();
    }
    if (existingUser.waNumber === input.waNumber) {
      throw ERR_WA_NUMBER_EXIST();
    }
    throw ERR_USER_CODE_EXIST();
  }

  private async upsertB2BRelationEntity(
    data: CreateB2BOrganizationMemberFms,
    user: RequestUser,
    queryRunner: QueryRunner,
    type: string,
  ): Promise<void> {
    if (data.userType === USER_TYPE_B2B_EXTERNAL.OWNEXT) {
      const [autoNumbering] = await Promise.all([
        queryRunner.manager.findOneOrFail(AutoNumbering, {
          where: {
            transactionType: AUTO_NUMBERING_TRX_TYPE.B2B_FARM_CODE,
          },
        }),
      ]);

      const newExternalFarm = await this.farmDAO.upsertOneWithTx(
        { userOwnerId: data.userId },
        {
          farmName: `Peternakan ${data.name}`,
          farmCode:
            type === 'create'
              ? generateB2BCode(
                  autoNumbering.lastNumber,
                  autoNumbering.digitCount,
                  autoNumbering.prefix,
                )
              : undefined,
          userOwnerId: data.userId,
          status: data.status,
          ...B2B_FARM_DEFAULT_ADDRESS,
        },
        user,
        queryRunner,
      );

      const upsertedB2BFarm = await this.b2bFarmDAO.upsertOneWithTx(
        { ownerId: data.userId, organizationId: data.organizationId },
        { farmId: newExternalFarm.id, ownerId: data.userId, organizationId: data.organizationId },
        user,
        queryRunner,
      );

      await this.b2bFarmMemberDAO.upsertOneWithTx(
        { b2bFarmId: upsertedB2BFarm.id, userId: data.userId },
        { b2bFarmId: upsertedB2BFarm.id, userId: data.userId },
        user,
        queryRunner,
      );

      if (type === 'create') {
        await queryRunner.manager.update(AutoNumbering, autoNumbering.id, {
          lastNumber: () => 'last_number + 1',
        });
      }
    }

    if (data.userType === USER_TYPE_B2B_EXTERNAL.AKEXT) {
      if (!data.ownerId) {
        throw ERR_B2B_POULTRY_WORKER_ASSIGNMENT_NEED_VALID_OWNER();
      }

      // Validate the owner's farm & user owner with role owner external
      const [externalOwnerFarm, userOwnerExternal] = await Promise.all([
        this.farmDAO.getOneStrict({
          where: {
            userOwnerId: data.ownerId,
          },
        }),
        this.dao.getOneStrict({
          where: {
            id: data.ownerId,
            status: true,
            userType: USER_TYPE_B2B_EXTERNAL.OWNEXT,
          },
        }),
      ]);

      const b2bFarm = await this.b2bFarmDAO.getOneStrict({
        where: {
          farmId: externalOwnerFarm.id,
          ownerId: userOwnerExternal.id,
        },
      });

      await this.b2bFarmMemberDAO.upsertOneWithTx(
        { b2bFarmId: b2bFarm.id, userId: data.userId },
        { b2bFarmId: b2bFarm.id, userId: data.userId },
        user,
        queryRunner,
      );
    }

    if (data.userType === USER_TYPE.ADM) {
      const b2bFarm = await this.b2bFarmDAO.getOneStrict({
        where: {
          organizationId: DEFAULT_ORGANIZATION_PITIK.ORG_ID,
        },
      });

      await this.b2bFarmMemberDAO.upsertOneWithTx(
        { b2bFarmId: b2bFarm.id, userId: data.userId },
        { b2bFarmId: b2bFarm.id, userId: data.userId },
        user,
        queryRunner,
      );
    }

    await this.b2bOrganizationMemberDAO.upsertOneWithTx(
      {
        organizationId: data.organizationId,
        userId: data.userId,
      },
      {
        organizationId: data.organizationId,
        userId: data.userId,
      },
      user,
      queryRunner,
    );
  }

  async updateUserBranchById(
    id: string,
    input: UpdateUserBranchByIdBody,
    user: RequestUser,
  ): Promise<void> {
    await this.dao.getOneStrict({ where: { id } });
    await this.dao.updateOne({ id }, { branchId: input.branchId }, user);
  }

  // eslint-disable-next-line class-methods-use-this
  private getOrganizationInfo(organizationMember: any): any {
    if (typeof organizationMember === 'object' && organizationMember.length > 0) {
      return {
        id: organizationMember[0].organization.id,
        name: organizationMember[0].organization.name,
      };
    }
    return {
      id: B2B_DEFAULT_ORG.ID,
      name: B2B_DEFAULT_ORG.NAME,
    };
  }
}
