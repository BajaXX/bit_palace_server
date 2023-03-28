class Common {
    static sendResult(ctx, data) {
        ctx.response.status = 200
        if (data.ERRORCODE) {
            console.log('-------------ERROR:', ctx.path, data.ERRORCODE, data.RESULT)
            ctx.body = {
                ERRORCODE: data.ERRORCODE
                // RESULT: data.RESULT
            }
        } else {
            if (Object.prototype.toString.call(data) == '[object Error]') {
                ctx.body = {
                    ERRORCODE: 'JM000000'
                    // RESULT: 'Unknown error'
                }
            } else {
                ctx.body = {
                    ERRORCODE: 0,
                    RESULT: data
                }
            }
        }
    }
    static sendSuccess(ctx) {
        ctx.response.status = 200
        ctx.body = {
            ERRORCODE: 0,
            RESULT: 'OK'
        }
    }
}

module.exports = Common
