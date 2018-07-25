// Initializes the `script` service on path `/script`
const createService = require('feathers-memory');
const hooks = require('./script.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/script', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('script');

  service.hooks(hooks);
};
