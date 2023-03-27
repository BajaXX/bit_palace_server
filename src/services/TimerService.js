const ERRORCODE = require('../config/ERRORCODE')
const OperationVerifyLogDao = require('../dao/OperationVerifyLogDao')
const UserInfoDao = require('../dao/userInfoDao')

class TimerService {
    static async correction() {
        //获取所有状态为未处理的答案，挑出回答人超过3个的奇数的题号
        return await OperationVerifyLogDao.correctAnswers()
    }

    static async awardUser() {
        //获取全部已处理状态的答案
        const verifiedAnswers = await OperationVerifyLogDao.getVerifiedAnswers()
        //循环处理发送奖励
        //1 如果验证结果为正确，修改账户余额+5，反之-5，不管增减都将释放提交答案时的冻结金额数量
        for (const answer of verifiedAnswers) {
            const { id, verifyResult } = answer

            // Add or subtract 5 from user's account balance based on verification result
            const rewardAmount = verifyResult === 1 ? ONE_AWARD : -ONE_AWARD
            await UserInfoDao.updateBalanceAndFrozenToken(tokenID, id, rewardAmount)
            //写入交易记录表
        }
    }
}

module.exports = TimerService
