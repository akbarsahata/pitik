const { authenticate } = require('@feathersjs/authentication');
const { disallow } = require("feathers-hooks-common");

module.exports = {
  before: {
    all: [ ],
    find: [ 
      authenticate('jwt')
    ],
    get: [
      disallow()
    ],
    create: [
      disallow()
    ],
    update: [
      disallow()
    ],
    patch: [
      disallow()
    ],
    remove: [
      disallow()
    ]
  },
  
  after: {
    all: [ ],
    find: [ 
      
    ],
    get: [
      disallow()
    ],
    create: [
      disallow()
    ],
    update: [
      disallow()
    ],
    patch: [
      disallow()
    ],
    remove: [
      disallow()
    ]
  }
};