const OperationVerifyLog = require('../models/OperationVerifyLog')
const Sequelize = require('sequelize')
const { ONE_AWARD } = require('../config/contants')
const ERRORCODE = require('../config/ERRORCODE')
const { Transaction } = require('sequelize')
const Op = Sequelize.Op
const { mysql_BITPALACE } = require('../core/mysql')

class OperationVerifyLogDao {
    static async save(data) {
        await mysql_BITPALACE
            .transaction(async (t) => {
                // 冻结金额增加5，余额减少5
                const [affectedRows] = await UserInfo.update(
                    {
                        frozenToken: Sequelize.literal(`frozenToken + ${ONE_AWARD}`),
                        updateTime: Sequelize.fn('UNIX_TIMESTAMP')
                    },
                    {
                        where: {
                            tokenID,
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
            })
            .catch((error) => {
                console.error('Transaction has been rolled back', error)
            })
        // // 开启事务
        // const t = await Sequelize.transaction()
        // try {
        //     // 冻结金额增加5，余额减少5
        //     const [affectedRows] = await UserInfo.update(
        //         {
        //             frozenToken: Sequelize.literal(`frozenToken + ${ONE_AWARD}`),
        //             updateTime: Sequelize.fn('UNIX_TIMESTAMP')
        //         },
        //         {
        //             where: {
        //                 tokenID,
        //                 balance: { [Sequelize.Op.gte]: ONE_AWARD }
        //             },
        //             transaction: t
        //         }
        //     )

        //     if (affectedRows !== 1) {
        //         // 更新失败，回滚事务
        //         await t.rollback()
        //         throw new Error(`Failed to update UserInfo balance for tokenID ${tokenID}`)
        //     }

        //     // 插入答案记录
        //     await OperationVerifyLog.create(data, { transaction: t })

        //     // 提交事务
        //     await t.commit()
        // } catch (error) {
        //     // 回滚事务
        //     await t.rollback()
        //     throw error
        // }
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

        const [results] = await Sequelize.query(query, { type: QueryTypes.UPDATE })
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
}

module.exports = OperationVerifyLogDao
