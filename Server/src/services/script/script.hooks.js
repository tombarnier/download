const { authenticate } = require('@feathersjs/authentication').hooks;

const serieUpdate = require('../../hooks/serie-update');

module.exports = {
  before: {
    all: [authenticate('jwt'), serieUpdate()],
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
