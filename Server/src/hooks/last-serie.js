// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
let request = require('request');
let cheerio = require ('cheerio');
let url = 'https://www.zone-telechargement1.org/series-vostfr/'
let http = 'https://www.zone-telechargement1.org/telecharger-series'
let promise = require ('promise');
let serieList = []


module.exports = function (options = {}) {
  return async context => {
		if (context.data.action === "last"){
			request(url, (error, response, html) => {
				if(!error && response.statusCode == 200) {
					const $ = cheerio.load(html);
					$('.cover_infos_title').each(function(index, element){
						serieList[index] = {}
						var a = $(this).find('a')
						var lienTemp = a.attr('href')
						var name = a.text();
						name = name.split("-");
						name = name[0]
						var lien = lienTemp;
						var regnum = /saison[-]?[0-9]/g;
						var reglang = /(vostfr|french|multi)/g;
						var regqual = /(hd[-]?720p|hd[-]?1080p|hdtv)|bdrip/g;
						var regchiffre = /[0-9]/g;123455602
						var num = lien.match(regnum);
						var lang = lien.match(reglang);
						var qual = lien.match(regqual);
						if (num != null)num = num.toString().match(regchiffre).toString()
						else num = "undefined"
						if (lang != null)lang = lang.toString()
						else lang = "undefined"
						if (qual != null)qual = qual.toString()
						else qual = "undefined"
						var saison = {
							lien: lien,
							num: num ,
							lang: lang,
							type: qual
						}
						serieList[index]['name'] = name
						serieList[index]['saisons'] = []
						serieList[index]['saisons'].push(saison)
						request(lienTemp, (error, response2, html2) => {
							const $2 = cheerio.load(html2)
							$2('.otherversions').each(function(j, element){
								$2(this).find('a').each(function(k, element) {
									var lien2 = $2(this).attr('href')
									var lien2 = http + lien2
									var regnum = /saison[-]?[0-9]/g;
									var reglang = /(vostfr|french)/g;
									var regqual = /(hd[-]?720p|hd[-]?1080p|hdtv)|bdrip/g;
									var num = lien2.match(regnum);
						if (num != null)num = num.toString().match(regchiffre).toString()
									else num = "undefined"
									var lang = lien2.match(reglang);
									if (lang != null)lang = lang.toString()
									else lang = "undefined"
									var qual = lien2.match(regqual);
									if (qual != null)qual = qual.toString()
									else qual = "undefined"
									var saison = {
										lien: lien2,
										num: num,
										lang: lang,
										type: qual
									}
									serieList[index]['saisons'].push(saison)
								})
							})
						})
					})
				}
			})
			for (var i = 0, len = serieList.length; i < len; i++){
				serie = serieList[i];
				for(var j = 0, len = serie.saisons.length; j < len; j++){
					var saison = serie.saisons[j]
					console.log(saison)
					console.log(saison.lien)
					if(saison.lien != "undefined"){
						request(saison.lien, (error, response, html) => {
							const $ = cheerio.load(html)
							$('.postinfo').each(function(i, element){
								var a = $(this).find('a').attr('href')
								console.log(a)
								//var reg = /(123455600|123455601)(123455602).*/g
								//a = a.match(reg)
								//console.log(a)
							})
						})
					}
				}
				console.log("fin")




				/*context.app.service('series').create(serieList[i]).then( function(){
					console.log("c'est bonn nan?")
				}).catch( function(err){
					console.log("err for: " + element.name)
				})*/
			}
		}

	return context;

  };
};
