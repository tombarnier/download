const { authenticate } = require('@feathersjs/authentication').hooks;

const scanSeries = require('../../hooks/testHooks');

module.exports = {
  before: {
    all: [authenticate('jwt'), scanSeries()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
