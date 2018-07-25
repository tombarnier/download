const assert = require('assert');
const app = require('../../src/app');

describe('\'script\' service', () => {
  it('registered the service', () => {
    const service = app.service('script');

    assert.ok(service, 'Registered the service');
  });
});
