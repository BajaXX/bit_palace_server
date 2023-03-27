const xxx = require('../models/xxx')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

class xxxDao {
    static async save(data) {
        return xxx.create(data)
    }
    static async update(data) {
        return xxx.update(data, {
            where: {
                id: data.id
            }
        })
    }
    static async delete(id) {
        return xxx.destroy({
            where: {
                id
            }
        })
    }
    static async getxxxById(pid) {
        return xxx.findOne({
            where: {
                pid
            }
        })
    }
    static async getxxxListById(pid, offset = 0, limit = 20) {
        return xxx.findAll({
            where: {
                pid
            },
            offset: offset * limit,
            limit: limit,
            order: [['ctime', 'ASC']]
        })
    }
}

module.exports = xxxDao
