const checkAccess = require('../utils/checkAccess')
const { initBlogBtn, cancelSetInstBtn } = require("../utils/buttons")
const { REPLY_TEXT } = require("../config/consts")
const { initUser, updateInst, getUserNick, updateAboutMe, updateContact, getInterests, createInterest } = require('../services/Blog')
const getUserProfile = require('../utils/getUserProfile')

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
    await initUser(ctx.wizard.state.data)
    let msg = ctx.update.callback_query.message

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

const updateInstDatas = async ctx =>{
    try {
        if(checkAccess.check(ctx.message.from.id)){
            let msg = ctx.update.message.text
    
            if(msg.includes('@', 11)){
                newUrl = msg.split(' ')
                newUrl = newUrl[1].replace('@','')
                getUserProfile(newUrl)
                .then(async (data)=>{
                    if(!data){
                        await ctx.reply('❌ Указана не верная @ссылка либо повторите попытку ещё раз')
                        return
                    }
                    await updateInst(data)
                    await ctx.reply(`📝 Данные Instagram были обновлены:\n| Полное имя: ${data.username}\n| Ник: ${data.nick}\n| Кол-во публикаций: ${data.publicationsCount}\n| Кол-во подписчиков: ${data.subsCount}\n| Bio: ${data.bio}\n🎆 Фотография обновлена`)
                })
            } else{
                await getUserNick()
                .then(async (res)=>{
                    await getUserProfile(res)
                    .then(async (data)=>{
                        if(!data){
                            await ctx.reply('❌ Указана не верная @ссылка либо повторите попытку ещё раз')
                            return
                        }
                        await updateInst(data)
                        await ctx.reply(`📝 Данные Instagram были обновлены:\n| Полное имя: ${data.username}\n| Ник: ${data.nick}\n| Кол-во публикаций: ${data.publicationsCount}\n| Кол-во подписчиков: ${data.subsCount}\n| Bio: ${data.bio}\n🎆 Фотография обновлена`)
                    })
                })
            }
        } else{
            ctx.reply(REPLY_TEXT.notAccess)
        }
    } catch (e) {
        console.log("\x1b[31m",`[!] (.commands>updateInstDatas) Ошибка запуска: ${e}`)
    }
}

const aboutMeCom = async ctx => {
    try {
        if(checkAccess.check(ctx.message.from.id)){
            let msg = ctx.update.message.text
            msg = msg.replace('/aboutme', '')
            msg = msg.trim()

            if(msg.length == 0){
                ctx.reply('❗️ Необходимо ввести новые данные для изменения информации о себе')
            } else{
                updateAboutMe(msg)
                .then(()=>{
                    ctx.reply('✅ Инфомация о себе была изменена')
                })
            }
        } else{
            ctx.reply(REPLY_TEXT.notAccess)
        }
    } catch (e) {
        console.log("\x1b[31m",`[!] (.commands>aboutMeCom) Ошибка запуска: ${e}`)
    }
}

const setTelegramCom = async ctx => {
    try {
        if(checkAccess.check(ctx.message.from.id)){
           let msg = ctx.update.message.text
           msg = msg.replace('/setTelegram','')
           msg = msg.replace('@','')
           msg = msg.replace('https://t.me/', '')
           msg = msg.trim()

           if(msg.length == 0){
            ctx.reply('⛔️ Необходимо ввести сокращённую @ либо полную ссылку на телеграм')
           } else{
            updateContact(msg,1)
            .then(()=>{
                ctx.reply('✅ Контакт телеграма был изменён')
            })
           }
        } else{
            ctx.reply(REPLY_TEXT.notAccess)
        }
    } catch (e) {
        console.log("\x1b[31m",`[!] (.commands>setTelegramCom) Ошибка запуска: ${e}`)
    }
}

const setMailCom = async ctx => {
    try {
        if(checkAccess.check(ctx.message.from.id)){
           let msg = ctx.update.message.text
           msg = msg.replace('/setMail','')
           msg = msg.trim()

           if(msg.length == 0){
            ctx.reply('⛔️ Необходимо ввести новый контакт почты в формате: somebody@mail.com')
           } else{
            updateContact(msg,2)
            .then(()=>{
                ctx.reply('✅ Контакт почты был изменён')
            })
           }

        } else{
            ctx.reply(REPLY_TEXT.notAccess)
        }
    } catch (e) {
        console.log("\x1b[31m",`[!] (.commands>setMailCom) Ошибка запуска: ${e}`)
    }
}

const showInterests = async ctx => {
    try {
        if(checkAccess.check(ctx.message.from.id)){
            getInterests()
            .then((data)=>{
                ctx.replyWithHTML(showInterestingsList(data, 1))
            })
        } else{
            ctx.reply(REPLY_TEXT.notAccess)
        }
    } catch (e) {
        console.log("\x1b[31m",`[!] (.commands>showInterests) Ошибка запуска: ${e}`)
    }
}

const addInterest = async ctx => {
    try {
        if(checkAccess.check(ctx.message.from.id)){
           let msg = ctx.update.message.text
           msg = msg.replace('/addInt','')
           msg = msg.trim()

           if(msg.length == 0){
            ctx.reply('⛔️ Использование: /addInt <emoji> <интерес>')
           } else{
            let emoji = msg.split(' ')

            emoji = emoji[0]

            msg = msg.replace(msg[0], '')
            msg = msg.trim()

            createInterest(emoji,msg)
            .then((data)=>{
                if(!data){
                    ctx.reply('⛔️ Выбранный emoji не поддерживается')
                    return
                }
                ctx.replyWithHTML(showInterestingsList(data, 2))
            })
            
           }

        } else{
            ctx.reply(REPLY_TEXT.notAccess)
        }
    } catch (e) {
        console.log("\x1b[31m",`[!] (.commands>addInterest) Ошибка запуска: ${e}`)
    }
}

// const TemplateCom = async ctx => {
//     try {
//         if(checkAccess.check(ctx.message.from.id)){
//            let msg = ctx.update.message.text

//         } else{
//             ctx.reply(REPLY_TEXT.notAccess)
//         }
//     } catch (e) {
//         console.log("\x1b[31m",`[!] (.commands>TemplateCom) Ошибка запуска: ${e}`)
//     }
// }


function showInterestingsList (data, status){
    let result
    if(status == 1){
        result = '📜 Список интересов:\n'
    } else if(status = 2){
        result = '✅ Список интересов обновлён:\n'
    }

    for(let i = 0; i != data.length; i++){
        result+=`\n${i}. ${data[i].name} - ${data[i].emoji || '<i>emoji не установлен</i>'}`
    }

    return result
}

module.exports = {
    start,
    help,
    startSetInst,
    cancelAction,
    cancelInst,
    confirmInst,
    startArticlesTutorial,
    startCardsTutorial,
    updateInstDatas,
    aboutMeCom,
    setTelegramCom,
    setMailCom,
    showInterests,
    addInterest
}