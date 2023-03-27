const Koa = require('koa')
const chalk = require('chalk')
const bodyParser = require('koa-bodyparser')
const { bearerToken } = require('koa-bearer-token')
const cors = require('koa2-cors')
const staticServer = require('koa-static-server')
const InitManager = require('./core/init')
const catchError = require('./middlewares/exception')
const config = require('./config')
const path = require('path')
const { historyApiFallback } = require('koa2-connect-history-api-fallback')

const timer = require('./core/timer/timer')
// const mongodb = require('./core/mongodb')
const { accessLogger, logger } = require('./middlewares/logger')

const app = new Koa()

const port = config.port
app.use(historyApiFallback({ whiteList: ['/api'] }))
app.use(accessLogger())
app.use(cors({ origin: '*' }))

// app.use(staticServer(__dirname + '/dist', { extensions: ['html'] }))
// app.use(staticServer({ rootDir: `${path.join(__dirname, '../dist')}`, rootPath: '/' }))
app.use(catchError)
app.use(bodyParser())
app.use(bearerToken())
InitManager.initCore(app)
// mongodb.connect()
timer.init()

app.on('error', (err) => {
    logger.error(err)
})

app.listen(port, () => {
    console.log(`Open ${chalk.green('http://localhost:' + port)}`)
})
