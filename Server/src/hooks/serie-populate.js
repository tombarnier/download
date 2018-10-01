// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
// eslint-disable-next-line no-unused-vars
const { BadRequest } = require ('@feathersjs/errors');

module.exports = function (options = {}) {
  return async context => {
	const { app, data, params } = context;
	const serieA = await app.service('series').find({
		query: {
			name: {
				$phrase: data.name,
			}
		}
	});
	if (serieA.total > 0 ){
		throw new BadRequest('serie updated' + data.name );
	}
	return context;
  };
};
