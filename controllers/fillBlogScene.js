const { Scenes, Composer } = require('telegraf')
const { REPLY_TEXT } = require('../config/consts')
const { cancelFillBlogBtn, tutorialBtn } =require('../utils/buttons')
const { fillUser } = require('../services/Blog')

// Обработчики
const aboutMeHandler = new Composer()
aboutMeHandler.on('text', async ctx =>{
    ctx.wizard.state.data = {}
    let msgText = ctx.update.message.text

    ctx.wizard.state.data.aboutMe = msgText

    await ctx.reply(REPLY_TEXT.fillBlog.interestings, cancelFillBlogBtn)
    return ctx.wizard.next()
})

const interestsHandler = new Composer()
interestsHandler.on('text', async ctx=>{
    // разбор и сохранение Interests в БД
    let msgText = ctx.update.message.text

    // !!!!! возможность дальше устанавливать эмодзи
    
    ctx.wizard.state.data.interestings = msgText.replace(/ /g,'').split(',')

    await ctx.reply(REPLY_TEXT.fillBlog.telegram, cancelFillBlogBtn)
    return ctx.wizard.next()
})

const contactTelegramHandler = new Composer()
contactTelegramHandler.on('text', async ctx=>{
    //сохранить в БД
    let msgText = ctx.update.message.text
    ctx.wizard.state.data.contacts = {}
    
    ctx.wizard.state.data.contacts.telegram = msgText
    
    await ctx.reply(REPLY_TEXT.fillBlog.mail, cancelFillBlogBtn)
    return ctx.wizard.next()
})

const contactMailHandler = new Composer()
contactMailHandler.on('text', async ctx=>{
    //сохранить в БД
    let msgText = ctx.update.message.text
    
    ctx.wizard.state.data.contacts.mail = msgText

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