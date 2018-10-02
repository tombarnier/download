let request = require('request');
let cheerio = require ('cheerio');
let url = 'https://ww4.zone-telechargement1.org/series-vostfr/'
let promise = require ('promise');
let serieList = []
let promises = []


function getSaison(serie) {
	return new Promise(function(resolve,reject) {
		serie.saisons=[]
		new Promise(function(resolve,reject) {
			serie.saisonsTemp.forEach((element,index) => {
				let re = /(saison-\d)-((hd-720p|hdtv|hd-1080p|hd720p)|(french|vostfr))-((french|vostfr)|(hd-720p|hdtv|hd-1080p|hd720p))/g
				test = element.lien.slice(55)
				test = test.match(re)
				if(test !== null){
					re = /saison-[0-9]*/g
					num = test[0].match(re)
					re = /(vostfr|french)/g
					lang = test[0].match(re)
					saison = {
						lien: saison.lien,
						num: num,
						lang: lang,
						episodes: []
					}
					serie.saisons.push(saison)
				}
				else{
					reject("lel")
				}
			})
			resolve(serie)
		}).then(() => {
			delete serie.saisonsTemp
			resolve(serie)
		}).catch((err) => {
			reject(err)
		})
	})
}
function getSaisons(serie) {
	return new Promise(function(resolve,reject) {
		request(serie.lien,(error,response,html) => {
			if(error) reject(Error("page introuvable"))
			const $2 = cheerio.load(html);
			serie.saisonsTemp = []
			new Promise (function(resolve,reject) {
				$2('.otherversions, .otherquality').each(function(index,element) {
					let lien = $2(this).parent().attr('href')
					if (lien != undefined){
						lien = "https://ww4.zone-telechargement1.org/telecharger-series"+lien
						saison = {
							lien: lien,
							name: "placehold"
						}
						serie.saisonsTemp.push(saison)
					}
					else {
					}
				})
				resolve(serie)
			}).then(() => {
				saison = {
					lien: serie.lien,
					name: 'placeholder'
				}
				serie.saisonsTemp.push(saison)
				delete serie.lien
				resolve(serie)
			}).catch((err)=> {
				reject(err)
			})
		})
	})
}


function getLastSerie(urlSerie){
	return new Promise(function(resolve,reject) {
		request(urlSerie,(error, response, html) => {
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

module.exports = function (options = {}) {
  return async context => {
		const { app, data, params } = context;
    if(data.action === "series")
    {
    	console.log(data.action)
			let i = 1
    	for(i;i <= 1;i++ ){
				promises = []
				let url2 = url + "page/" +i
				getLastSerie(url2).then( result => {
					result.forEach(function(element){
						promises.push(getSaisons(element))
					})
				}).then(()=> {
					Promise.all(promises).then((results) => {
						console.log("promise all finis " + i)
						promises2 = []
						results.forEach((result) => {
							promises2.push(getSaison(result))
							Promise.all(promises2).then((saison) =>{
								console.log(saison)
								app.service('series').create(saison)
							}).catch((err) => {
								console.log(err)
							})
						})
					}).catch((err) => {
						console.log(err)
					})
				}).catch((err) => {
					console.log(err)
				})
			}
    }
		console.log("finis")
	}
}
