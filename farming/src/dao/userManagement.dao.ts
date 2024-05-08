import { Initializer, Service } from 'fastify-decorators';
import fetch from 'node-fetch';
import env from '../config/env';
import { User } from '../datasources/entity/pgsql/User.entity';
import { CreateUserBody, GetUserSupervisorResponse, UpdateUserByIdBody } from '../dto/user.dto';
import {
  GetUserManagementDetailResponse,
  SubordinateItem,
  UserManagementItem,
} from '../dto/userManagement.dto';
import { ROLE_RANK_CONTEXT } from '../libs/constants';
import { createCircuitBreaker } from '../libs/utils/circuitBreaker';

type Role = {
  id: string;
  name: string;
};

type RegisterResponse = {
  id: string;
  roleId: string;
  role: string;
  roles: Role[];
};

type Supervisor = {
  context: ROLE_RANK_CONTEXT;
  supervisorId: string;
};

type UpdateResponse = {
  id: string;
  roleId: string;
  roleName: string;
  roles: Role[];
  supervisors: Supervisor[];
};

@Service()
export class UserManagementDAO {
  private circuitBreaker: ReturnType<typeof createCircuitBreaker>;

  @Initializer()
  init(): void {
    this.circuitBreaker = createCircuitBreaker();
  }

  register(input: Partial<CreateUserBody>): Function {
    return async (user?: User) => {
      if (!user) return;

      const body = {
        fullName: user.fullName,
        email: user.email,
        phone: user.phoneNumber,
        password: input.password,
        lang: 'id',
        role: user.userType,
        roleId: input.roleId,
        roleIds: input.roleIds,
        status: input.status,
        parentId: input.parentId,
        createdBy: user.createdBy,
        additional: {
          id_cms: user.id,
        },
      };

      const response = await this.circuitBreaker.execute(() =>
        fetch(`${env.HOST_USER_MGMT}/register`, {
          method: 'post',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
            'X-APP-ID': '1',
          },
        }),
      );

      const result = await response.json();
      if (!result || !result.data || !result.data.id) {
        throw new Error('unexpected response');
      }
    };
  }

  async registerV2(input: Partial<CreateUserBody>, user?: User): Promise<RegisterResponse | null> {
    if (!user) return null;

    const body = {
      fullName: user.fullName,
      email: user.email,
      phone: user.phoneNumber,
      password: input.password,
      lang: 'id',
      role: user.userType,
      roleId: input.roleId,
      roleIds: input.roleIds,
      status: input.status,
      parentId: input.parentId,
      createdBy: user.createdBy,
      additional: {
        id_cms: user.id,
      },
      supervisors: input.supervisors,
      organizationId: input.organizationId,
    };

    const response = await this.circuitBreaker.execute(() =>
      fetch(`${env.HOST_USER_MGMT}/register`, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'X-APP-ID': '1',
        },
      }),
    );

    const result = await response.json();
    if (!result || !result.data || !result.data.id) {
      throw new Error('unexpected response');
    }
    return result.data as RegisterResponse;
  }

  async updateUser(input: UpdateUserByIdBody, user?: User): Promise<UpdateResponse | null> {
    if (!user) return null;

    const userMgtData = await this.circuitBreaker.execute(() =>
      fetch(`${env.HOST_USER_MGMT}/users?additional.id_cms=${user.id}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'X-APP-ID': '1',
        },
      }),
    );

    const resultUsrMgtData = await userMgtData.json();
    if (!resultUsrMgtData || !resultUsrMgtData.data || !resultUsrMgtData.data[0]) {
      throw new Error('unexpected response');
    }

    const body = {
      fullName: input.fullName || user.fullName,
      email: input.email || user.email,
      phone: input.phoneNumber || user.phoneNumber,
      modifiedBy: user.modifiedBy,
      roleIds: input.roleIds || [],
      supervisors: input.supervisors,
    };

    Object.assign(body, {
      password: input.password ? user.password : undefined,
      role: input.roleId ? { userType: input.userType, roleId: input.roleId } : undefined,
      roleIds: input.roleIds,
      parentId: input.parentId && input.parentId.toLowerCase() === 'null' ? 'null' : input.parentId,
      acceptTnc: 'acceptTnc' in input ? input.acceptTnc : user.acceptTnc,
      organizationId: input.organizationId ? input.organizationId : undefined,
    });

    const response = await fetch(`${env.HOST_USER_MGMT}/users/${resultUsrMgtData.data[0].id}`, {
      method: 'patch',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'X-APP-ID': '1',
      },
    });

    const result = await response.json();
    if (!result || !result.data || result.code !== 200) {
      throw new Error('unexpected response');
    }

    return result.data as UpdateResponse;
  }

  async getUserDetail(cmsId: string): Promise<Partial<GetUserManagementDetailResponse>> {
    const path = `/users?$limit=1&cmsIds=${cmsId}`;

    const response = await this.circuitBreaker.execute(() =>
      fetch(`${env.HOST_USER_MGMT}${path}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'X-APP-ID': '1',
        },
      }),
    );

    const result = await response.json();

    let userDetail: Partial<UserManagementItem>;
    if (result.code !== 200 && !result.data) {
      userDetail = {
        id: '',
        cmsId: '',
        parentId: '',
        roleId: '',
        roles: [],
        supervisors: [],
      };
      return userDetail;
    }

    userDetail = {
      id: result.data[0]?.id || '',
      cmsId: result.data[0]?.cmsId || '',
      parentId: result.data[0]?.parentId || '',
      roleId: result.data[0]?.roleId || '',
      roles: result.data[0]?.roles || [],
      supervisors: result.data[0]?.supervisors || [],
      modules: result.data[0]?.modules || [],
      organizationId: result.data[0]?.organizationId,
    };
    return userDetail;
  }

  async getUsersByCmsIds(cmsIds: string[]): Promise<Partial<UserManagementItem>[]> {
    const path = '/users/search';

    const response = await this.circuitBreaker.execute(() =>
      fetch(`${env.HOST_USER_MGMT}${path}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'X-APP-ID': '1',
        },
        body: JSON.stringify({
          $limit: 0,
          cmsIds,
        }),
      }),
    );

    const result = await response.json();

    if (result.code !== 200 && !result.data) {
      return [];
    }

    const userDetail = result.data as Partial<UserManagementItem>[];
    return userDetail;
  }

  async getManyIdsByRoles(roles: string[]): Promise<string[]> {
    const path = `/users/search-ids?roleNames=${roles.join()}`;

    const response = await this.circuitBreaker.execute(() =>
      fetch(`${env.HOST_USER_MGMT}${path}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'X-APP-ID': '1',
        },
      }),
    );

    const result = await response.json();

    if (result.code !== 200 && !result.data) {
      return [];
    }

    return result.data as string[];
  }

  async getUserSupervisors(userCmsId: string): Promise<GetUserSupervisorResponse[]> {
    const path = `/users-supervisor?cms_id=${userCmsId}`;

    const response = await this.circuitBreaker.execute(() =>
      fetch(`${env.HOST_USER_MGMT}${path}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'X-APP-ID': '1',
        },
      }),
    );

    const result = await response.json();

    if (!result || !result.data) {
      throw new Error('unexpected response');
    }

    return result.data;
  }

  async getUserSubordinates(
    userId: string,
    context?: ROLE_RANK_CONTEXT,
  ): Promise<SubordinateItem[]> {
    const path = `/users/${userId}/subordinates?context=${context}`;

    const response = await this.circuitBreaker.execute(() =>
      fetch(`${env.HOST_USER_MGMT}${path}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'X-APP-ID': '1',
        },
      }),
    );

    const result = await response.json();

    if (!result || !result.data) {
      throw new Error('unexpected response');
    }

    return result.data;
  }
}
