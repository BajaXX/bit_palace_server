const Router = require('koa-router')
const UserCtrl = require('../../controller/UserCtrl')
const auth = require('../../middlewares/auth')
const router = new Router({
    prefix: '/api/user'
})

//user
router.post('/login', UserCtrl.login)
router.post('/getNonceToSign', UserCtrl.getNonceToSign)
router.post('/getUser', auth, UserCtrl.getUser)
router.post('/ping', UserCtrl.ping)

module.exports = router
