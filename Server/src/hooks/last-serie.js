// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
let cheerio = require ('cheerio')
let html = cheerio.load('https://www.zone-telechargement1.org/series-vostfr/')


module.exports = function (options = {}) {
  return async context => {
    if (context.data.type === "last"){
		var seriesList = [];
		html('.cover_info_title').each(function(index, element) {
			console.log("index")
			seriesList[index] = {};
			seriesList[index]['name'] = $(element).find('a').text();
			seriesList[index]['url'] = $(element).find('a').getAttribute('href');
		})
		console.log(seriesList);
	}
	return context;
  };
};
