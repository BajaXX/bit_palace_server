const Router = require('koa-router')
const UserCtrl = require('../../controller/UserCtrl')
const auth = require('../../middlewares/auth')
const router = new Router({
    prefix: '/api/user'
})

//user
router.post('/login', UserCtrl.login)
router.post('/getUser', auth, UserCtrl.getUser)

module.exports = router
