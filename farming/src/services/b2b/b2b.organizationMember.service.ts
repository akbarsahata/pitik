import { Inject, Service } from 'fastify-decorators';
import { ILike, QueryRunner } from 'typeorm';
import { B2BOrganizationMemberDAO } from '../../dao/b2b/b2b.organizationMember.dao';
import { B2BOrganizationMember } from '../../datasources/entity/pgsql/b2b/B2BOrganizationMember.entity';
import {
  B2BOrganizationMemberItem,
  CreateB2BOrganizationMemberFms,
  GetB2BOrganizationMemberItemResponse,
  GetB2BOrganizationMemberListQuery,
  GetB2BOrganizationMemberParams,
} from '../../dto/b2b/b2b.organizationMember.dto';
import {
  DEFAULT_ORGANIZATION_PITIK,
  INTERNAL_ROLE_FOR_EXTERNAL,
} from '../../libs/constants/b2bExternal';
import { ERR_B2B_NOT_AN_ORGANIZATION_MEMBER } from '../../libs/constants/errors';
import { RequestUser } from '../../libs/types/index.d';
import { UserService as UserCoreService } from '../usermanagement/userCore.service';

@Service()
export class B2BOrganizationMemberService {
  @Inject(B2BOrganizationMemberDAO)
  private dao!: B2BOrganizationMemberDAO;

  @Inject(UserCoreService)
  private userCoreService!: UserCoreService;

  async getMemberInfo(userId: string): Promise<GetB2BOrganizationMemberItemResponse> {
    const memberInfo = await this.dao.getOneStrict({
      where: {
        userId,
        user: {
          status: true,
        },
      },
      relations: {
        user: true,
        organization: true,
      },
    });

    const [userManagementData] = await this.userCoreService.getMany({ cmsIds: userId, $limit: 1 });

    return {
      id: memberInfo.user.id,
      name: memberInfo.user.fullName,
      email: memberInfo.user.email,
      phoneNumber: memberInfo.user.phoneNumber,
      waNumber: memberInfo.user.waNumber,
      role: this.conditionalRole(memberInfo),
      roles: userManagementData[0].roles || [],
      organizationId: memberInfo.organization.id,
      organizationName: memberInfo.organization.name,
      createdDate: memberInfo.user.createdDate.toISOString(),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private conditionalRole(data: Partial<B2BOrganizationMember>): string {
    let result = data.user?.userType || '';

    if (data.user && data.organization) {
      if (
        INTERNAL_ROLE_FOR_EXTERNAL.includes(data.user.userType.toLowerCase()) &&
        data.organization.name === DEFAULT_ORGANIZATION_PITIK.ORG_NAME
      ) {
        result = DEFAULT_ORGANIZATION_PITIK.ORG_OWNER_EXTERNAL_ROLE;
      }
    }

    return result;
  }

  async getB2BOrganizationMemberList(
    filter: GetB2BOrganizationMemberListQuery,
    user: RequestUser,
  ): Promise<[B2BOrganizationMemberItem[], number]> {
    const limit = (filter.$limit && filter.$limit > 0 && filter.$limit) || undefined;

    const skip =
      limit && filter.$page !== undefined && filter.$page > 0 ? (filter.$page - 1) * limit : 0;

    const [results, count] = await this.dao.getMany({
      where: {
        organizationId: user.organizationId,
        user: {
          fullName: filter.name ? ILike(`%${filter.name}%`) : undefined,
          phoneNumber: filter.phoneNumber,
          status: filter.status,
        },
      },
      relations: {
        user: {
          userModifier: true,
        },
        organization: true,
      },
      order: {
        createdDate: 'DESC',
        modifiedDate: 'DESC',
      },
      skip,
      take: limit,
    });

    return [
      results.map<B2BOrganizationMemberItem>((r) => ({
        id: r.id,
        organization: {
          id: r.organization.id,
          name: r.organization.name,
          image: r.organization.image,
        },
        user: {
          id: r.user.id,
          name: r.user.fullName,
          code: r.user.userCode,
          role: r.user.userType,
          email: r.user.email,
          phoneNumber: r.user.phoneNumber,
          waNumber: r.user.waNumber,
          status: r.user.status,
          modifiedBy: r.user.userModifier?.fullName || '',
          modifiedDate: r.user.modifiedDate?.toISOString(),
        },
      })),
      count,
    ];
  }

  async getB2BOrganizationMemberDetail(
    params: GetB2BOrganizationMemberParams,
    user: RequestUser,
  ): Promise<B2BOrganizationMemberItem> {
    const result = await this.dao.getOneStrict({
      where: {
        organizationId: user.organizationId,
        id: params.memberId,
      },
      relations: {
        user: {
          userModifier: true,
        },
        organization: true,
      },
    });

    return {
      id: result.id,
      organization: {
        id: result.organization.id,
        name: result.organization.name,
        image: result.organization.image,
      },
      user: {
        id: result.user.id,
        name: result.user.fullName,
        code: result.user.userCode,
        role: result.user.userType,
        email: result.user.email,
        phoneNumber: result.user.phoneNumber,
        waNumber: result.user.waNumber,
        status: result.user.status,
        modifiedBy: result.user.userModifier?.fullName || '',
        modifiedDate: result.user.modifiedDate?.toISOString(),
      },
    };
  }

  async createOrganizationMemberFromFms(
    input: CreateB2BOrganizationMemberFms,
    user: RequestUser,
    queryRunner: QueryRunner,
  ): Promise<Partial<B2BOrganizationMember>> {
    const organizationMember = await this.dao.createOneWithTx(input, user, queryRunner);

    return organizationMember;
  }

  async getOrganizationIdByUserId(userId: string): Promise<string> {
    const organizationMemberDetail = await this.dao.getOne({
      select: {
        organizationId: true,
      },
      where: {
        userId,
      },
    });

    if (!organizationMemberDetail) {
      throw ERR_B2B_NOT_AN_ORGANIZATION_MEMBER();
    }

    return organizationMemberDetail.organizationId;
  }
}
