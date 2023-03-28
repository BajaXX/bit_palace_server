const Router = require('koa-router')
const TripleCtrl = require('../../controller/TripleCtrl')
const auth = require('../../middlewares/auth')
const router = new Router({
    prefix: '/api/triple'
})

//Triple
router.post('/getOneTriple', auth, TripleCtrl.getOneTriple)
router.post('/commitAnswer', auth, TripleCtrl.commitAnswer)

module.exports = router
