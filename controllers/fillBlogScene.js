const { Scenes, Composer } = require('telegraf')
const { REPLY_TEXT } = require('../config/consts')
const { cancelFillBlogBtn, tutorialBtn } =require('../utils/buttons')
const { fillUser } = require('../services/Blog')

// Обработчики
const aboutMeHandler = new Composer()
aboutMeHandler.on('text', async ctx =>{
    ctx.wizard.state.data = {}
    let msgText = ctx.update.message.text

    let aboutMe = {
        text: msgText,
        image: ''
    }

    ctx.wizard.state.data.aboutMe = aboutMe

    await ctx.reply(REPLY_TEXT.fillBlog.interestings, cancelFillBlogBtn)
    return ctx.wizard.next()
})

const interestsHandler = new Composer()
interestsHandler.on('text', async ctx=>{
    // разбор и сохранение Interests в БД
    let msgText = ctx.update.message.text

    // !!!!! возможность дальше устанавливать эмодзи
    let interestingsToSave = []
    let interestings = msgText.split(',')

    for(let i = 0; i != interestings.length; i++){
        interestings[i]=interestings[i].trim()
    }

    for(let g = 0; g != interestings.length; g++){
        interestingsToSave.push({
            name: interestings[g],
            emoji: ''
        })
    }
    
    ctx.wizard.state.data.interestings = interestingsToSave

    await ctx.reply(REPLY_TEXT.fillBlog.telegram, cancelFillBlogBtn)
    return ctx.wizard.next()
})

const contactTelegramHandler = new Composer()
contactTelegramHandler.on('text', async ctx=>{
    //сохранить в БД
    let msgText = ctx.update.message.text
    ctx.wizard.state.data.contacts = {}

    msgText = msgText.trim()
    
    ctx.wizard.state.data.contacts.telegram = msgText.replace('@', '')
    
    await ctx.reply(REPLY_TEXT.fillBlog.mail, cancelFillBlogBtn)
    return ctx.wizard.next()
})

const contactMailHandler = new Composer()
contactMailHandler.on('text', async ctx=>{
    //сохранить в БД
    let msgText = ctx.update.message.text
    
    ctx.wizard.state.data.contacts.mail = msgText.trim()
    ctx.wizard.state.data.wallpaper = ''

    //console.log(ctx.wizard.state.data)
    fillUser(ctx.wizard.state.data)

    await ctx.reply(REPLY_TEXT.fillBlog.finish, tutorialBtn)
    await ctx.scene.leave('fillBlogScene')
})

const fillBlogScene = new Scenes.WizardScene('fillBlogScene', aboutMeHandler,interestsHandler,contactTelegramHandler,contactMailHandler)

fillBlogScene
.enter(async ctx=>{
    ctx.reply(REPLY_TEXT.fillBlog.aboutMe, cancelFillBlogBtn)
})

module.exports = {
    fillBlogScene
}