const Sequelize = require('sequelize')
const config = require('../../config')

const { host, user, password, database, port } = config.mysql_BITPALACE

const mysql_BITPALACE = new Sequelize(database, user, password, {
    dialect: 'mariadb',
    host,
    port,
    benchmark: true, // 在打印执行的SQL日志时输出执行时间（毫秒）
    dialectOptions: {
        timezone: 'Etc/GMT+8' //时间转换时从数据库得到的JavaScript时间。这个时区将应用于连接服务器的 NOW、CURRENT_TIMESTAMP或其它日期函数
    },
    pool: {
        max: 5,
        min: 1,
        acquire: 30000,
        idle: 10000
    },
    define: {
        underscored: false, //转换列名的驼峰命名规则为下划线命令规则
        timestamps: false //为模型添加 createdAt 和 updatedAt 两个时间戳字段
    },
    // logging: console.log //用于Sequelize日志打印的函数
    logging: false
})

mysql_BITPALACE
    .authenticate()
    .then(() => {
        console.log(`Connection has been mysql successfully.:${host}:${port}-----Database:[${database}]`)
    })
    .catch((err) => {
        console.error(`Unable to connect to the database:${host}:${port}`, err)
    })

module.exports = mysql_BITPALACE
