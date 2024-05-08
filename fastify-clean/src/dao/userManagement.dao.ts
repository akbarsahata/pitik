import { Service } from 'fastify-decorators';
import fetch from 'node-fetch';
import env from '../config/env';
import { User } from '../datasources/entity/pgsql/User.entity';
import { CreateUserBody, GetUserSupervisorResponse, UpdateUserByIdBody } from '../dto/user.dto';
import { GetUserManagementDetailResponse, UserManagementItem } from '../dto/userManagement.dto';

@Service()
export class UserManagementDAO {
  static register(input: Partial<CreateUserBody>): Function {
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
        status: input.status,
        parentId: input.parentId,
        createdBy: user.createdBy,
        additional: {
          id_cms: user.id,
        },
      };

      const response = await fetch(`${env.HOST_API_V2}/register`, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'X-APP-ID': '1',
        },
      });
      const result = await response.json();
      if (!result || !result.data || !result.data.id) {
        throw new Error('unexpected response');
      }
    };
  }

  static update(input: UpdateUserByIdBody): Function {
    return async (user?: User) => {
      if (!user) return;

      const userMgtData = await fetch(`${env.HOST_API_V2}/users?additional.id_cms=${user.id}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'X-APP-ID': '1',
        },
      });
      const resultUsrMgtData = await userMgtData.json();
      if (!resultUsrMgtData || !resultUsrMgtData.data || !resultUsrMgtData.data[0]) {
        throw new Error('unexpected response');
      }

      const body = {
        fullName: input.fullName || user.fullName,
        email: input.email || user.email,
        phone: input.phoneNumber || user.phoneNumber,
        modifiedBy: user.modifiedBy,
      };

      if (input.password) Object.assign(body, { password: user.password });
      if (input.roleId) Object.assign(body, { role: input.userType, roleId: input.roleId });
      if (input.parentId) Object.assign(body, { parentId: input.parentId });
      if (input.parentId?.toLowerCase() === 'null') Object.assign(body, { parentId: 'null' });
      if (input.acceptTnc) Object.assign(body, { acceptTnc: user.acceptTnc });

      const response = await fetch(`${env.HOST_API_V2}/users/${resultUsrMgtData.data[0].id}`, {
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
    };
  }

  static async get(cmsId: string): Promise<Partial<GetUserManagementDetailResponse>> {
    const path = `/users?additional.id_cms=${cmsId}&$limit=1`;

    const response = await fetch(`${env.HOST_API_V2}${path}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-APP-ID': '1',
      },
    });
    const result = await response.json();

    let userDetail: Partial<UserManagementItem>;
    if (result.code !== 200 && !result.data) {
      userDetail = {
        parentId: '',
        roleId: '',
      };
      return userDetail;
    }

    userDetail = {
      parentId: result.data[0]?.parentId || '',
      roleId: result.data[0]?.roleId || '',
    };
    return userDetail;
  }

  // eslint-disable-next-line class-methods-use-this
  static async getSupervisor(userCmsId: string): Promise<GetUserSupervisorResponse[]> {
    const path = `/users-supervisor?cms_id=${userCmsId}`;

    const response = await fetch(`${env.HOST_API_V2}${path}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-APP-ID': '1',
      },
    });
    const result = await response.json();

    if (!result || !result.data) {
      throw new Error('unexpected response');
    }

    return result.data;
  }
}
