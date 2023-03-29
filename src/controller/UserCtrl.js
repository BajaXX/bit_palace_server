const Common = require('../common')
const UserInfoDao = require('../dao/UserInfoDao')
const UserNonceDao = require('../dao/UserNonceDao')
const ERRORCODE = require('../config/ERRORCODE')
const { recoverAddress } = require('../libs/web3')
const dayjs = require('dayjs')
const { generateToken } = require('../libs/utils')
const { jwtConfig, VERIFY_CODE_EXPIRE, SIGNATURE_DESCRIPTION } = require('../config')

class UserCtrl {
    static async getNonceToSign(ctx) {
        try {
            const { walletAddress } = ctx.request.body
            // 根据钱包地址查询用户信息，如果不存在则创建新用户并返回nonce值

            const nonce = Math.floor(Math.random() * 1000000000).toString()
            // 更新用户的nonce值
            await UserNonceDao.save({ tokenID: walletAddress, nonce })
            Common.sendResult(ctx, nonce)
        } catch (error) {
            console.log(error)
            Common.sendResult(ctx, ERRORCODE.BASE_ERROR)
        }
    }
    static async ping(ctx) {
        Common.sendResult(ctx, ~~(Date.now() / 1000))
    }

    static async login(ctx) {
        try {
            const { walletAddress, signature } = ctx.request.body
            if (!walletAddress) {
                Common.sendResult(ctx, ERRORCODE.ADDRESS_IS_ERROR)
                return
            }

            const existingNonce = await UserNonceDao.getUserNonceByTokenID(walletAddress)
            if (!existingNonce) throw ERRORCODE.NO_NONCE

            const recoveredAddress = recoverAddress(SIGNATURE_DESCRIPTION + existingNonce.nonce, signature)
            // 对签名进行验证，确认签名是由用户钱包生成的，并且签名内容正确
            if (recoveredAddress.toLowerCase() !== walletAddress) {
                Common.sendResult(ctx, ERRORCODE.VERIFY_FAIL_RELOGIN)
                return
            }

            // 查询用户信息
            let userInfo = await UserInfoDao.getUserInfoByWalletAddress(walletAddress)

            const expireTime = dayjs().add(jwtConfig.expires, 'second').unix()
            const nowTime = ~~(Date.now() / 1000)

            if (userInfo) {
                const token = generateToken({ tokenID: userInfo.tokenID, regTime: userInfo.createTime })
                //新生成accessToken 修改数据后返回
                if (nowTime > userInfo.expireTime) {
                    Common.sendResult(ctx, ERRORCODE.XTOKEN_IS_INVALID)
                    return
                }

                userInfo.accessToken = token
                userInfo.expireTime = expireTime
                const affectedCount = await UserInfoDao.updateUserInfo(userInfo)
                if (affectedCount > 0) {
                    await UserNonceDao.delete(walletAddress)
                    Common.sendResult(ctx, userInfo)
                } else {
                    Common.sendResult(ctx, ERRORCODE.MSG_TOKEN_IS_ERROR)
                }
            } else {
                const token = generateToken({ tokenID: walletAddress, regTime: nowTime })
                // 如果用户不存在则创建用户
                const newUser = {
                    tokenID: walletAddress,
                    balance: 500,
                    frozenToken: 0,
                    accessToken: token,
                    expireTime,
                    status: 1,
                    updateTime: nowTime,
                    createTime: nowTime
                }
                await UserInfoDao.createUserInfo(newUser)
                await UserNonceDao.delete(walletAddress)
                Common.sendResult(ctx, newUser)
            }
        } catch (e) {
            console.log(e)
            Common.sendResult(ctx, e)
        }
    }

    static async getUser(ctx) {
        try {
            const { walletAddress } = ctx.request.body
            if (!walletAddress) {
                Common.sendResult(ctx, ERRORCODE.ADDRESS_IS_ERROR)
                return
            }

            const res = await UserInfoDao.getUserInfoByWalletAddress(walletAddress)

            Common.sendResult(ctx, res)
        } catch (e) {
            console.log(e)
            if (e.ERRORCODE == 'JM000001') {
                Common.sendResult(ctx, e)
            } else {
                Common.sendResult(ctx, ERRORCODE.BASE_ERROR)
            }
        }
    }
}

module.exports = UserCtrl
