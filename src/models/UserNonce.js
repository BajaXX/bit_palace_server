const { mysql_BITPALACE } = require('../core/mysql')
const { DataTypes, Model } = require('sequelize')

class UserNonce extends Model {}

UserNonce.init(
    {
        tokenID: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: null,
            primaryKey: true,
            autoIncrement: false,
            comment: null,
            field: 'tokenID'
        },
        nonce: {
            type: DataTypes.STRING(20),
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: 'nonce'
        },
        updateTime: {
            type: DataTypes.INTEGER(10),
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: 'updateTime'
        }
    },
    { sequelize: mysql_BITPALACE, tableName: 'UserNonce' }
)

module.exports = UserNonce
