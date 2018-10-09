let request = require('request');
let cheerio = require ('cheerio');
let url = 'https://ww4.zone-telechargement1.org/series-vostfr/'
let serieList = []

async function lastSerie(urlZT) {
  return new Promise(function(resolve,reject) {
    request(urlZT,(error, response, html) =>{
      if(error) reject(Error("page introuvable"))
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
    })
  })
}

async function getEp(serie) {
    return new Promise((resolve,reject) => {
      let sais = serie.saisons.map(saison => getEpisodes(saison))
      serie.saisons = Promise.all(sais)
      //console.log("ensuite ici : " + serie.name)
      resolve(serie)
    })
}

async function getEpisodes(saison) {
  return new Promise((resolve,reject) => {
    request(saison.lien,(error,response,html) => {
      if(error) reject(Error("page introuvable"))
      const $3 = cheerio.load(html);
      console.log($3('.postinfo div').find('a').attr('href'))
    })
    resolve(saison)
  })
}

async function getSaison(serie) {
  return new Promise((resolve,reject) => {
    var saisons = serie.saisons.map(saison => {
      let re = /(saison-\d)-((hd-720p|hdtv|hd-1080p|hd720p)|(french|vostfr))-((french|vostfr)|(hd-720p|hdtv|hd-1080p|hd720p))/g
      test = saison.lien.slice(55)
      test = test.match(re)
      if(test !== null){
        re = /saison-[0-9]*/g
        num = test[0].match(re)[0]
        re = /(vostfr|french)/g
        lang = test[0].match(re)[0]
      }
      else{
        num = "inconnue"
        lang = "inconnue"
      }
      let saison2 = {
        lien: saison.lien,
        num: num,
        lang: lang,
        episodes: []
      }
      return saison2
    })
    serie.saisons = saisons
    resolve(serie)
  })
}
async function getSaisons(serie) {
  return new Promise(function(resolve,reject) {
    request(serie.lien,(error,response,html) => {
      if(error) reject(Error("page introuvable"))
      const $ = cheerio.load(html);
      serie.saisons = []
      $('.otherversions, .otherquality').each(function(index,element) {
        let lien = $(this).parent().attr('href')
        if (lien != undefined){
          lien = "https://ww4.zone-telechargement1.org/telecharger-series"+lien
          saison = {
            lien: lien,
            name: "placehold"
          }
          serie.saisons.push(saison)
        }
      })
      resolve(serie)
    })
  })
}

module.exports = function (options = {}) {
  return async context => {
    try {
      let series = await lastSerie(url)
      let promises = series.map(serie => getSaisons(serie))
      series = await Promise.all(promises)
      series.map(serie => {
        saison = {
          lien: serie.lien,
          name:"test"
        }
        serie.saisons.push(saison)
        delete serie.lien
      })
      promises = series.map(serie => getSaison(serie))
      series = await Promise.all(promises)
      promises = series.map(serie => getEp(serie))
      series = await Promise.all(promises)
      console.log("fin")
    } catch (e) {
      console.error(e)
    }
  }
}
