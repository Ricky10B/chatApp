const app = require('./server')
const host = process.env.HOST || '0.0.0.0'

const server = app.listen(app.get('port'), host, () => console.log(`Server running on port ${app.get('port')}`))

const io = require('socket.io')(server)

module.exports = io
require('./sockets/socket')