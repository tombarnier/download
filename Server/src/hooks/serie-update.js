// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { spawn } = require('child_process')
// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
	let { data } = context;
	let cmd;
	console.log(data)
	if (data.args) {
		let cmd = spawn('sh',['public/js/tri-serie.sh',data.args])
		cmd.stdout.on('data', (data) => {
			console.log(`stdout: ${data}`);
		});
		cmd.stderr.on('data', (data) => {
			console.log(`stderr: ${data}`);
		});
		console.log('un argument');
		cmd.on('close', (code) => {
			console.log('finished')
		});
	} else {
		let cmd = spawn('sh',['public/js/tri-serie.sh'])
		console.log('pas d\'argument')
		cmd.stdout.on('data', (data) => {
			console.log(`stdout: ${data}`);
		});
		cmd.stderr.on('data', (data) => {
			console.log(`stderr: ${data}`);
		});
		cmd.on('close', (code) => {
			console.log('finished')
		});
	}

	return context;
  };
};
