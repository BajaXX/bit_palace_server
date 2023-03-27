const { HttpException } = require('../core/http-exception')
const { logger } = require('./logger')
const catchError = async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        console.error(error)
        logger.error(error)
        const isHttpException = error instanceof HttpException

        if (isHttpException) {
            ctx.body = {
                ERRORCODE: error.code,
                RESULT: error.message
            }
            ctx.response.status = 200
        } else {
            ctx.body = error
            ctx.response.status = 200
        }
    }
}

module.exports = catchError
