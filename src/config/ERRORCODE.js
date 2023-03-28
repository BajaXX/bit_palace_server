module.exports = {
    BASE_ERROR: { ERRORCODE: 'JM000000', RESULT: '未知错误' },
    USER_NO_LOGIN: { ERRORCODE: 'JM000001', RESULT: '用户未登陆或登陆信息过期' },
    XTOKEN_IS_INVALID: { ERRORCODE: 'JM000002', RESULT: '登陆信息过期请重新登陆' },
    MSG_TOKEN_IS_ERROR: { ERRORCODE: 'JM000003', RESULT: '登陆信息有误请重新登陆' },
    PLEASE_RELOGIN: { ERRORCODE: 'JM000004', RESULT: '你的账号在其他设备登录，请重新登录' },
    VERIFY_FAIL_RELOGIN: { ERRORCODE: 'JM000005', RESULT: '验签失败，请用钱包重新登录' },
    //////////业务码10  用户类//////////////
    ADDRESS_IS_ERROR: { ERRORCODE: 'JM100001', RESULT: '钱包地址缺失' },
    BALANCE_DEFICIENCY: { ERRORCODE: 'JM100002', RESULT: '余额不足' },
    NO_NONCE: { ERRORCODE: 'JM100003', RESULT: '请获取nonce再登录' },
    //////////业务码11  用户类//////////////
    NO_USE_TRIPLE: { ERRORCODE: 'JM110001', RESULT: '没有更新的题目' },
    COMMIT_ERROR: { ERRORCODE: 'JM110002', RESULT: '提交答案失败' },

    CUSTOM_ERROR: customError
}

function customError(data) {
    return {
        ERRORCODE: 'JM000001',
        RESULT: data
    }
}
//错误码定义,以JM开头，两位业务吗，4位错误码
//业务码对照表
//10  用户类
//11  题库类
