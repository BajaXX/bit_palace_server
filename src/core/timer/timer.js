const schedule = require('node-schedule')
const TimerService = require('../../services/TimerService')

module.exports = {
    init: () => {
        //每小时批改提交答案
        schedule.scheduleJob('0 0 * * * *', () => {
            TimerService.correction()
        })

        //每小时发放奖励
        schedule.scheduleJob('0 0 * * * *', () => {
            TimerService.awardUser()
        })
    }
}
