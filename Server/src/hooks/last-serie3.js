const puppeteer = require('puppeteer')
let url = 'https://www.zone-telechargement.lol/series-vostfr/'


const getData = async () => {
	const browser = await puppeteer.launch({args:  ['--no-sandbox'],headless: false})
	const page = await browser.newPage()

	await page.goto(url)

	const result = page.evaluate(() => {
		console.log(document.querySelector("#dle-content .clearfix"))
		return("slt")
	})
	browser.close()
	return result
}


getData().then(value => {
	console.log(value)
}).catch(e => {
	console.log(e.message)
})
