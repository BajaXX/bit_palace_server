const crypto = require('crypto')
const { jiamaConfig, jwtConfig } = require('../config')
const jwt = require('jsonwebtoken')

module.exports = {
    createSign: (params) => {
        const Obj = { ...params, secret: jiamaConfig.secretKey }
        let array = []
        //字典排序
        for (let key in Obj) {
            array.push(key)
        }
        array.sort()
        let paramArray = []
        //拼接字符串
        for (let index in array) {
            let key = array[index]
            let value = Obj[key]

            paramArray.push(key + '' + value)
        }
        //sha1化
        let source = paramArray.join('')
        return crypto.createHash('sha1').update(source).digest('hex').toUpperCase()
    },
    generateToken: (params) => {
        return jwt.sign(params, jwtConfig.secretKey, {
            expiresIn: jwtConfig.expires
        })
    },
    //yyyyMMdd转yyyy-MM-dd
    formatDateNumber: (datenum) => {
        if (datenum) return (datenum + '').replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3')
        else return '0000-00-00'
    }
}
