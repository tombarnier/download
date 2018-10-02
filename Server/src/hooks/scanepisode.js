let request = require('request');
let cheerio = require ('cheerio');
let url = 'https://ww4.zone-telechargement1.org/series-vostfr/'
let promise = require ('promise');
let serieList = []
let promises = []

module.exports = function (options = {}) {
  return async context => {
    if(context.data.action === "episodes")
    console.log(context.data.action)
  }
}
