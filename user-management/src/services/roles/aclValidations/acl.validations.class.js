const { Service } = require('feathers-sequelize');

exports.Service = class AclValidations extends Service {
  constructor(options, app) {
    super(options);
    this.app = app;
  }

  async find(params) {
    try {
      const queryApiCriteria = {};
      for (let key in params.query) {
        if (key === 'method') {
          params.query[key] = params.query[key].toUpperCase();
        }
        Object.assign(queryApiCriteria, { [key]: params.query[key] });
      }

      const roleApiService = this.app.service("apis");
      const isApiExists = await roleApiService._find({
        query: {
          $limit: 1,
          ...queryApiCriteria,
        }
      });

      if (isApiExists.data.length === 0) {
        throw new Error('API not found');
      }

      const roleAclService = this.app.service("roles/acl");
      const aclAllowed = await roleAclService._find({
        query: {
          roleId: params.user.roleId,
          apiId: isApiExists.data[0].id,
        }
      });

      return {
        status: 200,
        data: {
          isAllowed: aclAllowed.data.length > 0
        }
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}