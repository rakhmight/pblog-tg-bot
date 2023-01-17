const { Scenes, Composer } = require('telegraf')
const { REPLY_TEXT } = require('../config/consts')
const { cancelSetInstBtn, checkInstBtn } = require('../utils/buttons')
const instURL = new RegExp(/@.*/i)
//const { getPic } = require('../utils/screenFromInst')
const path = require('path')
const getUserProfile = require('../utils/getUserProfile')

// Обработчики
const queryInstHandler = new Composer()
queryInstHandler.on('text', async ctx =>{
    ctx.wizard.state.data = {}
    let msg = ctx.update.message.text
    function checkInstUrl(str) {
        let result = str.match(instURL)
        if(!result){
            return false
        }
        result = result[0]
        result = result.replace(/ .*/, '')
        result = result.replace('@','')
        return result
    }
    let instUrl = checkInstUrl(msg)
    let timerIsWork = true

    if(instUrl){
        let delayData = await ctx.reply(REPLY_TEXT.getInst.delay)
        let delayMsgId = delayData.message_id
        let delayChatId = delayData.chat.id
        let counter = 9
        let delayInterval = setInterval(()=>{
            if(counter == 0){
                clearInterval(delayInterval)
            }

            // проблема
            if(timerIsWork){
                ctx.telegram.editMessageText(delayChatId, delayMsgId, 0,`⏳ Подождите ${counter} секунд..`)
            }
            counter--
        },1000)

        await getUserProfile(instUrl)
        .then((data)=>{
            ctx.reply(`${REPLY_TEXT.getInst.confirm}\n| Полное имя: ${data.username}\n| Ник: ${data.nick}\n| Кол-во публикаций: ${data.publicationsCount}\n| Кол-во подписчиков: ${data.subsCount}\n| Bio: ${data.bio}\n🎆 Фотография установлена`,checkInstBtn)
            ctx.wizard.state.data = { ...data }
            timerIsWork = false
            ctx.telegram.deleteMessage(delayChatId,delayMsgId)
        })

    } else{
        ctx.replyWithHTML(REPLY_TEXT.getInst.urlFormat, cancelSetInstBtn)
    }
    
})

const setInstScene = new Scenes.WizardScene('setInstScene', queryInstHandler)

setInstScene
.enter(async ctx => {
    await ctx.replyWithHTML(REPLY_TEXT.getInst.urlFormat, cancelSetInstBtn)
})

module.exports = {
    setInstScene
}