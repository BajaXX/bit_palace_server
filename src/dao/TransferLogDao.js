const TransferLog = require('../models/TransferLog')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

class TransferLogDao {
    static async save(data) {
        return TransferLog.create(data)
    }
    static async update(data) {
        return TransferLog.update(data, {
            where: {
                id: data.id
            }
        })
    }
    static async delete(id) {
        return TransferLog.destroy({
            where: {
                id
            }
        })
    }
    static async getTransferLogById(pid) {
        return TransferLog.findOne({
            where: {
                pid
            }
        })
    }
    static async getTransferLogListById(pid, offset = 0, limit = 20) {
        return TransferLog.findAll({
            where: {
                pid
            },
            offset: offset * limit,
            limit: limit,
            order: [['ctime', 'ASC']]
        })
    }
}

module.exports = TransferLogDao
