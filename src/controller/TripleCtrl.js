const Common = require('../common')
const TripleInfoDao = require('../dao/TripleInfoDao')
const ERRORCODE = require('../config/ERRORCODE')
const OperationVerifyLogDao = require('../dao/OperationVerifyLogDao')
const { randomUUID } = require('crypto')
class TripleCtrl {
    static async getOneTriple(ctx) {
        try {
            const { walletAddress } = ctx.request.body
            // 根据钱包地址查询用户信息，如果不存在则创建新用户并返回nonce值

            const one = await TripleInfoDao.getRandOne()
            if (one) {
                Common.sendResult(ctx, one)
            } else {
                Common.sendResult(ctx, ERRORCODE.NO_USE_TRIPLE)
            }
        } catch (error) {
            console.log(error)
            Common.sendResult(ctx, ERRORCODE.BASE_ERROR)
        }
    }

    static async commitAnswer(ctx) {
        try {
            const { walletAddress, tripleID, yesOrNo } = ctx.request.body
            const uuid = randomUUID().replace(/-/g, '')
            // 判断余额是否够
            const answer = {
                id: uuid,
                tripleID: tripleID,
                tokenID: walletAddress,
                userOperation: yesOrNo,
                status: 0,
                createTime: ~~(Date.now() / 1000),
                updateTime: ~~(Date.now() / 1000)
            }
            const result = await OperationVerifyLogDao.save(answer)
            Common.sendResult(ctx, { tripleID, result: result })
        } catch (error) {
            console.log(error)
            Common.sendResult(ctx, ERRORCODE.BASE_ERROR)
        }
    }
}

module.exports = TripleCtrl
