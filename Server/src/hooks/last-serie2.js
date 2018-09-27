let request = require('request');
let cheerio = require ('cheerio');
let url = 'https://www.zone-telechargement.lol/series-vostfr/'
let http = 'https://www.zone-telechargement.lol/telecharger-series'
let promise = require ('promise');
let serieList = []
let saisonList = []



function getSerieSaisons(serie) {
	return new Promise(function(resolve,reject){
		request(serie.saisons[0].lien,(error, response, html) => {
			if(error) reject(Error("lien série introuvable"))
			else{
				saisons = []
				const $ = cheerio.load(html);
				$('.otherversions').each(function(index, element){
					$(this).find('a').each(function(index2, element2){
						var lien = $(this).attr('href')
						var info = $(this).text()
						info = info.replace(/[S|s]aison [0-9]*/g,"")
						var num = lien.match(/[S|s]aison-[0-9]*/s)
						if(num === null) num = ["error"]
						var saison = {
							lien : lien,
							info: info,
							num: num[0]
						}
						serie.saisons.push(saison)
					})
				})
				resolve(serie)
			}
		})
	})
}

function getLastSerie(url){
	return new Promise(function(resolve,reject) {
		request(url,(error, response, html) => {
			if(error) reject(Error("page introuvable"))
			else{
				const $ = cheerio.load(html);
				$('#dle-content').find('.clearfix').each(function(index,element){
					infos=$(this)
					var lien = infos.find('a').attr('href')
					var name = infos.find('img').attr('alt')
					if (name != undefined) {
						serieList[index] = {}
						name = name.replace(/- [S|s]aison [0-9]*/g,"")
						serieList[index]['name'] = name 
						serieList[index]['saisons'] = []
						var saison = {
							lien: lien,
							lang: infos.find('.langue').text(),
							num: infos.find('.saison').text(),
							qualite: infos.find('.qualite').text()
						}
						serieList[index]['saisons'].push(saison)
					}
				})
				resolve(serieList)
			}
		})
	})
}

function getEpisode(saison) {
	return new Promise(function(resolve,reject) {
		lien = saison.lien
		request(lien,(error, response, html) => {
			if(error) reject(Error("lien saisons introuvable"))
			else{
				const $ = cheerio.load(html);
				saison['episode'] = []
				$('.postinfo').find('a').each(function(index,element){
					var lien = $(this).attr('href')
					var regex = RegExp('https:\/\/www.dl-protect1.com/4153534906006506554495')
					var regex2 = RegExp('[E|e]pisode [0-9]*')
					if(regex.test(lien) && regex2.test($(this).text())){
						var ep = {
							num: $(this).text(),
							lien: $(this).attr('href')
						}
						saison['episode'].push(ep)
					}
				})
				resolve(saison)
			}
		})
	})
}

/*getLastSerie(url).then(result => {
	console.log("on a récupéré tous les episodes")
	console.log(result)
	result.forEach(function(element){
		getSerieSaisons(element)
		.then(result => {
			tabPromise = []
			result.saisons.forEach(function(element){
				tabPromise.push(getEpisode(element))
			})
			promise.all(tabPromise).then(console.log,console.log)
		})
		.catch(e => {
			console.log(e.message)
		})
	})
}).catch(e => {
	console.log(e)
})*/
getLastSerie(url).then( result => {
	result.forEach( item => {
		getSerieSaisons(item).then( result => {
			console.log(result)
		}).catch(e => {
			console.log(e.message)
		})
	})
}).catch( e => {
	console.log(e)
})

