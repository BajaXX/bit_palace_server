const { mysql_BITPALACE } = require('../core/mysql')
const { DataTypes, Model } = require('sequelize')

class OperationVerifyLog extends Model {}

OperationVerifyLog.init(
    {
        id: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: null,
            primaryKey: true,
            autoIncrement: false,
            comment: 'id',
            field: 'id'
        },
        tripleID: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: '三元组ID',
            field: 'tripleID'
        },
        tokenID: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: '用户地址',
            field: 'tokenID'
        },
        userOperation: {
            type: DataTypes.STRING(3),
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: '用户操作选项（yes接受，no拒绝）',
            field: 'userOperation'
        },
        verifyResult: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: '验证结果（1正确，2错误）',
            field: 'verifyResult'
        },
        status: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: '状态（0未处理、1已处理、2已奖励，3已处罚）',
            field: 'status'
        },
        txInfo: {
            type: DataTypes.STRING(50),
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: '奖励相关的链上交易编号',
            field: 'txInfo'
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
    { sequelize: mysql_BITPALACE, tableName: 'OperationVerifyLog' }
)

module.exports = OperationVerifyLog
