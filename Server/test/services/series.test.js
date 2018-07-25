const assert = require('assert');
const app = require('../../src/app');

describe('\'series\' service', () => {
  it('registered the service', () => {
    const service = app.service('series');

    assert.ok(service, 'Registered the service');
  });
});
