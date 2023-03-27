const { mysql_BITPALACE } = require('../core/mysql')
const { DataTypes, Model } = require('sequelize')

class TransferLog extends Model {}

TransferLog.init(
    {
        transferID: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: null,
            primaryKey: true,
            autoIncrement: false,
            comment: '转账操作ID',
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
        amount: {
            type: DataTypes.INTEGER(10),
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: '转账数量',
            field: 'amount'
        },
        remark: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: '交易说明',
            field: 'remark'
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
    { sequelize: mysql_BITPALACE, tableName: 'TransferLog' }
)

module.exports = TransferLog
