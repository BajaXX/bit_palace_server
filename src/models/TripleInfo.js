const { mysql_BITPALACE } = require('../core/mysql')
const { DataTypes, Model } = require('sequelize')

class TripleInfo extends Model {}

TripleInfo.init(
    {
        tripleID: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: null,
            primaryKey: true,
            autoIncrement: false,
            comment: '三元组ID',
            field: 'tripleID'
        },
        subject: {
            type: DataTypes.STRING(128),
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: '主语',
            field: 'subject'
        },
        predicate: {
            type: DataTypes.STRING(128),
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: '谓语',
            field: 'predicate'
        },
        object: {
            type: DataTypes.STRING(512),
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: '宾语',
            field: 'object'
        },
        createTime: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: '创建时间，时间戳',
            field: 'createTime'
        }
    },
    { sequelize: mysql_BITPALACE, tableName: 'TripleInfo' }
)

module.exports = TripleInfo
