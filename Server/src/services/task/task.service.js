// Initializes the `task` service on path `/task`
const createService = require('./task.class.js');
const hooks = require('./task.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/task', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('task');

  service.hooks(hooks);
};
