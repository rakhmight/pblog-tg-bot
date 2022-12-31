const { Markup } = require('telegraf')
const { BUTTONS_TEXT } = require('../config/consts')

const initBlogBtn = Markup.inlineKeyboard([
    Markup.button.callback(
        BUTTONS_TEXT.initBlog,
        'initBlog'
    ),
])

const cancelSetInstBtn = Markup.inlineKeyboard([
    Markup.button.callback(
        '❌ отменить',
        'initInstCancel'
    ),
])

const checkInstBtn = Markup.inlineKeyboard([
    Markup.button.callback(
        'да ✔️',
        'confirmInst'
    ),
    Markup.button.callback(
         'нет ❌',
        'cancelInst'
    )
])

const cancelFillBlogBtn = Markup.inlineKeyboard([
    Markup.button.callback(
        '❌ отменить',
        'blogFillCancel'
    ),
])

const tutorialBtn = Markup.inlineKeyboard([
    [
        Markup.button.callback(
            '📰 публикации 📰',
            'articlesTutorial'
        ),
        Markup.button.callback(
            '🔖 аниме-карточки 🔖',
            'cardsTutorial'
        ),
    ],
    [
        Markup.button.url(
            '🌠 перейти в блог',
            'google.com'
        )
    ]
])

module.exports = {
    initBlogBtn,
    cancelSetInstBtn,
    checkInstBtn,
    cancelFillBlogBtn,
    tutorialBtn
}