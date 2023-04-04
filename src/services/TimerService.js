const { MUMBAI_RPC_URL, INFURA_API_KEY, REWARD_PK } = require('../config')
const { ONE_AWARD, CONTRACT_ADDRESS } = require('../config/contants')
const ERRORCODE = require('../config/ERRORCODE')
const OperationVerifyLogDao = require('../dao/OperationVerifyLogDao')
const UserInfoDao = require('../dao/UserInfoDao')
const BPTTokenService = require('./BPTTokenService')

class TimerService {
    static async correction() {
        console.log('执行批改任务')
        //获取所有状态为未处理的答案，挑出回答人超过3个的奇数的题号
        return await OperationVerifyLogDao.correctAnswers()
    }

    static async awardUser() {
        //获取全部已处理状态的答案
        const verifiedAnswers = await OperationVerifyLogDao.getVerifiedAnswers()
        //循环处理发送奖励
        //1 如果验证结果为正确，修改账户余额+5，反之-5，不管增减都将释放提交答案时的冻结金额数量
        for (const answer of verifiedAnswers) {
            const { id, verifyResult, tokenID, tripleID } = answer

            // Add or subtract 5 from user's account balance based on verification result
            const rewardAmount = verifyResult === 1 ? ONE_AWARD : -ONE_AWARD
            await UserInfoDao.updateBalanceAndFrozenToken(tokenID, tripleID, id, rewardAmount)
            //写入交易记录表
        }
    }

    static async recordOnChain() {
        const awardedUsers = await OperationVerifyLogDao.getAwardedUsers()
        // Create an instance of the BPTToken contract

        const bptTokenService = new BPTTokenService(MUMBAI_RPC_URL + INFURA_API_KEY, CONTRACT_ADDRESS, REWARD_PK)

        awardedUsers.forEach(async (user) => {
            const { tokenID, count, tripleIDs, ids } = user

            // Call the reward function of the BPTToken contract
            const amount = count * ONE_AWARD // Multiply the count by the reward amount per correct answer
            const description = JSON.stringify(tripleIDs)

            const tx = await bptTokenService.reward(tokenID, amount, description)
            // Update the txInfo field of the OperationVerifyLog record with the transaction hash
            if (tx) {
                await OperationVerifyLogDao.updateTxInfo(tx.transactionHash, tokenID, ids, amount)
                console.log(`Reward of ${amount} BPT tokens sent to ${tokenID} for answering ${count} questions correctly: ${description}`)
            } else {
                console.error(
                    `Reward of ${amount} BPT tokens sent to ${tokenID} for answering ${count} questions correctly: ${description}`
                )
            }
        })
    }
}

module.exports = TimerService
