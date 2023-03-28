const UserNonce = require('../models/UserNonce')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

class UserNonceDao {
    static async save(data) {
        data.updateTime = ~~(Date.now() / 1000)
        return UserNonce.upsert(data)
    }
    static async update(data) {
        return UserNonce.update(data, {
            where: {
                tokenID: data.walletAddress
            }
        })
    }
    static async delete(tokenID) {
        return UserNonce.destroy({
            where: {
                tokenID
            }
        })
    }
    static async getUserNonceByTokenID(tokenID) {
        return UserNonce.findOne({
            where: {
                tokenID
            },
            raw: true
        })
    }
}

module.exports = UserNonceDao
