const jwt = require('jsonwebtoken')
const { jwtConfig, TOKEN_KEY, environments } = require('../config')
const ERRORCODE = require('../config/ERRORCODE')
const UserInfoDao = require('../dao/userInfoDao')

const auth = async (ctx, next) => {
    const xAuthToken = ctx.request.headers['x-auth-token']
    // 无带token
    if (!xAuthToken) {
        console.log(ctx.request.path)
        throw ERRORCODE.USER_NO_LOGIN
    }
    try {
        let user = jwt.verify(xAuthToken, jwtConfig.secretKey)
        const isToken = await UserInfoDao.getAccessToken(user.tokenID)
        // const isToken = await redis.getHash(TOKEN_KEY, user.uid)
        if (!isToken) {
            throw ERRORCODE.USER_NO_LOGIN
        }
        ctx.state.userInfo = user
        ctx.request.body.walletaddress = user.tokenID
        if (process.env.NODE_ENV == 'development') console.log(ctx.request.path + ':', ctx.request.body)
    } catch (error) {
        console.log('error:', error.name)
        if (error.name === 'TokenExpiredError') {
            // token 不合法 过期
            throw ERRORCODE.XTOKEN_IS_INVALID
        } else {
            console.log('error:', error)
        }
    }

    await next()
}
module.exports = auth
