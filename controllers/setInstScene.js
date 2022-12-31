const { Scenes, Composer } = require('telegraf')
const { REPLY_TEXT } = require('../config/consts')
const { cancelSetInstBtn, checkInstBtn } = require('../utils/buttons')
const instURL = new RegExp(/https:\/\/www\.instagram\.com\/.*/i)
const { getPic } = require('../utils/screenFromInst')
const path = require('path')

// Обработчики
const queryInstHandler = new Composer()
queryInstHandler.on('text', async ctx =>{
    let msg = ctx.update.message.text
    let checkInstUrl = msg.match(instURL)

    if(checkInstUrl){
        let delayData = await ctx.reply(REPLY_TEXT.getInst.delay)
        let delayMsgId = delayData.message_id
        let delayChatId = delayData.chat.id
        let counter = 9
        let delayInterval = setInterval(()=>{
            if(counter == 0){
                clearInterval(delayInterval)
            }

            ctx.telegram.editMessageText(delayChatId, delayMsgId, 0,`⏳ Подождите ${counter} секунд..`)
            counter--
        },1000)

        await getPic(checkInstUrl[0])
        setTimeout(()=>{
            ctx.replyWithPhoto({source: path.join(__dirname, '..', 'media/inst.png')}, {
                caption: `${REPLY_TEXT.getInst.confirm}\n${checkInstUrl[0]}`,
                ...checkInstBtn
            })
            ctx.telegram.deleteMessage(delayChatId,delayMsgId)
        }, 6000)

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