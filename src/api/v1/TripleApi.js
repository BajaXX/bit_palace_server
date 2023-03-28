const Router = require('koa-router')
const TripleCtrl = require('../../controller/TripleCtrl')
const auth = require('../../middlewares/auth')
const router = new Router({
    prefix: '/api/triple'
})

//Triple
router.post('/getOneTriple', TripleCtrl.getOneTriple)
router.post('/commitAnswer', TripleCtrl.commitAnswer)

module.exports = router
