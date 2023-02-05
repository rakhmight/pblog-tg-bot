const puppeteer = require('puppeteer')
const BASE_URL = 'https://www.instagram.com/'

const getUserProfile = async (user)=>{
    let launchOptions = { headless: false, args: ['--start-maximized'] };
    const browser = await puppeteer.launch(launchOptions)
    let username, nick, publicationsCount, subsCount, profilePic, bio
    
    const page = await browser.newPage()

    await page.setViewport({width: 1366, height: 768})
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36')

    await page.goto(BASE_URL+user)
    
    username = await page.evaluate(() => {
        if(document.querySelector('div._aa_c>span._aacl._aaco._aacw._aacx._aad7._aade')){
            return document.querySelector('div._aa_c>span._aacl._aaco._aacw._aacx._aad7._aade').textContent
        }
        return 'User'
    })
    nick = await page.evaluate(() => {
        if(document.querySelector('h2.x1lliihq.x1plvlek.xryxfnj.x1n2onr6.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1i0vuye.x1ms8i2q.xo1l8bm.x5n08af.x4zkp8e.xw06pyt.x10wh9bi.x1wdrske.x8viiok.x18hxmgj')){
            return document.querySelector('h2.x1lliihq.x1plvlek.xryxfnj.x1n2onr6.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1i0vuye.x1ms8i2q.xo1l8bm.x5n08af.x4zkp8e.xw06pyt.x10wh9bi.x1wdrske.x8viiok.x18hxmgj').textContent
        }
        return 'nick'
    })

    publicationsCount = await page.evaluate(() => {
        if(document.querySelectorAll('span._ac2a')[0]){
            return document.querySelectorAll('span._ac2a')[0].textContent
        }
        return 'none'
    })
    
    subsCount = await page.evaluate(() => {
        if(document.querySelectorAll('span._ac2a')[1]){
            return document.querySelectorAll('span._ac2a')[1].textContent
        }
        return 'none'
    })
    
    profilePic = await page.evaluate(() => {
        if(document.querySelectorAll('img')[2]){
            return document.querySelectorAll('img')[2].getAttribute('src')
        }
        return false
    })
    
    bio = await page.evaluate(() => {
        if(document.querySelector('div._aa_c>h1._aacl._aaco._aacu._aacx._aad6._aade')){
            return document.querySelector('div._aa_c>h1._aacl._aaco._aacu._aacx._aad6._aade').textContent
        }
        return 'always EBASH'
    })
    
    setTimeout(async ()=>{
        await browser.close()
    },1000)

    if(!profilePic){
        return false
    }
    profilePic = profilePic.match(/v\/.*/)
    profilePic = profilePic[0]

    return {
            username,
            nick,
            publicationsCount,
            subsCount,
            profilePic,
            bio
        }
}

module.exports = getUserProfile