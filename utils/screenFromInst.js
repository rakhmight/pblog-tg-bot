const puppeteer = require('puppeteer')
const path = require('path')

async function getPic(url) {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto(url);
  await page.setViewport({width: 1920, height: 1080})

  setTimeout(async ()=>{
    await page.screenshot({path: path.join(__dirname, '..', 'media/inst.png')});
    await browser.close();
  }, 3500)
}

module.exports= {
    getPic
}