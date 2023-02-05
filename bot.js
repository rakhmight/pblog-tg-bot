require('dotenv').config({ path: './config/.env' })
const mongoose = require('mongoose')
const { Scenes, Telegraf } = require('telegraf')
const { session } = require("telegraf-session-mongoose")

mongoose.set('strictQuery', false)

// Сцены
const { setInstScene } = require('./controllers/setInstScene')
const { fillBlogScene } = require('./controllers/fillBlogScene')

// Команды
const { start, help, startSetInst, cancelAction, confirmInst, cancelInst, startArticlesTutorial, startCardsTutorial, updateInstDatas, aboutMeCom, setTelegramCom, setMailCom, showInterests, addInterest } = require('./controllers/commands')

const bot = new Telegraf(process.env.BOT_TOKEN)
// Регистрация сцен
const stage = new Scenes.Stage([setInstScene, fillBlogScene])

async function initBot() {
    try {
        await mongoose.connect(process.env.BD_TOKEN, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            dbName: 'p-blog-sessions-db'
        })

        await bot
        .use(session({ collectionName: 'sessions' }))
        .use(stage.middleware())

        .start(start)
        .help(help)
        .command('instUpdate', updateInstDatas)
        .command('aboutme', aboutMeCom)
        .command('setTelegram', setTelegramCom)
        .command('setMail', setMailCom)
        .command('interests', showInterests)
        .command('addInt', addInterest)

        .action('initBlog', startSetInst)
        .action('initInstCancel', cancelAction)
        .action('confirmInst', confirmInst)
        .action('cancelInst', cancelInst)
        .action('blogFillCancel', cancelAction)
        .action('articlesTutorial', startArticlesTutorial)
        .action('cardsTutorial', startCardsTutorial)

        .launch({dropPendingUpdates: true})
    } catch (e) {
        console.log("\x1b[31m",`[!] (.bot) Ошибка запуска: ${e}`)
    }
}

initBot()