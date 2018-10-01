let request = require('request');
let cheerio = require ('cheerio');
let url = 'https://ww4.zone-telechargement1.org/series-vostfr/'
let http = 'https://ww3.zone-telechargement1.org/series-vostfr'
let promise = require ('promise');
let serieList = []
let promises = []

function getLastSerie(urltest){
	return new Promise(function(resolve,reject) {
		request(urltest,(error, response, html) => {
			if(error) reject(Error("page introuvable"))
			else{
				const $ = cheerio.load(html);
				$('.cover_infos_title').each(function(index,element){
          serieList[index] = {}
          serieList[index]['lien']=$(this).find('a').attr('href')
          let name =$(this).find('a').text()
					name = name.split("-")
					name = name[0].trim()
					serieList[index]['name'] = name
        })
        resolve(serieList)
      }
    })
  })
}
function sendSerie(promise){
	return new Promise(function(resolve,reject) {
		promise.then( result => {
			result.forEach(function(element){
				promises.push(app.service('series').create(element))
			});
		})
	})
}
module.exports = function (options = {}) {
  return async context => {
		const { app, data, params } = context;
    if(data.action === "series")
    {
    	console.log(data.action)
    	for(var i=1;i <= 10;i++ ){
				let url2 = url + "page/" +i
				getLastSerie(url2).then( result => {
					result.forEach(function(element){
						app.service('series').create(element)
						console.log("ajout de serie :  " + element.name)
					});
				})
			}
    }
	}
}
