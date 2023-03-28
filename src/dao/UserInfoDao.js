const UserInfo = require('../models/UserInfo')
const Sequelize = require('sequelize')
const ERRORCODE = require('../config/ERRORCODE')
const { ONE_AWARD, SYSTEM_ACCOUNT } = require('../config/contants')
const TransferLog = require('../models/TransferLog')
const { randomUUID } = require('crypto')
const { mysql_BITPALACE } = require('../core/mysql')

const Op = Sequelize.Op

class UserInfoDao {
    static async getAccessToken(tokenID) {
        return await UserInfo.findOne({
            where: {
                tokenID,
                status: 1
            },
            attributes: ['accessToken', 'expireTime'],
            raw: true
        })
    }
    static async getUserInfoByWalletAddress(tokenID) {
        const user = await UserInfo.findOne({
            where: {
                tokenID,
                status: 1
            },
            attributes: { exclude: ['accessToken', 'expireTime'] },
            raw: true
        })
        return user
    }

    static async updateUserToken(tokenID, accessToken, expireTime) {
        const [affectedCount] = await UserInfo.update(
            {
                accessToken: accessToken,
                expireTime: expireTime,
                updateTime: ~~(Date.now() / 1000)
            },
            {
                where: { tokenID: tokenID }
            }
        )
        return affectedCount
    }

    static async createUserInfo(data) {
        data.updateTime = ~~(Date.now() / 1000)
        return UserInfo.create(data)
    }
    static async updateUserInfo(data) {
        data.updateTime = ~~(Date.now() / 1000)
        const [affectedCount] = await UserInfo.update(data, {
            where: {
                tokenID: data.tokenID
            }
        })
        return affectedCount
    }

    static async updateBalanceAndFrozenToken(tokenID, id, balanceChange) {
        // 开启事务
        await mysql_BITPALACE
            .transaction(async (t) => {
                // 插入转账记录
                await TransferLog.create(
                    {
                        transferID: randomUUID().replace(/-/g, ''), // 生成去掉横杆的UUID
                        formUserID: SYSTEM_ACCOUNT, // 转出账户为系统固定账号
                        toUserID: tokenID,
                        amount: ONE_AWARD,
                        remark: balanceChange > 0 ? `奖励-${id}` : `惩罚-${id}`,
                        createTime: ~~(Date.now() / 1000) // 以秒为单位
                    },
                    { transaction: t }
                )
                const [affectedRowsUser] = await UserInfo.update(
                    {
                        balance: sequelize.literal(`balance + ${balanceChange}`),
                        frozenToken: sequelize.literal(`frozenToken - ${ONE_AWARD}`),
                        updateTime: sequelize.fn('UNIX_TIMESTAMP')
                    },
                    {
                        where: {
                            tokenID,
                            balance: { [Op.gte]: -balanceChange } // 只有当余额大于等于变化量的相反数时才更新，避免余额变成负数
                        },
                        transaction: t // 添加事务
                    }
                )
                if (affectedRowsUser !== 1) {
                    // 更新失败，抛出异常
                    throw ERRORCODE.BALANCE_DEFICIENCY
                }

                //修改系统的余额表
                const [affectedRowsSystem] = await UserInfo.update(
                    {
                        balance: sequelize.literal(`balance + ${balanceChange > 0 ? -ONE_AWARD : ONE_AWARD}`),
                        updateTime: sequelize.fn('UNIX_TIMESTAMP')
                    },
                    {
                        where: {
                            tokenID: SYSTEM_ACCOUNT
                        },
                        transaction: t // 添加事务
                    }
                )
                if (affectedRowsSystem !== 1) {
                    // 更新失败，抛出异常
                    throw ERRORCODE.BALANCE_DEFICIENCY
                }

                // 更新状态为已奖励
                await sequelize.query(`UPDATE OperationVerifyLog SET status = 2 WHERE status = 1 AND id='${id}')`, {
                    type: QueryTypes.UPDATE,
                    transaction: t
                })
            })
            .then(() => {
                console.log('Transaction has been committed')
            })
            .catch((error) => {
                console.error('Transaction has been rolled back', error)
            })
    }
}

module.exports = UserInfoDao
