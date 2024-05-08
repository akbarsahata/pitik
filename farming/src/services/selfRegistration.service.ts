import { Inject, Service } from 'fastify-decorators';
import { In } from 'typeorm';
import env from '../config/env';
import { FarmingCycleDAO } from '../dao/farmingCycle.dao';
import { FarmingCycleMemberDDAO } from '../dao/farmingCycleMemberD.dao';
import { UserDAO } from '../dao/user.dao';
import { UserManagementDAO } from '../dao/userManagement.dao';
import { UserRegisterDAO } from '../dao/userRegister.dao';
import { User } from '../datasources/entity/pgsql/User.entity';
import { UserRegister } from '../datasources/entity/pgsql/UserRegister.entity';
import { OperatorTypeEnum } from '../dto/farmingCycle.dto';
import {
  SelfRegisCoopOperator,
  SelfRegisCoopOperatorBody,
  SelfRegisterOwnerActionBody,
  SelfRegisterOwnerActionParams,
  SelfRegisterOwnerBody,
  SelfRegisterOwnerItemResponse,
} from '../dto/selfRegistration.dto';
import { CreateUserBody } from '../dto/user.dto';
import { SelfRegistrationQueue } from '../jobs/queues/self-registration.queue';
import { UserAssignedToFcQueue } from '../jobs/queues/user-assigned-to-fc.queue';
import { USER_TYPE } from '../libs/constants';
import {
  ERR_EMAIL_EXIST,
  ERR_PHONE_NUMBER_EXIST,
  ERR_SELF_REGISTER_USER_EXISTED,
  ERR_SELF_REGISTER_USER_QUOTA,
  ERR_USER_HAS_REGISTERED,
} from '../libs/constants/errors';
import { RequestUser } from '../libs/types/index.d';

const COOP_TYPES = ['OPEN HOUSE', 'SEMI HOUSE', 'CLOSE HOUSE'];

@Service()
export class SelfRegistrationService {
  @Inject(UserRegisterDAO)
  private userRegisterDAO: UserRegisterDAO;

  @Inject(UserDAO)
  private userDAO: UserDAO;

  @Inject(FarmingCycleDAO)
  private fcDAO: FarmingCycleDAO;

  @Inject(FarmingCycleMemberDDAO)
  private fcMemberDAO: FarmingCycleMemberDDAO;

  @Inject(UserManagementDAO)
  private userManagementDAO: UserManagementDAO;

  @Inject(UserAssignedToFcQueue)
  private userAssignedToFcQueue: UserAssignedToFcQueue;

  @Inject(SelfRegistrationQueue)
  private queue: SelfRegistrationQueue;

  async selfRegisterOwner(data: SelfRegisterOwnerBody): Promise<SelfRegisterOwnerItemResponse> {
    const existingUser = await this.userDAO.getOne({
      where: [
        {
          email: data.email,
        },
        {
          phoneNumber: data.phoneNumber,
        },
      ],
    });

    if (existingUser) {
      this.checkConflictAttribute(existingUser, data);
    }

    const registeruserCheck = await this.userRegisterDAO.getOne({
      where: [
        {
          email: data.email,
        },
        {
          phoneNumber: data.phoneNumber,
        },
      ],
    });

    if (registeruserCheck) {
      throw ERR_USER_HAS_REGISTERED();
    }

    const registerUserPayload: Partial<UserRegister> = {
      ...data,
      id: data.email,
      coopType: COOP_TYPES[data.coopType],
    };

    const userRequester: RequestUser = { id: data.email, role: 'owner' };

    const registeredUser = await this.userRegisterDAO.createOne(registerUserPayload, userRequester);

    return {
      id: registeredUser.id,
      fullName: registeredUser.fullName,
      email: registeredUser.email,
      phoneNumber: registeredUser.phoneNumber,
      businessYear: registeredUser.businessYear,
      coopType: registeredUser.coopType,
      coopCapacity: registeredUser.coopCapacity,
      coopLocation: registeredUser.coopLocation,
      address: registeredUser.address,
      district: registeredUser.district,
      region: registeredUser.region,
      province: registeredUser.province,
      createdBy: registeredUser.createdBy,
      createdDate: registeredUser.createdDate.toISOString() || '',
    };
  }

  async selfRegisterOwnerAction(
    params: SelfRegisterOwnerActionParams,
    data: SelfRegisterOwnerActionBody,
    requester: RequestUser,
  ): Promise<SelfRegisterOwnerItemResponse> {
    const queryRunner = await this.userDAO.startTransaction();

    try {
      const requestRecord = await this.userRegisterDAO.getOneStrict({
        where: {
          id: params.registerId,
          approved: false,
        },
      });

      const approvedStatus = params.action === 'approve';

      if (params.action === 'approve') {
        const userPayload: CreateUserBody = {
          userType: USER_TYPE.OWN,
          userCode: data.userCode,
          fullName: requestRecord.fullName,
          email: requestRecord.email,
          phoneNumber: requestRecord.phoneNumber,
          waNumber: requestRecord.phoneNumber,
          status: true,
          password: env.DEFAULT_PASSWORD,
          roleIds: [],
        };

        await this.userDAO.createOneWithTx(userPayload, requester, queryRunner, [
          this.userManagementDAO.register(userPayload),
        ]);
      }

      const updatedUserRegistered = await this.userRegisterDAO.updateOneWithTx(
        {
          id: params.registerId,
        },
        {
          approved: approvedStatus,
        },
        requester,
        queryRunner,
      );

      await this.userDAO.commitTransaction(queryRunner);

      return {
        id: updatedUserRegistered.id,
        fullName: updatedUserRegistered.fullName,
        phoneNumber: updatedUserRegistered.phoneNumber,
        email: updatedUserRegistered.email,
        approved: updatedUserRegistered.approved,
        coopType: updatedUserRegistered.coopType,
        createdBy: updatedUserRegistered.createdBy,
        createdDate: updatedUserRegistered.createdDate.toISOString() || '',
      };
    } catch (error) {
      await this.userDAO.rollbackTransaction(queryRunner);

      throw error;
    }
  }

  async registerCoopOperator(
    data: SelfRegisCoopOperatorBody,
    ownerId: string,
  ): Promise<SelfRegisCoopOperator> {
    const [existingUser, [, operatorCount], owner] = await Promise.all([
      this.userDAO.getOne({
        where: {
          phoneNumber: data.phoneNumber,
        },
      }),
      this.userDAO.getMany({
        where: {
          ownerId,
          userType: In(['poultry leader', 'poultry worker']),
        },
      }),
      this.userDAO.getOneById(ownerId),
      this.fcDAO.getOneById(data.farmingCycleId), // called to validate FC exist
    ]);

    if (existingUser) {
      throw ERR_SELF_REGISTER_USER_EXISTED(existingUser.phoneNumber, existingUser.fullName);
    }

    if (operatorCount > 10) {
      throw ERR_SELF_REGISTER_USER_QUOTA();
    }

    const newOperator = await this.userDAO.registerCoopOperator(data, owner);

    const [fcMember] = await this.fcMemberDAO.assignUsersToFarmingCycle(
      [newOperator],
      data.farmingCycleId,
      owner.id,
    );

    await this.queue.addJob({ ...newOperator, password: data.password });

    await this.userAssignedToFcQueue.addJob(fcMember);

    return {
      id: newOperator.id,
      userCode: newOperator.userCode,
      userType: newOperator.userType,
      phoneNumber: newOperator.phoneNumber,
      fullName: newOperator.fullName,
      ownerId: newOperator.ownerId,
      role: newOperator.userType === 'poultry leader' ? OperatorTypeEnum.KK : OperatorTypeEnum.AK,
      farmingCycleId: fcMember.farmingCycleId,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private checkConflictAttribute(existingUser: User, input: Partial<User>): void {
    if (existingUser.email === input.email) {
      throw ERR_EMAIL_EXIST();
    }
    if (existingUser.phoneNumber === input.phoneNumber) {
      throw ERR_PHONE_NUMBER_EXIST();
    }
  }
}
