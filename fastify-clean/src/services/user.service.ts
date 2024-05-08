import { Inject, Service } from 'fastify-decorators';
import { FindOptionsWhere, In, Like, Not } from 'typeorm';
import { GetUserManagementDetailResponse } from '../dto/userManagement.dto';
import { UserManagementDAO } from '../dao/userManagement.dao';
import { UserDAO } from '../dao/user.dao';
import { User } from '../datasources/entity/pgsql/User.entity';
import {
  CreateUserBody,
  GetUserResponseItem,
  GetUsersQueryString,
  PatchMeRequestBody,
  UpdateUserByIdBody,
  UserMeItem,
} from '../dto/user.dto';
import {
  ERR_EMAIL_EXIST,
  ERR_PHONE_NUMBER_EXIST,
  ERR_RESET_INVALID_OLD_PASSWORD,
  ERR_RESET_PASSWORD_NOT_MATCH,
  ERR_USER_CODE_EXIST,
  ERR_USER_OWNER_IN_USE,
  ERR_USER_TYPE_NOT_EXIST,
  ERR_WA_NUMBER_EXIST,
} from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';
import { comparePassword, generateHash, generateHashCMS } from '../libs/utils/helpers';
import { UserOwnerUpdatedQueue } from '../jobs/queues/user-owner-updated.queue';
import { USER_TYPE, USER_MANAGEMENT_WATCHED_FIELDS } from '../libs/constants';
import { FarmDAO } from '../dao/farm.dao';
import { FeatureWhitelistDAO } from '../dao/featureWhitelist.dao';

@Service()
export class UserService {
  @Inject(UserDAO)
  private dao: UserDAO;

  @Inject(FeatureWhitelistDAO)
  private featureWhitelistDAO: FeatureWhitelistDAO;

  @Inject(UserOwnerUpdatedQueue)
  private queue: UserOwnerUpdatedQueue;

  @Inject(FarmDAO)
  private farmDAO: FarmDAO;

  async createUser(input: CreateUserBody, user: RequestUser): Promise<User> {
    const queryRunner = await this.dao.startTransaction();

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

      const newUser = await this.dao.createOneWithTx(input, user, queryRunner, [
        UserManagementDAO.register(input),
      ]);

      await this.dao.commitTransaction(queryRunner);

      return newUser;
    } catch (error) {
      this.dao.rollbackTransaction(queryRunner);

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
    const [users, count] = await this.dao.getMany({
      where: {
        userType: userTypes.length > 0 ? In(userTypes) : undefined,
        fullName: filter.name ? Like(`%${filter.name}%`) : undefined,
        userCode: filter.userCode,
        email: filter.email,
        phoneNumber: filter.phoneNumber,
        waNumber: filter.waNumber,
        status: filter.status,
        ownerId: filter.ownerId,
        owner:
          (filter.ownerName && {
            fullName: Like(`%${filter.ownerName}%`),
          }) ||
          undefined,
      },
      take: (filter.$limit !== 0 && limit) || undefined,
      skip,
      order: {
        createdDate: 'DESC',
      },
      relations: {
        owner: true,
        userModifier: true,
      },
      select: {
        owner: {
          fullName: true,
        },
      },
    });

    return [
      users.map<GetUserResponseItem>((user) => ({
        ...user,
        owner: user.owner ? user.owner : undefined,
        modifiedDate: user.modifiedDate?.toISOString(),
        modifiedBy: user.userModifier?.fullName || user.modifiedBy,
      })),
      count,
    ];
  }

  async getUserById(userId: string): Promise<User> {
    const [user, userMgt] = await Promise.all<Promise<any>>([
      this.dao.getOneById(userId) as Promise<User>,
      UserManagementDAO.get(userId) as Promise<Partial<GetUserManagementDetailResponse>>,
    ]);
    return { ...user, ...userMgt };
  }

  async getUserMe(userId: string): Promise<UserMeItem> {
    const user = await this.dao.getOneById(userId);

    const pplAppWhitelist = await this.featureWhitelistDAO.getOne({
      where: {
        context: 'PPL_APP_NUMBERS',
        identifier: user.phoneNumber,
        isBlocked: false,
      },
    });

    return {
      id: user.id,
      userCode: user.userCode,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      waNumber: user.waNumber,
      userType: user.userType,
      status: user.status ? 1 : 0,
      acceptTnc: user.acceptTnc ? 1 : 0,
      createdDate: user.createdDate.toISOString(),
      isPplAppUser: !!pplAppWhitelist,
    };
  }

  async updateUserById(id: string, body: UpdateUserByIdBody, user: RequestUser): Promise<User> {
    const conflictConditions: FindOptionsWhere<User>[] = [];
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

    return updatedUser;
  }

  /**
   * TODO: This is temporary migration of user-auth: (reset-password & update-tnc) apis
   * after v2 release and stable, please migrate all user auth update related
   * to be handled from user-management service
   */
  async patchMeUpdate(body: PatchMeRequestBody, requester: RequestUser): Promise<User> {
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

  async updateUserWithTx(id: string, body: UpdateUserByIdBody, user: RequestUser): Promise<User> {
    const queryRunner = await this.dao.startTransaction();
    const { roleId, parentId, ...restBody } = body;
    try {
      const updatedUser = await this.dao.updateOneWithTx(
        { id },
        {
          ...restBody,
        },
        user,
        queryRunner,
        [UserManagementDAO.update({ roleId, parentId, ...restBody })],
      );

      await this.dao.commitTransaction(queryRunner);

      if (updatedUser.userType === USER_TYPE.OWN) {
        await this.queue.addJob(updatedUser);
      }

      return updatedUser;
    } catch (error) {
      this.dao.rollbackTransaction(queryRunner);

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
}
