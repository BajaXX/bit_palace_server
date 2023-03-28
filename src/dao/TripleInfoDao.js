const TripleInfo = require('../models/TripleInfo')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

class TripleInfoDao {
    static async save(data) {
        return TripleInfo.create(data)
    }
    static async update(data) {
        return TripleInfo.update(data, {
            where: {
                tripleID: data.tripleID
            }
        })
    }

    static async getRandOne() {
        const randomTriple = await TripleInfo.findOne({
            where: Sequelize.literal(
                `NOT EXISTS (SELECT 1 FROM OperationVerifyLog WHERE OperationVerifyLog.tripleID = TripleInfo.tripleID)`
            ),
            order: Sequelize.literal('RAND()')
        })
        return randomTriple
    }

    static async delete(tripleID) {
        return TripleInfo.destroy({
            where: {
                tripleID
            }
        })
    }
    static async getTripleInfoBytripleID(ptripleID) {
        return TripleInfo.findOne({
            where: {
                ptripleID
            }
        })
    }
    static async getTripleInfoListBytripleID(ptripleID, offset = 0, limit = 20) {
        return TripleInfo.findAll({
            where: {
                ptripleID
            },
            offset: offset * limit,
            limit: limit,
            order: [['ctime', 'ASC']]
        })
    }
}

module.exports = TripleInfoDao
