// Проверяем пользователя на права
const { ADMINS } = require('../config/consts')

module.exports = {
    check: (userId) => {
        for (let i = 0; i != ADMINS.length; i++) {
            if(userId == ADMINS[i]){
                return true
            }
        }
        return false
    }
}