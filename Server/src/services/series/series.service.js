// Initializes the `series` service on path `/series`
const createService = require('feathers-elasticsearch');
const elasticsearch = require('elasticsearch');
const hooks = require('./series.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'series',
	paginate
  };
	
    const Model = new elasticsearch.Client({
    host: process.env.ELASTIC_URL ? process.env.ELASTIC_URL : 'localhost:9200',
    apiVersion: '6.0'
  });
  // Initialize our service with any options it requires
  app.use('/series',createService({
	Model,
	elasticsearch: {
		index: 'series',
		type: 'doc'
	},
	paginate
  }));

  // Get our initialized service so that we can register hooks
  const service = app.service('series');

  service.hooks(hooks);
};
