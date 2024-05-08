const { Service } = require('./acl.validations.class');
const createModel = require('../../../models/roleAcl');
const hook = require('./acl.validations.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  app.use('/roles/acl/validate', new Service(options, app));

  app.service('/roles/acl/validate').hooks(hook);
};