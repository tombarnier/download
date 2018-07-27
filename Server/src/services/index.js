const users = require('./users/users.service.js');
const series = require('./series/series.service.js');
const script = require('./script/script.service.js');
const task = require('./task/task.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(series);
  app.configure(script);
  app.configure(task);
};
