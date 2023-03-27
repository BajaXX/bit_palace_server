const UserNonce = require('../models/UserNonce')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

class UserNonceDao {
    static async save(data) {
        return UserNonce.create(data)
    }
    static async update(data) {
        return UserNonce.update(data, {
            where: {
                tokenID: data.tokenID
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
            }
        })
    }
}

module.exports = UserNonceDao
