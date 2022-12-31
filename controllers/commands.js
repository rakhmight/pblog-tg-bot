const checkAccess = require('../utils/checkAccess')
const { initBlogBtn, cancelSetInstBtn } = require("../utils/buttons")
const { REPLY_TEXT } = require("../config/consts")
const { initUser } = require('../services/Blog')

const start = async ctx =>{
    try {
        let user = ctx.update.message.from
        if(checkAccess.check(ctx.message.from.id)){
            ctx.replyWithHTML(`✌️ Привет, <a href="tg://user?id=${user.id}">${user.first_name}</a>!\n${REPLY_TEXT.getStart}`,
            {
                disable_web_page_preview: true,
                parse_mode: 'HTML',
                ...initBlogBtn
            })
        } else {
            ctx.reply(REPLY_TEXT.notAccess)
        }
    } catch (e) {
        console.log("\x1b[31m",`[!] (.commands>start) Ошибка запуска: ${e}`)
    }
}

const help = ctx =>{
    try {
        if(checkAccess.check(ctx.message.from.id)){
            ctx.replyWithHTML(REPLY_TEXT.help)
        } else{
            ctx.reply(REPLY_TEXT.notAccess)
        }
    } catch (e) {
        console.log("\x1b[31m",`[!] (.commands>help) Ошибка запуска: ${e}`)
    }
}

const startSetInst = async ctx =>{
    try {
        await ctx.answerCbQuery()
        let msg = ctx.update.callback_query.message
        await ctx.telegram.editMessageText(msg.chat.id, msg.message_id,0,REPLY_TEXT.getInst.getURL, { inline_keyboard: false })
        await ctx.scene.enter('setInstScene')
    } catch (e) {
        console.log("\x1b[31m",`[!] (.commands>startSetInst) Ошибка запуска: ${e}`)
    }
}

const cancelAction = async ctx =>{
    try {
        let currentScene = ctx.session.__scenes.current
        let msg = ctx.update.callback_query.message
        if(currentScene){
            await ctx.reply('🚫 Отменено')
            await ctx.scene.leave('setInstScene')
        } else{
            await ctx.reply('❗️ В данный момент вы ничего не делаете')
        }
        await ctx.telegram.deleteMessage(msg.chat.id, msg.message_id)
    } catch (e) {
        console.log("\x1b[31m",`[!] (.commands>cancelAction) Ошибка запуска: ${e}`)
    }
}

const confirmInst = async ctx=>{
    let msgCaption = ctx.update.callback_query.message.caption
    let msg = ctx.update.callback_query.message
    let instURL = new RegExp(/https:\/\/www\.instagram\.com\/.*/i)
    let matchInstUrl = msgCaption.match(instURL)
    //matchInstUrl[0] - ссылка которую нужно сохранить в БД
    initUser(matchInstUrl[0])

    await ctx.telegram.deleteMessage(msg.chat.id, msg.message_id)
    await ctx.scene.leave('setInstScene')
    await ctx.scene.enter('fillBlogScene')
}

const cancelInst = async ctx=>{
    try {
        let msg = ctx.update.callback_query.message
        await ctx.telegram.deleteMessage(msg.chat.id, msg.message_id)
        await ctx.replyWithHTML(REPLY_TEXT.getInst.urlFormat, cancelSetInstBtn)
    } catch (e) {
        console.log("\x1b[31m",`[!] (.commands>cancelInst) Ошибка запуска: ${e}`)
    }
}

const startArticlesTutorial = async ctx =>{
    try {
        await ctx.reply('articles')
        
        let msg = ctx.update.callback_query.message
        await ctx.telegram.deleteMessage(msg.chat.id, msg.message_id)
    } catch (e) {
        console.log("\x1b[31m",`[!] (.commands>startArticlesTutorial) Ошибка запуска: ${e}`)
    }
}

const startCardsTutorial = async ctx =>{
    try {
        await ctx.reply('cards')
        
        let msg = ctx.update.callback_query.message
        await ctx.telegram.deleteMessage(msg.chat.id, msg.message_id)
    } catch (e) {
        console.log("\x1b[31m",`[!] (.commands>startCardsTutorial) Ошибка запуска: ${e}`)
    }
}

module.exports = {
    start,
    help,
    startSetInst,
    cancelAction,
    cancelInst,
    confirmInst,
    startArticlesTutorial,
    startCardsTutorial
}