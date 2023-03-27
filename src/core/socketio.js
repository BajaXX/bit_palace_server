const { createServer } = require('http')
const { Server } = require('socket.io')
const SocketService = require('../services/SocketService')
const { getHash } = require('../core/redis')

let io = null

function initSocket(app) {
    const httpServer = createServer(app.callback())
    io = new Server(httpServer, {})
    io.use(async (socket, next) => {
        try {
            await SocketService.checkAuth(socket)
            next()
        } catch (error) {
            console.log('发生错误error:', error)
            next(new Error(JSON.stringify(error)))
        }
    })
    io.on('connection', (socket) => {
        console.log(`new connection:`, socket.id)
        socket.onAny((event, data) => {
            switch (event) {
                case 'test':
                    console.log(io.sockets.sockets.get(socket.id))
                    io.sockets.sockets.get(socket.id).emit('hi', 'welcome')
                    break
                default:
                    socket.emit('msg', 'ok')
                    break
            }
            // socket.emit('hi', '34567898798989')
        })
    })
    return httpServer
}

function getSocket() {
    return this.io
}
async function sendToUid(uid, event, data) {
    const socketID = await getHash('SOCKET_BIND', uid)
    console.log(uid, socketID)
    const toSocket = io.sockets.sockets.get(socketID)
    if (toSocket) {
        console.log('用户在线')
        toSocket.emit(event, data)
    } else {
        console.log('用户不在线')
    }
    return 'ok'
}

module.exports = {
    initSocket,
    getSocket,
    sendToUid
}
