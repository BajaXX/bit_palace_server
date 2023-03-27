const { mysql_BITPALACE } = require('../core/mysql')
const { DataTypes, Model } = require('sequelize')

class ContractLog extends Model {}

ContractLog.init(
    {
        transferID: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: null,
            primaryKey: true,
            autoIncrement: false,
            comment: '对应的转账操作ID',
            field: 'transferID'
        },
        formUserID: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: '转出用户ID',
            field: 'formUserID'
        },
        toUserID: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: '转入用户ID',
            field: 'toUserID'
        },
        txID: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: '链上交易ID',
            field: 'txID'
        },
        status: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: '状态（1已发送，2已生效）',
            field: 'status'
        },
        updateTime: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: '更新时间，时间戳',
            field: 'updateTime'
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
    { sequelize: mysql_BITPALACE, tableName: 'ContractLog' }
)

module.exports = ContractLog
