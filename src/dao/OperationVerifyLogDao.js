const OperationVerifyLog = require('../models/OperationVerifyLog')
const Sequelize = require('sequelize')
const { ONE_AWARD } = require('../config/contants')
const ERRORCODE = require('../config/ERRORCODE')
const { Transaction } = require('sequelize')
const Op = Sequelize.Op
const QueryTypes = Sequelize.QueryTypes
const { mysql_BITPALACE } = require('../core/mysql')
const UserInfo = require('../models/UserInfo')
const _ = require('lodash')

class OperationVerifyLogDao {
    static async save(data) {
        return await mysql_BITPALACE
            .transaction(async (t) => {
                // 冻结金额增加5，余额减少5
                const [affectedRows] = await UserInfo.update(
                    {
                        frozenToken: Sequelize.literal(`frozenToken + ${ONE_AWARD}`),
                        updateTime: Sequelize.fn('UNIX_TIMESTAMP')
                    },
                    {
                        where: {
                            tokenID: data.tokenID,
                            balance: { [Sequelize.Op.gte]: ONE_AWARD }
                        },
                        transaction: t
                    }
                )

                if (affectedRows !== 1) {
                    // 更新失败，回滚事务
                    throw ERRORCODE.COMMIT_ERROR
                }

                // 插入答案记录
                await OperationVerifyLog.create(data, { transaction: t })
            })
            .then(() => {
                console.log('Transaction has been committed')
                return true
            })
            .catch((error) => {
                if (error.message === 'Validation error') {
                    console.error('Transaction has been rolled back', error.message)
                    throw ERRORCODE.DUPLICATE_COMMIT
                } else {
                    throw ERRORCODE.COMMIT_ERROR
                }
            })
    }
    static async update(data) {
        return OperationVerifyLog.update(data, {
            where: {
                id: data.id
            }
        })
    }
    static async delete(id) {
        return OperationVerifyLog.destroy({
            where: {
                id
            }
        })
    }
    static async getVerifiedAnswers() {
        const verifiedAnswers = await OperationVerifyLog.findAll({
            where: {
                status: 1
            }
        })
        return verifiedAnswers
    }

    static async getAwardedUsers() {
        const awardedUsers = await OperationVerifyLog.findAll({
            where: {
                status: 2,
                txInfo: null,
                verifyResult: 1
            },
            attributes: ['id', 'tokenID', 'tripleID']
        })

        const grouped = _.groupBy(awardedUsers, 'tokenID')
        const result = _.map(grouped, (group) => {
            const ids = _.map(group, 'id')
            const tripleIDs = _.map(group, 'tripleID')
            return {
                tokenID: group[0].tokenID,
                count: group.length,
                tripleIDs,
                ids
            }
        })

        return result
    }

    static async correctAnswers() {
        const query = `
                    UPDATE OperationVerifyLog a
                    INNER JOIN (
                    SELECT tripleID,
                        CASE WHEN SUM(CASE WHEN userOperation = 'yes' THEN 1 ELSE 0 END)
                                >= SUM(CASE WHEN userOperation = 'no' THEN 1 ELSE 0 END)
                            THEN 'yes' ELSE 'no' END AS correct_answer
                    FROM OperationVerifyLog
                    WHERE status = 0
                    GROUP BY tripleID
                    HAVING COUNT(*) >= 3 AND COUNT(*) % 2 = 1
                    ) b ON a.tripleID = b.tripleID
                    SET a.verifyResult = CASE WHEN a.userOperation = b.correct_answer THEN '1' ELSE '2' END,
                    a.status = 1,
                        a.updateTime = UNIX_TIMESTAMP()
                    WHERE a.status = 0;
                `
        const [results] = await mysql_BITPALACE.query(query, { type: QueryTypes.UPDATE })
        return results
    }
    static async getOperationVerifyLogById(pid) {
        return OperationVerifyLog.findOne({
            where: {
                pid
            }
        })
    }
    static async getOperationVerifyLogListById(tripleID) {
        return OperationVerifyLog.findAll({
            where: {
                tripleID,
                status: 0
            }
        })
    }

    static async updateTxInfo(txHash, tokenID, ids, amount) {
        let updatedRows = 0

        await mysql_BITPALACE.transaction(async (t) => {
            // 将需要更新 txInfo 的数据的 txInfo 字段值修改为 txHash
            updatedRows = await OperationVerifyLog.update(
                { txInfo: txHash, status: 3 },
                { where: { id: { [Sequelize.Op.in]: ids }, tokenID: tokenID, txInfo: null }, transaction: t }
            )

            console.log(updatedRows[0], ids.length)

            // 如果更新行数不等于 ids 数组的长度，则说明更新失败，回滚事务
            if (updatedRows[0] !== ids.length) {
                throw new Error('Failed to update txInfo')
            }

            // 更新用户表的余额
            const [affectedRows] = await UserInfo.update(
                { balance: Sequelize.literal(`balance - ${amount}`), updateTime: Sequelize.fn('UNIX_TIMESTAMP') },
                {
                    where: { tokenID: tokenID, [Sequelize.Op.and]: Sequelize.literal(`balance - frozenToken >= ${ONE_AWARD}`) },
                    transaction: t
                }
            )

            // 如果更新行数不等于 1，则说明更新失败，回滚事务
            if (affectedRows !== 1) {
                throw new Error('Failed to update user balance')
            }
        })

        return updatedRows
    }
}

module.exports = OperationVerifyLogDao
