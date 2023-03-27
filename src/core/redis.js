const redis = require('redis')
const { redisConfig_6001 } = require('../config')
// 创建客户端

const redisClient = redis.createClient(redisConfig_6001.port, redisConfig_6001.host, { db: redisConfig_6001.db })

redisClient.on('error', (err) => {
    console.log(`Redis err====>${err}`)
})
redisClient.on('connect', (err) => {
    console.log('Redis is connect:', redisConfig_6001.host, redisConfig_6001.port, redisConfig_6001.db)
})

/**
 * 设置 redis
 * @param {string} key 键
 * @param {string} val 值
 * @param {number} timeout 过期时间，UNIX timestamp
 */
function setKey(key, val, timeout) {
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }
    redisClient.set(key, val)
    if (timeout) {
        redisClient.expireat(key, timeout)
    }
}
/**
 * 设置 redis
 * @param {string} key 键
 * @param {string} field 值
 * @param {any} val 值
 */
function setHash(key, field, val) {
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }
    redisClient.hmset(key, field, val, () => {})
}

/**
 *  获取 redis
 * @param {string} key 键
 * @param {string} field 键
 */
function getHash(key, field) {
    return new Promise((resolve, reject) => {
        redisClient.hget(key, field, (err, val) => {
            if (err) {
                reject(err)
                return
            }
            if (val == null) {
                resolve(null)
                return
            }

            try {
                resolve(JSON.parse(val))
            } catch (ex) {
                resolve(val)
            }
        })
    })
}
/**
 *  获取 redis
 * @param {string} key 键
 */
function getKey(key) {
    return new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err)
                return
            }
            if (val == null) {
                resolve(null)
                return
            }

            try {
                resolve(JSON.parse(val))
            } catch (ex) {
                resolve(val)
            }
        })
    })
}

function exists(key) {
    return new Promise((resolve, reject) => {
        redisClient.exists(key, (err, val) => {
            if (err) {
                reject(err)
                return
            }
            resolve(val)
        })
    })
}

function del(key) {
    return new Promise((resolve, reject) => {
        redisClient.del(key, (err, val) => {
            if (err) {
                reject(err)
                return
            }
            resolve(val)
        })
    })
}

function hdel(key, field) {
    return new Promise((resolve, reject) => {
        redisClient.hdel(key, field, (err, val) => {
            if (err) {
                reject(err)
                return
            }
            resolve(val)
        })
    })
}

module.exports = {
    setKey,
    getKey,
    exists,
    del,
    hdel,
    setHash,
    getHash
}
