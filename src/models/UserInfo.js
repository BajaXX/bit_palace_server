const { mysql_BITPALACE } = require('../core/mysql')
const { DataTypes, Model } = require('sequelize')

class UserInfo extends Model {}

UserInfo.init(
    {
        tokenID: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: null,
            primaryKey: true,
            autoIncrement: false,
            comment: '钱包地址',
            field: 'tokenID'
        },
        balance: {
            type: DataTypes.INTEGER(10),
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: '余额数量',
            field: 'balance'
        },
        frozenToken: {
            type: DataTypes.INTEGER(10),
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: '冻结token数量',
            field: 'frozenToken'
        },
        accessToken: {
            type: DataTypes.STRING(50),
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: '访问令牌',
            field: 'accessToken'
        },
        expireTime: {
            type: DataTypes.INTEGER(10),
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: '令牌过期时间',
            field: 'expireTime'
        },
        status: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: '状态，用单个字符表示',
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
    { sequelize: mysql_BITPALACE, tableName: 'UserInfo' }
)

module.exports = UserInfo
