const { authenticate } = require('@feathersjs/authentication').hooks;

const scanSeries = require('../../hooks/scanserie');
const Episodes = require('../../hooks/scanepisode');

module.exports = {
  before: {
    all: [authenticate('jwt'), scanSeries(), Episodes()],
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
