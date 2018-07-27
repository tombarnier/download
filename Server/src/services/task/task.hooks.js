const { authenticate } = require('@feathersjs/authentication').hooks;

const lastSerie = require('../../hooks/last-serie');

module.exports = {
  before: {
    all: [authenticate('jwt'), lastSerie()],
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
